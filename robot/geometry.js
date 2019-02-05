// some 2D geometrical ops and entitites
class line {

   constructor (p1, p2) {
        this.p1 = p1 ;
        this.p2 = p2 ;
   }

   slope() {  
      return ( (this.p2.x == this.p1.x) ? 
                  undefined :
                  (this.p2.y - this.p1.y) / (this.p2.x - this.p1.x) );
   } // end slope

   c () { // intercept
          return ( (this.p2.x == this.p1.x) ? 
               undefined :
               this.p1.y - this.slope() * this.p1.x );
   } // end intercept
   

   len () { // length of line segment
      return ( (this.p2.x - this.p1.x)^2 +
               (this.p2.y - this.p1.y)^2 );
   }

} // end line

class point {
    constructor (x,y) {
       this.x = x ;
       this.y = y ;
    }
}// end point


function onLine (pt, l1) { // test if a point is 
  if (l1.p1.x == l2.p2.x) {
    f = (pt.x - l1.p1.x) / (l1.p2.x - l1.p1.x)
  } else if (l1.p1.y) == l1.p2.y) {
    f = (pt.y - l1.p1.y) / (l1.p2.y - l1.p1.y)
  }
}

function intsect (l1, l2) {
// find intersection of two lines
  var xi, yi ;  
  var intSects = false ;  // True when intersection exists

  let parallel = (l1.slope() == l2.slope()) ;

  let Haligned = (l1.slope() == 0) && (l1.p1.y == l2.p1.y) ;
  let Valigned = (l1.slope() == undefined) && (l1.p1.x == l2.p1.x) ;

  let aligned  = parallel && ( Haligned || Valigned ) ;
                  
  if (!parallel) { // not parallel lines      
        if (l1.slope() == undefined) {
            xi = l1.p1.x ;
            yi = l2.slope() * xi + l2.c() ;
        } else if (l2.slope() == undefined) {
            xi = l2.p1.x ;  
            yi = l1.slope() * xi + l1.c() ;
         } else {
            xi = - (l2.c() - l1.c()) / (l2.slope() - l1.slope());
            yi = l1.slope() * xi + l1.c() ;
           }
    } 

    if (aligned) { // aligned lines don't intersect but meet or merge
                   // but a choice of intersection point is made to help
                   // determine if the l1 vector tip falls on l2 (just for my game)
        xi = l1.p2.x ;
        yi = l1.p2.y ;
    }


     if (!parallel || aligned) {
       // Check to see if intersection is within the lines
         intSects =   xi >= l1.p1.x  && xi <= l1.p2.x &&
                      yi >= l1.p1.y  && yi <= l1.p2.y &&
                      xi >= l2.p1.x  && xi <= l2.p2.x &&
                      yi >= l2.p1.y  && yi <= l2.p2.y  ;     
     }

       let pt =  new point(xi,yi) ;

       if (intSects) {console.log("hello",Haligned, Valigned);}

       if (intSects) {
         console.log("Intersects@:", pt)
         return (pt);
       } else {
           return (undefined);
       }

} // Intersection of two lines
