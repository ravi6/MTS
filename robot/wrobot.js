// A generic robot worker implementation

importScripts("geometry.js", "board.js", "treasure.js", "node.js",
              "tree.js", "pdf.js", "robot.js", "util.js");

var rob ;

self.onmessage = function (e) {MsgListener (e);} ; 


// Testing
setTimeout (function (){
   if (rob != undefined && rob.robots.size == 1) {
     if (rob.id == "Cat")
         postMessage ({cmd:"update", rob: rob}) ;
   }}, 1500) ;

function MsgListener(e) {  // Messages Listener
// Marshall all received messages here

    let msg = e.data ;

    switch(msg.cmd) {

     // Actions
 
       case "init":   // creates a robot
         rob = new robot (msg.id, msg.pos);
         console.log (rob.id + ": is initialized"); 
         postMessage ({cmd: "newMember", rob: rob}) ; 
         break;

       case "newMember": // When a new one other than take a copy of it
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
