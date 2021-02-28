//Cannot be modified from the inside, and behaves like a pocket dimension of wires.
class SubCircuitInstance extends SubCircuit {

	//TODO: Figure out how subcircuit templates can generate immutable 'copies' of themselves.
	constructor(xPos,yPos,components,template,name) {
		super(xPos,yPos,name);
		super.initializeContents();
		this.COMPONENT_TYPE = "SUBCIRCUIT";
		this.myWidth = 50;
		this.myPins = [];
		//For each input, make a corresponding receiver
		// that gets displayed to the public
		this.myPublicInputs = [];
		this.myInternalInputs = [];
		//inputPins must all be InternalInputPin instances.
		//We don't need to push each input pin to the inputs argument, since
		// we already assigned our instance variable to that list earlier.
		this.myInternalOutputs = [];
		//For each output, make a corresponding output
		// that gets displayed to the public.
		this.myPublicOutputs = [];
		this.myComponents = [];
		for (let component of components) {
			this.myComponents.push(component);
  		for (let componentPin of component.getPins()) {
	  		this.myPins.push(componentPin);
	  	}
	  	if (component.getType() == INPUT_PIN_CODE) {
	  		let inputPin = component;
	  		this.myInternalInputs.push(component);
				let newPublicInput = new ReceivingPin(this.getLocation().x,this.getLocation().y + (50 * this.myPublicInputs.length),SIGNAL_NONE);
				this.myPublicInputs.push(newPublicInput);
				inputPin.setPublicSource(newPublicInput);
	  	}
	  	else if (component.getType() == OUTPUT_PIN_CODE) {
	  		let outputPin = component;
	  		let outputReceiver = outputPin.getPins()[0];
				outputPin.getPins()[0].addListener(this);
				this.myInternalOutputs.push(outputReceiver);
				this.myPublicOutputs.push(new GeneratingPin(this.myLocation.x + 50,this.myLocation.y + (50 * this.myPublicOutputs.length),SIGNAL_NONE));
	  	}
		}
		this.myHeight = max(this.myPublicOutputs.length * 50,50);
		this.myTemplate = template;
	}

	//Overridden method
	//This reacts to changes in the internal output pins by making sure
	// that the external output pins always match them.
	reactToPinChange(otherPin) {
		let index = findListIndex(otherPin,this.myInternalOutputs);
		if (index != -1) {
			this.myPublicOutputs[index].setSignal(otherPin.getSignal());
		}
	}

	getClone() {
		return this.myTemplate.generateInstance(this.myLocation.x,this.myLocation.y);
	}

	getJSON() {
		return {
			type :this.COMPONENT_TYPE,
			name : this.myName,
			x : this.getLocation().x,
			y : this.getLocation().y
		}
	}

	pointInBounds(x,y) {
		console.log("Checking subcircuit bounds");
		let myX = this.getLocation().x;
		let myY = this.getLocation().y;
		return (x > myX && x < myX + this.myWidth &&
						y > myY && y < myY + this.myHeight);
	}

	resetConnections() {
		this.myPublicInputs = [];
		for (let input of this.myInternalInputs) {
			let newPublicInput = new ReceivingPin(this.getLocation().x,this.getLocation().y + (50 * this.myPublicInputs.length),SIGNAL_NONE);
			this.myPublicInputs.push(newPublicInput);
			input.setPublicSource(newPublicInput);
		}
		for (let output of this.myPublicOutputs) {
			output.clearListeners();
		}
	}
}