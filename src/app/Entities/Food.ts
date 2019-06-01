import {Position} from "./Position";

class Food {
    position: Position;
    value: number;

    constructor(position: Position) {
        this.position = position;
        this.value = 1
    }
}

export {Food}
