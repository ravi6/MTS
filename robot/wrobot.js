// A generic robot worker implementation

importScripts("geometry.js", "board.js", "treasure.js", "node.js",
              "tree.js", "pdf.js", "robot.js", "util.js");

var rob ;

self.onmessage = function (e) {MsgListener (e);} ; 
Tests();



function Tests() {   // A stub for just testing a piece of code

// Testing

// A promise that I will wait for robots to be ready
var ready = new Promise (function (resolve, reject) {
                            (function waitForReady () {
                                if (rob != undefined && rob.robots.size == 1)
                                return(resolve());
                                setTimeout(waitForReady, 100); })();
                            });
                        
ready.then(function (result){console.log(result);});
 // A promise that I will start planning and wait until it is done 

var planned = new Promise (function (resolve, reject) {
                                var planner = new Planner() ;                                       
                                (function waitForDone () {
                                    if (planner.done) return(resolve("done"));
                                    setTimeout(waitForDone, 10); })();                                                                                                                                                         
                                 });                                        
planned.then(function (result) {console.log(result)})
                  .catch (function (error) {console.log(error); });

  } // end Tests


class Planner {  

    constructor () {
        this.MaxCount = 10 ;
        this.intval = 1000 ; //milli seconds
        this.count = 0 ;
        this.done = false ;     // planning done flag         
        this.timer = setInterval(function(){this.plan()}.bind(this), this.intval);
    }

    plan() {  //Get me to plan my next move       
       for (let i= 0 ; i < rob.pdf.size ; i++) {
           rob.mtsCycle() ; // Execute one cycle of MTS
       }
        postMessage ({cmd: "updateRobot", rob: rob}) ; // this allows pdf transmission
        rob.sentPDF = rob.pdf.clone();  // We may not use it at all (useful debug??)
        this.count = this.count + 1 ;
        console.log(this.count);
        if (this.count == this.MaxCount) this.stop();
      } // end plan
  

    stop() {
        clearInterval(this.timer);
        this.done = true ;
        console.log("Finished Planning");
    }

} // end planner 



function MsgListener(e) {  // Messages Listener
// Marshall all received messages here

    let msg = e.data ;

    switch(msg.cmd) {

     // Actions
 
       case "init":   // creates a robot
         rob = new robot (msg.id, msg.pos);
         console.log (rob.id + ": is initialized"); 
         postMessage ({cmd: "newRobot", rob: rob}) ; 

         break;

       case "newRobot": // When a new one other than take a copy of it
         if (msg.rob.id != rob.id) {
                 rob.robots.set (msg.rob.id, msg.rob) ; // use id as key to map
                 console.log("From Robot:", rob.id, " robots count:", rob.robots.size, rob.robots);
         }
         break;

       case  "updateRobot": // When a robot changes its state (eg. pos or pdf ..)
             console.log("Robot ", rob.id, " Updating ", msg.rob.id, "obj: ",  msg.rob);
             rob.robots.set (msg.rob.id, msg.rob) ; // local robot that is to be updated                        
         break;

       default:
         console.log ("Unkown Robot MsgListener cmd: ", msg.cmd, "from", rob.ID, e.data);

     } };   // end message handling       




/* Important Notes:
    - A javascript class will use global variable if it is not declared within.
       Eg. Planner class is using "rob" object that is global in scope

    - Planner class is designed to enable several mtsCycles to be done in a non
      blocking way. Notice the plan method is invoked from object instanstiation
      in a periodic fashion. Notice that plan method is not directly used as 
      the callback function in the setInterval. Instead it is encased in function
      that is bound to this. If you don't do this, when setInterval invokes the
      plan method of Planner class, "this" object is not referred to Planner object
      but to the globalScope object of the worker. 

    - Notice the way Promise to complete planning task implemented with a 
      ()() function object. (anonymous function). This function internally
      defines a function that emulates setInterval like behaviour but with 
      recursive calls until some desired state is detected. Then it resolves
      the promise.
      

 /*
    
     //  if (rob.id == "Cat") {
        // postMessage ({cmd: "updateRobot", rob: rob}) ;
       //  postMessage({cmd:"RobotMoved", id: rob.id, path: [new point(5,5), new point(6,6)]})
        // postMessage({cmd:"RobotMoved", id: rob.id, path: [new point(8,8), new point(9,9)]})
        // Try planning asynchornously and see the results
*/
