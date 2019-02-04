class node {  // A genertic node for Montecarlo Tree Search

    constructor (pos, move) {         
      this.parent   = {}              ;  
      this.children = []              ;    

      this.trials   = 0               ;          
      this.pos      = pos             ; // position of robot
      this.move     = move            ; // The move that resulted in this node

      this.gGain    = 0               ; // Global benefit (of all robots actions)
   
      this.Gain     = 0               ; // Cumulative Gains of Robot
      this.Cost     = 0               ; // Accumulated cost
   
      this.isRoot   = false           ;     
      this.depth    = 0               ;  // how far down the tree 
      this.index    = 0               ;  // its index among the siblings

      this.robot     = undefined      ; // The robot this belongs to
      this.moves     = undefined      ; // All possible children moves

    } // end constructor

    isExpanded () {
         return ( (this.children.length == this.moves.size) ) ;
    }

    isTerminal () { 
       return ( this.moves.length  == 0  );
    }
        
    hasChildren () {
        return (this.children.length > 0) ;
    }
  
    addNode () {   // Add a new child node if it is not yet discovered

        if ( !this.isExpanded() ) { // Can have more Children 
            
            // Get the list of moves used
            let chMoves = new Set() ; 
            this.children.forEach (function (ch) {
                                    chMoves.add (ch.move); });
            
            // Get moves yet to be explored 
            let pMoves = new Set([...this.moves]
                                  .filter(x => !chMoves.has(x)));
           // console.log("Moves", chMoves, pMoves);
 
            // Select randomly one unexplored move
            let rnum = Math.floor(Math.random() * (pMoves.size)) ;
            let move  = Array.from(pMoves)[rnum];  

            // spawn the child node state (with new pos, and new Cost)
            let newpos = new point (this.pos.x + move[0],
                                    this.pos.y + move[1]);

            let anode = new node(newpos, move) ;

            // Additional initializations of anode
            anode.Cost = anode.parent.Cost + this.robot.getCost(move);
            anode.Gain = anode.parent.Gain + this.robot.getReward(anode.pos);
            anode.parent = this ;
            anode.robot = this.robot ; // Pass parental info
            //Determine all the moves this child can make and store
            anode.moves = this.robot.getMoves(anode.pos, anode.Cost) ;

            anode.depth = this.depth + 1 ;
            anode.index = this.children.length ;

                  
            this.children.push (anode) ; // A child is born
            return (anode);
             
        } else {
               //  console.log("No more nodes to add") ;
               return ({});  // return empty object
        } 

    } // end addNode
     
    gGainMean () { // Mean gGain
      return ( this.gGain / this.trials ) ;
    }

    wexp () { // exploration weight 
      let x =  Math.log (this.parent.trials) / this.trials;
      return ( Math.sqrt (x) ) ;
    } 

    bestChild (fUTC) { // based on some measure return best child node 

          let measure = [] ;

          this.children.forEach ( function (e) {
                                  let x = e.gGainMean () + fUTC * e.wexp () ;
			                      measure.push (x) ;
                                    });
          let i = measure.indexOf (Math.max(...measure)) ;

          return (this.children[i]) ;  

    } // end bestChild

  getTree (node) { // returns the tree object the node belongs 
       var cnode = node ;
        while (!cnode.parent.isRoot()) {
            cnode = cnode.parent ;
        }
         return (cnode.parent.parent) ;
    } // end getTree

    getRobot (node) { // returns the Robot object a node belongs 
       var tnode = getTree (node) ;
       return (tnode.parent) ;
    } // end getRobot


} // end node
