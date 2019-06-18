class team
{
    constructor () {
            this.arena = new board();
            //arena.show();
            this.robots = [] ;
            this.robots.push(new robot("Cat",new point(0,0), arena, team));
            this.robots.push(new robot("Dog",new point(1,0), arena, team));

            this.tps = [ [2,1], [4,1], [5,3], [9,4], [3,4],
                   [2,6], [7,6], [4,8], [6,8], [8,9]] ; // Treasure points
    }


// We can make the following functions as complex as we wish
    // for now we keep it very simple

   getTeamReward (robID, seq) {
        // This is unweighted Rollout reward, given a robot and rollout seq.
        //  I am not sure if we have to use this or the next function which is
       //   uses Conditional expected values for  backpropagation
       //   My intution tells me that we need to use the later.
         let reward = 0 ;
         for (let i=0; i < this.robots.length ; i++) {
              let rb = this.robots[i] ;
              if (robID != this.id){
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


    CondExpTeamReward (robID, seq) {
           // Calculates global Reward based on all other Robots action sets
          //  given  action seq of this robot
         //     Sum (G(X|x_k)*p(i!=k)   i=1..N
         let reward = 0 ;
         for (let i=0; i < this.robots.length ; i++) {
              let rb = this.robots[i] ;
              if (robID != this.id){
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
         for (let i=0; i < this.robots.length ; i++) {
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
        for (let i=0; i<tps.length; i++ ) {
            if (pos.x == tps[i][0] && pos.y == tps[i][1]) {
                reward = true ;
                break ;
            }
        } 

        if (reward) {return (100);}
        else {return(0);}       
    } // end getReward

} // end of team

