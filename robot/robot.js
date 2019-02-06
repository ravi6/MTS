class robot {
// This the robot
    constructor (id, pos, arena) {
        this.id       = id       ;
        this.pos      = pos      ; 
        this.budget   = 40       ; // This could be made different for each robot 
        this.arena    = arena    ; // where Robot can move
        this.tree     = new tree (this) ; // Its MTCS tree
    }

    mtsCycle() { // MonteCarlo Tree SEP 
         this.tree.select() ; 
         this.tree.expand() ;       
         this.tree.simulate() ;   
         this.tree.propagate() ;   
    } // end mtsCycle

   getMoves (pt, cost) {

      // get possible moves from given position and accumulated cost
      // 
      // we could make them different for each robot if we wanted
        const MOVES = [[0,1], [0,-1], [1,0], [-1,0]] ;

        // Dermine possible moves (actions) by the robot at current pos
        let moves = []   ;

        for (let i=0 ; i<MOVES.length ; i++) {  
            let move = MOVES[i] ;
            let npt = new point (pt.x + move[0],
                                   pt.y + move[1]) ;
            let lm = new line(pt, npt) ;
            let hitswall = false ;
            
            // Test if the move lands outside arena
            let offBoard =  ( (npt.x < 0 || npt.x > this.arena.xmax) ||
                              (npt.y < 0 || npt.y > this.arena.ymax) ) ;

            if (!offBoard) {
               hitswall = false ; // starting assumption for each move
               for (let k=0 ; k < this.arena.walls.length ; k++) {
                   let wall = this.arena.walls[k] ;
                   let ipt = intsect(lm, wall); // get intersection pt

                   if ( !(ipt == undefined) || onLine (npt, wall)) {
                       hitswall = true ;
                                       console.log("mmm", npt, onLine(npt,wall));
                       console.log("Hit wall ", k, "at", ipt,
                                   "while moving from", pt, "to", npt);
                       break ;  // No need to check remaining walls
                   }
                } // wall loop
            } // offBoard

              let overBudget = (cost + this.getCost(move)) > this.budget;
              if (!(hitswall || offBoard || overBudget) ) moves.push(move) ;
        }; // all Moves

        return (moves) ;
    } // end getpMoves


    getCost (move) { // Calculate cost of a move}
        return (1) ; // We only travel 1 unit distance here
    } // end getCost

    getReward (pos) {// Calculate reward moving to pos
       let tps = [ [2,1], [4,1], [5,3], [9,4], [3,4],
                   [2,6], [7,6], [4,8], [6,8], [8,9]] ; // Treasure points
    
        let reward = false ; 
        for (let i=0; i<tps.length; i++ ) {
            if (pos.x == tps[i][0] && pos.y == tps[i][1]) {
                reward = true ;
                break ;
            }
        } 

        if (reward) {return (100);}
        else {return(0);}       
    } // end getReward

 
} // end robot