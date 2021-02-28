class OrGate extends LogicGate {

	constructor(outputX,outputY) {
		super(outputX,outputY);
		this.COMPONENT_TYPE = ORGATE_CODE;
		this.myText = "OR";
	}
	
	//Overridden method
	evaluateOutput() {
		for (let input of this.myInputs) {
			if (input.getSignal() == SIGNAL_ON) {
				this.myOutput.setSignal(SIGNAL_ON);
				return;
			}
		}
		this.myOutput.setSignal(SIGNAL_OFF);
	}

	//Overridden method
	getClone() {
		return new OrGate(this.myOutput.getLocation().x,this.myOutput.getLocation().y);
	}
}