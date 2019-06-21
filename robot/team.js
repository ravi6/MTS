class team
{
    constructor () {
            this.arena = new board();
            this.arena.show();
            this.robots = [] ;
            this.robots.push(new robot("Cat",new point(0,0), this.arena, this));
            this.robots.push(new robot("Dog",new point(0,10), this.arena, this));
            this.tres = new treasure() ;  // Specify treasures
    }

} // end of team

