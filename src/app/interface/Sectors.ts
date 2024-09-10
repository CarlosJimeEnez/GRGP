import { Vector3 } from "yuka";

export class Sectors {
    sector!: Vector3

    constructor(x: number, y: number, z: number){
        this.sector = new Vector3(x, y, z)
    }
}