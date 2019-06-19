class robot {
// This the robot
    constructor (id, pos, arena, team) {
        this.id       = id       ;
        this.pos      = pos      ; 
        this.budget   = 40       ; // This could be made different for each robot 
        this.arena    = arena    ; // where Robot can move
        this.tree     = new tree (this) ; // Its MTCS tree
        this.pdf      = new pdf(5)   ; // Probability dist func. of this robot (size 5)
        this.team     = team            ; // The team this robot belongs to
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
        //  I am not sure if we have to use this or the next function which 
       //   uses Conditional expected values for  backpropagation
       //   My intution tells me that we need to use the later.
         let reward = 0 ;
         let robots = this.team.robots ;
         for (let i=0; i < robots.length ; i++) {
              let rb = this.robots[i] ;
              if (rb.id != this.id){
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
         let robots = this.team.robots ;
         for (let i=0; i < robots.length ; i++) {
              let rb = robots[i] ;
              if (rb.id != this.id){
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
                          for (let j=0 ; j< seq.length ; j++) {
                              sum = sum + this.getReward(seq) ;
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
         let robots = this.team.robots ;
         for (let i=0; i < robots.length ; i++) {
              let rb = robots[i] ;
                   let js = rb.pdf.choose();
                   if (js.seq != "none") {
                          let sum = 0 ;
                          for (let j=0 ; j< js.seq.length ; j++) {
                              sum = sum + getReward( js.seq[j] ) ;
                          }
                          reward = reward + sum * js.q ;
                          } } // end loop over all robots 
        return (reward) ; 
    } // end team reward



    getReward (pos) {// Calculate reward moving to pos for any robot
    
        let reward = false ; 
        let tps = this.team.tps ;
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

      for (let i=0 ; i < this.pdf.size ; i++) {
          ExpF = ExpTeamReward () ;
          if (this.pdf.seq[i] != "none")
             CondExpF = CondExpTeamReward (this.pdf.seq[i]) ;
          else
            CondExpF = 0 ;
        
          let qold = this.pdf.q[i] ;

          let qnew = qold - alpha * qold * ( ( ExpF - CondExpF ) / beta
                                             + Entropy() + log (qold) ) ;
          this.pdf.q[i] = qnew ;
          NormalizeQ (i, qnew) ; 

      }
   } // end update Q


  Entropy () {  // Calculate Entropy of q_i disribution for this robot
      let s = 0 ;
      for (let i=0 ; i < this.pdf.size ; i++) {
            let q = this.pdf.q[i] ;
            if (q > 0)
              s = s + this.pdf.q[i] * log (this.pdf.q[i]) ;
            else
              console.log ("Negative q", i, q[i]) ;
      }
      retunr (s) ;
  }

  NormalizeQ (i, qval) { // Ensure that sum of all q_i in distribution is one
      let sum = 0 ;
      
      for (let i=0 ; i < this.pdf.size ; i++) {
          sum = sum + this.pdf.q[i] ; 
      }

      for (let i=0 ; i < this.pdf.size ; i++) {
          this.pdf.q[i] = this.pdf.q[i] / sum  ; 
      }

  } // End Noramalize q distribution


} // end robot
