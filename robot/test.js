//Spawns off many robot workers
//    With each having same Message Listening Interface
//   This is our Board Worker


var wrobots = new Map ;
var ids = ["Cat", "Dog"] ;

for (let i=0 ; i < ids.length ; i++) {
    let w = new Worker ("wrobot.js");
    w.onmessage = function (e) {MsgListener (e) ; } ; // note we use same listening interface to all
                                                      // should this have new instantiation for each ??
    wrobots.set (ids[i], w);
    w.postMessage ({cmd: "init", 
                     id: ids[i], pos: (new point (0,0)) } ) ;                  
}


function MsgListener (e) {   // Message handler for all robot workers

     let msg = e.data ;   

   // Marshall all received messages here  case "move":
         rob.pos = msg.pos ;
         break;


    switch(msg.cmd) {
        
     // Actions
       case "newMember": // Recieved {cmd: newMemeber, rob: new_robot}
         wrobots.forEach (function (w, key, map) { //Broadcast to all
                               w.postMessage({cmd: "newMember", rob: msg.rob}) ;
                           }) ;
         break;
       
        case "update": //Received  {cmd: update, rob: calling_robot}
          console.log("Master: Received update request from ", msg.rob.id);
          wrobots.forEach( function (w, key, map) {  //broadcast to other robots
                               if (key != msg.rob.id) {
                                    w.postMessage({cmd: "update", rob: msg.rob}) ;
                                    console.log ("Update Request sent to ", key, " obj:", msg.rob);
                               }});
          
        break ;     

         case "move":
               /// Tell board that you moved and send treasure to all 
         break;      
       
       default:
         console.log ("Master: MsgListener Unknown cmd", e.data);
     } };   // end message handling       