/*
 * Properties like speed, size, sight, intelligence
 *
 */
export class Properties {
    /*
     * Agility or speed
     * can move agt block in one move
     */
    agt: number;
    /*
     * Strength or size
     * can eat Blobs which are at least 20% smaller than this
     */
    str: number;
    /*
     * sight
     * how well a CustomBlob can see to determine the best route for food
     */
    sight: number;
    /*
     * Intelligence
     * how well a CustomBlob can put two things together
     * how well a CustomBlob can communicate
     * not important for the selfish gene
     */
    int: number;

    constructor(agt?: number, str?: number, sight?: number, int?: number) {
        this.agt = agt || 1;
        this.str = str || 1;
        this.sight = sight || 1;
        this.int = int || 1;
    }

    public mutate() {
        //30% chance
        if (Math.random() > (2 / 3)) {
            let mutation = Math.random();
            if (mutation < (1 / 3)) {
                this.agt++
            } else if (mutation > (1 / 3) && mutation < (2 / 3)) {
                this.str++;
            } else if (mutation > (2 / 3)) {
                this.sight++;
            }
        }
    }
}
