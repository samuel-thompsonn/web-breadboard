const TOTAL_WIDTH = 600;
const TOTAL_HEIGHT = 600;

const MOUSE_MODE_POKE = 0;
const MOUSE_MODE_MOVE = 1;
const MOUSE_MODE_DELETE = 2;
const MOUSE_MODE_PLACE = 3;

const INPUT_PIN_CODE = "INPUT";
const WIRE_CODE = "WIRE";
const OUTPUT_PIN_CODE = "OUTPUT";
const NORGATE_CODE = "NORGATE";
const ANDGATE_CODE = "ANDGATE";
const ORGATE_CODE = "ORGATE";
const XORGATE_CODE = "XORGATE";
const NOTEPLAYER_CODE = "NOTEPLAYER";
const DELAY_GATE_CODE = "DELAY";
const SUBCIRCUIT_CODE = "SUBCIRCUIT";
const LIGHT_CODE = "LIGHT";


const RIBBON_HEIGHT = TOTAL_HEIGHT * (1/12);

var RIGHT_ARROW_IMAGE;
var LEFT_ARROW_IMAGE;
var SUBCIRCUIT_ICON;

var mainCanvas;
var wireStatus;
var wiringHidden;
var firstWirePoint;
var pixelsPerUnit;
var selectedComponentType;
var componentIcons;
var componentTray;
var mySubcircuits;
var contextSubcircuit;
var subCircuitIndex;
var mainCanvasLocation;
var inputTextBox;
var filePrompt;
var numPrimitives;
var numCursorTypes;
var mouseMode;
var hudElements;
var subCircuitScroller;
var popupActive = false;
var myPopups;
var myTimedEvents;


function preload() {
  RIGHT_ARROW_IMAGE = loadImage("assets/rightChevronArrow.png");
  LEFT_ARROW_IMAGE = loadImage("assets/leftChevronArrow.png");
  SUBCIRCUIT_ICON = loadImage("assets/subCircuitIcon.png");

  mouseModeIcons = [];
  mouseModeIcons.push(new SelectButton(loadImage("assets/handcursor.png"),"Poke", function() {setMouseMode(MOUSE_MODE_POKE)}));
  mouseModeIcons.push(new SelectButton(loadImage("assets/trashCanIcon.png"),"Delete", function() {setMouseMode(MOUSE_MODE_DELETE)}));
  numCursorTypes = mouseModeIcons.length;
  componentIcons = [];
  componentIcons.push(new SelectButton(loadImage("assets/inputPinIcon.png"),"Input",function() {selectMousePlaceComponent(INPUT_PIN_CODE)}));
  componentIcons.push(new SelectButton(loadImage("assets/outputPinIcon.png"),"Output",function() {selectMousePlaceComponent(OUTPUT_PIN_CODE)}));
  componentIcons.push(new SelectButton(loadImage("assets/wireIcon.png"),"Wire - Requires two clicks to place",function() {selectMousePlaceComponent(WIRE_CODE)}));
  componentIcons.push(new SelectButton(loadImage("assets/NorIcon.png"),"NOR Gate",function() {selectMousePlaceComponent(NORGATE_CODE)}));
  componentIcons.push(new SelectButton(loadImage("assets/andGateIcon.png"),"AND Gate",function() {selectMousePlaceComponent(ANDGATE_CODE)}));
  componentIcons.push(new SelectButton(loadImage("assets/orGateIcon.png"),"OR Gate",function() {selectMousePlaceComponent(ORGATE_CODE)}));
  componentIcons.push(new SelectButton(loadImage("assets/xorGateIcon.png"),"XOR Gate",function() {selectMousePlaceComponent(XORGATE_CODE)}));
  componentIcons.push(new SelectButton(loadImage("assets/notePlayerIcon.png"),"Note Player",function() {selectMousePlaceComponent(NOTEPLAYER_CODE)}));
  componentIcons.push(new SelectButton(loadImage("assets/delayIcon.png"),"Delay",function() {selectMousePlaceComponent(DELAY_GATE_CODE)}));
  componentIcons.push(new SelectButton(loadImage("assets/lightIcon.png"),"Light",function() {selectMousePlaceComponent(LIGHT_CODE)}));
  numPrimitives = componentIcons.length;
  otherIcons = [];
  otherIcons.push(new SquareButton(loadImage("assets/newSubcircuitIcon.png"),"Create New Subcircuit", promptNewSubcircuit));
  otherIcons.push(new SquareButton(loadImage("assets/downloadIcon.png"),"Download Circuits",function() {exportJSON()}));
  otherIcons.push(new SquareButton(loadImage("assets/hideWiringIcon.png"),"Toggle Hiding Wiring",toggleHideWiring));
}

function setup() {
  mainCanvas = createCanvas(600, 600);  
  showInfo();
  wireStatus = 0;
  mouseMode = 0;
  wiringHidden = false;
  selectedComponentType = 0;
  pixelsPerUnit = 25;
  //TODO: Make it so that subcircuits don't need a list of pins,
  // as all information about pins is given by the other lists.
  // mySubcircuit = 
  mainCanvasLocation = {
    x : 50,
    y : 0
  };
  hudElements = [];
  componentTray = new VerticalTray(0,RIBBON_HEIGHT,50,TOTAL_HEIGHT - RIBBON_HEIGHT - 5,color(255),componentIcons);
  hudElements.push(componentTray);
  hudElements.push(new HorizontalTray(0,0,TOTAL_WIDTH * (5/8),RIBBON_HEIGHT,color(200),mouseModeIcons));
  hudElements.push(new HorizontalTray(TOTAL_WIDTH * (5/9),0,TOTAL_WIDTH - (TOTAL_WIDTH * (5/9)),RIBBON_HEIGHT,color(200),otherIcons));
  initializeLoadButton(mainCanvas.position());
  
  mySubcircuits = [];
  subCircuitIndex = 0;
  createNewSubcircuit("main");
  contextSubcircuit = mySubcircuits[subCircuitIndex];
  initializeComponentTray();

  subCircuitScroller = new ListScroller(TOTAL_WIDTH * (2/11),0,TOTAL_WIDTH * (4/12),RIBBON_HEIGHT,"Current Circuit:",mySubcircuits,
    "Edit Previous Circuit",
    function() {
      decrementSubcircuitIndex();
      subCircuitScroller.setIndex(subCircuitIndex);
    }, 
    "Edit Next Circuit",
    function() {
      incrementSubcircuitIndex();
      subCircuitScroller.setIndex(subCircuitIndex);
  });
  hudElements.push(subCircuitScroller);
  myPopups = [];
  myTimedEvents = [];
}

function showInfo() {
  createP("(Note that scrolling on the page is disabled. This is because you can scroll through the side tray if it has enough elements.)")
  createElement('h1',"Controls");
  createElement('h3',"Mouse Options (Top Left)");
  createP("Poke: Allows you to manipulate certain components. Click on an input pin to change its state. Click on a note player to change its pitch. Click on a delay component to change its delay time. Click on a light to change its color.");
  createP("Delete: Allows you to delete a component by clicking on it.");
  createElement('h3',"Components (Side Tray)");
  createP("Select a component and click on the canvas to place it.");
  createP("Input Pin: generates a signal for outgoing wires. An ON signal is bright green, and an OFF signal is dark green.");
  createP("Output Pin: accepts incoming signals and changes color based on what signal it is receiving. Red indicates no signal.")
  createP("Wire: click the start and end point of the wire you want to place. Wires carry signals between their ends.");
  createP("NOR Gate: Has a square output that only activates when both circular inputs are receiving OFF signals.");
  createP("AND Gate: Has a square output that only activates when both circular inputs are receiving ON signals.")
  createP("OR Gate: Has a square output that only activates when at least one circular input is receiving an ON signal.")
  createP("XOR Gate: Has a square output that only activates when exactly one circular input is receiving an ON signal.")
  createP("Note Player: Outputs a sine noise for half a second when powered on.");
  createP("Delay: Has an output that responds with a time delay to changes in the input.");
  createP("Light: Lights up while it is being powered.");
  createP("Subcircuits: If you've created other circuits, you can stamp a copy of them into other circuits. This copy does NOT update as its template circuit is changed. The template circuit's input and output pins will become the inputs and outputs on its stamped representation.");
  createElement('h3',"Other (Top Ribbon)");
  createP("Circuit Scroller: Use the left and right buttons to switch which circuit is on the editing canvas.");
  createP("Create New Subcircuit: Click this button and give a unique name to the new subcircuit, and it will be added to the list of circuits.");
  createP("Download Circuits: Saves all of your circuits as a JSON file and downloads it.");
  createP("Load Circuits: Click the 'Choose File' button and provide the file prompt with a downloaded JSON file to load your previous progress.");
  createElement('h3',"--------------------");
  createP("Made by Samuel Thompson");
}

function draw() {
  background(220);
  handleTimedEvents(myTimedEvents,deltaTime);
  contextSubcircuit.drawSelfAsCanvas(mainCanvasLocation.x,mainCanvasLocation.y);
  contextSubcircuit.reactToHover(mouseX - mainCanvasLocation.x, mouseY - mainCanvasLocation.y);
  for (let tray of hudElements) {
    tray.reactToHover(mouseX,mouseY);
    tray.drawSelf();
  }
  for (let popup of myPopups) {
    popup.drawSelf();
  }
  subCircuitScroller.drawSelf();
}
  
function locationsEqual(point1,point2) {
  return ((point1.x == point2.x) && (point1.y == point2.y));
}

function keyPressed() {
  if (keyCode == 81) {
    toggleHideWiring();
  }
}

function decrementSubcircuitIndex() {
  if (subCircuitIndex > 0) {
    subCircuitIndex -= 1;
    contextSubcircuit = mySubcircuits[subCircuitIndex];
  }
  initializeComponentTray();
}

function incrementSubcircuitIndex() {
  if (subCircuitIndex < mySubcircuits.length - 1) {
    subCircuitIndex += 1;
    contextSubcircuit = mySubcircuits[subCircuitIndex];
  }
  initializeComponentTray();
}

function promptNewSubcircuit() {
  popupActive = true;
  let prompt = new NewCircuitPrompt(mainCanvasLocation.x + 100, mainCanvasLocation.y + 100, 300, 200);
  myPopups.push(prompt);
}

function createNewSubcircuit(circuitName) {
  if (mySubcircuits.some(subCircuit => subCircuit.getName() == circuitName)) {
    console.log("Can't use duplicate circuit name.");
    return;
  }
  mySubcircuits.push(new SubCircuitTemplate(circuitName));
  componentTray.addButton(new SelectButton(SUBCIRCUIT_ICON,"Subcircuit " + circuitName,function() {selectMousePlaceComponent(circuitName)}));
}

function mousePressed() {
  if (popupActive) {
    return;
  }
  for (let element of hudElements) {
    element.reactToClick(mouseX,mouseY);
  }
  if (mouseX > 50 && mouseY > RIBBON_HEIGHT) {
    mousePressedOnBoard();
  }
  else {
    contextSubcircuit.refreshClickStatus();
  }
}

function mouseWheel(event) {
  componentTray.reactToScrolling(event.delta);
  return false;
}

function mousePressedOnBoard() {
  let mouseOnCanvas = {
    x : mouseX - mainCanvasLocation.x,
    y : mouseY - mainCanvasLocation.y
  }
  if (mouseMode == MOUSE_MODE_POKE) {
    contextSubcircuit.reactToPoke(mouseOnCanvas.x,mouseOnCanvas.y);
  }
  else if (mouseMode == MOUSE_MODE_MOVE) {
    contextSubcircuit.selectMouseDown(mouseOnCanvas.x,mouseOnCanvas.y);
  }
  else if (mouseMode == MOUSE_MODE_PLACE) {
    contextSubcircuit.createComponent(mouseOnCanvas.x,mouseOnCanvas.y,selectedComponentType,-1);    
  }
  else if (mouseMode == MOUSE_MODE_DELETE) {
    contextSubcircuit.deleteAtPoint(mouseOnCanvas.x,mouseOnCanvas.y);
  }
}

function mouseReleased() {
  if (mouseMode == MOUSE_MODE_MOVE) {
    contextSubcircuit.selectMouseUp(mouseX - mainCanvasLocation.x,mouseY - mainCanvasLocation.y);
    contextSubcircuit.doPinInteractions();
  }
}

function placeSubcircuit(x,y,name) {
  let circuit = mySubcircuits.find(function(subcircuit) {
    return (subcircuit.getName() == name);
  });
  contextSubcircuit.addComponent(circuit.generateInstance(x,y));
}

function drawTray() {
  stroke(0);
  strokeWeight(1);
  fill(255);
  rect(0,RIBBON_HEIGHT,50,TOTAL_HEIGHT - RIBBON_HEIGHT - 5);
  let i = 0;
  for (let icon of componentIcons) {
    icon.setLocation(5,5+(i*50));
    icon.setDimensions(40,40);
    icon.drawSelf()
    i++;
  }
}

function drawRibbon() {
  stroke(0);
  strokeWeight(1);
  fill(200);
  rect(0,0,width,RIBBON_HEIGHT);
  let buttonOffset = 0;
  for (let i = 0; i < mouseModeIcons.length; i ++) {
    let mouseIcon = mouseModeIcons[i];
    mouseIcon.setLocation(5 + (i * 50),5);
    mouseIcon.setDimensions(40,40);
    mouseIcon.drawSelf();
  }
}

function mousePressedOnRibbon() {
  for (button of mouseModeIcons) {
    button.reactToClick(mouseX,mouseY);
  }
}

function mousePressedOnTray() {
  wireStatus = 0;
  for (button of componentIcons) {
    button.reactToClick(mouseX,mouseY);
  }
}

function  findListIndex(object, list) {
  for (let i = 0; i < list.length; i ++) {
    let listObj = list[i];
    if (object == listObj) {
      return i;
    }
  }
  return -1;
}

function exportJSON() {
  let exportedList = [];
  for (let subcircuit of mySubcircuits) {
    exportedList.push(subcircuit.getJSON());
  }
  saveJSON({
    subcircuits : exportedList
  });
}

//This is a workaround to the fact that the only way I can upload a file in p5 is
// through an HTML file input element created by 'createFileInput'. It's not very 
// pretty.
function initializeLoadButton(canvasPos) {
  descriptionText = createElement('h3',"Load Circuits:");
  descriptionText.position(canvasPos.x + TOTAL_WIDTH * (6/8) + 33, canvasPos.y - 20);
  filePrompt = createFileInput(function(file) {
    handleSelectedFile(file);
  });
  filePrompt.position(canvasPos.x + TOTAL_WIDTH * (6/8) + 10 + 40, canvasPos.y + 5 + 20);
  filePrompt.size(90,80);
}

function handleSelectedFile(file) {
  if (file.subtype == 'json') {
    loadJSON(file.data,handleUploadedJSON,handleUploadError);
  }
  else {
    handleUploadError();
  }
}

function handleUploadedJSON(file) {
  let loadedCircuits = new CircuitFileReader().getSubCircuits(file);
  if (loadedCircuits != null && loadedCircuits.length > 0) {
    mySubcircuits = loadedCircuits;
    subCircuitIndex = 0;
    contextSubcircuit = mySubcircuits[subCircuitIndex];
    subCircuitScroller.setArray(mySubcircuits,subCircuitIndex);
    initializeComponentTray();
  }
}

function initializeComponentTray() {
  componentIcons = componentIcons.slice(0,numPrimitives);
  for (let i = 0; i < mySubcircuits.length; i ++) {
    //You shouldn't have the option to place a subcircuit inside itself.
    if (mySubcircuits[i] == contextSubcircuit) {
      continue;
    }
    componentIcons.push(new SelectButton(SUBCIRCUIT_ICON,"Subcircuit " + mySubcircuits[i].getName(),function() {selectMousePlaceComponent(mySubcircuits[i].getName())}));
  }
  componentTray.setButtons(componentIcons);
}

function handleUploadError() {
  console.log("NOT A JSON FILE");
}

function selectMousePlaceComponent(type) {
  setMouseMode(MOUSE_MODE_PLACE);
  selectedComponentType = type;
}

function setMouseMode(mode) {
  for (let tray of hudElements) {
    tray.deselectAll();
  }
  mouseMode = mode;
}

function addTimedEvent(millisDelay, callback) {
  myTimedEvents.push({
    time : millisDelay,
    event : callback
  });
}

function handleTimedEvents(timedEvents, elapsedTime) {
  for (let i = 0; i < timedEvents.length; i ++) {
    let timer = timedEvents[i];
    timer.time -= elapsedTime;
    if (timer.time < 0) {
      timer.event();
      timedEvents.splice(i,1);
      i --;
    }
  }
}

function showButtonInfo(buttonInfo) {
  stroke(0);
  strokeWeight(1);
  fill(210);
  let fontSize = 20;
  let boxWidth = (buttonInfo.length * (fontSize / 1.5)) + 10;
  rect(55,height - 40, boxWidth,40);
  noStroke();
  fill(0);
  textSize(fontSize);
  text(buttonInfo,65,height-30,boxWidth,40);
}

function toggleHideWiring() {
  wiringHidden = !wiringHidden;
}