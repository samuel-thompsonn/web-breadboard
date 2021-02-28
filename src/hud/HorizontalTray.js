class HorizontalTray extends ButtonTray {
	//Draws buttons horizontally from left to right.
	drawSelf() {
	  super.drawSelf();
	  let i = 0;
	  for (let button of this.myButtons) {
	    button.setLocation(this.myX + 5 + (i*50),this.myY + 5);
	    button.setDimensions(40,40);
	    button.drawSelf()
	    i++;
	  }
	}
}