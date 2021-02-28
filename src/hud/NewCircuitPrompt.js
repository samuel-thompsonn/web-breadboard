class NewCircuitPrompt {
	//Taken from the input box tutorial on the p5 reference
  //https://p5js.org/examples/dom-input-and-submitButton.html
	constructor(x,y,width,height) {
		this.myX = x;
		this.myY = y;
		this.myWidth = width;
		this.myHeight = height;
	  let originPos = mainCanvas.position();
	  inputTextBox = createInput();
	  let textBox = inputTextBox;
	  textBox.position(originPos.x + x + this.myWidth / 7,originPos.y + y + this.myHeight * (2/5));
	  let submitButton = createButton("submit");
	  submitButton.mousePressed(function() {
	    createNewSubcircuit(textBox.value());
	    textBox.remove();
	    submitButton.remove();
	    myPopups = [];
	    popupActive = false;
	  });
	  submitButton.position(textBox.x + textBox.width, textBox.y);
	}

	drawSelf() {
		stroke(0);
		strokeWeight(1);
		fill(200);
		rect(this.myX,this.myY,this.myWidth,this.myHeight);
		noStroke();
		fill(0);
		text("Enter subcircuit name:",this.myX + this.myWidth / 4, this.myY + this.myHeight / 5);
	}
}