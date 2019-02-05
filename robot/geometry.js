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


function intsect (l1, l2) {
// find intersection of two lines
       
        if (l1.slope() == l2.slope())  return (undefined)  ;
        
        var xi, yi ;
        if(l1.slope() == undefined) {
            xi = l1.p1.x ;
            yi = l2.slope() * xi + l2.c() ;
        } else if(l2.slope() == undefined) {
            xi = l2.p1.x ;  
            yi = l1.slope() * xi + l1.c() ;
         } else {
            xi = - (l2.c() - l1.c()) / (l2.slope() - l1.slope());
            yi = l1.slope() * xi + l1.c() ;
          }
       
// Check to see if it is within the lines

        let isInside =   xi >= l1.p1.x  && xi <= l1.p2.x &&
                         yi >= l1.p1.y  && yi <= l1.p2.y ;

        if (isInside) {return (new point(xi, yi));}
        else          {return (undefined)} ;
} // Intersection of two lines
