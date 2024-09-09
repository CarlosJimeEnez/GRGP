import { PerspectiveCamera, Scene, WebGLRenderer, SphereGeometry, MeshBasicMaterial, Mesh, LineLoop, BufferGeometry, Float32BufferAttribute, LineBasicMaterial } from 'three';
import { Vehicle, Path, Time, FollowPathBehavior, OnPathBehavior, EntityManager, Vector3 } from 'yuka';

export class Player {
    inAccidente: boolean = false; 
    lapCount: number; 
    hasCompletedLap: boolean; 
    currentWaypoint: Vector3; 
    vehicleGeometry: SphereGeometry;
    vehicleMaterial: MeshBasicMaterial;
    vehicleMesh: Mesh;
    vehicleAgent: Vehicle;
    radius: number;
    widthSegments: number;
    heightSegments: number;
    maxSpeed: number;
    initialWaypoint: Vector3;
    followPathBehavior: FollowPathBehavior; 
    onPathBehavior: OnPathBehavior; 
    entityManager: EntityManager;
    lastLapTime: number = 0; 
    lapCooldown: number = 2000; //Cooldown en milisegundos (2)   

    constructor(initialWaypoint: Vector3 ,playerColor: number, radius: number, widthSegments: number, heightSegments: number, maxSpeed: number, path: Path) {
        this.lapCount = 0;
        this.hasCompletedLap = false;
        this.initialWaypoint = initialWaypoint; 
        this.radius = radius;
        this.widthSegments = widthSegments;
        this.heightSegments = heightSegments;
        this.maxSpeed = maxSpeed;
        this.currentWaypoint = new Vector3()

        // Crear la geometría y el material del vehículo
        this.vehicleGeometry = new SphereGeometry(this.radius, this.widthSegments, this.heightSegments);
        this.vehicleMaterial = new MeshBasicMaterial({ color: playerColor });
        this.vehicleMesh = new Mesh(this.vehicleGeometry, this.vehicleMaterial);

        // Evitar actualizaciones automáticas de la matriz
        this.vehicleMesh.matrixAutoUpdate = false;

        // Inicializar el agente vehículo
        this.vehicleAgent = new Vehicle();
        this.vehicleAgent.setRenderComponent(this.vehicleMesh, this.sync.bind(this));
        this.vehicleAgent.position.copy(path.current())
        this.initialWaypoint = this.vehicleAgent.getWorldPosition(initialWaypoint)
        this.vehicleAgent.maxSpeed = this.maxSpeed;
        
        //Behavior
        this.followPathBehavior = new FollowPathBehavior(path, 0.5);
        this.vehicleAgent.steering.add(this.followPathBehavior)

        this.onPathBehavior = new OnPathBehavior(path);
        this.onPathBehavior.radius = 1;
        this.vehicleAgent.steering.add(this.onPathBehavior);

        this.entityManager = new EntityManager();
        this.entityManager.add(this.vehicleAgent);
    }

    // Método para establecer la posición inicial del jugador
    private setPosition(pathCurrent: Vector3) {
        this.vehicleAgent.position.copy(pathCurrent);
        this.initialWaypoint = this.vehicleAgent.getWorldPosition(new Vector3());
    }

    // Método para sincronizar la renderización (ejecutado en cada frame)
    private sync(entity: any, renderComponent: any){
        renderComponent.matrix.copy(entity.worldMatrix)
    }

    checkLapCount(): void {
        const currentTime = performance.now()

        this.currentWaypoint = this.vehicleAgent.getWorldPosition(this.currentWaypoint);
        const distance = this.currentWaypoint.distanceTo(this.initialWaypoint);
        const thereshold = 0.39

        if (distance < thereshold && currentTime - this.lastLapTime > this.lapCooldown) {
            this.lapCount += 1; 
            console.log("Se dio una vuelta");
            this.lastLapTime = currentTime; 
        } 
    }
}