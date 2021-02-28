const SIGNAL_OFF = 0;
const SIGNAL_ON = 1;
const SIGNAL_NONE = 2;
const SIGNAL_ERROR = 3;

class PinListener {
  reactToPinChange(otherPin) {
    //Gets called when the subject pin's signal changes.
    //Should be implemented by extending classes.
  }

  reactToSourceChange(pin, newSourcePin) {
    //Gets called when the subject pin's source changes.
    //Should be implemented by extending classes. Does nothing by default.
  }

  reactToPinDisconnect(pin) {
    //Gets called when the subject pin cuts off the listener relationship.
    //Should be implemented by extending classes. Does nothing by default.
  }
}

class Pin extends PinListener {
  
  constructor(x,y,startingSignal) {
    super();
    this.mySignal = startingSignal;
    this.myListeners = [];
    this.myX = x;
    this.myY = y;
  }
  
  getSignal() {
    return this.mySignal;
  }
  
  setSignal(signal) {
    this.mySignal = signal;
    this.notifyListeners();
  }
  
  addListener(listener) {
    this.myListeners.push(listener);
  }

  removeListener(listener) {
    for (let i = 0; i < this.myListeners.length; i++) {
      let potentialListener = this.myListeners[i];
      if (potentialListener == listener) {
        listener.reactToPinDisconnect(this);
        this.myListeners.splice(i,1);
        return;
      }
    }
  }

  clearListeners() {
    for (let listener of this.myListeners) {
      listener.reactToPinDisconnect();
    }
    this.myListeners = [];
  }
  
  notifyListeners() {
    for (let listener of this.myListeners) {
      if (listener == null) {
        continue;
      }
      listener.reactToPinChange(this);
    }
  }

  notifySourceListeners(newSourcePin) {
    for (let listener of this.myListeners) {
      if (listener != null) {
        listener.reactToSourceChange(this,newSourcePin);
      }
    }
  }

  reactToPinContact(otherPin) {
    //To be implemented by extending classes.
    //Should return true if the pin changes in any way.
    return false;
  }

  needsSource() {
    //Should return true or false depending on 
    // whether this pin is missing a source.
    //To be implemented by extending classes.
  }

  //Remove if possible
  getSource(originalRequester) {
    //To be implemented by extending classes.
    return null;
  }
  
  getLocation() {
    return {
      x : this.myX,
      y : this.myY
    }
  }

  setLocation(x,y) {
    this.myX = x;
    this.myY = y;
  }
  
  drawSelf() {
    stroke(0);
    strokeWeight(1);
    fill(this.getSignalColor(this.mySignal));
    //should be overridden to draw something
  }
  
  getSignalColor() {
    let signal = this.mySignal;
    if (signal == SIGNAL_OFF) {
      return color(0,125,0);
    }
    else if (signal == SIGNAL_ON) {
      return color(0,200,0);
    }
    else {
      return color(200,0,0);
    }
  }

  reactToClick(clickX,clickY) {
    //put reactions to clicks when overriding this.
  }

  printSelf() {
    console.log("pin of unknown type");
  }
}