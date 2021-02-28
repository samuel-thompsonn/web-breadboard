class Light extends Component {
	constructor(x,y,startingSignal) {
    super();
    this.COMPONENT_TYPE = LIGHT_CODE;
    this.myX = x;
    this.myY = y;
    this.myDiameter = 40;
    this.myInput = new ReceivingPin(x,y,startingSignal);
    this.myInput.addListener(this);
    this.powerOn = false;
    this.lightColors = [];
    this.lightColorIndex = 0;
    this.lightColors.push(color(255),color(255,0,0),color(0,255,0),color(0,0,255),color(255,200,0));
  }

  setColorIndex(index) {
    this.lightColorIndex = index;
  }

	//Overridden method
	drawSelf() {    
    stroke(0);
    strokeWeight(1);
    let lightColor = this.lightColors[this.lightColorIndex];
    let lightStrength = 0.50;
    if (this.powerOn) {
    	lightStrength = 0.90;
    }
    fill(red(lightColor) * lightStrength, green(lightColor) * lightStrength, blue(lightColor) * lightStrength);
    ellipse(this.myX, this.myY, this.myDiameter,this.myDiameter);
	}

	//Overridden method
	reactToPinChange(otherPin) {
		this.powerOn = (otherPin.getSignal() == SIGNAL_ON);
	}

	//Overridden method
	reactToPoke(clickX,clickY,gridX,gridY) {
		if (this.pointInBounds(clickX,clickY)) {
      this.lightColorIndex ++;
			if (this.lightColorIndex >= this.lightColors.length) {
				this.lightColorIndex = 0;
			}
		}
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
      y : this.myY,
      param : this.lightColorIndex
    };
  }

  pointInBounds(x,y) {
    return (dist(x,y,this.myX,this.myY) < (this.myDiameter / 2));
  }

  resetConnections() {
    this.myInput = new ReceivingPin(this.myX,this.myY,SIGNAL_NONE);
  }

  //Overridden method
  isWiringComponent() {
    return false;
  }
}