class CircuitFileReader {
	//Requires JSON data in the standardized format produced by this program,
	//With the root at the object containing the subcircuits list.
	getSubCircuits(JSONdata) {

		let subCircuitData = JSONdata.subcircuits;
		let completedSubcircuits = [];
		let incompleteSubcircuits = [];
		//Mark all subcircuits as incomplete.
		for (let i = 0; i < subCircuitData.length; i ++) {
			incompleteSubcircuits.push(subCircuitData[i]);
		}

		//Go through and instantiate any subcircuits that are now well-defined.
		let newTemplateCreated = true;
		while (newTemplateCreated) {
			newTemplateCreated = false;
			for (let i = 0; i < incompleteSubcircuits.length; i ++) {
				let subCircuitResult = this.instantiateCircuitComponents(incompleteSubcircuits[i].name,incompleteSubcircuits[i].components,completedSubcircuits);
				if (subCircuitResult != null) {
					completedSubcircuits.push(subCircuitResult);
					incompleteSubcircuits.splice(i,1);
					i -= 1;
					newTemplateCreated = true;
				}
			}
		}
		return completedSubcircuits;
	}

	instantiateCircuitComponents(name,componentData,completedTemplates) {
		let constructedCircuit = new SubCircuitTemplate(name);
		for (let j = 0; j < componentData.length; j ++) {
			let component = componentData[j];
			if (this.typeIsPrimitive(component.type)) {
				//if component is primitive, instantiate it.
				this.addPrimitiveComponent(component,constructedCircuit);
			}
			else if (component.type == "SUBCIRCUIT") {
				if (name == component.name) {
					//if component is this subcircuit, do not load it.
					continue;
				}
				else {
					let componentTemplate = this.findTemplateWithName(completedTemplates,component.name);
					if (componentTemplate == null) {
						return null;
					}
					constructedCircuit.addComponent(componentTemplate.generateInstance(component.x,component.y));
				}
			}
			
		}
		return constructedCircuit;
	}

	findTemplateWithName(templateList,name) {
		for (let k = 0; k < templateList.length; k ++) {
			let template = templateList[k];
			if (template.getName() == name) {
				return template;
			}
		}
		return null;
	}

	typeIsPrimitive(type) {
		return (type != SUBCIRCUIT_CODE);
	}

	addPrimitiveComponent(component,subCircuit) {
    if (component.type == WIRE_CODE) {
  		subCircuit.addComponent(new Wire(component.x1,component.y1,component.x2,component.y2));
    }
    else {
    	let param = -1;
    	if (component.hasOwnProperty('param')) {
    		param = component.param;
    	}
    	subCircuit.createComponent(component.x,component.y,component.type,param);
    }
	}	

}