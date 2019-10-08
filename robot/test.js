var wrobots = [] ;
var ids = ["Cat", "Dog"] ;


for (let i=0 ; i < ids.length ; i++) {
    let w = new Worker ("wrobot.js");
    w.onmessage = function (e) { responder(e) ; } ;
    wrobots.push (w);
    w.postMessage ({cmd: "init", 
                    msg: {id: ids[i], pos: (new point (0,0)) } }) ;                  
}


 function responder (e) {
 // Message handler for all robot workers
     let msg = e.data ;   

 // Marshall all received messages here

    switch(msg.cmd) {
     // Actions
       case "newMember":
         rob.pos = msg.pos ;
         break;

       default:
         console.log ("Unknown cmd", e.data);
     } };   // end message handling       
