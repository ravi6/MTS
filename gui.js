 var canvas = new fabric.Canvas("canvas", {backgroundColor: 'lightyellow',
                                              width: 400, height: 400});
 var gb = new guiBoard (canvas) ;

 var myplot = {
        id: "#plotarea",
        series: [],
        options: {  // flot plot default options
   	        series: {
	           lines: { show: true },
	          points: { show: true }
	        }
	    }};
                          
var game = {} ;

var ticker = true ;
var tickerID = setInterval(function(){ticker = !ticker},10);


$(document).ready(function() {
      $("#nsim").val(100) ;
      $("#nexp").val(100) ;
      $("#utcf").val(0.2) ;
    }); // end of Initial Set up

$("#btnplay").click (function() {

	let sim = {nexp: 100, nsim: 100, utcf: 0.2};
    let data = {wins: [], nplays: 0, nbatch: 0, count: 0, stats: {},
                sim: sim };
	miniPlay (data) ;
});

$("#btnPlot").click (function() {

    let ser = {label: "500,100,0.2 CyclePlay", data: []} ;
    myplot.series.push(ser);
    plotit ({ ser:   myplot.series[myplot.series.length-1],
              count: 0, sim: {nexp: 500, nsim: 100, utcf: 0.2} }); 
               
    ser = {label: "500,100,1.4 CyclePlay", data: []} ;
    myplot.series.push(ser);
    plotit ({ ser: myplot.series[myplot.series.length-1],
              count: 0, sim: {nexp: 500, nsim: 100, utcf: 1.4} }); 
});

$("#simbtn").click(function() {  
	  status ("Started Tree Search") ;
	  let sim = {} ;
	  sim.nexp = $("#nexp").val();
	  sim.nsim = $("#nsim").val();
	  sim.utcf = $("#utcf").val();
	  mtsCycle(sim);
	  status ("Tree Search Completed") ;
	  $("#lblnodes").html(game.NodeSet.length) ;
}); // Simulation button click 

function miniPlay (data) { // updates data statistics after several plays back in data
 // Breaking down big iteration execution
                        // with setTimeOut
	    const NPLAYS = 20 ;  // in a batch
        const NBATCHS = 20 ; // no. of batches
        const DELAY = 1 ;    // milliseconds .. yielding
        
        // Kludge to allow Timeout function to be used with miniPlay which takes an argument
        var myfun = function (param) {
        	             setTimeout (function (){ miniPlay (param); }, DELAY) ; }

			    ab = game.learntPlay() ;  			  
			    win = ab.player && (ab.result == "WIN")	;
			    
				if (ticker) { // We display every so often (crude setup)
					  gb.setState(ab); canvas.renderAll() ;// show it			    
					  let txt = win ? "o: Wins!!" : "o:((" ;	
					  $("#outcome").html("batch: " + data.nbatch +  " play:" + data.count + "  " + txt);
				}

			   if (win) {
			   	  data.count = data.count + 1 ;				   	 
			   }
			   
			   if ( data.nplays < NPLAYS ) {
			   	       data.nplays ++ ;
			   	       myfun (data, DELAY) ;
			   	       //setTimeout (miniPlay, DELAY) ;

			   } else if (data.nbatch < NBATCHS ){
			   	    data.wins.push (data.count);
			   	    data.count = 0 ;
			   	    data.nplays = 0 ;
			   	    data.nbatch ++ ;
			   	    myfun (data) ;
			   	    // setTimeout (miniPlay, DELAY) ;
			   	    $("#lblPWins").html(data.wins[data.nbatch-1]);		   	       
                  			   	  			   	   
			   } else { // All batches done
	                let stats = getStats(data.wins);
	                data.stats = stats ;
                    $("#lblMean").html(stats.mean.toPrecision(2));
	                $("#lblStd").html(stats.std.toPrecision(2));	
                    status("miniPlay Done Calling back"); 
                    data.cb(data) ; // make the call back passing info                  
			   }
} // end MiniPlay

function plotit (pdata) {// some batch process that gives some trends

   const NMAX = 10 ;

    var myfun = function (param) {
        	             setTimeout (function (){ plotit (param); }, 10) ; }   
 
    if ( pdata.count < NMAX )
    {
		mtsCycle(pdata.sim);

		let cb = function (data) {
						pdata.ser.data.push([pdata.count+1, data.stats.mean]);
						$.plot(myplot.id, myplot.series, myplot.options);	
						pdata.count = pdata.count + 1;				 					
						myfun (pdata);
						//console.log(myplot.series[0].data);
				 } // end callback definition

		let data = {wins: [], nplays: 0, nbatch: 0,
					   count: 0, stats: {},  cb: cb};
		miniPlay (data) ;
    } else {
    	console.log ("We are Done");
    }
	  
} // end plotit

function mtsCycle(sim) { // MonteCarlo Tree SEP

  game = new tree(); game.UTCF =  sim.utcf;
  
  for (let i=0 ; i < sim.nexp ; i++) {  
     game.select() ;  
     for(let j=0 ; j < sim.nsim ; j++) {   
        game.simulate() ;   
        game.propagate() ;   
     }};
} // end mtsCycle


function status(msg) { // Add messages to status
    // an easier way is to use innerHTML but that is not safe!!!
    var br = document.createElement("br") ;
    var d = new Date();    var n = d.toLocaleString();
    var content = document.createTextNode(n + ": " + msg ) ; 
    var stat =  $("#status") ;
    stat.append(br, content) ;
    stat.scrollTop(40)  ; 
}