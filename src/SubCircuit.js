class SubCircuit extends Component {
	//A subcircuit should keep track of its own components,
	// and when instantiated it should act like a 'pocket dimension'
	// for those components, which interfaces with the outside world using
	// its 'global' input and output pins.
	constructor(xPos,yPos,name) {
		super();
		this.myLocation = {
			x : xPos,
			y : yPos,
		}
		this.myName = name;
		this.pixelsPerUnit = 25;
		this.initializeContents();
	}

	initializeContents() {
	  this.myInternalInputs = [];
	  this.myInternalOutputs = [];
	  this.myPublicInputs = [];
	  this.myPublicOutputs = [];
	  this.myComponents = [];
	}

	getLocation() {
		//Returns a COPY of the location, since this shouldn't
		// be the method to move the canvas around.
		return {
			x : this.myLocation.x,
			y : this.myLocation.y
		}
	}

	getName() {
		return this.myName;
	}

	//Should probably inherit this from somewhere for safety.
	drawSelf() {
		// super.drawSelf();
		for (let pin of this.getPins()) {
			pin.drawSelf();
		}
		let unitHeight = max(this.myPublicOutputs.length,this.myPublicInputs.length);
		unitHeight = max(unitHeight-1,1);
		let unitWidth = 1;
		let unitSize = 50;
		stroke(0);
		strokeWeight(1);
		fill(255);
		rect(this.myLocation.x,this.myLocation.y,unitWidth * unitSize,unitHeight * unitSize);
		noStroke();
		fill(0);
		textSize(13);
		text(this.myName,this.myLocation.x + 3, this.myLocation.y + 13);
	}

	drawSelfAsCanvas(canvasX,canvasY) {
		translate(canvasX,canvasY);
		this.drawBackground();
		for (let component of this.myComponents) {
			if (wiringHidden && component.isWiringComponent()) {
				continue;
			}
			component.drawSelf();
		}
		let gridCoords = this.getGridCoords(mouseX - canvasX,mouseY - canvasY);
		this.drawMouseSnapIndicator(gridCoords.x,gridCoords.y);
		translate(-1 * canvasX,-1 * canvasY);
	}

	drawBackground() {
		stroke(255);
		strokeWeight(10);
		fill(0);
		rect(0,0,width,height);
	}

	//This should return the EXTERNAL pins, which are linked to the internal pins.
	getPins() {
		let pinList = [];
		for (let input of this.myPublicInputs) {
			pinList.push(input);
		}
		for (let output of this.myPublicOutputs) {
			pinList.push(output);
		}
		return pinList;
	}

	reactToPoke(x,y) {
		//I need to express that this is the poke when it's in CANVAS form.
	}

	reactToHover(x,y) {
		let gridCoords = this.getGridCoords(x,y);
		for (let component of this.myComponents) {
			component.reactToHover(x,y,gridCoords.x,gridCoords.y);
		}
	}

	drawMouseSnapIndicator(x,y) {
		stroke(0);
		strokeWeight(1);
		fill(255);
		ellipse(x,y,10,10);
	}
	selectMouseDown(x,y) {

	}

	selectMouseUp(x,y) {

	}

	getGridCoords(x, y) {
  //I don't expect this to work if the offset of the canvas 
  // is something ugly like 47.7, since it will round
  // based on a global onscreen grid anchored at the origin.
  let mouseCoordX = (x / this.pixelsPerUnit);
  let mouseCoordY = (y / this.pixelsPerUnit);
  let mouseRoundedCoords = {
    x : round(mouseCoordX),
    y : round(mouseCoordY)
  }
  return {
    x : mouseRoundedCoords.x * this.pixelsPerUnit,
    y : mouseRoundedCoords.y * this.pixelsPerUnit
  }
}
}