class myTbox {  // A customised text box with some bells and whistles

  constructor (txt, width, height)  {
   
    this.colors = {box: 'blue', txtON: 'white', txtOFF: 'green'} ;   
    this.flashDelay = 1000 ; // millis seconds

    this.rect  = new fabric.Rect({
       fill: this.colors.box,
       originX: 'center', 
       originY: 'center',
       ry:10,
       opacity:0.3 
       });

    this.tbox  = new fabric.Textbox(txt, {
       originX: 'center', 
       originY: 'center',
       fill: this.colors.txtON,
       textAlign: "center",  
       ry:10,
       opacity: 0.5 
       });

    this.tbox.width =  width ;                 
    this.tbox.height = height ;
    this.rect.width = this.tbox.width ;      
    this.rect.height = this.tbox.height;
    this.group = new fabric.Group([this.rect, this.tbox]) ;
   // canvas.add (this.group);

  } // end constructor

 
   flasher () {     

        var color = this.tbox.get('fill') ; 
        color = (color == (this.colors).txtON) ? 
                this.colors.txtOFF : this.colors.txtON ;
          this.tbox.set('fill',color); 
          canvas.renderAll();

       } // end of flasher


   flashtxt (on) {  // Text flasing 

       if (on)      
           var flashing = setInterval ((this.flasher).bind(this), this.flashDelay) ;                                             
       else      
         clearInterval(flashing);

  } // end flashtxt

   

} // end myTbox
