class GeneratingPin extends Pin {

  constructor(x,y,signal) {
    super(x,y,signal);
    this.myWidth = 20;
  }

  //Overridden method
  reactToPinChange(otherPin) {
    return false;
  }
  
  //Overriden method
  drawSelf() {
    super.drawSelf();
    let location = super.getLocation();
    rect(location.x - (this.myWidth / 2), location.y - (this.myWidth / 2), this.myWidth, this.myWidth);
  }

  needsSource(originalRequester) {
    //Generating pins don't need a source
    return false;
  }

  getSource() {
    return this;
  }

  printSelf() {
    console.log("generating pin");
  }
}