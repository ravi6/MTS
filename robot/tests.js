var statsTimer ;
var plotTimer ; // not used

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


        
       var ateam = new team ();
           var  count = 0 ;
         // We have two series in the plot one for Dog and
           // other for Cat ... initializing
           ateam.arena.myplot.series.push({});
           ateam.arena.myplot.series.push({});

           var plots = {Cat: new pdfPlot("#pdfCat"), 
                        Dog: new pdfPlot("#pdfDog")} ;

           var data = {team: ateam, count: count, pdfPlot: plots, betaTrend: [], beta: 0};
           
           statsTimer = setInterval(function(){doMCTS(data);}, 100);               
                                                           
} // end New Test


function plotPaths (data) {  

        let Cat = data.team.robots[0];
        let Dog = data.team.robots[1];
        let myplot = data.team.arena.myplot ;
        let idx = data.count ;

       if (data.count > Cat.pdf.size-1) {  // No more to plot
           clearInterval(plotTimer);
           return; 
       }

       let vec = getMoves(Cat, idx)
       var ip = myplot.series.length ;
       myplot.series[ip-2]=({label: "Cat walk" + idx, data: vec});
       vec = getMoves(Dog, idx);
       myplot.series[ip-1]= ({label: "Dog walk" + idx, data: vec});
       data.team.arena.update();

       data.count = data.count + 1 ; // ready for next path plotting

} // end plotPaths


function doMCTS (data) {  // Do 10 iterations and yield for 2 sec

           var  params = { maxCount: 2000,   // total number of global iterations 
                           alpha   : 0.1,    // Newton update relaxation                      
                           beta    : {max: 1, min: 0.001, anneal: 3 }
                         } ;      
                                    // beta.anneal controls how beta goes down
                                    //  large values slows down the change
 

           let robots = data.team.robots ;
           let Cat = robots[0];
           let Dog = robots[1];
         

             for (let k = 0 ;  k <2 ; k++) {

                 data.count = data.count + 1 ;
                 document.getElementById("counter").innerHTML 
                            = "Iterations: " + data.count;

                  // Good for when min is a tiny fraction of max 
                  let beta = params.beta.min + (params.beta.max - params.beta.min)
                                 * sCurve(params.beta.anneal, data.count / (params.maxCount-1)); 
                  data.beta = beta ;  // used for adding series legend info

                   // We use these two show how beta varies over iterations
                   data.betaTrend.push ([data.count, beta]);
              
                 
                 for(let i=0 ; i<10 ; i++) Cat.mtsCycle();             
                 Cat.updateQ(params.alpha, beta);
                 Cat.sendPDF();
                 for(let i=0 ; i<10 ; i++) Dog.mtsCycle(); 
                 Dog.updateQ(params.alpha, beta);
                 Dog.sendPDF();

                 reportRevisits(robots);
                
                // Start plotting paths once all iterations are over
                if ( data.count > params.maxCount-1 ) { // Done with computations
                   clearInterval(statsTimer);
                   console.log("Finished", data.count);
                   betaPlot(data.betaTrend) ;
                   // We plot paths for the last iteration 
                   data.count = 0 ; // reuse this to track paths now
                   plotTimer = setInterval(function (){plotPaths(data);},100);
                   return;
                }
                

                 if (((data.count+1)% (params.maxCount/10)) == 0) {
                       let label = "iter: " + (data.count + 1) + " beta: " + data.beta.toPrecision(1) ;
                       data.pdfPlot.Cat.addSeries(Cat.pdf.q, label); 
                       data.pdfPlot.Cat.update();
                       data.pdfPlot.Dog.addSeries(Dog.pdf.q, label);
                       data.pdfPlot.Dog.update(); 
                 }
                          
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
      } // end cloneSeq

      function reportRevisits(robs){
       // Report revist counts for all robots and sequences in their pdf 
       // and updates PDF  Tables
        
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
                     tab.rows[i+1].cells[3].innerHTML = rob.getReward(rob, rob.pdf.seq[i]);
                     tab.rows[i+1].cells[4].innerHTML = rob.pdf.q[i].toPrecision(2);                                     
                  }

                //  obj.push ({Id: robs[k].id ,  counts: counts, prevs: prevs , 
                //             ExpTeamReward: robs[k].ExpTeamReward(), q: robs[k].pdf.q});
            }
               //console.log ("Revists", obj);   
               // let msg = JSON.stringify (obj[0]) ;
               // console.log(msg);
              // $("#Results").html(msg);
      } // end reportRevisits




class pdfPlot {
  
        constructor (id) {

                  this.id =  id;
                  this.series =  [] ;
                  this.options = {  // flot plot default options
                                  series: { lines: { show: true },
                                           points: { show: false } }, 
                                  xaxes: { position: 'bottom', axisLabel: 'Sequence Number', showTickLabels: 'none' },
                                  yaxes: { position: 'left', axisLabel: 'q', showTickLabels: 'none' },    
                                 } ;
                // this.options.axisLabels.show = true ;
              
        } // end constuctor


       addSeries (vec, label) {
            var pdata = [] ;
            for (let k=0 ; k < vec.length ; k++) {
                  pdata.push([k, vec[k]]) ;
            }
            this.series.push ({ data:  pdata, label: label, 
                                lines: {lineWidth: 7, 
                                      fillColor: "rgb(255, 0, 255, 0.4)" }                              
                            });
      } // end addSeries

      update () {
	       $.plot(this.id, this.series, this.options);

     }

      addInfo(px, py, str) {
          // If you wish to use multiline string use <br> to break
          // lines in str
          // position is absolute pixels ... may have to use trial and error
          // since we don't use plot coordinates
           $(this.id).append("<div style='position:absolute;left:" 
                              + px + "px;top:" + py + 
                              "px;color:#666;font-size:smaller'>" +
                              + str + "</div>");  
      }

                                           
} // end pdfPlot


function betaPlot(betaTrend) {
   
      let options = {  // flot plot default options
                       series: { lines: { show: true },
                       points: { show: false } }, 
                        xaxes: { position: 'bottom', axisLabel: 'Sequence Number', showTickLabels: 'none' },
                                  yaxes: { position: 'left', axisLabel: 'beta', showTickLabels: 'none' },    
                                 } ;

       $.plot("#betaPlot", [{ data: betaTrend,
                              lines: {lineWidth: 7, 
                                      fillColor: "rgb(255, 0, 255, 0.4)" }
                             }], options);                                                                
} // end betaPlot

