// Adding clone methods for a vector and set objects
//  Caution: No deep cloning [complex objects withing are not cloned]
Set.prototype.clone = function () { // Deep copying of a set (only numbers)
    let a = Array.from(this) ;
    return (new Set(a));
}

Array.prototype.clone = function () { // Deep copying 
   return (this.slice(0)) ;
}

function isEmpty(obj) { // empty object test
 return (Object.keys(obj).length === 0 
          && obj.constructor === Object ) ;
}

function getStats (vec) {  // Get Mean ans Std of a vector

  var mean = 0 ;
  for (let i=0 ; i<vec.length ; i++)  {mean = mean + vec[i]};
  mean = mean / vec.length ;

  var std = 0 ;
  for (let i=0 ; i<vec.length ; i++)  {std = std + Math.pow((vec[i] - mean),2)};
  std = Math.sqrt (std / (vec.length -1)); 

  return ({mean: mean, std: std}) ;
} // end getStats

function cccurve(alpha, x) {
// Provides scaled curve shape that is either concave or convex
// alpha>1 concave, alpha <1 convex
// never try alpha =1   it is singular
// try  alpha 0.01 0.5 20

  y = (Math.pow(alpha, x) - 1) / (alpha -1); 
  return (y) ;
}

function sCurve(alpha, x) {
  // if Alpha is negtive you get S curve
  //             positive you get mirror of S curve
  y = 1.0 / (1 + Math.pow(x/(1-x), alpha)) ;
  return (y) ;
}
