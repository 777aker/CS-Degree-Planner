// the degree info
let Degree;
let mapNodesHolder;
// setup stuff
function setup() {
  textFont('Gill Sans MT');
  createCanvas(windowWidth, windowHeight);
  frameRate(30);

  mapNodesHolder = new MapNodesHolder();

  Degree = loadJSON(
    'https://777aker.github.io/CS-Degree-Planner/jsons/Computer-Science-BS-electives.json',
    setupDegree
  );
}

// will probably need this later
function setupDegree() {
  // needed it immediately actually
  for(let code in Degree.courses) {
    Degree.courses[code] = Object.assign(new Course(Degree.courses[code]), Degree.courses[code]);
  }
  for(let note in Degree.notes) {
    Degree.notes[note] = Object.assign(new Note(Degree.notes[note]), Degree.notes[note]);
  }
}

function draw() {
  clear();

  mapNodesHolder.draw();
}

function mouseWheel(e) {
  mapNodesHolder.zoom(e);
}

function mouseDragged() {
  mapNodesHolder.pan();
}

function mouseReleased() {
  document.body.style.cursor = '';
  mapNodesHolder.mouseReleasedEvent(mapNodesHolder);
}

function windowResized(e) {
  resizeCanvas(windowWidth, windowHeight);
}
