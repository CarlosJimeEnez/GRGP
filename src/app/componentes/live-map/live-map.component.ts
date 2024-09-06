import { Component, ElementRef, ViewChild, HostListener, AfterViewInit, OnInit, inject, NgZone } from '@angular/core';
import {MatCheckboxModule} from '@angular/material/checkbox';
import { CommonModule } from '@angular/common';
import * as THREE from 'three';
import * as YUKA from 'yuka';
import { MapPoints } from './vectors';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

@Component({
  selector: 'app-live-map',
  standalone: true,
  imports: [MatCheckboxModule, CommonModule],
  template: `
    <div class="card">
      <h4 class="card-title">Live Map</h4>
      <div class="row">
        <div class="col-12 d-flex align-items-center">
          <div #mapContainer class="mapContainer">
        </div>
      </div>
      </div>
      <div class="card-body">
        <h1>....</h1>
      </div>
    </div>
  `,
  styleUrl: './live-map.component.css'
})

export class LiveMapComponent implements OnInit {
  @ViewChild('mapContainer', { static: false }) mapContainer!: ElementRef;

  hasCompletedLap: boolean = false;
  initialWaypoint!: YUKA.Vector3;
  currentWaypoint!: YUKA.Vector3;

  scaleFactor: number = 0.03;
  offseX: number = 0;

  scene!: THREE.Scene;
  camera!: THREE.PerspectiveCamera;
  time!: YUKA.Time;  
  width!: number;
  height!: number;
  renderer!: any;
  
  vehicleGeometry!: THREE.SphereGeometry;
  vehicleMaterial!: THREE.MeshBasicMaterial;
  vehicleMesh!: THREE.Mesh;
  
  vehicleAgent!: YUKA.Vehicle;
  path!: YUKA.Path; 
  
  followPathBehavior!: YUKA.FollowPathBehavior;
  onPathBehavior!: YUKA.OnPathBehavior;
  entityManager!: YUKA.EntityManager;

  controls!: OrbitControls;

  constructor(private zone: NgZone){
   
  }

  ngOnInit(): void {
    //New Path
    this.time = new YUKA.Time(); 
    this.path = new YUKA.Path();
    this.initialWaypoint = new YUKA.Vector3();
    this.currentWaypoint = new YUKA.Vector3();
    MapPoints.forEach((point: any) => {
      this.path.add(new YUKA.Vector3((point[0] * this.scaleFactor) - this.offseX, 0, point[1] * this.scaleFactor))
    })
  }

  ngAfterViewInit(): void {
    if (typeof window !== 'undefined' && typeof document !== 'undefined') {
      this.updateDimensions();

      // Solo se ejecuta en el navegador
      this.renderer = new THREE.WebGLRenderer({ antialias: true });
      this.renderer.setSize(this.width, this.height);
      this.mapContainer.nativeElement.appendChild(this.renderer.domElement)
      
      this.scene = new THREE.Scene();
      this.renderer.setClearColor(0x27B2D9)

      this.camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000); // Inicializa con un aspect ratio por defecto
      this.camera.position.set(0, 20, 0);
      this.camera.aspect = this.width / this.height;

      this.controls = new OrbitControls(this.camera, this.renderer.domElement);
      this.controls.enableDamping = true; // Para suavizar el movimiento
      this.controls.dampingFactor = 0.05;
      

      // Primero, crea la geometría del círculo
      const radius = 0.5; // Radio de la esfera, ajusta según sea necesario
      const widthSegments = 32; // Segmentos horizontales
      const heightSegments = 32; // Segmentos verticales
      this.vehicleGeometry = new THREE.SphereGeometry(radius, widthSegments, heightSegments)

      // Crear el material para la esfera
      this.vehicleMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00 })
      this.vehicleMesh = new THREE.Mesh(this.vehicleGeometry, this.vehicleMaterial);
      this.vehicleMesh.matrixAutoUpdate = false;
      this.scene.add(this.vehicleMesh);
  
      //New YUKA VEHICLE
      this.vehicleAgent = new YUKA.Vehicle();
      this.vehicleAgent.setRenderComponent(this.vehicleMesh, this.sync);
      this.vehicleAgent.position.copy(this.path.current())
      this.initialWaypoint = this.vehicleAgent.getWorldPosition(this.initialWaypoint)
      this.vehicleAgent.maxSpeed = 3
      
      //Camera Position
      const gimbalPositionX = MapPoints[MapPoints.length/4][0] * this.scaleFactor
      const gimbalPositionY = MapPoints[MapPoints.length/4][1] * this.scaleFactor
      this.camera.lookAt(gimbalPositionX, 0, gimbalPositionY);
      this.controls.target.set(gimbalPositionX, 0, gimbalPositionY)
      this.controls.update();
      this.path.loop = true;

      //Behavior
      this.followPathBehavior = new YUKA.FollowPathBehavior(this.path, 0.5);
      this.vehicleAgent.steering.add(this.followPathBehavior)
  
      this.onPathBehavior = new YUKA.OnPathBehavior(this.path);
      this.onPathBehavior.radius = 3;
      this.vehicleAgent.steering.add(this.onPathBehavior);
  
      this.entityManager = new YUKA.EntityManager();
      this.entityManager.add(this.vehicleAgent);

      // Waypoints to render
      const position: any = [];
      MapPoints.forEach((waypoint: any) => {
        position.push(waypoint[0] * this.scaleFactor, 0, waypoint[1] * this.scaleFactor) 
      })
      
      const lineGeometry = new THREE.BufferGeometry();
      lineGeometry.setAttribute('position', new THREE.Float32BufferAttribute(position, 3));

      const lineMaterial = new THREE.LineBasicMaterial({color: 0x000000});
      const lines = new THREE.LineLoop(lineGeometry, lineMaterial);
      this.scene.add(lines);

      // this.renderer.setAnimationLoop(this.animate())
      this.zone.runOutsideAngular(() => {
        this.renderer.setAnimationLoop(() => this.animate());      
      })
      }
  }

  @HostListener('window:resize', ['$event'])
  onResize(event?: Event) {
    if (typeof window !== "undefined") {
      this.updateDimensions();
      this.camera.aspect = this.width / this.height;
      this.renderer.setSize(this.width, this.height);
      this.camera.updateProjectionMatrix();
      console.log(this.width, this.height);
    }
  }

  private sync(entity: any, renderComponent: any){
    renderComponent.matrix.copy(entity.worldMatrix)
  }

  private updateDimensions(): void {
    this.width = this.mapContainer.nativeElement.clientWidth;
    this.height = this.mapContainer.nativeElement.clientHeight;
  }

  private animate(): void {
    const delta = this.time.update().getDelta();
    this.entityManager.update(delta)

    this.hasCompletedLap = this.checkCurrentPosition()

    this.controls.update();
    this.renderer.render(this.scene, this.camera);
  }

  private checkCurrentPosition(): boolean {
    this.currentWaypoint = this.vehicleAgent.getWorldPosition(this.currentWaypoint);
    if (this.currentWaypoint == this.initialWaypoint){
      console.log("Se dio una vuelta");
      return true
    } else {
      return false
    } 

  }

}
