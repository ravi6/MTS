class board {
    constructor () {
            this.xmax = 20  ;   
            this.ymax = 20  ;
            this.walls = [new line(new point(3,3), new point(3,6)),
                          new line(new point(6,5), new point(4,6)), 
                          new line(new point(3,7), new point(2,6))]; 

    } // end constructor
} // End of board