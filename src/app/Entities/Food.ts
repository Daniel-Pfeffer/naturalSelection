import {Position} from "./Position";

export class Food {
    position: Position;
    value: number;
    wasEaten: boolean;

    constructor(position: Position) {
        this.position = position;
        this.value = 1
        this.wasEaten = false;
    }
}

