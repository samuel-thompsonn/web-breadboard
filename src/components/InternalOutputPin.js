//This shouldn't extend receivingPin, since receivingPin is a concrete class.
//Instead, both should extend a common parent.
class InternalOutputPin extends Component {

  constructor(x,y,startingSignal) {
    super();
    this.COMPONENT_TYPE = OUTPUT_PIN_CODE;
    this.myX = x;
    this.myY = y;
    this.myDiameter = 30;
    this.myInput = new ReceivingPin(x,y,startingSignal);
  }

	//Overridden method
	drawSelf() {    
    stroke(0);
    strokeWeight(1);
    fill(this.myInput.getSignalColor());
    ellipse(this.myX, this.myY, this.myDiameter,this.myDiameter);
	}

	getClone() {
		return new InternalOutputPin(this.myX,this.myY,SIGNAL_NONE);
	}

  getType() {
    return this.COMPONENT_TYPE;
  }

  getPins() {
    let pinList = [];
    pinList.push(this.myInput);
    return pinList;
  }

  getJSON() {
    return {
      type : this.COMPONENT_TYPE,
      x : this.myX,
      y : this.myY
    };
  }

  pointInBounds(x,y) {
    return (dist(x,y,this.myX,this.myY) < (this.myDiameter / 2));
  }

  resetConnections() {
    this.myInput = new ReceivingPin(this.myX,this.myY,SIGNAL_NONE);
  }
}