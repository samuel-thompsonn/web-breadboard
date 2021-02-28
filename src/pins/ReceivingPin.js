class ReceivingPin extends Pin {

  constructor(x,y,startingSignal) {
    super(x,y,startingSignal);
    this.mySource = null;
    this.myName = random(0,1000).toString();
  }

  setSourcePin(otherPin) {
    //You have to make sure to unsubscribe from your previous source pin 
    // if you're switching.
    if (this.mySource == this) {
      return;
    }
    if (this.mySource != null) {
      this.mySource.removeListener(this);      
    }
    this.mySource = otherPin;
    this.setSignal(otherPin.getSignal());
    otherPin.addListener(this);
    this.notifySourceListeners(otherPin);
  }

  //Overridden method
  reactToPinChange(otherPin) {
    super.setSignal(otherPin.getSignal());
  } 

  //Overridden method
  reactToPinDisconnect() {
    this.mySource = null;
    this.setSignal(SIGNAL_NONE);
  }

  //Method that has been expanded
  clearListeners() {
    super.clearListeners();
    this.mySource = null;
  }

  //Overridden method
  reactToPinContact(otherPin) {
    if (this.mySource == null) {
      //I shouldn't connect to a pin that doesn't have a source.
      if (!otherPin.needsSource(this)) {
        this.setSourcePin(otherPin);
        return true;
      }
    }
    return false;
  }

  needsSource(originalRequester) {
    //Receiving pins need a source if
    // they don't have a source.
    let location = this.getLocation();
    if (originalRequester == this) {
      return true;
    }
    if (this.mySource == null) {
      return true;
    }
    if (this.mySource == this) {
      return true;
    }
    return (this.mySource.needsSource(originalRequester));
  }

  //Overridden method
  getSource() {
    return this.mySource;
  }
  
  //Overridden method
  drawSelf() {    
    stroke(0);
    strokeWeight(1);
    fill(super.getSignalColor());
    let location = super.getLocation();
    ellipse(location.x, location.y, 20, 20);
    if (this.mySource != null) {
      let sourceLocation = this.mySource.getLocation();
      stroke(255,255,255,125);
      strokeWeight(2);
      line(location.x,location.y,sourceLocation.x,sourceLocation.y);
      strokeWeight(1);
      fill(0);
      ellipse(sourceLocation.x,sourceLocation.y,10);
    }
  }

  printSelf() {
    console.log("receiving pin at " + this.getLocation().x + ", " + this.getLocation().y);
  }

  setName(name) {
    this.myName = name;
  }

}