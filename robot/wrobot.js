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
         rob.robots.push (rob);
         postMessage ({cmd: "newMember", rob: rob}) ; 
         break;
       case "newMember":
         if (msg.rob.id != rob.id) {
                 rob.robots.push (msg.rob) ; 
                 console.log(rob.robots.length, rob.robots);
         }
         break;
        case "check":
           console.log (rob.id, rob.pos.x, rob.robots[0].pos.x, rob.robots[1].pos.x) ;
           break ;
       default:
         console.log ("Main Listner Unknown cmd: ", msg.cmd, "from", rob.ID, e.data);
     } };   // end message handling       
