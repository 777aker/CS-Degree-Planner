// p5js setup
function setup() {
  // create the canvas (subtract 20 so no scroll nonsense)
  createCanvas(windowWidth-20, windowHeight-20);
  // set background color
  background(220);
  // set framerate to 30 anything more is a waste of power
  frameRate(30);
  // create add course button
  button = createButton('Add Course');
  button.position(width-100, height-50);
  button.mousePressed(addCourse);
  button.id('addcoursebutton');
}

function addCourse() {

}

// p5js drawing code called every frame
function draw() {

}

// if the window is resized this function is called
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

//  key typed event not for special keys use keyPressed for those
function keyTyped() {
  // toggle full screen if f is pressed
  if(key === 'f' || key === 'F') {
    let fs = fullscreen();
    fullscreen(!fs);
  }
}
