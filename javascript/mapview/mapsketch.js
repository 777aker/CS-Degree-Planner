// p5js setup
function setup() {
  // create the canvas (subtract 20 so no scroll nonsense)
  createCanvas(windowWidth-20, windowHeight-20);
  // set background color
  background(220);
  // set framerate to 30 anything more is a waste of power
  frameRate(30);
  // set up the edit menu
  editMenuSetUp();
}

function editMenuSetUp() {
  // create add course button
  button = createButton('Add Course');
  button.mousePressed(addCourse);
  button.class("editbuttons");
  button.parent("#dropdown-content");
  // create add node button
  button = createButton('Add Node');
  button.mousePressed(addNode);
  button.class("editbuttons");
  button.parent("#dropdown-content");
  // create draw path button
  button = createButton('Draw Path');
  button.mousePressed(drawPath);
  button.class("editbuttons");
  button.parent("#dropdown-content");
  // create delete button
  button = createButton('Delete Mode');
  button.mousePressed(deleteMode);
  button.class("editbuttons");
  button.parent("#dropdown-content");
  // create move button
  button = createButton('Edit Positions');
  button.mousePressed(editPositions);
  button.class("editbuttons");
  button.parent("#dropdown-content");
}

// function called when user presses add course button
function addCourse() {

}

// function called when user presses add node button
function addNode() {

}

// function called when user presses draw path button
function drawPath() {

}

// function called when user presses delete mode button
function deleteMode() {

}

// function called when user presses edit positions button
function editPositions() {

}

// p5js drawing code called every frame
function draw() {

}

// if the window is resized this function is called
function windowResized() {
  resizeCanvas(windowWidth-20, windowHeight-20);
  // set background color
  background(220);
}

//  key typed event not for special keys use keyPressed for those
function keyTyped() {
  // toggle full screen if f is pressed
  if(key === 'f' || key === 'F') {
    let fs = fullscreen();
    fullscreen(!fs);
  }
}
