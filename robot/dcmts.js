class dcmts {
  // dcmts scheme testing object

    constructor () {
            this.team = new team ();
            this.count = 0 ;
            this.params = { alpha: 0.1, 
                             beta: {min: 0.001, max: 1, anneal: 6 },
                             maxCount: 1000 }

            // Timers to breakup compute tasks and animate path display
            this.mctsTimer =  undefined ;
            this.mctsIntvl =  250

            // Prepare for plotting paths taken by robtos
            this.pathPlotIntvl = 1000   ; //1 sec
            this.pathPlot =  new pathPlot(this.team, this.pathPlotIntvl) ;
              
            // prepare pdf plots for each robot
            this.pdfPlots= [] ;
            for (let i=0 ; i < this.team.robots.length ; i++) 
                     this.pdfPlots.push(new pdfPlot("#pdf" + this.team.robots[i].id)) ; 
            this.pdfTraces = 5 ;
    } // end constructor

    simulate () {
            this.mctsTimer = setInterval(this.doMCTS.bind(this), this.mctsIntvl);               
    }


    doMCTS () {  // does one cycle .. timer calls it many times

        let robots = this.team.robots ;

         document.getElementById("counter").innerHTML 
                      = "Iterations: " + this.count;
           
        //  Sequentially process each robot to run mtsCycle, update q, and transmit pdf
        for (let k=0; k < robots.length ; k++) {
           for(let i=0 ; i < robots[k].pdf.size ; i++) 
                     robots[k].mtsCycle();           
           robots[k].updateQ(this.params.alpha, this.getBeta(this.count));
           robots[k].sendPDF();
        }
         
         this.reportRevisits(robots);

          // Start plotting paths once all iterations are over
        if ( this.count > this.params.maxCount-1 ) { // Done with computations
             clearInterval(this.mctsTimer);
             console.log("Finished", this.count);
             this.betaPlot() ;
             // We plot paths for the last iteration 
             this.pathPlot.start();
          }
          
           if (((this.count+1)% (this.params.maxCount/this.pdfTraces)) == 0) {
                 let label = "iter: " + (this.count + 1) + " beta: " 
                            + this.getBeta(this.count).toPrecision(1) ;
                 for (let k=0 ; k < robots.length ; k++) {
                    this.pdfPlots[k].addSeries(robots[k].pdf.q, label); 
                    this.pdfPlots[k].update();
                 }
           }
                    
       this.count = this.count + 1 ; // ready for next time


    } //end doMCTS

    static getMoves(robot, idx) {
        let vec = [] ;
        vec.push([robot.pos.x, robot.pos.y]) ; // Start Point
        let seq = robot.pdf.seq[idx] ;
        for (let i=0 ; i < seq.length ; i++) {
              vec.push ([seq[i].x, seq[i].y]) ;
        }  // end plot sequence
        return (vec);                    
    } // end getMoves

    remAllDuplicates (seq) { // Removes all duplicates

      var nseq = this.cloneSeq (seq) ;
      var uniq = [] ;

      let n = seq.length ;
      for(let i=0 ; i<n ; i++) {  //               
         uniq = this.remDuplicates (nseq[0], nseq);              
         nseq = uniq ;              
      // console.log(uniq.length, uniq)     
      } ;                                  
        
      return (uniq);
    } // end remAllDuplicate

    remDuplicates (pt, seq) { // Removes duplicates of a given point
                                            // Does not alter seq
     let vec = [] ; 
     seq.forEach(function (elm) {
        if (elm.x != pt.x || elm.y != pt.y) vec.push (elm.clone());
     });
     vec.push(pt.clone());
     return (vec) ;
     } // remDuplicates

    cloneSeq (seq) { // Clone a sequence
                let vec = [] ;
                for (let i=0 ; i < seq.length ; i++) {
                      vec.push(seq[i].clone());
                }
                return (vec);
          } // end cloneSeq

    reportRevisits(robs){
           // Report revist counts for all robots and sequences in their pdf 
           // and updates PDF  Tables
            
        for (let k=0 ; k < robs.length ; k++){
          let prevs = [] ;    //percent of revisits
          let rob = robs[k]; let counts = [] ;

          for (let i=0; i < rob.pdf.size ; i++) {
             
             let uniqCount = this.remAllDuplicates (rob.pdf.seq[i]).length;
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
        }} // end of reportRevisits

    betaPlot() {
      // Show how Annealing parameter is varying 
        //
        let options = {  // flot plot default options
              series: { lines: { show: true },
              points: { show: false } }, 
               xaxes: { position: 'bottom', axisLabel: 'Sequence Number', 
                       showTickLabels: 'none' },
               yaxes: { position: 'left', axisLabel: 'beta', 
                       showTickLabels: 'none' },    
            } ;

       let betaTrend = [] ;

       // Beta variation with iteration count
       for (let i=0 ; i < this.params.maxCount ; i ++) 
             betaTrend.push([i, this.getBeta(i)]);

       $.plot("#betaPlot", [{ data: betaTrend,
                             lines: {lineWidth: 7, 
                         fillColor: "rgb(255, 0, 255, 0.4)" }
                          }], options);                                                                
    } // end betaPlot

    getBeta (count) {
      // Map iteration count to beta value
      // We control  annealing this way
      let beta = this.params.beta ;
      let b = beta.min + (beta.max - beta.min)
               * sCurve(beta.anneal, count / (this.params.maxCount-1)); 
      return(b);
     }

} // end of dmts class

class pathPlot {
    // Plotting paths taken by robots in the Arena with walls

  constructor (team, intval) {
        this.timer = undefined ;
        this.intval = intval   ;
        this.count  = 0        ; // path counter
        this.maxCount = team.robots[0].pdf.size ;
        this.team = team ;

        for (let i=0 ; i < team.robots.length ; i++)
             team.arena.myplot.series.push({});
  } // end constructor

  start () {
        this.timer = setInterval(this.plot.bind(this), this.intval) ;
  } // end start

  plot () {


       if (this.count > this.maxCount-1) {  // No more to plot
           clearInterval(this.timer);
           return; 
       }

       // Update paths corresponding to the pdf entry
       for (let i=0 ; i < this.team.robots.length ; i++) {
         let vec = dcmts.getMoves(this.team.robots[i], this.count)
         this.team.arena.myplot.series[i]=({label: this.team.robots[i].id + this.count, data: vec});
       }
         this.team.arena.update();
         this.count = this.count + 1 ; // Ready for next path
  } // end plot
} // end pathPlotter

class pdfPlot {
 // Render pdf Distributions of each robot

   constructor (id) {
        this.id =  id;
        this.series =  [] ;
        this.options = {  // flot plot default options
                series: { lines: { show: true },
                         points: { show: false } }, 
                          xaxes: { position: 'bottom', axisLabel: 'Sequence Number', 
			          showTickLabels: 'none' },
                          yaxes: { position: 'left', axisLabel: 'q', 
  			          showTickLabels: 'none' },    
                        } ;
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

   update () { // We have to delay update ... to counter drawing issues with flot
      
      activeTab("#plotsTab"); // We need to move to tab for flot is not happy
       // Make sure the tab is displayed before plotting
       setTimeout((function() {$.plot(this.id, this.series, this.options);}).bind(this), 150);
   } // end update

   addInfo(px, py, str) {
      // If you wish to use multiline string use <br> to break
      // lines in str
      // position is absolute pixels ... may have to use trial and error
      // since we don't use plot coordinates
      $(this.id).append("<div style='position:absolute;left:" 
                         + px + "px;top:" + py + 
                         "px;color:#666;font-size:smaller'>" +
                         + str + "</div>");  
      } // end addInfo
                                           
} // end pdfPlot
