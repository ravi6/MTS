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
                  moves.size > 0  )  { // Keep moving until budget exhausted or run out
                                       // of moves             
            var rnum = Math.floor (Math.random() * moves.size) ; // random selection
            var move  = Array.from (moves)[rnum]; 
            
            cost = cost + this.robot.getCost(move);          
            pos.x = pos.x + move[0] ;
            pos.y = pos.y + move[1] ;
            posSeq.push(pos) ;        // append to posSeq

            // Update possible moves from new pos
            moves = this.robot.getMoves(pos, cost);
                            
        } // end playout
   
        this.simActionSeq = getActionSeq (posSeq) ; // to be used by propagate call
        
        // Stores as many sequences as we need in pdf ... 
        this.pdf.seq[(this.Nsim + 1)%pdf.size] = this.simActionSeq ;

        this.Nsim = this.Nsim + 1   ;  // simulation count 


    } // end simulation


     propagate () {  // Back propagate result of simulaiton
       
       if ( isEmpty(this.simNode) ) return ;

       var anode = this.simNode ;

        do  {  // Move up the chain and update
           anode.trials = anode.trials + 1 ; // bump each nodes trial count
           
           // propagate Reward (based on collective actions)
           anode.gGain = anode.gGain 
                      + CondExpTeamReward(this.simActionSeq); // should I use TeamReward instead
           anode = anode.parent ; // move up the chain                   

       } while (!(anode.isRoot)) ;

     } // end propagate



    getActionSeq (simSeq) { // Generate full action sequence from root to end
                                //  after a simulation/rollout
      // Traverse up the tree
        let anode = this.simNode ;
        let seq = [] ;
        do {
            seq.push (anode.move) ;
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

// We can make the following functions as complex as we wish
    // for now we keep it very simple

   TeamReward (seq) {
        // This is unweighted Rollout reward, given a robot and rollout seq.
        //  I am not sure if we have to use this or the next function which 
       //   uses Conditional expected values for  backpropagation
       //   My intution tells me that we need to use the later.
         let reward = 0 ;
         for (let i=0; i < this.robots.length ; i++) {
              let rb = this.robots[i] ;
              if (rb.id != this.robot.id){
                   let js = rb.pdf.choose();
                   if (js.seq != "none") {
                          let sum = 0 ;
                          for (let j=0 ; j< js.seq.length ; j++) {
                              sum = sum + getReward( js.seq[j] ) ;
                          }
                          reward = reward + sum ; // note no probability multiplier
                   }
              } else { // calling robot case
                          let sum = 0 ;
                          for (let j=0 ; j< q.length ; j++) {
                              sum = sum + getReward(seq) ;
                          }
                          reward = reward + sum ; 
                      }
         } // end loop over all robots 

        return (reward) ; 

   }


    CondExpTeamReward (seq) {
           // Calculates global Reward based on all other Robots action sets
          //  given  action seq of this robot
         //     Sum (G(X|x_k)*p(i!=k)   i=1..N
         let reward = 0 ;
         let robots = this.robot.team.robots ;
         for (let i=0; i < robots.length ; i++) {
              let rb = robots[i] ;
              if (rb.id != this.robot.id){
                   let js = rb.pdf.choose();
                   if (js.seq != "none") {
                          let sum = 0 ;
                          for (let j=0 ; j< js.seq.length ; j++) {
                              sum = sum + getReward( js.seq[j] ) ;
                          }
                          reward = reward + sum * js.q ;
                   }
              } else { // calling robot case
                          let sum = 0 ;
                          for (let j=0 ; j< q.length ; j++) {
                              sum = sum + getReward(seq) ;
                          }
                          reward = reward + sum ;  
                      }
         } // end loop over all robots 

        return (reward) ; 
    } // end team reward


    ExpTeamReward () {
           // Calculates Expected global Reward based on all Robots action sets
          //     Sum (G(X)*q(i))   i=1..N
         let reward = 0 ;
         let robots = this.robot.team.robots ;
         for (let i=0; i < robots.length ; i++) {
              let rb = robots[i] ;
                   let js = rb.pdf.choose();
                   if (js.seq != "none") {
                          let sum = 0 ;
                          for (let j=0 ; j< js.seq.length ; j++) {
                              sum = sum + getReward( js.seq[j] ) ;
                          }
                          reward = reward + sum * js.q ;
                          } }
         } // end loop over all robots 

        return (reward) ; 
    } // end team reward



    getReward (pos) {// Calculate reward moving to pos for any robot
    
        let reward = false ; 
        let tps = this.robot.team.tps ;
        for (let i=0; i<tps.length; i++ ) {
            if (pos.x == tps[i][0] && pos.y == tps[i][1]) {
                reward = true ;
                break ;
            }
        } 

        if (reward) {return (100);}
        else {return(0);}       
    } // end getReward


   updateQ () {

      for (let i=0 ; i < this.pdf


   }

} // end tree
