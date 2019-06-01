// @ts-ignore
import {Properties} from "./Properties";
import {Position} from "./Position";

class CustomBlob {
    id: number;
    position: Position;
    properties: Properties;

    constructor(id: number, position: Position, properties?: Properties) {
        this.id = id;
        this.position = position;
        this.properties = properties || new Properties();
    }
}

export {CustomBlob};
