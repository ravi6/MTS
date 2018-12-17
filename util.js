const TIC = true  ;
const TOC  = false ;

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


/* Does not seem to work
Object.prototype.clone = function() { // A generic deep copy of any object
  var newObj = (this instanceof Array) ? [] : {};
  for (i in this) {
    if (i == 'clone') continue;
    if (this[i] && typeof this[i] == "object") {
      newObj[i] = this[i].clone();
    } else newObj[i] = this[i]
  } return newObj;
};
*/
