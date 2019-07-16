class pdf {
    constructor (n) {
          this.size = n ;
          this.q = new Array(n) ;
          this.q.fill(1/n) ;     // equal probabilities
          this.seq = new Array(n) ;
          this.seq.fill("none") ;  // unInitialized sequence
    }

    choose (){  // A random choice from the stored pdf
             let k  = Math.floor(Math.random() * this.size) ;
             return ({seq: this.seq[k], q: this.q[k]}) ;
    } // end choose

    clone () {
         let apdf = new pdf(this.size);
         apdf.q = new Array(this.size);
         apdf.seq = new Array(this.size);
         for (var i=0 ; i < this.size ; i++){
             apdf.seq[i] = this.cloneSeq(this.seq[i]);
             apdf.q[i] = this.q[i] ;
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

}// end class pdf
