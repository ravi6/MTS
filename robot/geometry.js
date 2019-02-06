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


function onLine (pt, l1) { // test if a point is on line
 let f = ( (l1.p2.x - l1.p1.x) * (pt.y - l1.p1.y) 
          -(l1.p2.y - l1.p1.y) * (pt.x - l1.p1.x) ) ;
         
    return ( f == 0 ); 
}

function testme(pt, l1) {

 var dx =  l1.p2.x - l1.p1.x ;
 var dy =  l1.p2.y - l1.p1.y ;
 var dxc = (pt.x - l1.p1.x)  ;
 var dyc = (pt.y - l1.p1.y) ;

 var ans = false ;
 if (dx == 0) { // Vertical line
   ans = (pt.x == l1.p1.x) && (pt.x >= Math.min(l1.p1.x, l1.p2.x))
                           && (pt.x <= Math.max(l1.p1.x, l1.p2.x)) ;
 }
 else if (dy == 0) { // Horizontal line
     ans = (pt.y == l1.p1.y) && (pt.y >= Math.min(l1.p1.y, l1.p2.y))
                           && (pt.y <= Math.max(l1.p1.y, l1.p2.y)) ;
 } else {
      var fx = dxc / dx ;
      var fy = dyc / dy ;
     ans = (fx == fy) && (fx >= 0) && (fx <= 1)
     console.log(fx,fy);

 }
    
console.log(ans);
}

function intsect (l1, l2) {
// find intersection of two lines
  var xi, yi ;  
 
  let parallel = (l1.slope() == l2.slope()) ;
            
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
     let pt = new point(xi,yi);

     if ( onLine (pt, l1) && onLine (pt, l2)) {
       return (pt) ; // Found proper intersection
     }
     else { 
        return (undefined); // Extended intersection we don't care
     }  
  } else {
      return (undefined) ;
    }

} // Intersection of two lines
