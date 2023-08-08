// global variables
// degree JSON object for degree information
let degreeJSON;
// name of the selected degree
let degreeName;
// semester we are currently in
let currentSemester;
// enum for sorting the semesters
const SeasonValues = {
  transfer: 0,
  spring: .1,
  maymester: .2,
  sessionsACD: .3,
  sessionB: .4,
  augmester: .5,
  fall: .6
}

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
  // setup the nav menu stuff
  navigationSetup();
  // setup planning area
  planningAreaSetup();
  // go ahead and load cs degree
  // TODO: default behavior maybe remove
  degreeName = 'CS BS Degree';
  degreeJSON = loadJSON(
    'https://777aker.github.io/CS-Degree-Planner/jsons/Computer-Science-BS-electives.json',
    populateDegreeArea
  );
}

// whenever we stop dragging elements do some common clean up
// or when we delete a semester
// or when we delete a course
// basically just update all the stuff we need to
function updateAll() {
  //TODO: resetSemesters();

  //TODO: checkRequirements();
  //TODO: updateSemesterCredits();
  //TODO: updateCourseColors();
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

function windowResized(e) {
  resizeCanvas(windowWidth, windowHeight);
}
