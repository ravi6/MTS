class  board {

      constructor () {
            this.xmax = 10 ;
            this.ymax = 10 ;
            this.walls = [ new line (new point(1, 3), new point(3, 3)),
                       new line (new point(7, 2), new point(7, 4)),
                       new line (new point(4, 5), new point(6, 7)) ];               
      }

} // End of board
