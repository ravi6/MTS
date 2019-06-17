 function randomwalk () { // random walk Test with obstructions
// Test status: passed

            var arena = new board();
            arena.show();
            var zzz = 0.1 ;
            var rob = new robot("Cat",new point(0,0), arena);

       let pos = new point (5,5);
       let vec = [[pos.x, pos.y]] ;
       let moves = rob.getMoves(pos, 0);
       let count = 0;
       while (moves.length > 0 && count < 450) {
           let k = Math.floor(Math.random() * moves.length + 1) - 1; // random choice
           //console.log("Choosing",{len: moves.length, idx: k, mv: moves[k]}, pos);
           let xnew = pos.x + moves[k][0];
           let ynew = pos.y + moves[k][1];
           vec.push ([xnew, ynew]);
           pos = new point (xnew, ynew);
           moves = rob.getMoves(pos, 0);
           count = count + 1 ;            
       }

      arena.myplot.series.push({label: rob.id + " walk", data: vec});
      arena.update();
      //console.log(vec);

} // end randomwalk


var robs = [] ;  // global variable ....

 function robots () { // multiple robots
            var arena = new board();
            arena.show();
            robs.push(new robot("Cat",new point(0,0), arena));
            robs.push(new robot("Dog",new point(1,0), arena));
 }


function globReward (rob) {
// Calculates global Reward based on all Robots action sets
    //     Sum (G(X|x_i)*p(-i)

}

 getReward (pos) {// Calculate reward moving to pos
       let tps = [ [2,1], [4,1], [5,3], [9,4], [3,4],
                   [2,6], [7,6], [4,8], [6,8], [8,9]] ; // Treasure points
    
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

