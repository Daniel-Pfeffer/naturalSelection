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
        if (Math.random() >= (2 / 3)) {
            console.log(`do the mutate`);
            let mutation = Math.random();
            let up = Math.random() > (1 / 3);
            console.log(up);
            if (mutation <= (1 / 3)) {
                console.log('Mutate agt');
                if (up) {
                    console.log('Mutate agt++');
                    this.agt++
                } else if (this.agt > 1) {
                    console.log('Mutate agt--');
                    this.agt--;
                } else {
                    console.log('would mutate agt--');
                }
            } else if (mutation > (1 / 3) && mutation <= (2 / 3)) {
                console.log('Mutate str');
                if (up) {
                    console.log('Mutate str++');
                    this.str++
                } else if (this.str > 1) {
                    console.log('Mutate str--');
                    this.str--;
                } else {
                    console.log('would mutate str--');
                }
            } else if (mutation > (2 / 3)) {
                console.log('mutate sight');
                if (up) {
                    this.sight++;
                    console.log('mutate sight++');
                } else if (this.sight > 1) {
                    this.sight--;
                } else {
                    console.log('would mutate sight--');
                }
            }
            if (up) {
                console.log('mutate int++');
                this.int++;
            } else if (this.int > 1) {
                console.log('mutate int--');
                this.int--;
            } else {
                console.log('would mutate int--');
            }
        }
    }
}
