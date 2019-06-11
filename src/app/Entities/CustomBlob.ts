// @ts-ignore
import {Properties} from "./Properties";
import {Position} from "./Position";
import {Food} from "./Food";

class CustomBlob {
    id: number;
    position: Position;
    properties: Properties;
    foodInSight: Array<Food>;
    foodDevoured: number;

    constructor(id: number, position: Position, properties?: Properties) {
        this.id = id; // clones have the SAME id
        this.position = position;
        this.properties = properties || new Properties();
        this.foodInSight = new Array<Food>();
        this.foodDevoured = 0;
    }

    public move(foodInSight: Array<Food>) {
        // Save food
        this.foodInSight = foodInSight;
        if (this.foodInSight && this.foodInSight.length > 0) {
            let nearestFood: Food = this.findNearestFood();
            for (let i = 0; i < this.properties.agt; i++) {
                this.moveToFood(nearestFood);
            }
        } else {
            for (let i = 0; i < this.properties.agt; i++) {
                this.searchFood();
            }
        }
    }

    private searchFood() {
        /* TODO: move to direction where border is far away i.e:
            Blob is at 1,1
            will not move to any 0 value
            will move to x => 1 any y => 1
            Blob is at 9,9
            will not move to x > 9 and y > 9
            will move to x <= 9 and y <= 9
        * */
    }

    private findNearestFood(): Food {
        return this.foodInSight.sort((a, b) => {
            if (this.distanceToPoint(a) < this.distanceToPoint(b)) {
                return -1;
            }
            if (this.distanceToPoint(a) > this.distanceToPoint(b)) {
                return 1;
            }
            return 0;
        })[0];
    }

    public distanceToPoint(food: Food): number {
        return Math.sqrt(
            Math.pow(
                (food.position.x - this.position.x), 2) +
            Math.pow(
                (food.position.y - this.position.y), 2)
        )
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
        return Math.pow(this.properties.str, 3) * Math.pow(this.properties.agt, 2) + this.properties.sight;
    }
}

export {CustomBlob};
