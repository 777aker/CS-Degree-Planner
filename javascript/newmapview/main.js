// the degree info
let Degree;
// setup stuff
function setup() {
  textFont('Gill Sans MT');
  createCanvas(windowWidth, windowHeight);
  frameRate(30);
  Degree = loadJSON(
    'https://777aker.github.io/CS-Degree-Planner/jsons/Computer-Science-BS-electives.json',
    setupDegree
  );
}

// will probably need this later
function setupDegree() {
  for(let code in Degree.courses) {
    Degree.courses[code] = Object.assign(new Course(Degree.courses[code]), Degree.courses[code]);
  }
}

function draw() {
  clear();

  mapNodes.forEach(node => {
    node.draw();
  });
}

function mouseWheel(e) {
  mapNodes.forEach(node => {
    node.zoom(e);
  });
}

function windowResized(e) {
  resizeCanvas(windowWidth, windowHeight);
}

class MapControls {
  x = 0;
  y = 0;
  zoom = 1;
  factor = 0.05;

  zoomEvent(e) {
    let direction = e.deltaY > 0 ? -1 : 1;
    const zoom = 1 * direction * this.factor;

    const wx = (mouseX-this.x)/(width*this.zoom);
    const wy = (mouseY-this.y)/(height*this.zoom);

    this.x -= wx*width*zoom;
    this.y -= wy*height*zoom;
    this.zoom += zoom;
  }
}
