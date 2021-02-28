//A subcircuit that can be modified from the inside and can have its appearance modified.
class SubCircuitTemplate extends SubCircuit {

	constructor(name) {
		//For each input, there is a corresponding receiver
		// that gets displayed to the public
		//For each output, there is a corresponding output
		// that gets displayed to the public.
		super(0,0,name);
		this.myCameraX = 0;
		this.myCameraY = 0;
		this.wirePlacingStatus = 0;
		this.firstWirePoint = {};
	}

	clearContents() {
		//Exists for readability, and in case
		// initialization and clearing the board become different.
		this.initializeContents();
	}

	reactToPoke(x,y) {
		let gridCoords = this.getGridCoords(x,y);
    for (let pin of this.myComponents) {
      pin.reactToPoke(x,y,gridCoords.x,gridCoords.y);
    }
	}

	doPinInteractions() {
	  let pinModified = true;
	  while (pinModified) {
	    pinModified = this.doInteractionLoop(this.getPins());
	  }
	}

	getPins() {
		let pinList = [];
	  for (let component of this.myComponents) {
	  	for (let pin of component.getPins()) {
	  		pinList.push(pin);
	  	}
	  }
	  return pinList;
	}

	doInteractionLoop(pinList) {
	  let pinModified = false;
	  for (let receivingPin of pinList) {
	    for (let transmittingPin of pinList) {
	      if (receivingPin == transmittingPin) {
	        continue;
	      }
	      if (locationsEqual(transmittingPin.getLocation(),receivingPin.getLocation())) {
          if (receivingPin.reactToPinContact(transmittingPin)) {
            pinModified = true;
          }
	      }
	    }
	  }
	  return pinModified;
	}

	addComponent(component) {
	  this.myComponents.push(component);
		this.doPinInteractions();
	}

	generateInstance(xPos,yPos) {
		//get a clone of every component and internal I/O pin, and put them into
		// the new instance.
		let componentsCopy = [];
		for (let component of this.myComponents) {
			componentsCopy.push(component.getClone());
		}
		let inputsCopy = [];
		let outputsCopy = [];
		//Since the new components don't have their interactions resolved,
		// and the existing ones do, I can just pass in the existing ones and use the new ones.
		// It's risky though, since I might have something here that has a dangling connection to something there.
		let returnedInstance = new SubCircuitInstance(xPos,yPos,this.myComponents,this,this.myName);
		this.initializeContents();
		for (let component of componentsCopy) {
			this.addComponent(component);
		}

		this.doPinInteractions();

		return returnedInstance;
	}

	initializeContents() {
	  this.myInternalInputs = [];
	  this.myPublicInputs = [];
	  this.myPublicOutputs = [];
	  this.myComponents = [];
	}

	getNamedClone(name) {
		let returnedClone = new SubCircuitTemplate(name);
		for (let component of this.myComponents) {
			returnedClone.addComponent(component.getClone());
		}
		returnedClone.doPinInteractions();
		return returnedClone;
	}

	toString() {
		return this.getName();
	}

	getJSON() {
		let returnedInfo = [];
		for (let component of this.myComponents) {
			returnedInfo.push(component.getJSON());
		}
		return {
			name : this.myName,
			components : returnedInfo
		};
	}

	selectMouseDown(x,y) {
		let gridCoords = this.getGridCoords(x,y);
		for (let component of this.myComponents) {
			component.selectMouseDown(x,y,gridCoords.x,gridCoords.y);
		}
	}

	selectMouseUp(x,y) {
		let gridCoords = this.getGridCoords(x,y);
		for (let component of this.myComponents) {
			component.selectMouseUp(x,y,gridCoords.x,gridCoords.y);
		}
	}

	deleteAtPoint(x,y) {
		for (let i = 0; i < this.myComponents.length; i ++) {
			let component = this.myComponents[i];
			if (component.pointInBounds(x,y)) {
				this.myComponents.splice(i,1);
				for (let anyComponent of this.myComponents) {
					anyComponent.resetConnections();
				}
				break;
			}
		}
		this.doPinInteractions();
	}

	createComponent(x,y,selectedComponentType,param) {
	  let roundedPixelCoords = this.getGridCoords(x,y);
	  if (selectedComponentType == INPUT_PIN_CODE) {
	    let inputPin = new InternalInputPin(roundedPixelCoords.x,roundedPixelCoords.y,0);
	    this.addComponent(inputPin);
	  }
	  else if (selectedComponentType == WIRE_CODE) {
	    if (this.wirePlacingStatus == 0) {
	      firstWirePoint = roundedPixelCoords;
	      this.wirePlacingStatus = 1;
	    }
	    else {
  			this.addComponent(new Wire(firstWirePoint.x,firstWirePoint.y,roundedPixelCoords.x,roundedPixelCoords.y));
	      this.wirePlacingStatus = 0;
	    }
	  }
	  else if (selectedComponentType == NORGATE_CODE) {
	    let norGate = new NorGate(roundedPixelCoords.x,roundedPixelCoords.y);
	    this.addComponent(norGate);
	  }
	  else if (selectedComponentType == OUTPUT_PIN_CODE) {
	    let internalOutput = new InternalOutputPin(roundedPixelCoords.x,roundedPixelCoords.y,SIGNAL_NONE);
	    this.addComponent(internalOutput); 
	  }
	  else if (selectedComponentType == NOTEPLAYER_CODE) {
	  	let notePlayer = new NotePlayer(roundedPixelCoords.x,roundedPixelCoords.y,SIGNAL_NONE);
	  	if (param > 0) {
	  		notePlayer.setFrequency(param)
	  	}
	  	this.addComponent(notePlayer);
	  }
	  else if (selectedComponentType == DELAY_GATE_CODE) {
	  	let delayGate = new Delay(roundedPixelCoords.x,roundedPixelCoords.y);
	  	if (param > 0) {
	  		delayGate.setDelay(param);
	  	}
	  	this.addComponent(delayGate);
	  }
	  else if (selectedComponentType == LIGHT_CODE) {
	  	let light = new Light(roundedPixelCoords.x,roundedPixelCoords.y);	  	
	  	if (param > 0) {
	  		light.setColorIndex(param)
	  	}
	  	this.addComponent(light);
	  }
	  else if (selectedComponentType == ANDGATE_CODE) {
	  	let andGate = new AndGate(roundedPixelCoords.x,roundedPixelCoords.y);
	  	this.addComponent(andGate);
	  }
	  else if (selectedComponentType == ORGATE_CODE) {
	  	let orGate = new OrGate(roundedPixelCoords.x,roundedPixelCoords.y);
	  	this.addComponent(orGate);
	  }
	  else if (selectedComponentType == XORGATE_CODE) {
	  	let xorGate = new XorGate(roundedPixelCoords.x,roundedPixelCoords.y);
	  	this.addComponent(xorGate);
	  }
	  else {
	    placeSubcircuit(roundedPixelCoords.x,roundedPixelCoords.y,selectedComponentType);
	  }
	}

	refreshClickStatus() {
		this.wirePlacingStatus = 0;
	}
}