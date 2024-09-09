import { Component, ElementRef, ViewChild, HostListener, OnInit, NgZone, Input, model, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PerspectiveCamera, Scene, WebGLRenderer, LineLoop, BufferGeometry, Float32BufferAttribute, LineBasicMaterial } from 'three';
import { Path, Time, FollowPathBehavior, OnPathBehavior, EntityManager, Vector3 } from 'yuka';
import { MapPoints } from './vectors';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { Player } from '../../interface/Player';
import { Carrera } from '../../interface/Carrera';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-live-map',
  standalone: true,
  imports: [CommonModule, MatIcon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="card">
      <h4 class="card-title mt-4 ms-4">Live Map</h4>
        <div class="row">
          <div div class="col-12 d-flex mapContainer align-items-center">
            <div #mapContainer  class="mapThreejs m-3"></div>
            
        </div>
      </div>
      <div class="card-body">
        <h1>{{lapCount}}/{{maxLaps}}</h1>
      </div>
      @if(crashDetection){
        <div class="card-body-alert">
          <h5 class="card-title ">Crash Detection</h5>
          <div>
            <div class="text-center">
              <mat-icon class="crashed-player">circle</mat-icon>
            </div>
          </div>
          <div class="row mt-3">
            <div class="col-12 d-flex justify-content-center">
            <a class="btn btn-danger" (click)="crashDetectionFnc(false)">
              <mat-icon class="icons-size">close</mat-icon>
            </a>  
            </div>
          </div>
        </div>
      }
                    
      <div class="form-check m-3">
      <a class="btn btn-danger" (click)="crashDetectionFnc(true)">Crash example</a>  
      </div>
    </div>
  `,
  styleUrl: './live-map.component.css'
})

export class LiveMapComponent implements OnInit {
  @ViewChild('mapContainer', { static: false }) mapContainer!: ElementRef;
  @Input() player1Color: number = 0xf315c3
  @Input() player2Color: number = 0xff914d
  crashDetection: boolean = false
  // Primero, crea la geometría del círculo
  radius: number = 0.5; // Radio de la esfera, ajusta según sea necesario
  widthSegments: number = 12; // Segmentos horizontales
  heightSegments: number = 12; // Segmentos verticales

  hasCompletedLap: boolean = false;
  initialWaypoint!: Vector3;
  currentWaypoint!: Vector3;
  lapCount: number = 0; 
  maxLaps: number = 2; 
  lastLapTime: number = 0; 
  lapCooldown: number = 2000; //Cooldown en milisegundos (2)   

  scaleFactor: number = 0.03;
  offseX: number = 0;

  scene!: Scene;
  staticScene!: Scene
  camera!: PerspectiveCamera;
  time!: Time;  
  width!: number;
  height!: number;
  renderer!: any;  
  path!: Path;
  path2!: Path;  
  controls!: OrbitControls;

  player1!: Player
  player2!: Player 
  carrera!: Carrera

  followPathBehavior!: FollowPathBehavior;
  onPathBehavior!: OnPathBehavior;
  entityManager!: EntityManager;
  
  constructor(private zone: NgZone, private cdr: ChangeDetectorRef){}

  ngOnInit(): void {
    this.scene = new Scene();
    this.time = new Time(); 
    this.path = new Path();

    this.initialWaypoint = new Vector3();
    this.currentWaypoint = new Vector3();
    
    //New Path
    MapPoints.forEach((point: any) => {
      this.path.add(new Vector3((point[0] * this.scaleFactor) - this.offseX, 0, point[1] * this.scaleFactor))
    })
    this.path.loop = true;

    this.path2 = new Path()
    MapPoints.forEach((point: any) => {
      this.path2.add(new Vector3((point[0] * this.scaleFactor) - this.offseX, 0, point[1] * this.scaleFactor))
    })
    this.path2.loop = true;
  }


  ngAfterViewInit(): void {
    if (typeof window !== 'undefined' && typeof document !== 'undefined') {
      this.updateDimensions();
      
      // Solo se ejecuta en el navegador
      this.renderer = new WebGLRenderer({ antialias: true });
      this.renderer.setSize(this.width, this.height);
      this.mapContainer.nativeElement.appendChild(this.renderer.domElement)
      this.renderer.setClearColor(0xffffff)

      this.camera = new PerspectiveCamera(75, 1, 0.1, 1000); // Inicializa con un aspect ratio por defecto
      this.camera.position.set(0, 20, 0);
      this.camera.aspect = this.width / this.height;

      this.controls = new OrbitControls(this.camera, this.renderer.domElement);
      this.controls.enableDamping = true; // Para suavizar el movimiento
      this.controls.dampingFactor = 0.05;
      // Restringir la rotación en el eje vertical
      this.controls.minPolarAngle = 0; // Mínimo ángulo polar
      this.controls.maxPolarAngle = Math.PI / 2.5; // Máximo ángulo polar
    
      
  
      //Camera Position
      const gimbalPositionX = MapPoints[MapPoints.length/4][0] * this.scaleFactor
      const gimbalPositionY = MapPoints[MapPoints.length/4][1] * this.scaleFactor
      this.camera.lookAt(gimbalPositionX, 0, gimbalPositionY);
      this.controls.target.set(gimbalPositionX, 0, gimbalPositionY)
      this.controls.update();
      
      // Waypoints to render
      const position: any = [];
      MapPoints.forEach((waypoint: any) => {
        position.push(waypoint[0] * this.scaleFactor, 0, waypoint[1] * this.scaleFactor) 
      })
      const lineGeometry = new BufferGeometry();
      lineGeometry.setAttribute('position', new Float32BufferAttribute(position, 3));

      const lineMaterial = new LineBasicMaterial({color: 0x000000});
      const lines = new LineLoop(lineGeometry, lineMaterial);

      this.player1 = new Player
        (
          this.initialWaypoint, 
          this.player1Color, 
          this.radius, 
          this.widthSegments, 
          this.heightSegments, 
          2, 
          this.path
        )
        
      this.player2 = new Player
        (
          this.initialWaypoint, 
          this.player2Color, 
          this.radius, 
          this.widthSegments, 
          this.heightSegments, 
          1.5, 
          this.path2
        )

      this.carrera = new Carrera([this.player1, this.player2]) 

      this.scene.add(this.player1.vehicleMesh);
      this.scene.add(this.player2.vehicleMesh)
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

  // Animate 
  private animate(): void {
    const delta = this.time.update().getDelta();
    
    
    // Usamos reduce para encontrar el jugador con más vueltas
  const maxLapsPlayer = this.carrera.corredores.reduce((maxPlayer, player) => {
    if(player.lapCount < this.maxLaps) {
      player.checkLapCount()
      player.entityManager.update(delta)
    } 
    return (player.lapCount > maxPlayer.lapCount) ? player : maxPlayer;  
  }, this.carrera.corredores[0]); // Aquí definimos el valor inicial

  this.zone.run(() => {        
    this.lapCount = maxLapsPlayer.lapCount;
    this.cdr.detectChanges(); // Forzar la detección de cambios
  })

    // this.stopAnimation()
    this.controls.update();
    this.renderer.render(this.scene, this.camera);
  }

  crashDetectionFnc(state: boolean): void{
    this.crashDetection = state
  }
}
