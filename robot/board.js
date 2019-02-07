class  board {

      constructor () {
            this.xmax = 10 ;
            this.ymax = 10 ;
            this.walls = [ new line (new point(1, 3), new point(3, 3)),
                       new line (new point(7, 2), new point(7, 4)),
                       new line (new point(4, 5), new point(6, 7)) ]; 
            
            this.tps = [ [2,1], [4,1], [5,3], [9,4], [3,4],
                        [2,6], [7,6], [4,8], [6,8], [8,9]] ; // Treasure points
    
        this.myplot = {
			id: "#plotarea",
			series: [],
			options: {  // flot plot default options
				series: { lines: { show: true },
						 points: { show: true } },  
				  xaxis: {min: 0, max: 10, ticks: [0,1,2,3,4,5,6,7,8,9,10]}, 
				  yaxis: {min: 0, max: 10, ticks: [0,1,2,3,4,5,6,7,8,9,10]}       
			}};
              
      }


show () {
  
   //Draw walls

      for (let i=0; i < this.walls.length ; i++){
      	var vec =  [[this.walls[i].p1.x, this.walls[i].p1.y],
                     [this.walls[i].p2.x, this.walls[i].p2.y]] ;               
      this.myplot.series.push ({data: vec, label: "wall", 
                                lines: {lineWidth: 7, 
                                        fillColor: "rgb(255, 0, 255, 0.8)" }
                               });                  
      }


                                     

     this.myplot.series.push ({data: this.tps, label: "Reward",
                               lines: {show: false},
                               points: { show: true, 
                                         symbol: this.tpSymbol }
                              });
} // end show


update () {
	$.plot(this.myplot.id, this.myplot.series, this.myplot.options);
}

tpSymbol (ctx, x, y, radius, shadow) {
  ctx.arc (x, y, radius * 4, 0,
           shadow ? Math.PI : Math.PI * 2, false);
} // end tpSymbol

} // End of board
