class guiBoard { // TicToc board graphics

    constructor (canvas) {
       this.canvas = canvas ;
       this.gcells = [] ;
       this.counter = 0 ;

       
        [0, 1, 2].forEach ( function(x) {
                        // x = parseInt(x);
                         let b = new myTbox ("", 100, 100) ;
                             b.group.top = 100;
                             b.group.left = x * (100 + 2) ;
                             this.gcells.push (b) ;
                             }.bind(this));
         [3, 4, 5].forEach ( function(x) {
                         let b = new myTbox ("", 100, 100) ;
                             b.group.top = 200 + 2;
                             b.group.left = (x - 3) * (100 + 2) ;
                             this.gcells.push (b) ;
                             }.bind(this));
          [6, 7, 8].forEach ( function(x) {
                         let b = new myTbox ("", 100, 100) ;
                             b.group.top = 300 + 4;
                             b.group.left = (x - 6) * (100 + 2) ;
                             this.gcells.push (b) ;
                             }.bind(this));

        let gs = [] ;
        this.gcells.forEach (function (e) { gs.push (e.group); }) ;
        let gboard = new fabric.Group(gs);

        gboard.top = 50 ; 
        gboard.left = 30 ; // canvas.renderAll();

} // end constructor

     setState (node) { //  Display given nodes state
       this.gcells.forEach (function (e, i){
                   let txt = node.board.cells[i] ;
                   e.tbox.set('text', txt);
                    });
     }



     showSeq (nodes) { // Given some nodes display them
     
      var seq = setInterval(()=>{
                               this.counter = this.counter +1 ;
                               console.log(this.counter);
                               if (this.counter >10)
                                   clearInnterval(seq);
                             }, 1000) ;
      
     } // end showSeq

} // end guiBoard