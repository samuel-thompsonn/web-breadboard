//Used as the input pins when designing (inside) a subcircuit.
// When that subcircuit is instantiated, these pins will 
// change to match the inputs to the subcircuit component.
class InternalInputPin extends Component {

	constructor(x,y,signal) {	
		super();
		this.COMPONENT_TYPE = "INPUT";
		this.myPublicSource = null;
		this.myX = x;
		this.myY = y;
		this.myWidth = 30;
		this.myOutput = new GeneratingPin(x,y,signal);
	}
	
	//Overridden method
	reactToPoke(clickX,clickY,gridX,gridY) {
	  //This should be the behavior for global input pins,
	  // but NOT for gate output pins (which are a type of generate pin)
	  if (this.pointInBounds(clickX,clickY)) {
	    if (this.myOutput.getSignal() == 0) {
	      this.myOutput.setSignal(1);
	    }
	    else {
	      this.myOutput.setSignal(0);
	    }
	  }
	}

	setPublicSource(publicSourcePin) {
		this.myPublicSource = publicSourcePin;
		publicSourcePin.addListener(this);
	}

	//Overridden method
	reactToPinChange(otherPin) {
		this.myOutput.setSignal(otherPin.getSignal());
	}

	getType() {
		return this.COMPONENT_TYPE;
	}

	getClone() {
		return new InternalInputPin(this.myX,this.myY,SIGNAL_OFF);
	}

	getJSON() {
    return {
      type : this.COMPONENT_TYPE,
      x : this.myX,
      y : this.myY
    };
  }

  getPins() {
  	let pinList = [];
  	pinList.push(this.myOutput);
  	return pinList;
  }

  drawSelf() {
  	stroke(0);
    strokeWeight(1);
    fill(this.myOutput.getSignalColor());
    rect(this.myX - (this.myWidth / 2),this.myY - (this.myWidth / 2),this.myWidth,this.myWidth);
  }

  pointInBounds(x,y) {
  	let location = this.myOutput.getLocation();
  	return (x > location.x - (this.myWidth / 2) && x < location.x + (this.myWidth / 2) &&
	      		y > location.y - (this.myWidth / 2) && y < location.y + (this.myWidth / 2));
  }

  resetConnections() {
  	this.myOutput.clearListeners();
  }

  //Overridden method
  isWiringComponent() {
  	return false;
  }
}