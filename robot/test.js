var obj ;

function Test () {

 obj = new dcmts() ;

  // Read in parameters from Main Tab
 
   obj.params.maxCount = parseInt($("#MaxIter").val());
   obj.pdfTraces = parseInt($("#pdfTraces").val()) ;
   obj.params.beta.min = parseFloat($("#betaMin").val());
   obj.params.beta.max = parseFloat($("#betaMax").val());
   obj.params.beta.anneal = parseFloat($("#anneal").val());
   obj.params.alpha = parseFloat($("#alpha").val());
   //console.log(obj.params);
  
    obj.simulate() ;
}


