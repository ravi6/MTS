var obj ;

function Test () {
           var catRewards = []  ;
          var dogRewards = []  ;

console.log("Gathering Stats");
for (let k=0 ;  k<100 ; k++){
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
   catRewards.push(obj.team.robots[0].pdf.table[9].reward);
  dogRewards.push(obj.team.robots[1].pdf.table[9].reward);
}

       let catStats = getStats(catRewards);
       let dogStats = getStats(dogRewards);
       console.log(catStats.mean, catStats.std, 
                        dogStats.mean, dogStats.std);
console.log("Done");
}      