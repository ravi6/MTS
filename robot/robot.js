class robot {
// This the robot
    constructor (id, parent) {
        this.id = id ;
        this.tree = new tree ; // Its MTCS tree
        this.budget = 40 ;     // This could be made different for each robot
        this.board = parent ;
    }

    mtsCycle() { // MonteCarlo Tree SEP 
         this.tree.select() ; 
         this.tree.expand() ;       
         this.tree.simulate() ;   
         this.tree.propagate() ;   
    } // end mtsCycle

   getMoves (pt, cost) {

      // get possible moves from given position
      // 
      // we could make them different for each robot if we wanted
        const MOVES = [[0,1], [0,-1], [1,0], [-1,0]] ;

        // Dermine possible moves (actions) by the robot at current pos
        var moves = []   ;

        MOVES.forEach ( function (move) {
            let npt = new point (pt.x + move[0],
                                   pt.y + move[1]) ;
            var lm = new line(pt, npt) ;
            
            // Test if the move lands outside arena
            let offBoard =  ( (npt.x < 0 || npt.x > this.board.xmax) ||
                              (npt.y < 0 || npt.y > this.board.ymax) ) ;

            if (!offBoard) {
               let hitswall = false ; // starting assumption for each move
               board.walls.forEach ( function (wall) {

                   let ipt = intsect(lm, wall); // get intersection pt
                   if (ipt == undefined) { // lines
                      hitswall = hitswall || isInside (npt, wall) ; // we are hitting a wall
                   } else { // not parallel lines
                       hitswall = hitswall || isInside (ipt, wall);
                   }
                }); // wall loop
            } // offBoard

              let overBudget = (cost > this.Budget) ;
              if (!(hitswall || offBoard || overBudget) ) moves.push = move ;
        }); // all Moves

        return (moves) ;
    } // end getpMoves


    getCost (move) { // Calculate cost of a move}
        return (1) ; // We only travel 1 unit distance here
    } // end getCost

    getReward (pos) {// Calculate reward moving to pos
        let xv = [6, 8, 4, 1, 2] ;
        let v = [7, 4, 2, 3, 8] ;
        // reward if you land in any (x,y) combo from above vectors
        let reward = xv.includes(pos) && yv.includes(pos);
        if (reward) {return (100);}
        else {return(0);}       
    } // end getReward

 
} // end robot