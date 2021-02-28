class NotePlayer extends Component {
	constructor(x,y,startingSignal) {
    super();
    this.COMPONENT_TYPE = NOTEPLAYER_CODE;
    this.myX = x;
    this.myY = y;
    this.myDiameter = 30;
    this.playing = false;
    this.mySound = new p5.Oscillator('sine');
    this.mySound.amp(0.3);
    this.setFrequency(300);
    this.maxFrequency = 600;
    this.minFrequency = 100;
    this.myDurationMillis = 500;
    this.remainingDuration = 0;
    this.myInput = new ReceivingPin(x,y,startingSignal);
    this.myInput.addListener(this);
    this.playing = false;
  }

  setFrequency(freq) {
  	this.mySoundFrequency = freq;
  	this.mySound.freq(this.mySoundFrequency);
  }

	//Overridden method
	drawSelf() {    
    stroke(0);
    strokeWeight(1);
    // fill(this.myInput.getSignalColor());
    fill(100,0,100);
    if (this.playing) {
    	fill(200,0,200);

    }
    ellipse(this.myX, this.myY, this.myDiameter,this.myDiameter);
	}

	//Overridden method
	reactToPinChange(otherPin) {
		if (otherPin.getSignal() == SIGNAL_ON) {
			this.playSound();
		}
	}

	playSound() {
		this.mySound.start();
		this.mySound.stop(this.myDurationMillis / 1000);
	}

	//Overridden method
	reactToPoke(clickX,clickY,gridX,gridY) {
		if (this.pointInBounds(clickX,clickY)) {
			if (this.mySoundFrequency >= this.maxFrequency) {
				this.mySoundFrequency = this.minFrequency;
			}
			else {
				this.mySoundFrequency += (this.maxFrequency - this.minFrequency) / 10;
			}
			this.mySound.freq(this.mySoundFrequency);
			console.log("freq: " + this.mySoundFrequency);
			this.playSound();
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
      param : this.mySoundFrequency
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