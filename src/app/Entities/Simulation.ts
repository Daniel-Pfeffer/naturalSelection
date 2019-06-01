import {CustomBlob} from "./CustomBlob";
import {Food} from "./Food";
import {Position} from "./Position";

class Simulation {
    blobs: Array<CustomBlob>;
    food: Array<Food>;
    mapLength: number;
    blobCount: number;
    foodCount: number;
    private trackedPos: Array<Position>;

    constructor(blobCount?: number, foodCount?: number, mapSize?: number) {
        // Generation 0
        this.blobCount = blobCount || 20;
        this.foodCount = foodCount || 50;
        this.mapLength = mapSize || 10;
        this.trackedPos = new Array<Position>();
        this.blobs = new Array<CustomBlob>();
        // Generate Blobs
        for (let i = 0; i <= this.blobCount; i++) {
            let pos = this.generateNewPosition();
            this.blobs.push(new CustomBlob(this.blobs.length, pos))
        }


        this.food = new Array<Food>();
        // Generate Food
        for (let i = 0; i <= this.foodCount; i++) {
            let pos = this.generateNewPosition();
            this.food.push(new Food(pos));
        }
        // clear trackedPos
        this.trackedPos = new Array<Position>();
        delete this.trackedPos;
    }

    private generateNewPosition(): Position {
        let contains;
        let pos: Position;
        do {
            contains = false;
            let x = this.randomFromInterval(1, this.mapLength);
            let y = this.randomFromInterval(1, this.mapLength);
            pos = new Position(x, y);
            this.trackedPos.forEach(posit => {
                if (posit.x === pos.x && posit.y === pos.y) {
                    contains = true;
                }
            });
        } while (contains);
        this.trackedPos.push(pos);
        return pos;
    }

    private randomFromInterval(min: number, max: number) {
        return Math.floor(Math.random() * (max - min + 1) + min);
    }

    public async run(maxGenerations: number) {
        // TODO: Generation 1 - maxGenerations
        console.log(maxGenerations);
    }
}

export {Simulation};
