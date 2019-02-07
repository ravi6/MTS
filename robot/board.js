class  board {

      constructor () {
            this.xmax = 10 ;
            this.ymax = 10 ;
            this.walls = [ new line (new point(1, 3), new point(3, 3)),
                       new line (new point(7, 2), new point(7, 4)),
                       new line (new point(4, 5), new point(6, 7)) ]; 
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
           this.myplot.series.push ([[this.walls[i].p1.x, this.walls[i].p1.y],
                           [this.walls[i].p2.x, this.walls[i].p2.y]]);                   
      }

 	  $.plot(this.myplot.id, this.myplot.series, this.myplot.options);
}

update () {
	$.plot(this.myplot.id, this.myplot.series, this.myplot.options);
}

} // End of board
