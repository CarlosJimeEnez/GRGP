import { PerspectiveCamera, Scene, WebGLRenderer, SphereGeometry, MeshBasicMaterial, Mesh, LineLoop, BufferGeometry, Float32BufferAttribute, LineBasicMaterial } from 'three';
import { Vehicle, Path, Time, FollowPathBehavior, OnPathBehavior, EntityManager, Vector3 } from 'yuka';

export class Player {
    vehicleGeometry: SphereGeometry;
    vehicleMaterial: MeshBasicMaterial;
    vehicleMesh: Mesh;
    vehicleAgent: Vehicle;
    radius: number;
    widthSegments: number;
    heightSegments: number;
    maxSpeed: number;
    initialWaypoint: Vector3;
    

    constructor(initialWaypoint: Vector3 ,playerColor: number, radius: number, widthSegments: number, heightSegments: number, maxSpeed: number, path: Path) {
        this.initialWaypoint = initialWaypoint
        this.radius = radius;
        this.widthSegments = widthSegments;
        this.heightSegments = heightSegments;
        this.maxSpeed = maxSpeed;

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
    }

    // Método para establecer la posición inicial del jugador
    setPosition(pathCurrent: Vector3) {
        this.vehicleAgent.position.copy(pathCurrent);
        this.initialWaypoint = this.vehicleAgent.getWorldPosition(new Vector3());
    }

    // Método para sincronizar la renderización (ejecutado en cada frame)
    private sync(entity: any, renderComponent: any){
        renderComponent.matrix.copy(entity.worldMatrix)
    }
}