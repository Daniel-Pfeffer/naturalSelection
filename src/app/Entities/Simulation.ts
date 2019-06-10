import {Generation} from "./Generation";
import {Socket} from "socket.io";
import {StartConfigs} from "../helper/startConfigs";
import {FoodConfig} from "../helper/foodConfig";


export class Simulation {
    mapLength: number;
    blobCount: number;
    foodConfigs: FoodConfig;
    socket: Socket | undefined;
    private generations: Array<Generation>;

    constructor(configs: StartConfigs) {
        this.generations = new Array<Generation>();
        // Generation 0
        this.blobCount = configs.startingPopulationSize || 20;
        this.foodConfigs = configs.food || new FoodConfig(50);
        this.mapLength = configs.mapSize || 10;
        this.generations.push(new Generation(undefined, this.mapLength, this.blobCount, this.foodConfigs))
    }


    public async run(maxGenerations: number) {
        // run all generations
        for (let i = 0; i < maxGenerations; i++) {
            let generation = new Generation(this.generations[this.generations.length - 1]);
            this.generations.push(generation);
            generation.run().catch(reason => {
                console.log(reason);
            });
        }
    }
}
