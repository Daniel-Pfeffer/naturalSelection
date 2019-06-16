import {CustomBlob} from "./CustomBlob";
import {Food} from "./Food";
import {Position} from "./Position";
import {FoodConfig} from "../helper/foodConfig";
import {Properties} from "./Properties";

export class Generation {
    blobs: Array<CustomBlob>;
    food: Array<Food>;
    private trackedPos: Array<Position>;
    blobCount?: number;
    foodConfig: FoodConfig;
    mapLength: number;
    lastGeneration: Generation;

    constructor(lG?: Generation, mL?: number, bC?: number, fC?: FoodConfig) {
        this.trackedPos = new Array<Position>();
        // get all parameter from Generation current-1 else generate Generation 0
        this.lastGeneration = lG!;
        if (this.lastGeneration) {
            this.mapLength = this.lastGeneration.mapLength;
            this.blobs = this.lastGeneration.blobs;
            this.foodConfig = this.lastGeneration.foodConfig;
            // set blob position so that no food spawn on top of blob
            this.blobs.forEach(blob => {
                this.trackedPos.push(blob.position)
            });
        } else {
            this.mapLength = mL!;
            this.blobCount = bC!;
            this.foodConfig = fC!;

            this.blobs = new Array<CustomBlob>();
            this.blobCount = this.blobCount!;
            for (let i = 0; i <= this.blobCount; i++) {
                let pos = this.generateNewPosition();
                this.blobs.push(new CustomBlob(this.blobs.length, pos))
            }
        }
        this.food = new Array<Food>();
        // Generate Food
        for (let i = 0; i <= this.foodConfig.foodAmount; i++) {
            let pos = this.generateNewPosition();
            this.food.push(new Food(pos));
        }
        if (this.foodConfig.isDecreasing == 1) {
            this.foodConfig.foodAmount -= this.foodConfig.amountChanging!;
            if (this.foodConfig.foodAmount < this.foodConfig.minimumFood!) {
                this.foodConfig.foodAmount = this.foodConfig.minimumFood!
            }
        } else if (this.foodConfig.isDecreasing == 2) {
            this.foodConfig.foodAmount += this.foodConfig.amountChanging!;
            if (this.foodConfig.foodAmount > this.foodConfig.maximumFood!) {
                this.foodConfig.foodAmount = this.foodConfig.maximumFood!;
            }
        }
        // clear trackedPos
        this.trackedPos = new Array<Position>();
    }

    private generateNewPosition(): Position {
        let contains;
        let pos: Position;
        do {
            contains = false;
            let x = this.randomFromInterval(1, this.mapLength);
            let y = this.randomFromInterval(1, this.mapLength);
            pos = new Position(x, y);
            // check if a position is already used
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

    public async run() {
        // One generation 10 moves
        for (let i = 0; i < 10; i++) {
            this.blobs.forEach(blob => {
                console.log(`Move ${i} starts for blob ${blob.id}`);
                blob.move(this.searchForFood(blob), this.mapLength);
            });
        }
        console.log("call endGen");
        let nextGen: Array<CustomBlob> = new Array<CustomBlob>();
        this.blobs.forEach(blob => {
            let nextGenBlob = blob.endGeneration();
            if (nextGenBlob != null) {
                if (Array.isArray(nextGenBlob)) {
                    let parent = nextGenBlob[0];
                    nextGen.push(parent);
                    let positionOfNewBlob = this.generateNewPositionBasedOnPosition(parent.position);
                    let newBlob = new CustomBlob(
                        parent.id,
                        positionOfNewBlob,
                        // to avoid references to parent blob
                        new Properties(
                            parent.properties.agt,
                            parent.properties.str,
                            parent.properties.sight,
                            parent.properties.int
                        )
                    );
                    newBlob.properties.mutate();
                    nextGen.push(newBlob);
                } else {
                    nextGen.push(nextGenBlob);
                }
            }
        });
        this.blobs = nextGen;
    }

    private searchForFood(blob: CustomBlob): Array<Food> {
        let foodInSight = Array<Food>();
        // iterate through all visible tiles if there is food anywhere
        for (let startX = -blob.properties.sight; startX <= blob.properties.sight; startX++) {
            for (let startY = -blob.properties.sight; startY <= blob.properties.sight; startY++) {
                let pos = new Position(blob.position.x + startX, blob.position.y + startY);
                // @ts-ignore needed except you want a spicy error
                let food: Food | undefined = this.food.find(food => {
                    if (pos.x == food.position.x && pos.y == food.position.y) {
                        return food;
                    }
                });
                // check if the food is defined and if the food was eaten
                if (food && !food.wasEaten) {
                    // if food found and wasn't eaten push to foodInSight
                    foodInSight.push(food);
                }
            }
        }
        return foodInSight;
    }

    /*
        more disgusting
     */
    private generateNewPositionBasedOnPosition(position: Position) {
        const {x: x1, y: y1} = position;
        let isInBlobs = false;
        let pos: Position;
        do {
            let x = this.randomFromInterval(x1 - 1 < 1 ? 1 : x1 - 1, x1 + 1);
            let y = this.randomFromInterval(y1 - 1 < 1 ? 1 : y1 - 1, y1 + 1 > this.mapLength ? this.mapLength : y1 + 1);
            pos = new Position(x, y);
            isInBlobs = this.blobs.find(blob => blob.position.x == pos.x && blob.position.y == pos.y) == null;
        } while (isInBlobs);
        return pos;
    }
}
