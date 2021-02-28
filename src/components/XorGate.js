class XorGate extends LogicGate {

	constructor(outputX,outputY) {
		super(outputX,outputY);
		this.COMPONENT_TYPE = XORGATE_CODE;
		this.myText = "XOR";
	}
	
	//Overridden method
	evaluateOutput() {
		let firstInput = this.myInputs[0].getSignal();
		let secondInput = this.myInputs[1].getSignal();
		if (firstInput == secondInput) {
			this.myOutput.setSignal(SIGNAL_OFF);
			return;
		}
		this.myOutput.setSignal(SIGNAL_ON);
	}

	//Overridden method
	getClone() {
		return new XorGate(this.myOutput.getLocation().x,this.myOutput.getLocation().y);
	}
}