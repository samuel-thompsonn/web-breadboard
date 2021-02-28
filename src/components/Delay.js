class Delay extends Component {
	constructor(outputX,outputY) {
		super();
		this.COMPONENT_TYPE = DELAY_GATE_CODE;
		let inputX = outputX - 50;
		let inputY = outputY;
		this.myInput = new ReceivingPin(inputX,inputY,SIGNAL_NONE)
		this.myInput.addListener(this);
		this.myOutput = new GeneratingPin(outputX,outputY,SIGNAL_OFF);
		this.highlighted = false;
		this.selected = false;
		this.myDelay = 500;
		this.minDelay = 100;
		this.maxDelay = 1000;
		this.myText = "Delay";
	}

	setDelay(delay) {
		if (delay >= this.minDelay && delay <= this.maxDelay) {
			this.myDelay = delay;
		}
	}

	//Overridden method
	reactToPinChange(otherPin) {
		this.evaluateOutput();
	}

	reactToPoke(x,y) {
		if (this.pointInBounds(x,y)) {
			this.myDelay += 100;
			if (this.myDelay > this.maxDelay) {
				this.myDelay = this.minDelay;
			}
		}
	}

	evaluateOutput() {
		let signal = this.myInput.getSignal();
		if (signal != SIGNAL_NONE) {
			let functionSubject = this;
			addTimedEvent(this.myDelay,function() {
				functionSubject.myOutput.setSignal(signal);
			});
		}
	}

	setLocation(x,y) {
		this.myInput.setLocation(x,y);
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
		let rectCorner = this.myInput.getLocation();
		rect(rectCorner.x,rectCorner.y,50,50);
		noStroke();	
		fill(0);
		textSize(12);
		text(this.myText, rectCorner.x + 5, rectCorner.y + 25);
		text(this.myDelay, rectCorner.x + 5, rectCorner.y + 40);
	}

	getPins() {
		let pinList = [];
		pinList.push(this.myInput);
		pinList.push(this.myOutput);
		return pinList;
	}

	getClone() {
		return new Delay(this.myOutput.getLocation().x,this.myOutput.getLocation().y);
	}

	getJSON() {
    return {
      type : this.COMPONENT_TYPE,
      x : this.myOutput.getLocation().x,
      y : this.myOutput.getLocation().y,
      param : this.myDelay
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
  	return (x >= this.myInput.getLocation().x && x <= this.myInput.getLocation().x + 50 &&
  			y >= this.myInput.getLocation().y && y <= this.myInput.getLocation().y + 50);
  }

  resetConnections() {		
  	let outputX = this.myOutput.getLocation().x;
  	let outputY = this.myOutput.getLocation().y;	
		let inputX = outputX - 50;
		let inputY = outputY;	
		this.myInput.clearListeners();
		this.myInput = new ReceivingPin(inputX1,inputY1,SIGNAL_NONE)
		this.myInput.addListener(this);
		this.myOutput.clearListeners();
		this.myOutput = new GeneratingPin(outputX,outputY,SIGNAL_NONE);
  }
}