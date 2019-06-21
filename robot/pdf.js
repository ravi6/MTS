class pdf {
    constructor (n) {
          this.size = n ;
          this.q = new Array(n) ;
          this.q.fill(1/n) ;     // equal probabilities
          this.seq = new Array(n) ;
          this.seq.fill("none") ;  // unInitialized sequence
    }

    choose (){  // A random choice from the stored pdf
             let k  = Math.floor(Math.random() * (this.size - 1)) ;
             return ({seq: this.seq[k], q: this.q[k]}) ;
    }

}// end class pdf
