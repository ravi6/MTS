class pdf {

    constructor (n) {
          this.size = n ;
          this.q = new Array(n) ;
          this.q.fill(1/n) ;     // equal probabilities
          this.seq = new Array(n) ;
          this.seq.fill("none") ;  // unInitialized sequence           
    }

    static get select() {
         return ({RANDOM: 0, MAXQ: 1, SAMPLE: 2}) ; // pdf table item selection methods 
    }

    choose (){  // Choose one pdf element from the table
             let method = pdf.select.RANDOM ;

             let k = 0  ;
             switch (method) {
                case method.RANDOM:
                     k  = Math.floor(Math.random() * this.size) ;
                     break ;
                case method.MAXQ:
                     k = indexOfMax(this.q);   // Choosing maximum q sequence
                     break ;
                case method.SAMPLE:
                     // Generate cumulative q table
                     let cumQ = [] ;           
                     cumQ.push(this.q[0]);
                     for (let i=1 ; i < this.size ; i++) {
                         cumQ.push(cumQ[cumQ.length-1] + this.q[i]);
                     }
                        
                     let rnum = Math.random() ; // get a random val 0 to 1
                     // Choose seq corresponding to CumValue just below it
                     k = 0;
                     while (rnum < cumQ[k] && k < this.size-1) {
                         k = k + 1 ;
                     }
                     break ;
             } // end switch
                                                     
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
