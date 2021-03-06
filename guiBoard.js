class guiBoard { // TicToc board graphics

    constructor (canvas) {
       this.canvas = canvas ;
       this.gcells = [] ;
             
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

     setState (board) { //  Display given board 
       this.gcells.forEach (function (e, i){
                   let txt = board.cells[i] ;
                   e.tbox.set('text', txt);
                    });
     }


} // end guiBoard