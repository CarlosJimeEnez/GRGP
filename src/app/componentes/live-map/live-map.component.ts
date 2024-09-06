import { Component, ElementRef, ViewChild, HostListener, AfterViewInit, OnInit } from '@angular/core';
import {MatCheckboxModule} from '@angular/material/checkbox';
import { CommonModule } from '@angular/common';
import * as THREE from 'three';
import * as YUKA from 'yuka';
import { MapPoints } from './vectors';

@Component({
  selector: 'app-live-map',
  standalone: true,
  imports: [MatCheckboxModule, CommonModule],
  template: `
    <div class="card">
      <h4 class="card-title">Live Map</h4>
      <div #mapContainer>
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

  scene!: THREE.Scene;
  camera!: THREE.PerspectiveCamera;
  time!: YUKA.Time;
  width!: number;
  height!: number;
  renderer!: any;
  
  vehicleGeometry!: THREE.ConeGeometry;
  vehicleMaterial!: THREE.MeshNormalMaterial;
  vehicleMesh!: THREE.Mesh;
  
  vehicle!: YUKA.Vehicle;
  path!: YUKA.Path; 
  
  followPathBehavior!: YUKA.FollowPathBehavior;
  onPathBehavior!: YUKA.OnPathBehavior;
  entityManager!: YUKA.EntityManager;

  ngOnInit(): void {
    const position: any = []
    MapPoints.forEach((element: any) => {
      const waypoint = {
        x: element[0], 
        y: element[1], 
      }
      position.push(waypoint)
    });

    // const lineGeometry = new THREE.BufferGeometry();
    // lineGeometry.setAttribute('position', new THREE.Float32BufferAttribute(position, 3));

    // const lineMaterial = new THREE.LineBasicMaterial({color: 0xFFFFFF});
    // const lines = new THREE.LineLoop(lineGeometry, lineMaterial);
    // this.scene.add(lines);

    // const time = new YUKA.Time();
  }

  ngAfterViewInit(): void {
    if (typeof window !== 'undefined' && typeof document !== 'undefined') {
      // Solo se ejecuta en el navegador
      this.renderer = new THREE.WebGLRenderer({ antialias: true });
      
      this.renderer.setSize(this.width, this.height);
      this.scene = new THREE.Scene();
      this.time = new YUKA.Time();
      this.camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000); // Inicializa con un aspect ratio por defecto
      this.camera.position.set(0, 20, 0);
      this.camera.lookAt(this.scene.position);
      this.camera.aspect = this.width / this.height;
  
      this.vehicleGeometry = new THREE.ConeGeometry(0.1, 0.5, 8)
      this.vehicleGeometry.rotateX(Math.PI * 0.5);
      this.vehicleMaterial = new THREE.MeshNormalMaterial();
      this.vehicleMesh = new THREE.Mesh(this.vehicleGeometry, this.vehicleMaterial);
      this.vehicleMesh.matrixAutoUpdate = false;
      this.scene.add(this.vehicleMesh);
  
      this.vehicle = new YUKA.Vehicle();
      this.vehicle.setRenderComponent(this.vehicleMesh, this.sync);
      
      this.path = new YUKA.Path()

      this.path.add( new YUKA.Vector3(0, 0, 0));
      this.path.add( new YUKA.Vector3(0, 0, 3));
      this.path.add( new YUKA.Vector3(1, 0, 0));

      this.path.loop = true;
      this.vehicle.position.copy(this.path.current())

      this.followPathBehavior = new YUKA.FollowPathBehavior(this.path, 0.5);
      this.vehicle.steering.add(this.followPathBehavior)
  
  
      this.onPathBehavior = new YUKA.OnPathBehavior(this.path);
      this.onPathBehavior.radius = 2;
      this.vehicle.steering.add(this.onPathBehavior);
  
      this.entityManager = new YUKA.EntityManager();
      this.entityManager.add(this.vehicle);

      
      this.camera.updateProjectionMatrix();
      this.updateDimensions();
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
}
