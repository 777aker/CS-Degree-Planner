// setup everything that needs to be setup
function setup() {
  textFont('Gill Sans MT');
  frameRate(30);
  createCanvas(windowWidth, windowHeight);

  // All close buttons close your parent object
  document.querySelectorAll('.close-btn').forEach(closeBTN => {
    closeBTN.addEventListener('click', function() {
      closeBTN.parentElement.style.display = 'none';
    });
  });
  // setup the degree selecting area
  degreeSelectorSetup();
  // setup planning area
  planningAreaSetup();
}

function windowResized(e) {
  resizeCanvas(windowWidth, windowHeight);
}

// global variables
// source element dragged
let dragSrcElement;
// degree JSON object for degree information
let degreeJSON;
// name of the selected degree
let degreeName;
// semester we are currently in
let currentSemester;

// whenever we stop dragging elements do some common clean up
// or when we delete a semester
// or when we delete a course
// basically just update all the stuff we need to
function cleanUpDragEnd() {
  resetSemesters();

  checkRequirements();
  updateSemesterCredits();
  updateCourseColors();
}

// handle key presses
function keyPressed() {
  if(keyCode === ESCAPE) {
    closeAll();
  }
}

// close everything
function closeAll() {
  document.querySelectorAll('form').forEach(form => {
    form.style.display = 'none';
  });
  document.querySelectorAll('.course-holder').forEach(courseHolder => {
    courseHolder.style.display = 'none';
  });
}

/* doesn't look good as is, maybe revisit later
let dragCircles = [];
function draw() {
  clear();

  dragCircles.forEach(dragCircle => {
    dragCircle.draw();
  });
}

class DragCircle {
  constructor() {
    this.x = mouseX;
    this.y = mouseY;
    this.radius = 20;
    dragCircles.push(this);
  }

  draw() {
    noStroke();
    fill('rgba(211, 84, 0, .4)');
    circle(this.x, this.y, this.radius);
    this.radius += 20;
    if(this.radius >= 175) {
      dragCircles.splice(dragCircles.indexOf(this), 1);
      delete this;
    }
  }
}
*/
