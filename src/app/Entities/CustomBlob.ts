// @ts-ignore
import {Properties} from "./Properties";
import {Position} from "./Position";
import {Food} from "./Food";

class CustomBlob {
    id: number;
    position: Position;
    properties: Properties;
    foodInSight: Array<Food>;

    constructor(id: number, position: Position, properties?: Properties) {
        this.id = id;
        this.position = position;
        this.properties = properties || new Properties();
        this.foodInSight = new Array<Food>();
    }

    public move(foodInSight: Array<Food>) {
        // Save food
        this.foodInSight = foodInSight;
        //console.log(foodInSight);
        let nearestFood: Food = this.findNearestFood();
        console.log(nearestFood)
    }

    private findNearestFood(): Food {
        return this.foodInSight.sort(this.compareDistance)[0];
    }

    private compareDistance(a: Food, b: Food) {
        if (this.distanceToPoint(a) < this.distanceToPoint(b)) {
            return -1;
        }
        if (this.distanceToPoint(a) > this.distanceToPoint(b)) {
            return 1;
        }
        return 0;
    }

    public distanceToPoint(food: Food):number {
        return Math.sqrt(
            Math.pow(
                (food.position.x - this.position.x), 2) +
            Math.pow(
                (food.position.y - this.position.y), 2)
        )
    }
}

export {CustomBlob};
