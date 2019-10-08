// A generic robot worker implementation

importScripts("geometry.js", "board.js", "treasure.js", "node.js",
              "tree.js", "pdf.js", "robot.js", "util.js");

var rob ;

self.onmessage = function (e) { // Marshall all received messages here

    let msg = e.data ;

    switch(msg.cmd) {
     // Actions
       case "move":
         rob.pos = msg.pos ;
         break;
       case "init":
         rob = new robot (msg.id, msg.pos);
         console.log (rob.id + ": is initialized"); 
         postMessage ({cmd: "newMember", rob: rob}) ; 
         break;
       case "newMember":
         if (msg.rob.id != rob.id)
                 rob.robots.push (rob) ; 
       default:
         console.log ("Unknown cmd", rob.ID, e.data);
     } };   // end message handling       
