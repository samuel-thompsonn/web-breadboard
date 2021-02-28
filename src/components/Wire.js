const WIRE_WIDTH = 3.5;

class Wire extends Component {

  constructor(x1,y1,x2,y2) {
    super();
    this.COMPONENT_TYPE = "WIRE";
    this.startPin = new ReceivingPin(x1,y1,SIGNAL_NONE);
    this.startPin.addListener(this);
    
    this.endPin = new ReceivingPin(x2,y2,SIGNAL_NONE);
    this.endPin.addListener(this);
  }
  
  //Overridden method
  reactToPinChange(otherPin) {
    //Pins connected by a wire react to each other.
    //Additionally, a wire may want to keep track of the state of its pins so that it can 
    // draw itself in a powered or unpowered state.
  }

  //Overridden method
  reactToSourceChange(pin, newSourcePin) {
      if (this.startPin.needsSource()) {
        this.startPin.setSourcePin(newSourcePin);
      }
      if (this.endPin.needsSource()) {
        this.endPin.setSourcePin(newSourcePin);
      }
    // else {
    //   console.log("Refused to change source pin because this wire has a source already.");
    // }
  }
  
  getStartPin() {
    return this.startPin;
  }
  
  getEndPin() {
    return this.endPin;
  }

  printSelf() {
    console.log("wire");
  }

  drawSelf() {
    super.drawSelf();
    stroke(this.startPin.getSignalColor());
    strokeWeight(2 * WIRE_WIDTH);
    line(this.startPin.getLocation().x,this.startPin.getLocation().y,this.endPin.getLocation().x,this.endPin.getLocation().y);

  }

  //Overridden method
  getPins() {
    let returnedPins = [];
    returnedPins.push(this.startPin);
    returnedPins.push(this.endPin);
    return returnedPins;
  }

  //Overridden method
  getClone() {
    return new Wire(this.startPin.getLocation().x,this.startPin.getLocation().y,this.endPin.getLocation().x,this.endPin.getLocation().y);
  }
  
  getJSON() {
    return {
      type : this.COMPONENT_TYPE,
      x1 : this.startPin.getLocation().x,
      y1 : this.startPin.getLocation().y,
      x2 : this.endPin.getLocation().x,
      y2 : this.endPin.getLocation().y
    };
  }

  pointInBounds(x,y) {
    let x1 = this.startPin.getLocation().x;
    let y1 = this.startPin.getLocation().y;
    let x2 = this.endPin.getLocation().x;
    let y2 = this.endPin.getLocation().y;
    let minX = min(x1,x2);
    let maxX = max(x1,x2);
    if (x < minX && x > maxX) {
      return false;
    }
    if (this.startPin.getLocation().x == this.endPin.getLocation().x) {
      let topX = min(this.startPin.getLocation().y,this.endPin.getLocation().y);
      let bottomX = max(this.startPin.getLocation().y,this.endPin.getLocation().y);
      return (x > this.startPin.getLocation().x - WIRE_WIDTH && x < this.startPin.getLocation().x + WIRE_WIDTH &&
              y > topX && y < bottomX);
    }
    else {
      let slope = (y2 - y1) / (x2 - x1);
      let targetY = (slope * (x - x1)) + y1;
      let diffY = y - targetY;
      return (diffY >= -1 * WIRE_WIDTH && diffY <= WIRE_WIDTH);
    }
  }

  resetConnections() {
    this.startPin.clearListeners();
    this.endPin.clearListeners();
    this.startPin = new ReceivingPin(this.startPin.getLocation().x,this.startPin.getLocation().y,SIGNAL_NONE);
    this.startPin.addListener(this);
    
    this.endPin = new ReceivingPin(this.endPin.getLocation().x,this.endPin.getLocation().y,SIGNAL_NONE);
    this.endPin.addListener(this);
  }

}