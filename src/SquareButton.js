class SquareButton {
	constructor(image,name,onClick) {
		this.myName = name;
		this.myImage = image;
		this.onClick = onClick;
		this.myX = 0;
		this.myY = 0;
		this.myWidth = 10;
		this.myHeight = 10;
		this.selected = false;
		this.hover = false;
	}

	setLocation(x,y) {
		this.myX = x;
		this.myY = y;
	}

	setDimensions(width,height) {
		this.myWidth = width;
		this.myHeight = height;
	}

	drawSelf() {
		let hoverEffect = 0;
		if (this.hover) {
			hoverEffect = 25;
			showButtonInfo(this.myName);
		}
		stroke(0);
		strokeWeight(1);
		fill(220 + hoverEffect);
		if (this.selected) {
			fill(220 + hoverEffect,170 + hoverEffect,0 + hoverEffect);
		}
		rect(this.myX,this.myY,this.myWidth,this.myHeight);
		if (this.myImage != null) {
			image(this.myImage,this.myX,this.myY,this.myWidth,this.myHeight);
		}
		else {
			textSize(20);
			text(this.myName,this.myX + 5,this.myY,this.myWidth,this.myHeight);
		}
	}

	getName() {
		return this.myName;
	}

	reactToClick(clickX,clickY) {
		let clicked = this.pointInBounds(clickX,clickY);
		if (clicked) {
			this.onClick();
		}
	}

	reactToHover(x,y) {
		this.hover = this.pointInBounds(x,y);
	}

	reactToNoHover() {
		this.hover = false;
	}

	deselect() {
		this.selected = false;
	}

	pointInBounds(x,y) {
		return (x > this.myX && x < this.myX + this.myWidth &&
						y > this.myY && y < this.myY + this.myHeight);
	}
}