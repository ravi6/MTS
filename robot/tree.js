class tree {    // The Game Tree (MonteCarlo Tree Search)

    constructor (parent) {
        
         this.root        = new node() ;
         this.root.isRoot = true ;
         this.parent      = parent ;  // Holds the robot that
         this.selNode   = undefined; // Node selected at the end of selection
         this.simNode   = undefined; // New node from which simulation occurs
         
         this.Nsim = 0;        // Total number of simulations
         this.NodeSet = [] ;   // All discovered nodes of the tree
	     this.UTCF = 1.414     ; // Normally 1.414
    } // end constructor


    select () {  // Select best path in the node tree and return 
                 //  the node with unexplored moves
           
       var anode = this.root ;       anode.trials = 1 ;
       while (anode.isExpanded () && !anode.isTerminal()) { // It has all of the potential children         
                                                            //travel down the tree until you hit a node
                                                           // with unexplored moves 
          anode = anode.bestChild (this.UTCF) ;  // Latch on to the best and repeat
       }
          this.selNode = anode ;         
    } // end select

    expand() { // Tree expansion phase
           this.simNode = {} ;
            if (!this.selNode.isTerminal()) {
               this.simNode = this.selNode.addNode();
               if ( ! isEmpty(this.simNode) ) {
                 this.NodeSet.push(this.simNode);
               }}                           
    } // end expand

    simulate () {  // We play from the given node randomly until result
   
        if ( isEmpty(this.simNode) ) { return };
        var ab = this.simNode.board.clone() ; // A temporary board we can play with 
  
        while (ab.result == "NONE") { // Keep the play until conclusion     
            var rnum = Math.floor (Math.random() * ab.moves.size) ;
            var move  = Array.from (ab.moves)[rnum]; 
            ab.play (move) ;                 
        }
   
        this.Nsim = this.Nsim + 1   ;  // simulation count 
        this.simResult = ab.result ;
        this.simPlayer = ab.player ;
         
    } // end simulation


     propagate () {  // Back propagate result of simulaiton
       
       if ( isEmpty(this.simNode) ) return ;

       var anode = this.simNode ;

        do  {  // Move up the chain and update
           anode.trials = anode.trials + 1 ; // bump each nodes trial count

           // update the wins based on end result
           if ((this.simResult == "WIN") && 
               (this.simPlayer == anode.board.player)) {
                 anode.wins = anode.wins + 1 ;
           } else if (this.simResult == "DRAW") { 
                      anode.wins = anode.wins + 0.5} ;
         
           anode = anode.parent ; // move up the chain                   
       } while (!(anode.isRoot)) ;

     } // end propagate

   info () {  // A bit more information of the state of the tree

     console.log("Nodes Discovered: ", this.NodeSet.length);
     for (let i=0 ; i<this.NodeSet.length ; i++) {
           let e = this.NodeSet[i] ;
           console.log(i, "  Depth = ", e.depth, "Index = ", e.index);
     };
     
   } // end info

} // end of game tree
