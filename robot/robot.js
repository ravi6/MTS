class robot {
// This the robot
    constructor (id, pos) {
        this.id       = id       ;
        this.pos      = pos      ; 
        this.budget   = 40   ; // This could be made different for each robot 
        this.arena    = new board()    ; // where Robot can move (own copy)
        this.tres     = new treasure ; // its own notion of treasure state

        this.tree     = new tree (this) ; // Its MTCS tree
        this.pdf      = new pdf(10)   ; // Probability dist func. of this robot (size 10)
        this.sentpdf  = new pdf(10) ;   // Holds pdf last transmitted
        this.robots   = new Map()          ;   // Holds all (but self) robots in team
                                               // These are not true robot objects, but stripped objects devoid of methods
                                               // Good enough for what we want to do with other robots
                                               // Will have to duplicate selection method of pdf to evaluate expected values
    } // end constructor

    mtsCycle() { // MonteCarlo Tree SEP 
         this.tree.select() ; 
         this.tree.expand() ;       
         this.tree.simulate() ;   
         this.tree.propagate() ;   
    } // end mtsCycle // Message handler for all robot workers

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
                   } // Message handler for all robot workers
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

   DiffTeamReward (seq) { // Total Reward differential with my Action - my InAction
       // In our case it is just depends only on my action (Very simplistic Team Reward as above)
       return (getReward(seq)) ;
   }


    CondExpTeamReward (seq) {
           // Calculates global Reward based on all other Robots action sets
          //  given  action seq of this robot
         //     Sum (G(X|x_k)*p(i!=k)   i=1..N
        //     The above is implicitly realised when samples are generated from pdf table
         
         let reward = 0 ;
                                                          
         this.robots.forEach (function (rb, key, map) { // consider other robots ony
                            let js = this.samplePDF (rb.pdf);           // note rb.pdf here is stripped object table          
                            reward = reward + js.reward ; });
  
          //  add this robots seq reward                    
         reward = reward + this.getReward(seq) ; 
                  
          return (reward) ;          
    } // end CondExpTeamReward


    ExpTeamReward () {
           // Calculates Expected global Reward based on all Robots action sets
          //     Sum (G( X)*q(i))   i=1..N
        //     The above is implicitly realised when samples are generated from pdf table
          
         let reward = 0 ;

          this.robots.forEach (function (rb, key, map) { // all but me
                  let js = this.sapmplePDF (rb.pdf);           // note rb.pdf here is stripped object table
                   if (js != undefined)
                      reward = reward + js.reward ; 
                   else 
                      console.log("js undefined in ExpTeamReward"); 
          });

          //  Add myown reward
                   js = this.sentpdf.sample();
                   if (js != undefined)
                      reward = reward + js.reward; 
                   else 
                      console.log("js undefined in ExpTeamReward"); 

        return (reward) ; 
    } // end ExpTeamReward

         
    getReward (seq) {// Calculate reward
        if (seq == undefined || seq.length == 0) return (0);

       let sum = 0 ;
       for (let i=0 ; i < seq.length ; i++) {      
            sum = sum + this.tres.collect(seq[i]) ;
       }

       // Restore the state of the treasure to original
       //  so that subsequent calcs with other seq. are done correctly
       this.tres.restore();
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

          // Don't let the newton step move to infeasible region
          // One can not have negative probability
          // Approximate q zero to small value to avoid log(0)
         
          if (qnew <= 0) 
              qnew = 1e-10 ; 
          else if (qnew > 1) 
              qnew = 1.0 ;
                                               
          this.pdf.table[i].q = qnew ;
          this.NormalizeQ (i, qnew) ; 
      }
   } // end updateQ


  Entropy () {  // Calculate Entropy of q_i disribution for this robot
      let s = 0 ;
      for (let i=0 ; i < this.pdf.table.length ; i++) {
            let q = this.pdf.table[i].q ;
            if (q > 0)
              s = s + q * Math.log (q) ;
            else       
              console.log ("q<=0", i, q) ;
      }
      return (-s) ;
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


  samplePDF(table){  // Sample from known distribution data

       // Generate cumulative q table
       let cumQ = [] ;           
       cumQ.push(table[0].q);

       for (let i=1 ; i < table.size ; i++) {
	        cumQ.push(cumQ[cumQ.length-1] + table[i].q);
       }
	  
       let rnum = Math.random() ; // get a random val 0 to 1

       // Choose seq corresponding to CumValue just below it
       let k = 0;
       while (rnum > cumQ[k] && k < table.size-1) {
	   k = k + 1 ;
       }
					       
       return ({seq: table[k].seq, q: table[k].q, reward: table[k].reward}) ; // this way we send by values 

    } // end sample
} // end robot
