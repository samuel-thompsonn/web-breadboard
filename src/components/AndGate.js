class AndGate extends LogicGate {

	constructor(outputX,outputY) {
		super(outputX,outputY);
		this.COMPONENT_TYPE = ANDGATE_CODE;
		this.myText = "AND";
	}
	
	//Overridden method
	evaluateOutput() {
		for (let input of this.myInputs) {
			if (input.getSignal() == SIGNAL_OFF) {
				this.myOutput.setSignal(SIGNAL_OFF);
				return;
			}
		}
		this.myOutput.setSignal(SIGNAL_ON);
	}

	//Overridden method
	getClone() {
		return new AndGate(this.myOutput.getLocation().x,this.myOutput.getLocation().y);
	}
}