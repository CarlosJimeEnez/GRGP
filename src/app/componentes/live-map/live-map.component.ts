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
export class LiveMapComponent implements OnInit, AfterViewInit {
  @ViewChild('mapContainer', { static: false }) mapContainer!: ElementRef;

  renderer!: any
  entityManager: any
  scene: any
  camera: any
  time: YUKA.Time; 
  offseX: number = 10
  offseY: number = -7
  scaleFactor: number = 0.039; 
  meshLine: any;
  width: number = 670
  height: number = 534

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    this.entityManager = new YUKA.EntityManager();
    this.scene = new THREE.Scene();
    this.time = new YUKA.Time();
    // No inicializar Three.js aquí
  }

  ngAfterViewInit(): void {
    this.entityManager = new YUKA.EntityManager();
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
    const radius = 0.3; // Radio de la esfera, ajusta según sea necesario
    const widthSegments = 32; // Segmentos horizontales
    const heightSegments = 32; // Segmentos verticales

    const sphereGeometry = new THREE.SphereGeometry(radius, widthSegments, heightSegments);

    // Crear el material para la esfera
    const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 }); // Cambia el color si lo deseas

    // Crear la malla de la esfera
    const sphere = new THREE.Mesh(sphereGeometry, material);
    sphere.matrixAutoUpdate = false
    // Añadir la esfera a la escena
    this.scene.add(sphere);

    // Configurar la posición inicial de la esfera si es necesario
    // sphere.position.set(10, 0, 0); // Cambia las coordenadas según sea necesario

    const vehicleAgent = new YUKA.Vehicle();
    vehicleAgent.setRenderComponent(sphere, sync);
    function sync(entity: any, renderComponent: any) {
      renderComponent.matrix.copy(entity.worldMatrix);
    }

    // Points
    const path = new YUKA.Path(); 
    MapPoints.forEach((point: any) => {
        path.add( new YUKA.Vector3((point[0] * this.scaleFactor) - this.offseX, 0, (point[1] * this.scaleFactor) + this.offseY));
    })

    path.loop = true;
    vehicleAgent.position.copy(path.current());

    //vehicleAgent.maxSpeed = 3;
    const followPathBehavior = new YUKA.FollowPathBehavior(path, 0.5);
    vehicleAgent.steering.add(followPathBehavior);

    const onPathBehavior = new YUKA.OnPathBehavior(path);
    onPathBehavior.radius = 1;
    vehicleAgent.steering.add(onPathBehavior);
  
    this.entityManager.add(vehicleAgent);

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

  ngOnInit() {
    
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

  private updateDimensions(): void {
    this.width = this.mapContainer.nativeElement.clientWidth;
    this.height = this.mapContainer.nativeElement.clientHeight;
  }

  private animate(): void {
    const delta = this.time.update().getDelta();
    this.entityManager.update(delta);
    this.renderer.render(this.scene, this.camera);
  }
}
