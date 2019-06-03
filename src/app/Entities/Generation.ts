import {CustomBlob} from "./CustomBlob";
import {Food} from "./Food";
import {Position} from "./Position";

export class Generation {
    blobs: Array<CustomBlob>;
    food: Array<Food>;
    private trackedPos: Array<Position>;
    blobCount?: number;
    foodCount: number;
    mapLength: number;
    lastGeneration: Generation;

    constructor(lG?: Generation, mL?: number, bC?: number, fC?: number) {
        this.trackedPos = new Array<Position>();
        // get all parameter from Generation current-1 else generate Generation 0
        this.lastGeneration = lG!;
        if (this.lastGeneration) {
            this.mapLength = this.lastGeneration.mapLength;
            this.blobs = this.lastGeneration.blobs;
            this.foodCount = this.lastGeneration.foodCount;
            // set blob position so that no food spawn on top of blob
            this.blobs.forEach(blob => {
                this.trackedPos.push(blob.position)
            });
        } else {
            this.mapLength = mL!;
            this.blobCount = bC!;
            this.foodCount = fC!;

            this.blobs = new Array<CustomBlob>();
            this.blobCount = this.blobCount!;
            for (let i = 0; i <= this.blobCount; i++) {
                let pos = this.generateNewPosition();
                this.blobs.push(new CustomBlob(this.blobs.length, pos))
            }
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
        this.run()
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

    private run(): void {
        // One generation 10 moves
        for (let i = 0; i < 10; i++) {
            this.blobs.forEach(blob => {
                //console.log(`Feck ${blob.id}`)
            });
        }
    }
}
