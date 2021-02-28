class LogicGate extends Component {
	constructor(outputX,outputY) {
		super();
		let inputX1 = outputX - 50;
		let inputY1 = outputY - 25;
		let inputX2 = inputX1;
		let inputY2 = inputY1 + 50;
		this.myInputs = [];
		this.myInputs.push(new ReceivingPin(inputX1,inputY1,SIGNAL_NONE));
		this.myInputs.push(new ReceivingPin(inputX2,inputY2,SIGNAL_NONE));
		for (let input of this.myInputs) {
			input.addListener(this);
		}
		this.myOutput = new GeneratingPin(outputX,outputY,SIGNAL_NONE);
		this.highlighted = false;
		this.selected = false;
	}

	//Overridden method
	reactToPinChange(otherPin) {
		for (let input of this.myInputs) {
			if (input.getSignal() == SIGNAL_NONE) {
				this.myOutput.setSignal(SIGNAL_NONE);
				return;
			}
		}
		this.evaluateOutput();
	}

	evaluateOutput() {
		//Gates should not have a determined output if their
		// input is unknown.
		//To be implemented based on the logic of the particular gate.
	}

	setLocation(x,y) {
		this.myInputs[0].setLocation(x,y);
		this.myInputs[1].setLocation(x,y+50);
		this.myOutput.setLocation(x+50,y+25);
	}

	drawSelf() {
		super.drawSelf();
		stroke(0);
		strokeWeight(1);
		fill(220);
		if (this.highlighted) {
			fill(255);
		}
		this.highlighted = false;
		let rectCorner = this.myInputs[0].getLocation();
		rect(rectCorner.x,rectCorner.y,50,50);
		noStroke();	
		fill(0);
		textSize(20);
		text(this.myText, rectCorner.x + 5, rectCorner.y + 40);
	}

	getPins() {
		let pinList = [];
		for (let input of this.myInputs) {
			pinList.push(input);
		}
		pinList.push(this.myOutput);
		return pinList;
	}

	getJSON() {
    return {
      type : this.COMPONENT_TYPE,
      x : this.myOutput.getLocation().x,
      y : this.myOutput.getLocation().y
    };
  }

  reactToHover(x,y,gridX,gridY) {
  	if (this.pointInBounds(x,y)) {
  		this.highlighted = true;
  	}
  	if (this.selected) {
  		this.setLocation(gridX,gridY);
  		console.log("Changing location to " + gridX + ", " + gridY);
  	}
  }

  selectMouseDown(x,y,gridX,gridY) {
  	console.log("Checking for click");
  	if (this.pointInBounds(x,y)) {
  		console.log("Evaluated to true.");
  		this.selected = true;
  	}
  }

  selectMouseUp(x,y,gridX,gridY) {
  	if (this.selected) {
	  	this.selected = false;
	  	this.resetConnections();
  	}
  }

  pointInBounds(x,y,gridX,gridY) {
  	return (x >= this.myInputs[0].getLocation().x && x <= this.myInputs[0].getLocation().x + 50 &&
  			y >= this.myInputs[0].getLocation().y && y <= this.myInputs[0].getLocation().y + 50);
  }

  resetConnections() {		
  	let outputX = this.myOutput.getLocation().x;
  	let outputY = this.myOutput.getLocation().y;		
  	let inputX1 = outputX - 50;
		let inputY1 = outputY - 25;
		let inputX2 = inputX1;
		let inputY2 = inputY1 + 50;
  	for (let input of this.myInputs) {
			input.clearListeners();
		}
  	this.myInputs = [];
		this.myInputs.push(new ReceivingPin(inputX1,inputY1,SIGNAL_NONE));
		this.myInputs.push(new ReceivingPin(inputX2,inputY2,SIGNAL_NONE));
		for (let input of this.myInputs) {
			input.addListener(this);
		}
		this.myOutput.clearListeners();
		this.myOutput = new GeneratingPin(outputX,outputY,SIGNAL_OFF);

  }

}