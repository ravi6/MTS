var statsTimer ;
var plotTimer ; // not used
var data 

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

;
function newTest(){
     
           console.log("=====================");

           var ateam = new team ();
           var  count = 0 ;
         // We have two series in the plot one for Dog and
           // other for Cat ... initializing
           ateam.arena.myplot.series.push({});
           ateam.arena.myplot.series.push({});
           
            data = {team: ateam, count: count};
           statsTimer = setInterval(doMCTS(data), 2000);         
} // end New Test


function plotPaths (idx) {      
       let vec = getMoves(Cat, idx)
       var ip = ateam.arena.myplot.series.length ;
       ateam.arena.myplot.series[ip-2]=({label: "Cat walk" + idx, data: vec});
       vec = getMoves(Dog, idx);
       ateam.arena.myplot.series[ip-1]= ({label: "Dog walk" + idx, data: vec});
       ateam.arena.update();
} 


function doMCTS (data) {  // Do 10 iterations and yield for 2 sec
           let maxCount = 800 ;
           console.log("count", data.count);
           if ( data.count > maxCount ) {
                   statsTimer.clearInterval();
                   return;
           }

           // Plot robot paths with some time delay for each sequence
           if (data.count == maxCount) {
                 for (let idx=0 ; idx < Cat.pdf.size ; idx++) {
                       setTimeout(plotPaths(idx),2000);
                 }
                 return ;
           }


           let alpha = 0.1 ;                          
           let betamax = 1 ;
           let betamin = 0.001 ;

           let delBeta = betamax - betamin ;
           let Cat = data.team.robots[0];
           let Dog = data.team.robots[1];

             for (let k = 0 ;  k< 1 ; k++) {
                 data.count = data.count + 1 ;
                 console.log(data.count) ;
                 document.getElementById("counter").innerHTML = data.count;
                 let beta = betamax - data.count * delBeta; // progressively reduce beta
                 for(let i=0 ; i<10 ; i++) Cat.mtsCycle();             
                 Cat.updateQ(alpha, beta);
                 Cat.sendPDF();
                 for(let i=0 ; i<10 ; i++) Dog.mtsCycle(); 
                 Dog.updateQ(alpha, beta);
                 Dog.sendPDF();
                 reportRevisits(data.team.robots);                 
             } // end loop

} //end doMCTS


      function getMoves(robot, idx) {
             let vec = [] ;
             vec.push([robot.pos.x, robot.pos.y]) ; // Start Point
             let seq = robot.pdf.seq[idx] ;
              for (let i=0 ; i < seq.length ; i++) {
                      vec.push ([seq[i].x, seq[i].y]) ;
             }  // end plot sequence
            return (vec);                    

       } // end getMoves



      function remAllDuplicates (seq) { // Removes all duplicates

           var nseq = cloneSeq (seq) ;
           var uniq = [] ;

            let n = seq.length ;
            for(let i=0 ; i<n ; i++) {  //               
                  uniq = remDuplicates (nseq[0], nseq);              
                  nseq = uniq ;              
                 // console.log(uniq.length, uniq)     
             } ;                                  
    
            return (uniq);
      } // end remAllDuplicate

      function remDuplicates (pt, seq) { // Removes duplicates of a given point
                                        // Does not alter seq
            vec = [] ; 
            seq.forEach(function (elm) {
                  if (elm.x != pt.x || elm.y != pt.y) vec.push (elm.clone());
            });
            vec.push(pt.clone());
            return (vec) ;
      } // remDuplicates

      function cloneSeq (seq) { // Clone a sequence
            let vec = [] ;
            for (let i=0 ; i < seq.length ; i++) {
                  vec.push(seq[i].clone());
            }
            return (vec);
      }

      function reportRevisits(robs){
       // Report revist counts for all robots and sequences in their pdf  
        let obj = [] ;  
            for (k=0 ; k < robs.length ; k++){
                  let prevs = [] ;    //percent of revisits
                  let rob = robs[k]; let counts = [] ;

                  for (let i=0; i < rob.pdf.size ; i++) {
                     
                     let uniqCount = remAllDuplicates (rob.pdf.seq[i]).length;
                     let Count = rob.pdf.seq[i].length ;
                     let revCountP = Math.round(100*(Count - uniqCount)/Count)
                     prevs.push(revCountP);
                     counts.push(Count); 

                     let tabid = rob.id + "Table" ;
                     let tab = document.getElementById(tabid);
                     //console.log($(tabid));
                     tab.rows[i+1].cells[1].innerHTML = (Count) ;
                     tab.rows[i+1].cells[2].innerHTML = revCountP ;
                     tab.rows[i+1].cells[3].innerHTML = rob.ExpTeamReward().toPrecision(2); 
                     tab.rows[i+1].cells[4].innerHTML = rob.pdf.q[i].toPrecision(3); 
                                      
                  }

                //  obj.push ({Id: robs[k].id ,  counts: counts, prevs: prevs , 
                //             ExpTeamReward: robs[k].ExpTeamReward(), q: robs[k].pdf.q});




            }
               //console.log ("Revists", obj);   
               // let msg = JSON.stringify (obj[0]) ;
               // console.log(msg);
              // $("#Results").html(msg);
      }



