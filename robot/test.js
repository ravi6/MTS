var cat  = new Worker("cat.js");
var dog  = new Worker("dog.js");
cat.onmessage = responder ;
dog.onmessage = responder ;

function responder (msg) {
 // Message handler for all robot workers
    // 
   console.log(msg) ;
}

