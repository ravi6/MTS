class ball
{
 constructor (color) {
       this.color = color ;
       this.rings = [1, 2, 3, 4];
       this.amap = new Map() ;
       this.amap.set("ravi", new bat("red"));
       this.amap.set("rami", new bat("green"));
 }
} // end ball
class bat
{
     constructor (color) {
        this.color=color;
    };
}
