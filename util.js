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
