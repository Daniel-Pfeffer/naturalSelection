import {Generation} from "./Generation";


class Simulation {
    mapLength: number;
    blobCount: number;
    foodCount: number;
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
        // TODO: Generation 1 - maxGenerations
        this.generations.push(new Generation(this.generations[this.generations.length]));
        console.log(maxGenerations);
    }
}

export {Simulation};
