class team
{
    constructor () {
            this.arena = new board();
            this.arena.show();
            this.robots = [] ;
            this.robots.push(new robot("Cat",new point(5,5), this.arena, this));
            this.robots.push(new robot("Dog",new point(5,5), this.arena, this));

            this.tps = [ [2,1], [4,1], [5,3], [9,4], [3,4],
                   [2,6], [7,6], [4,8], [6,8], [8,9]] ; // Treasure points
    }


} // end of team

