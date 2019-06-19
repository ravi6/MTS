class team
{
    constructor () {
            this.arena = new board();
            //arena.show();
            this.robots = [] ;
            this.robots.push(new robot("Cat",new point(0,0), arena, team));
            this.robots.push(new robot("Dog",new point(1,0), arena, team));

            this.tps = [ [2,1], [4,1], [5,3], [9,4], [3,4],
                   [2,6], [7,6], [4,8], [6,8], [8,9]] ; // Treasure points
    }


} // end of team

