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
  RunTest1 ();
});



$("#btnSim").click(function() {  
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

function RunTest1() {
	// This tests sensitivity of game outcome to UTCF,
	// Number of simulations and expansion cycle
	 let asim = { nexp: $("#nexp").val(),
	              nsim:  $("#nsim").val(), 
	              utcf:  $("#utcf").val() } ;
	 let astr = asim.nexp + "," + asim.nsim + "," + asim.utcf;

	let ser = {label: astr, data: []} ;
    myplot.series.push(ser);
    Test1 ({ ser:   myplot.series[myplot.series.length-1],
              count: 0, sim: asim}); 
 
} // end of RunTest1

function RunTest2 () {
	Test2 ({ ser: {label: "", data: []},	               
	        sim: {nexp:  $("#nexp").val(),
	              nsim:  $("#nsim").val(), 
	              utcf:  $("#utcf").val()}, 
	       count: 0}); 
}	 // RunTest2

function Test2 (pdata) {
	// Show how the tree is going through number of nodes
	// The number of nodes statistics for a given no. of exploration
	 // minify my compute
        var myfun = function (param) {
        	             setTimeout (function (){ Test2 (param); }, 10) ; }
	      
   if (pdata.count < 100) {   	             
	     mtsCycle(pdata.sim);
	     pdata.ser.data.push ([pdata.count, game.NodeSet.length]) ;
	     pdata.count = pdata.count +1 ;
	     myfun(pdata) ;
   } else {       
      let v = [] ;
      pdata.ser.data.forEach (function (vec) {
      	v.push (vec[1]);});
	  let stats = getStats (v);
	  let mean = stats.mean.toPrecision(2);
      let std  = stats.std.toPrecision(2); 
	  pdata.ser.label = "Nexp=" + pdata.sim.nexp + 
	              " Nsim=" + pdata.sim.nsim +
	              " Utcf=" + pdata.sim.utcf +
	              " mean="+ mean + 
	              " std=" + std ;
	  myplot.series.push(pdata.ser);
	  $.plot(myplot.id, myplot.series, myplot.options);
	  	  //console.log(myplot.series[0]);
   }  
} // Test2 end


function Test1 (pdata) {// some batch process that gives some trends

   const NMAX = 20 ;

    var myfun = function (param) {
        	             setTimeout (function (){ Test1 (param); }, 10) ; }   
 
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
	  
} // end Test1


function mtsCycle(sim) { // MonteCarlo Tree SEP

  game = new tree(); game.UTCF =  sim.utcf;
  
  for (let i=0 ; i < sim.nexp ; i++) {  
     game.select() ; 
     game.expand() ;
      
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