class ButtonContainer {

	constructor(x,y,containerWidth,containerHeight) {
		this.myX = x;
		this.myY = y;
		this.myWidth = containerWidth;
		this.myHeight = containerHeight;
		this.myButtons = [];
	}

	pointInBounds(x,y) {
		return (x > this.myX && x < this.myX + this.myWidth &&
						y > this.myY && y < this.myY + this.myHeight);
	}

	reactToClick(x,y) {		
		if (!this.pointInBounds(x,y)) {
			return;
		}
		for (let button of this.myButtons) {
			button.reactToClick(x,y);
		}
	}

	reactToHover(x,y) {		
		if (!this.pointInBounds(x,y)) {
			for (let button of this.myButtons) {
				button.reactToNoHover();
			}
			return;
		}
		for (let button of this.myButtons) {
			button.reactToHover(x,y);
		}
	}

	addButton(button) {
		this.myButtons.push(button);
	}

	setButtons(buttons) {
		this.myButtons = buttons;
	}

	deselectAll() {
		for (let button of this.myButtons) {
			button.deselect();
		}
	}
}