class treasure {

    constructor () {
        this.loc = [ [2,1], [4,1], [5,3], [9,4], [3,4],
                   [2,6], [7,6], [4,8], [6,8], [8,9]] ; // Treasure locations
                   
        this.defValue = new Array(this.loc.length).fill(10) ;  // Add some money in all locations
        this.value    = this.defValue.slice()  ;              //Clones the array
    } 

    collect (pos) {  // Draws money if money in the pos 

      let reward = 0 ;
      for (let k=0; k < this.loc.length; k++ ) {
                if ( (pos.x == this.loc[k][0] && pos.y  == this.loc[k][1]) 
                     && (this.value[k] > 0) ) { 
                     reward = 1 ;  
                     this.value[k] = this.value[k]-1 ;   // Reduce the treasure            
                    break ;
                }} 
      return (reward)            
    }

    restore() {
        // We restore the treasures to original state
        this.value = this.defValue.slice() ;
    }

} // end treasure