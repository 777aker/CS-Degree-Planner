// the degree info
let Degree;
// setup stuff
function setup() {
  Degree = loadJSON(
    'https://777aker.github.io/CS-Degree-Planner/jsons/Computer-Science-BS-electives.json',
    setupDegree
  );
}

// will probably need this later
function setupDegree() {
  for(let code in Degree.courses) {
    Degree.courses[code] = Object.assign(new Course(Degree.courses[code].x, Degree.courses[code].y), Degree.courses[code]);
  }
}

function draw() {
  mapNodes.forEach(node => {
    node.draw();
  });
}

function mouseWheel(e) {
  mapNodes.forEach(node => {
    node.zoom(e);
  });
}
