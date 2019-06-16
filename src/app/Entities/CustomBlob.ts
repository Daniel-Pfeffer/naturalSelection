import {Properties} from "./Properties";
import {Position} from "./Position";
import {Food} from "./Food";

export class CustomBlob {
    id: number;
    position: Position;
    properties: Properties;
    foodInSight: Array<Food>;
    foodDevoured: number;
    moveSet: string;

    constructor(id: number, position: Position, properties?: Properties) {
        this.id = id; // clones have the SAME id
        this.position = position;
        this.properties = properties || new Properties();
        this.foodInSight = new Array<Food>();
        this.foodDevoured = 0;
        this.moveSet = '';
    }

    public move(foodInSight: Array<Food>, mapLength: number) {
        // Save food
        this.foodInSight = foodInSight;
        if (this.foodInSight && this.foodInSight.length > 0) {
            let nearestFood: Food = this.findNearestFood();
            for (let i = 0; i < this.properties.agt; i++) {
                this.moveToFood(nearestFood);
            }
        } else {
            for (let i = 0; i < this.properties.agt; i++) {
                this.searchFood(mapLength);
            }
        }
    }

    private searchFood(mapLength: number) {
        console.log("Enter search food");
        let posToMove = this.findPositionToMove(mapLength);
        this.moveToPosition(posToMove);
    }

    private findPositionToMove(mapLength: number): Position {
        const positionsToMove = [
            {//D
                x: 0,
                y: 0
            },
            {//A
                x: 0,
                y: mapLength
            },
            {//B
                x: mapLength,
                y: mapLength
            },
            {//C
                x: mapLength,
                y: 0
            },
            {//g
                x: mapLength / 2,
                y: 0
            },
            {//h
                x: 0,
                y: mapLength / 2
            },
            {//e
                x: mapLength / 2,
                y: mapLength
            },
            {//f
                x: mapLength,
                y: mapLength / 2
            }
        ];
        return positionsToMove.sort((a, b) => {
            if (this.distanceToPoint(a) < this.distanceToPoint(b)) {
                return 1
            }
            if (this.distanceToPoint(a) > this.distanceToPoint(b)) {
                return -1
            }
            return 0
        })[0];
    }

    private findNearestFood(): Food {
        return this.foodInSight.sort((a, b) => {
            if (this.distanceToPoint(a.position) < this.distanceToPoint(b.position)) {
                return -1;
            }
            if (this.distanceToPoint(a.position) > this.distanceToPoint(b.position)) {
                return 1;
            }
            return 0;
        })[0];
    }

    private distanceToPoint(position: Position): number {
        return Math.sqrt(
            Math.pow(
                (position.x - this.position.x), 2) +
            Math.pow(
                (position.y - this.position.y), 2)
        )
    }

    private moveToPosition(position: Position) {
        if (position.y > position.y) {
            if (position.x > position.x) {
                // add 1,1
                this.position.x++;
                this.position.y++;
            } else if (position.x < position.x) {
                // add -1,1
                this.position.x--;
                this.position.y++;
            } else {
                // add 0,1
                this.position.y++;
            }
        } else if (position.y < position.y) {
            if (position.x > position.x) {
                // add 1,-1
                this.position.x++;
                this.position.y--;
            } else if (position.x < position.x) {
                // add -1,-1
                this.position.x--;
                this.position.y--;
            } else {
                // add 0,-1
                this.position.y--;
            }
        } else {
            if (position.x > position.x) {
                // add 1,0
                this.position.x++;
            } else if (position.x < position.x) {
                // add -1,0
                this.position.x--;
            } else {
                // is on top
                // heck
            }
        }
    }

    private moveToFood(food: Food) {
        if (food.position.y > food.position.y) {
            if (food.position.x > food.position.x) {
                // add 1,1
                this.position.x++;
                this.position.y++;
            } else if (food.position.x < food.position.x) {
                // add -1,1
                this.position.x--;
                this.position.y++;
            } else {
                // add 0,1
                this.position.y++;
            }
        } else if (food.position.y < food.position.y) {
            if (food.position.x > food.position.x) {
                // add 1,-1
                this.position.x++;
                this.position.y--;
            } else if (food.position.x < food.position.x) {
                // add -1,-1
                this.position.x--;
                this.position.y--;
            } else {
                // add 0,-1
                this.position.y--;
            }
        } else {
            if (food.position.x > food.position.x) {
                // add 1,0
                this.position.x++;
            } else if (food.position.x < food.position.x) {
                // add -1,0
                this.position.x--;
            } else {
                // is on top -> devour
                console.log(`food was eaten by blob${this.id}`);
                food.wasEaten = true;
                this.foodDevoured += food.value;
            }
        }
    }

    public endGeneration(): CustomBlob | null | Array<CustomBlob> {
        console.log(`blobID: ${this.id}`);
        console.log(`devoured: ${this.foodDevoured}`);
        console.log(`energy cost: ${this.calculateEnergyCost()}`);
        if (this.calculateEnergyCost() <= this.foodDevoured) {
            if (this.calculateEnergyCost() * 2 <= this.foodDevoured) {
                console.log(`mate`);
                this.foodDevoured = 0;
                return [this]; // Disgusting
            } else {
                console.log(`live`);
                this.foodDevoured = 0;
                return this;
            }
        } else {
            console.log(`die`);
            return null;
        }
    }

    private calculateEnergyCost() {
        return Math.pow(this.properties.str, 1) * Math.pow(this.properties.agt, 1 / 2) + this.properties.sight / 2;
    }
}
