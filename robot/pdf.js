class pdf {
          
    constructor (n) {
          this.size = n ;  // pdf table size 
          this.table = [] ;
    }

    choose (){  // Choose one pdf element from the table

       // Generate cumulative q table
       let cumQ = [] ;           
       cumQ.push(this.table[0].q);

       for (let i=1 ; i < this.size ; i++) {
	   cumQ.push(cumQ[cumQ.length-1] + this.table[i].q);
       }
	  
       let rnum = Math.random() ; // get a random val 0 to 1

       // Choose seq corresponding to CumValue just below it
       k = 0;
       while (rnum > cumQ[k] && k < this.size-1) {
	   k = k + 1 ;
       }
					       
       return (this.table[k]) ;

    } // end choose

    push (seq, reward) { // add an entry to pdf table grow it to size and replace entry if required

        let entry = {seq: seq, q: 0.2, reward: reward}) ;

        if (this.table.length < this.size) {
            // do this until we grow the pdf table to its size
              this.table.push (entry);
              this.resetTable() ;
	      return ;
        } 
        else {
            if ( reward <= this.table[0].reward ) return ; // nothing to add (less than min)
            if ( reward > this.table[this.table.length-1].reward ) { 
	                // replace the last entry  higher than max
                this.table.pop();
                this.table.push (entry) ;
	        return ;
            }

         let k = 1 ;
         while (reward > this.table[i].reward ) {  // we are in the middle of the table
			 k = k + 1;
         }
             this.table = this.table.splice(k, 1, entry); // replace the middle entry with new one
             this.resetTable() ;

    } % end push

    resetTable () { // sorting by reward in ascending reward order
                    // also reset q values for all entries
        this.table.sort(function (a,b){return a.reward - b.reward} ;
        this.table.forEach (function (e) { e.reward = 1.0 / this.table.length; }).bind(this);
    }

    clone () {
         let apdf = new pdf(this.size);
         apdf.table = new Array(this.size) ;
         for (var i=0 ; i < this.table.length ; i++){
             apdf.table[i] = {seq:     this.cloneSeq(this.table[i].seq),
                              q:       this.table[i].q,
                              reward:  this.table[i].reward}) ;
         }

         return (apdf);
    } // end cloning pdf

    cloneSeq (seq) { // Clone a sequence (private funciton)
            let vec = [] ;
            for (let i=0 ; i < seq.length ; i++) {
                  vec.push(seq[i].clone());
            }
            return (vec);
    } // end cloneSeq

    showBest() { // show the higest q value seq
      //   let i = indexOfMax(this.q);
       //  console.log(i, this.q[i], this.seq.length) ;
    }

}// end class pdf
