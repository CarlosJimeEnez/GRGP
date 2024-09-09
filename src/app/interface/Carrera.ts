import { Player } from "./Player";

export class Carrera {
    corredores: Player[]

    constructor(corredores: Player[]){
        this.corredores = corredores
    }
}