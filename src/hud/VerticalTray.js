class VerticalTray extends ButtonTray {

	constructor(x,y,trayWidth,trayHeight,color,buttons) {
		super(x,y,trayWidth,trayHeight,color,buttons);
		this.scrollOffset = 0;
	}

	//Draws buttons vertically from top to bottom.
	drawSelf() {
	  super.drawSelf();
	  let i = 0;
	  for (let button of this.myButtons) {
	  	let buttonY = this.myY + 5 + (i*50) - this.scrollOffset;
	    button.setLocation(this.myX + 5,buttonY);
	    button.setDimensions(40,40);
	    button.drawSelf()
	    i++;
	  }
	}

	//Overridden method
	//Moves the buttons if there are too many to store in the side tray
	reactToScrolling(delta) {
		let requiredHeight = (this.myButtons.length * 50) + 5;
		if (requiredHeight > this.myHeight) {
			if (delta < 0) {
				//Scrolling up means negative delta
				this.scrollOffset += delta * 0.1;
				this.scrollOffset = max(this.scrollOffset, 0);
			}
			else {
				//scrolling down means positive delta
				let maxScroll = requiredHeight - this.myHeight;
				this.scrollOffset += delta * 0.1;
				this.scrollOffset = min(this.scrollOffset,maxScroll);
			}
		}
	}
}