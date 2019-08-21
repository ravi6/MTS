class tree {    // The Game Tree (MonteCarlo Tree Search)

    constructor (parent) {

         this.parent      = parent      ;  // Holds the robot that has this tree
         this.selNode     = undefined   ;  // Node selected at the end of selection
         this.simNode     = undefined   ;  // New node from which simulation occurs
         
         this.Nsim      = 0      ;        // Total number of simulations
         this.NodeSet   = []     ;   // All discovered nodes of the tree
	     this.UTCF      = 1.414  ; // Normally 1.414
        
         this.robot =  parent       ;

	 // Root Node creation and initialization        
         this.root        = new node(parent.pos, undefined)  ; // root node has no move
         this.root.Cost   = 0 ;
         this.root.isRoot = true ;
         this.root.robot = parent ;
         this.root.moves = parent.getMoves(parent.pos, this.root.Cost) ;

         this.simActionSeq = [] ; // ActionSeq from the latest simulation 

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
   
        if ( isEmpty(this.simNode) ) { return }

        let posSeq = [] ;  // holds positions of rollout branch after simNode
        let pos = new point(this.simNode.pos.x, this.simNode.pos.y) ; // Starting from simNode positon

        let cost = this.simNode.Cost ; 
        let moves = this.robot.getMoves(pos, cost);
  
        while ( (cost < this.robot.budget) &&
                  moves.length > 0  )  { // Keep moving until budget exhausted or run out
                                       // of moves             
            var rnum = Math.floor (Math.random() * moves.length) ; // random selection
            var move  = Array.from (moves)[rnum]; 
             
            cost = cost + this.robot.getCost(move);     
                 
            pos.x = pos.x + move[0] ;
            pos.y = pos.y + move[1] ;
            posSeq.push(pos.clone()) ;        // append to posSeq

            // Update possible moves from new pos
            moves = this.robot.getMoves(pos, cost);
                                        
        } // end playout
   
        this.simActionSeq = this.getActionSeq (posSeq) ; // to be used by propagate call
        
        // Update pdf table entry if this simActionSeq is better than existing ones
        // We could use DiffTeamReward too ... we will do it when we move to it
      
        let breakPoint = this.robot.pdf.update (this.simActionSeq, this.robot.CondExpTeamReward (this.simActionSeq)) ;
        
        this.Nsim = this.Nsim + 1   ;  // simulation count 
       
    } // end simulation


     propagate () {  // Back propagate result of simulaiton
       
       if ( isEmpty(this.simNode) ) return ;

       var anode = this.simNode ;
       
       // We could use DiffTeamReward too ... we will do it when we move to it
       let addGain = this.robot.CondExpTeamReward(this.simActionSeq); // Propagating team reward
       
        do  {  // Move up the chain and update
           anode.trials = anode.trials + 1 ; // bump each nodes trial count
           
           // propagate Reward (based on collective actions)
           anode.gGain = anode.gGain  + addGain ;
              
           anode = anode.parent ; // move up the chain                   

       } while (!(anode.isRoot)) ;

     } // end propagate



    getActionSeq (simSeq) { // Generate full action sequence from root to end
                                //  after a simulation/rollout
      // Traverse up the tree
        let anode = this.simNode ;
        let seq = [] ;
        do {
            seq.push (anode.pos) ;
            anode = anode.parent ;
        } while(!(anode.isRoot))
              
        return ( (seq.reverse()).concat(simSeq) ) ;
    }


   info () {  // A bit more information of the state of the tree

     console.log("Nodes Discovered: ", this.NodeSet.length);
     for (let i=0 ; i<this.NodeSet.length ; i++) {
           let e = this.NodeSet[i] ;
           console.log(i, "  Depth = ", e.depth, "Index = ", e.index);
     };
     
   } // end info

} // end tree
