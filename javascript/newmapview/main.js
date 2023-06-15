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
    Degree.courses[code] = Object.assign(new Course, Degree.courses[code]);
  }
}
