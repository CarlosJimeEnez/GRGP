import { Component, ElementRef, ViewChild, HostListener, OnInit, NgZone, Input, model, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PerspectiveCamera, Scene, WebGLRenderer, LineLoop, BufferGeometry, Float32BufferAttribute, LineBasicMaterial, SphereGeometry, MeshBasicMaterial, Mesh, Group, Line } from 'three';
import { Path, Time, FollowPathBehavior, OnPathBehavior, EntityManager, Vector3 } from 'yuka';
import { MapPoints } from './vectors';
import { CSS2DRenderer, CSS2DObject } from 'three/examples/jsm/renderers/CSS2DRenderer.js';

import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { Player, PlayerDto } from '../../interface/Player';
import { Carrera } from '../../interface/Carrera';
import { MatIcon } from '@angular/material/icon';
import { AlertsService } from '../../services/alerts.service';
import { Sectors } from '../../interface/Sectors';

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
    </div>
  `,
  styleUrl: './live-map.component.css'
})

export class LiveMapComponent implements OnInit {
  @ViewChild('mapContainer', { static: false }) mapContainer!: ElementRef;
  @Input() player1Color: number = 0xf315c3
  @Input() player2Color: number = 0xff914d

  allCarsPassedFirstSector: boolean = false
  crashDetection: boolean = false
  // Primero, crea la geometría del círculo
  radius: number = 0.5; // Radio de la esfera, ajusta según sea necesario
  radiusSectorsSphere: number = 0.15
  widthSegments: number = 12; // Segmentos horizontales
  heightSegments: number = 12; // Segmentos verticales
  hasSentCrashDetection:boolean = false;

  hasCompletedLap: boolean = false;
  initialWaypoint!: Vector3;
  currentWaypoint!: Vector3;
  lapCount: number = 0; 
  maxLaps: number = 2; 
  lastLapTime: number = 0; 
  lapCooldown: number = 2000; //Cooldown en milisegundos (2)   
  startTime: number = 0 
  
  scaleFactor: number = 0.03;
  offseX: number = 0;

  labelRenderer!: CSS2DRenderer
  scene!: Scene;
  staticScene!: Scene
  camera!: PerspectiveCamera;
  time!: Time;  
  width!: number;
  height!: number;
  renderer!: any;  
  lineGeometry!: BufferGeometry;
  colors: number[] = [
    0xFF5733,
    0x33FF57, // Verde lima
    0x3357FF, // Azul
    0xF1C40F, // Amarillo
    0x8E44AD, // Púrpura
    0xE74C3C, // Rojo
    0x3498DB, // Azul claro
    0x1ABC9C, // Turquesa
    0x2ECC71, // Verde
    0xF39C12  // Naranja
  ]

  path!: Path;
  path2!: Path;  
  path3!: Path;
  path4!: Path; 
  path5!: Path;  
  path6!: Path;  
  path7!: Path;
  path8!: Path;
  path9!: Path;
  path10!: Path;
  paths: Path[] = []
  controls!: OrbitControls;
  sectors!: any 

  players: Player[] = []  
  player1!: Player
  player2!: Player 
  
  carrera!: Carrera

  followPathBehavior!: FollowPathBehavior;
  onPathBehavior!: OnPathBehavior;
  entityManager!: EntityManager;
  
  constructor(
    private zone: NgZone,
    private cdr: ChangeDetectorRef,
    private alertService: AlertsService,
  ){

  }

  ngOnInit(): void {
    this.startTime = Date.now(); 
    this.scene = new Scene();
    this.time = new Time(); 
    
    this.initialWaypoint = new Vector3();
    this.currentWaypoint = new Vector3();

    //New Path
    this.path = new Path();
    MapPoints.forEach((point: any) => {
      this.path.add(new Vector3((point[0] * this.scaleFactor) - this.offseX, 0, point[1] * this.scaleFactor))
    })
    this.path.loop = true;

    this.path2 = new Path()
    MapPoints.forEach((point: any) => {
      this.path2.add(new Vector3((point[0] * this.scaleFactor) - this.offseX, 0, point[1] * this.scaleFactor))
    })
    this.path2.loop = true;

    this.path3 = new Path();
    MapPoints.forEach((point: any) => {
      this.path3.add(new Vector3((point[0] * this.scaleFactor) - this.offseX, 0, point[1] * this.scaleFactor))
    })
    this.path3.loop = true;

    this.path4 = new Path();
    MapPoints.forEach((point: any) => {
      this.path4.add(new Vector3((point[0] * this.scaleFactor) - this.offseX, 0, point[1] * this.scaleFactor))
    })
    this.path4.loop = true;

    this.path5 = new Path();
    MapPoints.forEach((point: any) => {
      this.path5.add(new Vector3((point[0] * this.scaleFactor) - this.offseX, 0, point[1] * this.scaleFactor))
    })
    this.path5.loop = true;

    this.path6 = new Path();
    MapPoints.forEach((point: any) => {
      this.path6.add(new Vector3((point[0] * this.scaleFactor) - this.offseX, 0, point[1] * this.scaleFactor))
    })
    this.path6.loop = true;

    this.path7 = new Path();
    MapPoints.forEach((point: any) => {
      this.path7.add(new Vector3((point[0] * this.scaleFactor) - this.offseX, 0, point[1] * this.scaleFactor))
    })
    this.path7.loop = true;

    this.path8 = new Path();
    MapPoints.forEach((point: any) => {
      this.path8.add(new Vector3((point[0] * this.scaleFactor) - this.offseX, 0, point[1] * this.scaleFactor))
    })
    this.path8.loop = true;

    this.path9 = new Path();
    MapPoints.forEach((point: any) => {
      this.path9.add(new Vector3((point[0] * this.scaleFactor) - this.offseX, 0, point[1] * this.scaleFactor))
    })
    this.path9.loop = true;

    this.path10 = new Path();
    MapPoints.forEach((point: any) => {
      this.path10.add(new Vector3((point[0] * this.scaleFactor) - this.offseX, 0, point[1] * this.scaleFactor))
    })
    this.path10.loop = true;

    this.paths = [this.path, this.path2, this.path3, this.path4, this.path5, this.path6, this.path7, this.path8, this.path9, this.path10]
  }


  ngAfterViewInit(): void {
    if (typeof window !== 'undefined' && typeof document !== 'undefined') {
      this.updateDimensions();
    
      this.labelRenderer = new CSS2DRenderer();
      this.labelRenderer.setSize(this.width, this.height);
      this.labelRenderer.domElement.style.position = 'absolute';
      this.labelRenderer.domElement.style.top = '0px';
      this.labelRenderer.domElement.style.pointerEvents = "none"
      this.mapContainer.nativeElement.appendChild(this.labelRenderer.domElement)
      
      // const sectors = this.calculoSectores()
      const numeroDeSectores = 24;  // Número de sectores que deseas
      this.sectors = this.dividirEnSectores(MapPoints, numeroDeSectores);
      const group = new Group();
      const group3dText = new Group();

      this.sectors.forEach((element: any, index:any) => {
        const x = element[0][0]
        const y = element[0][1]
        const sphereMesh1 = this.createCpointMesh(`sphereMesh${index}`, x * this.scaleFactor,0,y * this.scaleFactor)
        group.add(sphereMesh1)

        // Crear un CSS2DObject y añadirlo a la escena
        const div = document.createElement('p');
        div.textContent = `Sec: ${index + 1}`;
        div.style.color = 'black'; // Ajusta el color según sea necesario
        const divLabel = new CSS2DObject(div);
        divLabel.position.set(x * this.scaleFactor, -5, y * this.scaleFactor);
        group3dText.add(divLabel);
      })
      this.scene.add(group)
      this.scene.add(group3dText)

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

      this.lineGeometry = new BufferGeometry();
      this.lineGeometry.setAttribute('position', new Float32BufferAttribute(position, 3));
      const lineMaterial = new LineBasicMaterial({color: 0x000000});
      const lines = new LineLoop(this.lineGeometry, lineMaterial);
      this.scene.add(lines);

      this.newPlayers([2.3, 2.2, 2.1, 1.9, 1.8, 1.4, 1.3, 1.2, 1.1, 1], this.paths, this.colors)
      this.carrera = new Carrera(this.players) 
      this.players.forEach(element => {
        this.scene.add(element.vehicleMesh)
      });

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
    }
  }

  private calcularDistancia(p1:any, p2:any) {
    return Math.sqrt(Math.pow(p2[0] - p1[0], 2) + Math.pow(p2[1] - p1[1], 2));
  }

  private dividirEnSectores(MapPoints: any, numeroDeSectores:any, margen = 1) {
    let sectores = [];
    let sectorActual = [];
    let distanciaTotal = 0;
    
    // Calcular la distancia total de la línea
    for (let i = 0; i < MapPoints.length - 1; i++) {
        distanciaTotal += this.calcularDistancia(MapPoints[i], MapPoints[i + 1]);
    }

    // Distancia objetivo por sector
    const distanciaObjetivo = distanciaTotal / numeroDeSectores;
    let distanciaAcumulada = 0;

    for (let i = 0; i < MapPoints.length - 1; i++) {
        if (sectorActual.length === 0) {
            sectorActual.push(MapPoints[i]);  // Asegurar al menos un punto en el sector
        }
        
        let distanciaProximoPunto = this.calcularDistancia(MapPoints[i], MapPoints[i + 1]);
        // Comprobar si agregar el próximo punto excede el margen permitido
        if (distanciaAcumulada + distanciaProximoPunto > distanciaObjetivo * (1 + margen) && sectorActual.length > 0) {
            sectores.push(sectorActual);
            sectorActual = [];
            distanciaAcumulada = 0;
        } else {
            distanciaAcumulada += distanciaProximoPunto;
            sectorActual.push(MapPoints[i + 1]);
        }
    }
  
    // Agregar el último sector
    if (sectorActual.length > 0) {
        sectores.push(sectorActual);
    }

    return sectores;
  }

  private sync(entity: any, renderComponent: any){
    renderComponent.matrix.copy(entity.worldMatrix)
  }

  private createCpointMesh(name: string, x:number, y:number, z:number){
    const geo = new SphereGeometry(this.radiusSectorsSphere, this.widthSegments, this.heightSegments)
    const mat = new MeshBasicMaterial({color: 0xFF0000})
    const mesh = new Mesh(geo, mat)
    mesh.position.set(x,y,z)
    mesh.name = name
    return mesh
  }

  private updateDimensions(): void {
    this.width = this.mapContainer.nativeElement.clientWidth;
    this.height = this.mapContainer.nativeElement.clientHeight;
  }

  // Animate 
  private animate(): void {
    const delta = this.time.update().getDelta();
    this.labelRenderer.render(this.scene, this.camera);

    // Render Sectors
    const position: any = [];
    this.sectors.forEach((element:any) => {
      element.forEach((elemenInSector:any) => {
        position.push(elemenInSector[0] * this.scaleFactor, 0, elemenInSector[1] * this.scaleFactor) 
      });
    });
    this.lineGeometry.setAttribute('position', new Float32BufferAttribute(position, 3));
    const lineMaterial = new LineBasicMaterial({color: 0xc0aa2e});
    const lines = new LineLoop(this.lineGeometry, lineMaterial);
    this.scene.add(lines);

    this.allCarsPassedFirstSector = true

    // Usamos reduce para encontrar el jugador con más vueltas
    const maxLapsPlayer = this.carrera.corredores.reduce((maxPlayer, player) => {
      if(player.lapCount < this.maxLaps && !player.inAccidente) {
        player.checkLapCount()
        player.entityManager.update(delta)

        if(!player.passedFirstSector) {
          const passed = player.checkFirstSector(this.sectors[1])
          if(!passed){
            this.allCarsPassedFirstSector = false
          }
        }

        //Medicion del tiempo
        let endTime = Date.now()
        let elapsedTime = (endTime - this.startTime) / 1000
        this.alertService.setTimeDetection(elapsedTime)
      }
      return (player.lapCount > maxPlayer.lapCount) ? player : maxPlayer;  
    }, this.carrera.corredores[0]); // Aquí definimos el valor inicial

     // Si todos los coches han pasado por el primer sector, podemos tomar alguna acción
    if (this.allCarsPassedFirstSector) {
      const lineMaterial = new LineBasicMaterial({color: 0x1e9924});
      const lines = new LineLoop(this.lineGeometry, lineMaterial);
      this.scene.add(lines);
    }

    //Envio de alerta
    if (this.allCarsPassedFirstSector && !this.hasSentCrashDetection) {
      this.alertService.setCrashDetection(this.allCarsPassedFirstSector)
      this.hasSentCrashDetection = true
    }

    this.zone.run(() => {        
      this.lapCount = maxLapsPlayer.lapCount;
      this.cdr.detectChanges(); // Forzar la detección de cambios
    })

    this.controls.update();
    this.renderer.render(this.scene, this.camera);
  }


  newPlayers(velocity: number[], paths: Path[], colors: number[]): void{
   let playerDtoArray: PlayerDto[] = []
   
    const nombres: string[] = [
      "Juan",
      "María",
      "Carlos",
      "Ana",
      "Luis",
      "Elena",
      "Miguel",
      "Sofía",
      "Pedro",
      "Lucía"
  ];
  const colorsHex: string[] = [
    "#FF5733", // Rojo anaranjado
    "#33FF57", // Verde lima
    "#3357FF", // Azul
    "#F1C40F", // Amarillo
    "#8E44AD", // Púrpura
    "#E74C3C", // Rojo
    "#3498DB", // Azul claro
    "#1ABC9C", // Turquesa
    "#2ECC71", // Verde
    "#F39C12"  // Naranja
  ]
  for(let i = 0; i < 10; i++){
    const player = new Player(
        this.initialWaypoint, 
        colors[i], 
        this.radius, 
        this.widthSegments, 
        this.heightSegments, 
        velocity[i], 
        this.paths[i]
      )
      
    const playerDto = new PlayerDto(
      i +1,
      nombres[i],
      colorsHex[i]
    )
    playerDtoArray.push(playerDto)
  
    // Mapear playerDtoArray al formato deseado
  const pilotsData: { position: number, name: string, playerColor: string }[] =
  playerDtoArray.map(player => ({
    position: player.position,
    name: player.name,
    playerColor: player.playerColor
  }));

    this.alertService.setDataDetection(pilotsData)
    this.players.push(player)
  }
}
}
