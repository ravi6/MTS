class tree {    // The Game Tree (MonteCarlo Tree Search)

    constructor () {
        
         this.root = new node() ;
         this.root.isRoot = true ;

         this.selNode   = undefined; // Node selected at the end of selection
         this.simNode   = undefined; // New node from which simulation occurs
         this.simResult = undefined; // Result of the latest simulation
         this.simPlayer = undefined; // Player with last move 
         
         this.Nsim = 0;     // Total number of simulations
         this.NodeCount = 0 ;  // We dont count rootNode
    } // end constructor


    select () {  // Select best path in the node tree and return 
                 //  the node with unexplored moves
           
       var anode = this.root ;
       var count = 0;
       
       while (anode.isExpanded () && !anode.isTerminal()) { // It has all of the potential children
           count = count + 1 ;
           
                //travel down the tree until you hit a node with unexplored moves 
                // Selecting the best node based on win ratio as you go
          let wratio = [] ; 
          anode.children.forEach ( function (e) {
                                       wratio.push (e.wins / e.trials) ;
                                    });
          let i = wratio.indexOf (Math.max(...wratio)) ;
          console.log("Best Child = ", i, wratio[i]);
          anode = anode.children[i] ;  // Latch on to the best and repeat
       }
          this.selNode = anode ;
          console.log("Selection Count: ", count);

    } // end selenew childction

    simulate () {  // We play from the given node randomly until result

        if (this.selNode.isTerminal()) {
            return ;
        } else {
            this.simNode = this.selNode.addNode();
            if ( isEmpty(this.simNode) ) return ;
        }


        var ab = this.simNode.board.clone() ; // A temporary board we can play with 
  
        var count = 0 ;
        while (ab.result == "NONE" && count < 150) { // Keep the play until conclusion     
            var rnum = Math.floor (Math.random() * ab.moves.size) ;
            var move  = Array.from (ab.moves)[rnum]; 
            ab.play (move) ; 

            console.log ("Random Walk " + count );  ab.show();                   
            count = count + 1 ;
        }
        console.log ("Simulation Count = ", count);

        this.Nsim = this.Nsim + 1   ;  // simulation count 
        this.simResult = ab.result ;
        this.simPlayer = ab.player ;
         
    } // end simulation


     propagate () {  // Back propagate result of simulaiton
       
       if ( isEmpty(this.simNode) ) return ;

       var anode = this.simNode ;

       while (!(anode.isRoot)) {  // Move up the chain and update
           anode.trials = anode.trials + 1 ; // bump each nodes trial count

           // update the wins based on end result
           if ((this.simResult == "WIN") && 
               (this.simPlayer == anode.player)) {
                 anode.wins = anode.wins + 1 ;
           } else if (this.simResult == "DRAW") { 
                      anode.wins = anode.wins + 0.5} ;
           console.log ("Propagating:", anode.trials, anode.wins) ;
           anode = anode.parent ; // move up the chain                   
       } 

     } // end propagate

bestPath () {  // Show the best path so far             
           
       var anode = this.root ;
       
       while (!anode.isTerminal()) { 
          let wratio = [] ; 
          anode.children.forEach ( function (e) {
                                       wratio.push (e.wins / e.trials) ;
                                    });
          let i = wratio.indexOf (Math.max(...wratio)) ;
          console.log("Best Child = ", i, "  %Win = ", wratio[i] * 100);
          anode.board.show();
          anode = anode.children[i] ;  // Latch on to the best and repeat
       }
         anode.board.show();
    } // end  bestPath
    
} // end of game tree
