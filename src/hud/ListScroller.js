class ListScroller extends ButtonContainer {
	//Requires that its array contents have a defined toString() method.
	constructor(x,y,width,height,label,startArray,leftLabel,onClickLeft,rightLabel,onClickRight) {
		super(x,y,width,height);
		this.myLabel = label;
		this.myArray = startArray;
		this.myArrayIndex = 0;
		let functionTarget = this;
		this.myLeftButton = new SquareButton(LEFT_ARROW_IMAGE,leftLabel,function() {
			onClickLeft();
			// functionTarget.setIndex(subCircuitIndex);
			// functionTarget.incrementArrayIndex();
		});
		this.addButton(this.myLeftButton);
		this.myRightButton = new SquareButton(RIGHT_ARROW_IMAGE,rightLabel,function() {
			onClickRight();
			// functionTarget.setIndex(subCircuitIndex);
			// functionTarget.decrementArrayIndex();
		});
		this.addButton(this.myRightButton);
	}

	addArrayElement(element) {
		//May not be needed.
	}

	setArray(array,startIndex) {
		this.myArray = array;
		this.myArrayIndex = startIndex;
	}

	decrementArrayIndex() {
		if (this.myArrayIndex > 0) {
			this.myArrayIndex--;
		}
	}

	incrementArrayIndex() {
		if (this.myArrayIndex < this.myArray.length - 1) {
			this.myArrayIndex++;
		}
	}

	drawSelf() {
		fill(200);
		stroke(0);
		strokeWeight(1);
		rect(this.myX,this.myY,this.myWidth,this.myHeight);

		this.myLeftButton.setLocation(this.myX + 5, this.myY + 5);
		this.myLeftButton.setDimensions(30,40);
		this.myLeftButton.drawSelf();

		this.myRightButton.setLocation(this.myX + this.myWidth - 35,this.myY + 5);
		this.myRightButton.setDimensions(30,40);
		this.myRightButton.drawSelf();

		fill(0);
		noStroke();
		textSize(13);
		text(this.myLabel + "(" + (this.myArrayIndex + 1) + "/" + this.myArray.length + ")",this.myX + 40, this.myY + 5, 1000, 40);
		textSize(15);
		text(this.myArray[this.myArrayIndex].toString(),this.myX + 60, this.myY + 20,40,40);
	}

	setIndex(index) {
		this.myArrayIndex = index;
	}
}