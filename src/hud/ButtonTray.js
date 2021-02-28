class ButtonTray extends ButtonContainer {
	constructor(x,y,trayWidth,trayHeight,color,buttons) {
		super(x,y,trayWidth,trayHeight);
		this.myColor = color;
		this.myButtons = buttons; 
	}

	drawSelf() {
		stroke(0);
		strokeWeight(1);
		fill(this.myColor);
		rect(this.myX,this.myY,this.myWidth,this.myHeight);
	}

	reactToScrolling(delta) {
		//To be implemented by extending classes.
	}
}