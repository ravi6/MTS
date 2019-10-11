//Spawns off many robot workers
//    With each having same Message Listening Interface
//   This is our Board Worker

var wrobots = new Map ;
var ids = ["Cat", "Dog"] ;
var aboard = new board();

for (let i=0 ; i < ids.length ; i++) {
    let w = new Worker ("wrobot.js");
    w.onmessage = function (e) {MsgListener (e);} ; // note we use same listening interface to all
                                                      // should this have new instantiation for each ??
    wrobots.set (ids[i], w);
    w.postMessage ({cmd: "init", 
                     id: ids[i], pos: (new point (0,0)) } ) ;  
                      
    aboard.robots.set(ids[i], {path: [], reward: 0}) ;   // Initialize board's view of robots motion and rewards                                 
}


function MsgListener (e) {   // Message handler for all robot workers

     let msg = e.data ;   

   // Marshall all received messages here  case "move":
 
    switch(msg.cmd) {
        
     // Actions
       case "newMember": // Recieved {cmd: newMemeber, rob: new_robot}
         wrobots.forEach (function (w, key, map) { //Broadcast to all
                               w.postMessage({cmd: "newMember", rob: msg.rob}) ;
                           }) ;
         break;
       
        case "updateRobot": //Received  {cmd: updateRobot, rob: calling_robot}
          console.log("Master: Received update request from ", msg.rob.id);
          wrobots.forEach( function (w, key, map) {  //broadcast to other robots
                               if (key != msg.rob.id) {
                                    w.postMessage({cmd: "update", rob: msg.rob}) ;
                                    console.log ("Update Request sent to ", key, " obj:", msg.rob);
                               }});        
          break ; 

         case "robMoved": // Received {cmd: moved, id: robid, path: moveseq} 
            
            // update boards view of robots motion and rewards
             let path = aboard.robots.get(msg.id).path ;         
             path.push.apply(path, msg.path);   // Append move sequence to existing robPath 

             // Although We could have taken reward calculation of a sequence from the originating robot 
             //  it is deemed better to get the board to make this calculation again, because it has the
             //  real state of the treasure, were as robot has only notional view of treasure state.
             //  Ofcourse board has only notional view of the robots position, since it relies on robots
             //  telling it where they are.
             let reward =  aboard.getReward (msg.path) + aboard.robots.get(msg.id).reward ;  // accumulate reward

              aboard.robtos.set(rob.id, {path: path, reward: reward}); 
          break;
          
       default:
         console.log ("Master: MsgListener Unknown cmd", e.data);
     } };   // end message handling       