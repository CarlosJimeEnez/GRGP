import { AfterViewChecked, AfterViewInit, Component, ElementRef, HostListener, Inject, OnInit, PLATFORM_ID, ViewChild } from '@angular/core';
import {MatCheckboxModule} from '@angular/material/checkbox';
import { MapPoints} from "./vectors"
import * as THREE from 'three'
import * as YUKA from 'yuka'


@Component({
  selector: 'app-live-map',
  standalone: true,
  imports: [MatCheckboxModule],
  templateUrl: './live-map.component.html',
  styleUrl: './live-map.component.css'
})
export class LiveMapComponent implements AfterViewInit {
  @ViewChild('mapContainer', { static: false }) mapContainer!: ElementRef;
  vehicleAgent : any;
  vehicleAgent2: any;

  renderer!: any
  entityManager: any
  entityManager2: any
  scene: any
  camera: any
  time: any; 

  offseX: number = 10
  offseY: number = -7
  scaleFactor: number = 0.039; 

  meshLine: any;

  width: number = 670
  height: number = 534

  proximityThreshold: number = 1

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
  }

  ngAfterViewInit(): void {
    this.entityManager = new YUKA.EntityManager();
    this.entityManager2 = new YUKA.EntityManager();
    this.scene = new THREE.Scene();
    this.time = new YUKA.Time();

    this.updateDimensions()
    this.camera = new THREE.PerspectiveCamera(
      45,
      (this.width) / (this.height),
      0.1,
      1000
    );

    //Render
    this.renderer = new THREE.WebGLRenderer({antialias: true});
    this.renderer.setSize(this.width, this.height);
    this.renderer.setClearColor(0x000000, 0);
    this.camera.position.set(0,20,0);
    this.camera.lookAt(this.scene.position);

    // Crear la geometría de la esfera
    const radius = 0.8; // Radio de la esfera, ajusta según sea necesario
    const widthSegments = 32; // Segmentos horizontales
    const heightSegments = 32; // Segmentos verticales
    const sphereGeometry = new THREE.SphereGeometry(radius, widthSegments, heightSegments);
    // Crear el material para la esfera
    const material = new THREE.MeshBasicMaterial({ color: 0xF31515 }); // Cambia el color si lo deseas
    const sphere = new THREE.Mesh(sphereGeometry, material);
    sphere.matrixAutoUpdate = false
    this.scene.add(sphere);

    // Crear el material para la esfera
    const sphereGeometry2 = new THREE.SphereGeometry(radius, widthSegments, heightSegments);
    const material2 = new THREE.MeshBasicMaterial({ color: 0xF315C3 }); // Cambia el color si lo deseas
    const sphere2 = new THREE.Mesh(sphereGeometry2, material2);
    sphere2.matrixAutoUpdate = false
    this.scene.add(sphere2);

    // Configurar la posición inicial de la esfera si es necesario
    this.vehicleAgent = new YUKA.Vehicle();
    this.vehicleAgent.setRenderComponent(sphere, sync);
    function sync(entity: any, renderComponent: any) {
      renderComponent.matrix.copy(entity.worldMatrix);
    }

    this.vehicleAgent2 = new YUKA.Vehicle();
    this.vehicleAgent2.setRenderComponent(sphere2, sync2);
    function sync2(entity: any, renderComponent: any) {
      renderComponent.matrix.copy(entity.worldMatrix);
    }

    // Points
    const path = new YUKA.Path(); 
    MapPoints.forEach((point: any) => {
        path.add( new YUKA.Vector3((point[0] * this.scaleFactor) - this.offseX, 0, (point[1] * this.scaleFactor) + this.offseY));
    })
    const path2 = new YUKA.Path(); 
    MapPoints.forEach((point: any) => {
        path2.add( new YUKA.Vector3((point[0] * this.scaleFactor) - this.offseX, 0, (point[1] * this.scaleFactor) + this.offseY));
    })

    path.loop = true;
    path2.loop = true;

    this.vehicleAgent.position.copy(path.current());
    this.vehicleAgent2.position.copy(path2.current());

    this.vehicleAgent.maxSpeed = 2.2
    this.vehicleAgent2.maxSpeed = 3.5

    const followPathBehavior = new YUKA.FollowPathBehavior(path, 1);
    const followPathBehavior2 = new YUKA.FollowPathBehavior(path2, 0.5);
    this.vehicleAgent.steering.add(followPathBehavior);
    this.vehicleAgent2.steering.add(followPathBehavior2);

    const onPathBehavior = new YUKA.OnPathBehavior(path);
    const onPathBehavior2 = new YUKA.OnPathBehavior(path2);
    onPathBehavior.radius = 1;
    onPathBehavior2.radius = 1;
    this.vehicleAgent.steering.add(onPathBehavior);
    this.vehicleAgent2.steering.add(onPathBehavior2);
    
    this.entityManager.add(this.vehicleAgent);
    this.entityManager2.add(this.vehicleAgent2);

    const position: any = [];
    MapPoints.forEach((element: any) => {
      position.push((element[0]*this.scaleFactor) - this.offseX, 0, (element[1] * this.scaleFactor) + this.offseY)
    });

    const lineGeometry = new THREE.BufferGeometry();
    lineGeometry.setAttribute('position', new THREE.Float32BufferAttribute(position, 3));
    const lineMaterial = new THREE.LineBasicMaterial({color: 0x000000});
    const lines = new THREE.LineLoop(lineGeometry, lineMaterial);
    this.scene.add(lines);

    this.renderer.setAnimationLoop(() => this.animate());
    this.mapContainer.nativeElement.appendChild(this.renderer.domElement);
    this.onResize();
  }

  @HostListener('window:resize', ['$event'])
  onResize(event?: Event) {
    if (typeof window !== "undefined"){
      this.updateDimensions()
      this.camera.aspect = this.width / this.height;
      this.renderer.setSize(this.width, this.height);
      this.camera.updateProjectionMatrix();
      console.log(this.width)
    }
  }

  checkProximity(vehicleAgent: any, vehicleAgent2: any): boolean {
    const distance = vehicleAgent.position.distanceTo(vehicleAgent2.position);
    if (distance < this.proximityThreshold) {
      console.log("¡Las esferas están cerca!");
      return true;
    }
    return false;
  }

  private updateDimensions(): void {
    this.width = this.mapContainer.nativeElement.clientWidth;
    this.height = this.mapContainer.nativeElement.clientHeight;
  }

  private animate(): void {
    const delta = this.time.update().getDelta();
    this.entityManager.update(delta);
    this.entityManager2.update(delta);
    this.checkProximity(this.vehicleAgent, this.vehicleAgent2);
    this.renderer.render(this.scene, this.camera);
  }
}
