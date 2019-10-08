var wrobots = [] ;
var ids = ["Cat", "Dog"] ;


for (let i=0 ; i < ids.length ; i++) {
    let w = new Worker ("wrobot.js");
    w.onmessage = function (e) { robListener (e) ; } ;
    wrobots.push (w);
    w.postMessage ({cmd: "init", 
                     id: ids[i], pos: (new point (0,0)) } ) ;                  
}


wrobots[0].postMessage({cmd: "move", pos: new point(10,10)}) ; 
setTimeout( function () {
          wrobots[0].postMessage({cmd: "check"});
          wrobots[1].postMessage({cmd: "check"}); } , 1000);



 function robListener (e) {
 // Message handler for all robot workers
     let msg = e.data ;   

 // Marshall all received messages here

    switch(msg.cmd) {
     // Actions
       case "newMember":
         wrobots.forEach (function (w) { //Broadcast all
                               w.postMessage({cmd: "newMember", rob: msg.rob}) ;
                           }) ;
         break;

       default:
         console.log ("robListner Unknown cmd", e.data);
     } };   // end message handling       
