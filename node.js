class node {  // A genertic node for Montecarlo Tree Search

    constructor () {  
         
      this.parent   = {}              ;  
      this.children = []              ;    
      this.wins     = 0               ;
      this.trials   = 0               ;          
      this.board    = new board()     ;  // default new board
      this.isRoot   = false           ;     
      this.depth    = 0               ;  // how far down the tree 
      this.index    = 0               ;  // its index among the siblings
    } // end constructor

    isExpanded () {
         return ( (this.children.length == this.board.moves.size) ) ;
    }

    isTerminal () { 
       return ( !this.board.hasMoves()  );
    }
        
    hasChildren () {
        return (this.children.length > 0) ;
    }
  
    addNode () {   // Add a new child node if it is not yet discovered

        if ( !this.isExpanded() ) { // Can have more Children 
            
            // Get the list of moves used
            let chMoves = new Set() ; 
            this.children.forEach (function (ch) {
                                    chMoves.add (ch.board.move); });
            
            // Get moves yet to be explored 
            let pMoves = new Set([...this.board.moves]
                                  .filter(x => !chMoves.has(x)));
           // console.log("Moves", chMoves, pMoves);

            // Get the board with a random move from above set
            // starting  from the current node state
            let anode = new node() ;
            anode.parent = this ;
            anode.depth = this.depth + 1 ;
            anode.index = this.children.length ;
            
            // Prepare the board for new child 
            let rnum = Math.floor(Math.random() * (pMoves.size)) ;
            let move  = Array.from(pMoves)[rnum];  
         
            anode.board = (this.board.clone());
            anode.board.play(move);           
            this.children.push (anode) ; // A child is born

            return (anode);
             
        } else {
               //  console.log("No more nodes to add") ;
               return ({});  // return empty object
        } 

    } // end addNode
     
    wratio () { // get win ratio
      return ( this.wins / this.trials ) ;
    }

    wexp () { // exploration weight 
      let x =  Math.log (this.parent.trials) / this.trials;
      return ( Math.sqrt (x) ) ;
    } 

    bestChild (fUTC) { // based on some measure return best child node 

          let measure = [] ;

          this.children.forEach ( function (e) {
                                  let x = e.wratio () + fUTC * e.wexp () ;
			                      measure.push (x) ;
                                    });
          let i = measure.indexOf (Math.max(...measure)) ;

          return (this.children[i]) ;  

    } // end bestChild
} // end node
