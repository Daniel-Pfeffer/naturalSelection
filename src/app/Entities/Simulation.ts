import {Generation} from "./Generation";
import {Socket} from "socket.io";


export class Simulation {
    mapLength: number;
    blobCount: number;
    foodCount: number;
    socket: Socket | undefined;
    private generations: Array<Generation>;

    constructor(blobCount?: number, foodCount?: number, mapSize?: number) {
        this.generations = new Array<Generation>();
        // Generation 0
        this.blobCount = blobCount || 20;
        this.foodCount = foodCount || 50;
        this.mapLength = mapSize || 10;
        this.generations.push(new Generation(undefined, this.mapLength, this.blobCount, this.foodCount))
    }


    public async run(maxGenerations: number) {
        await setTimeout(function () {
            console.log("noice 1")
        }, 1000);
        this.socket!.emit("gen", "Hoi");
        // TODO: Generation 1 - maxGenerations
        setTimeout(function () {
            console.log("noice 2")
        }, 1000);
        this.socket!.emit("gen", "Hoisas");
        await this.generations.push(new Generation(this.generations[this.generations.length]));
    }
}
