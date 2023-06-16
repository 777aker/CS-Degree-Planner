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
    delete Degree.notes[note].code;
    delete Degree.notes[note].width;
    delete Degree.notes[note].height;
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
  document.body.style.cursor = 'all-scroll';
  mapNodesHolder.pan();
}

function mouseReleased() {
  document.body.style.cursor = '';
}

function windowResized(e) {
  resizeCanvas(windowWidth, windowHeight);
}
