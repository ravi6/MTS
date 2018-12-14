class board {

    constructor () {
            this.moves = new Set([...Array(9).keys()])    ;   // Possible moves
            this.cells     = Array(9).fill("-")           ;
            this.result    = "NONE"                       ;
            this.player    = false                        ;   // Last move made by   
            this.move      = undefined                    ;   // Last move of the current player      
    } // end constructor

    
    hasMoves () { // Still some moves left in the game
        return ( (this.result == "NONE") &&
                 (this.moves.size > 0) ) ;                
    } // end hasMoves

    play (move) { // Next player makes a move 
        if (this.hasMoves()) {  // 
         this.player = !this.player ; 
         this.cells[move] = this.player ? "o":"x" ;
         this.moves.delete(move) ;
         this.move = move ; 
         this.getResult() ;
    } else
         console.log ("Game Over, Ignoring Move: ", move);
    } // end play
 
    getResult () { // Determine the result of the move
       
        var x       = this.cells ;
        var win     = false      ;          
        var pattern = this.player ? "ooo":"xxx" ; // last player
    
            [0, 3, 6].forEach ( function (i) {
                                 i = parseInt (i);
                                 let s = x[0+i] + x[1+i] + x[2+i] ;   
                                 win = win || (s == pattern) ;
            });

            [0, 1, 2].forEach ( function (i) {
                                  i = parseInt (i);
                                  let s = x[0+i] + x[3+i] + x[6+i] ;    
                                  win = win || (s == pattern) ;
            });
                      
               win = win || ((x[0]+x[4]+x[8]) == pattern ) 
                         || ((x[2]+x[4]+x[6]) == pattern) ;

             if (win) {
                    this.result = "WIN" ; 
                    this.moves.clear(); // make sure no more moves possible
             }
             else if ( (this.moves.size) == 0 )  
                    this.result = "DRAW" ;   
             else
                     this.result = "NONE" ;
                           
    } // end getResult
   
    clone() {  // A clone of myself
        var nb = new board() ;
        nb.player = this.player ;
        nb.move = this.move ;
        nb.cells = this.cells.clone() ;
        nb.moves = this.moves.clone() ;
        nb.result = this.result ;
        return (nb);
    } // end clone

    show () {
        [0, 3, 6].forEach ( function(i) {   
                              var c = this.cells ;    
                              console.log(c[i] ,  c[i+1] , c[i+2]);
                            }.bind(this) );  
       this.getResult() ;
       
      // If play continues after win this line will be confusing
       console.log ("Last Player:"  + (this.player? "o":"x") + "     Result: " + this.result);                          
    } // end show

    id () { // Generate unique ID for the state
        let str ="" ;
        this.cells.forEach (function (e, i) {
            str = str + e.cells[i] ;
        });
        return (str);
    }
} // End of board
