class Component extends PinListener {
	drawSelf() {
		for (let pin of this.getPins()) {
			pin.drawSelf();
		}
		//Should be implemented by extending classes.
		// This exists just to give a shared drawSelf() to wires and subcircuits.
	}

	getPins() {
		//Should be implemented to return all of the input and output components of the circuit.
	}

	getClone() {
		//Should be implemented to return a clone of this component, tied to clones of their pins.
	}

	getType() {
		//Should return the standardized code saying what type of component this is.
		return "";
	}

	getJSON() {
		//Should be implemented to return a JSON representation of this component.
	}

	reactToPoke(x,y,gridX,gridY) {
		//Should be implemented to do the reaction to being poked, if there is one.
	}

	reactToHover(x,y,gridX,gridY) {
		//Should be implemented to highlight parts when they are moused over.
	}

	selectMouseDown(x,y,gridX,gridY) {

	}

	selectMouseUp(x,y,gridX,gridY) {

	}

	setLocation(x,y,gridX,gridY) {

	}

	pointInBounds(x,y) {
		return false;
	}

	resetConnections() {
		
	}

	isWiringComponent() {
		//Should be overridden to return false if this component should still appear while wiring is hidden.
		return true;
	}
}