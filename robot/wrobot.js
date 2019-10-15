// A generic robot worker implementation

importScripts("geometry.js", "board.js", "treasure.js", "node.js",
              "tree.js", "pdf.js", "robot.js", "util.js");

var rob ;

self.onmessage = function (e) {MsgListener (e);} ; 


Tests();



function Tests() {   // A stub for just testing a piece of code

// Testing
setTimeout (function (){
 
   if (rob != undefined && rob.robots.size == 1) {

   //  if (rob.id == "Cat") {
        // postMessage ({cmd: "updateRobot", rob: rob}) ;
       //  postMessage({cmd:"RobotMoved", id: rob.id, path: [new point(5,5), new point(6,6)]})
        // postMessage({cmd:"RobotMoved", id: rob.id, path: [new point(8,8), new point(9,9)]})
        // Try planning asynchornously and see the results
        var planner = new Planner() ;
        planner.timer = setTimeout(planner.plan, 100);       
        planner.promise().then(function (result) {console.log(result)})
                  .catch (function (error) {console.log(error); })


    // } else { }// postMessage({cmd:"RobotMoved", id: rob.id, path: [new point(15,15), new point(16,16)]})}
   } 
   }, 1500) ;
} // end Tests


class Planner {   // this class uses global variable rb ...yuk

    constructor () {
        this.MaxCount = 3 ;
        this.intval = 1000 ; //milli seconds
        this.count = 0 ;
        this.done = false ;     // planning done flag         
        this.timer ;
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
        this.timer=0;    promise() {
        return new Promise (function (resolve, reject) {                       
                                        if (this.done) resolve("done");
                                        else { 
                                          reject("failed"); 
                                          self.terminate();
                                          }}.bind(this));
    } // end promise

        this.done = true ;
        console.log("Stopped Planning");
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


 /*
    promise() {
        return new Promise (function (resolve, reject) {                       
                                        if (this.done) resolve("done");
                                        else { 
                                          reject("failed"); 
                                          self.terminate();
                                          }}.bind(this));
    } // end promise
*/