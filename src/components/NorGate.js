class NorGate extends LogicGate {

	constructor(outputX,outputY) {
		super(outputX,outputY);
		this.COMPONENT_TYPE = NORGATE_CODE
		this.myText = "NOR";
	}
	
	//Overridden method
	evaluateOutput() {
		for (let input of this.myInputs) {
			if (input.getSignal() == SIGNAL_ON) {
				this.myOutput.setSignal(SIGNAL_OFF);
				return;
			}
		}
		this.myOutput.setSignal(SIGNAL_ON);
	}

	//Overridden method
	getClone() {
		return new NorGate(this.myOutput.getLocation().x,this.myOutput.getLocation().y);
	}
}