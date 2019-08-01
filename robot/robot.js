class robot {
// This the robot
    constructor (id, pos, arena, team) {
        this.id       = id       ;
        this.pos      = pos      ; 
        this.budget   = 40       ; // This could be made different for each robot 
        this.arena    = arena    ; // where Robot can move
        this.tree     = new tree (this) ; // Its MTCS tree
        this.pdf      = new pdf(10)   ; // Probability dist func. of this robot (size 5)
        this.team     = team         ; // The team this robot belongs to
        this.sentpdf  = new pdf(10) ;   // Holds pdf last transmitted
    } // end constructor

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
            let hitsWall = false ;
            
            // Test if the move lands outside arena
            let offBoard =  ( (npt.x < 0 || npt.x > this.arena.xmax) ||
                              (npt.y < 0 || npt.y > this.arena.ymax) ) ;

            if (!offBoard) {
               hitsWall = false ; // starting assumption for each move
               for (let k=0 ; k < this.arena.walls.length ; k++) {
                   let wall = this.arena.walls[k] ;
                   let ipt = intsect(lm, wall); // get intersection pt
                   
                   if ( !(ipt == undefined) || onLine (npt, wall)) {
                       hitsWall = true ;
                    //   console.log("Hit wall ", k, "at", ipt,
                    //               "while moving from", pt, "to", npt);
                       break ;  // No need to check remaining walls
                   }
                } // wall loop
            } // offBoard

              let overBudget = (cost + this.getCost(move)) > this.budget;

              if (!(hitsWall || offBoard || overBudget) ) moves.push(move) ;
        }; // all Moves

        return (moves) ;
    } // end getpMoves


    getCost (move) { // Calculate cost of a move}
        return (1) ; // We only travel 1 unit distance here
    } // end getCost

 

// We can make the following functions as complex as we wish
    // for now we keep it very simple

   TeamReward (seq) {
        // This is unweighted Rollout reward, given a robot and rollout seq.
         let reward = 0 ;
         let robots = this.team.robots ;
         for (let i=0; i < robots.length ; i++) {
              let rb = robots[i] ;
              if (rb.id != this.id){
                   let js = rb.pdf.choose();               
                   reward = reward + this.getReward(rb, js.seq ) ; // note no probability multiplier
                   }
          } // end all other robots
              
          // Add this robots contribution                
          reward = reward + this.getReward(this, seq) ; 
          return (reward) ; 
   } // end TeamReward

   DiffTeamReward (seq) { // Total Reward differential with my Action - my InAction
       // In our case it is just depends only on my action (Very simplistic Team Reward as above)
       return (getReward(this, seq)) ;
   }


    CondExpTeamReward (seq) {
           // Calculates global Reward based on all other Robots action sets
          //  given  action seq of this robot
         //     Sum (G(X|x_k)*p(i!=k)   i=1..N
         let reward = 0 ;
         let robots = this.team.robots ;

         for (let i=0; i < robots.length ; i++) { // consider other robots ony
              let rb = robots[i] ;
              if (rb.id != this.id){
                   let js = rb.sentpdf.choose();                    
                   reward = reward + this.getReward(rb, js.seq) * js.q ;
               }
          } // end all other robots

          //  add this robots seq reward                    
                reward = reward + this.getReward(this, seq) ; 
                  
          return (reward) ; 
          
    } // end CondExpTeamReward


    ExpTeamReward () {
           // Calculates Expected global Reward based on all Robots action sets
          //     Sum (G(X)*q(i))   i=1..N
          
         let reward = 0 ;
         let robots = this.team.robots ;
         for (let i=0; i < robots.length ; i++) {
              let rb = robots[i] ;
              let js = rb.sentpdf.choose();
                     if (js != undefined)
                        reward = reward + this.getReward(rb, js.seq) * js.q ;
                        else console.log("js undefined in ExpTeamReward");
              }
        return (reward) ; 
    } // end ExpTeamReward



    getReward (rb, seq) {// Calculate reward from a robots sequence of actions
        
        if (seq == undefined || seq.length == 0) return (0);

       let sum = 0 ;
       for (let i=0 ; i < seq.length ; i++) {      
            sum = sum + this.team.tres.collect(seq[i]) ;
       }

       // Restore the state of the treasure to original
       //  so that subsequent calcs with other seq. are done correctly
       this.team.tres.restore();
        // console.log("Reward Value of a Seq =" , rb.id, sum);
       return (sum) ;
    } // end getReward


   updateQ (alpha, beta) {
      let ExpF, CondExpF, qold, qnew ;

      for (let i=0 ; i < this.pdf.table.length ; i++) {
          ExpF = this.ExpTeamReward () ;
          CondExpF = this.CondExpTeamReward (this.pdf.table[i].seq) ;
          qold = this.pdf.table[i].q ;

          // Here (1/beta  corresponds to  -T in my Lagrangian in write_up)
          // Consequently positive beta values give maxima
          
          qnew = qold - alpha * qold * ( ( ExpF - CondExpF ) / beta
                                             + this.Entropy() + Math.log (qold) ) ;
          if (qnew < 0) qnew = qold ; // Don't let the newton step move to infeasible region
                                      // One can not have negative probability
          
          this.pdf.table[i].q = qnew ;
          this.NormalizeQ (i, qnew) ; 
          console.log("updatedPDF", this.pdf.table);
      }
   } // end updateQ


  Entropy () {  // Calculate Entropy of q_i disribution for this robot
      let s = 0 ;
      for (let i=0 ; i < this.pdf.table.length ; i++) {
            let q = this.pdf.table[i].q ;
            if (q > 0)
              s = s + q * Math.log (q) ;
            else
              console.log ("Negative q", i, q) ;
      }
      return (s) ;
  }

  NormalizeQ (i, qval) { // Ensure that sum of all q_i in distribution is one
      let sum = 0 ;
      
      for (let i=0 ; i < this.pdf.table.length ; i++) {
          sum = sum +  this.pdf.table[i].q  ; 
      }

      for (let i=0 ; i < this.pdf.table.length ; i++) {
          this.pdf.table[i].q =  this.pdf.table[i].q  / sum  ; 
      }

  } // End Noramalize q distribution

  sendPDF () {
         this.sentpdf = this.pdf.clone() ; // Assuming perfect reception by others
  }
} // end robot
