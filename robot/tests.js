function Test () {

// randomwalk();
   newTest() ;
}

 function randomwalk () { // random walk Test with obstructions
// Test status: passed

            var arena = new board();
            arena.show();
            var zzz = 0.1 ;
            var rob = new robot("Cat",new point(0,0), arena, null);

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


function newTest(){
     
           console.log("=====================");

           var ateam = new team ();
           let Cat = ateam.robots[0] ;
           let Dog = ateam.robots[1] ;
           let alpha = 0.1;  let beta = 100 ;
         
           for (k=0 ; k<400 ; k++ ){
                 for(let i=0 ; i<5 ; i++) Cat.mtsCycle();             
                 Cat.updateQ(alpha, beta);
                 Cat.sendPDF();
                 for(let i=0 ; i<5 ; i++) Dog.mtsCycle(); 
                 Dog.updateQ(alpha, beta);
                 Dog.sendPDF();
           }
            

           ateam.arena.update();
           ateam.arena.myplot.series.push({});
           ateam.arena.myplot.series.push({});
            var ip = ateam.arena.myplot.series.length ;
           
             var idx = 0 ;
                 var tmr = setInterval(function () {
                     if (idx > 4) return ;
                     let vec = getMoves(Cat, idx)
                     ateam.arena.myplot.series[ip-2]=({label: "Cat walk" + idx, data: vec});
                     vec = getMoves(Dog, idx);
                     ateam.arena.myplot.series[ip-1]= ({label: "Dog walk" + idx, data: vec});
                     ateam.arena.update();
                     idx = idx + 1;  console.log(idx);
                     if (idx > 4) clearInterval(tmr) ;}, 2000) ;
    
            console.log(Cat.tree);
            console.log(Dog.tree);
            //console.log(Dog.tree.info());
           // console.log(Cat.tree.info());
           console.log(Dog.pdf, Cat.pdf);
           console.log(Dog.ExpTeamReward(), Cat.ExpTeamReward());
         console.log("==========END===========");
 } // End Test


 function getMoves(robot, idx) {

       let vec = [robot.pos.x, robot.pos.y] ; // Start Point
       console.log (robot);
       let seq = robot.pdf.seq[idx] ;
        for (let i=0 ; i < seq.length ; i++) {
                vec.push ([seq[i].x, seq[i].y]) ;
       }  // end plot sequence
      return (vec);                    
     
 } // end getMoves


