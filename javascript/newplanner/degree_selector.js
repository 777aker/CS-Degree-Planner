const degreeButton = document.querySelector('#menu-select-degree');
degreeButton.addEventListener('click', function() {
  document.querySelector('#select-degree-form').style.display = 'flex';
});

let degreeJSON;
let degreeName;

const degreeSelectorForm = document.querySelector('#select-degree-form');
function degreeSelectorSetup() {
  let csButton = createButton('CS BS Degree');
  csButton.parent(degreeSelectorForm);
  csButton.attribute('type', 'button');
  csButton.mousePressed(function() {
    csButton.elt.parentElement.style.display = 'none';
    degreeName = 'CS BS Degree';
    degreeJSON = loadJSON(
      'https://777aker.github.io/CS-Degree-Planner/jsons/Computer-Science-BS-electives.json',
      processJSON
    );
  });
}

function processJSON() {
  degreeJSON.courses.forEach((course, key) => {
    degreeJSON.courses[course.code] = course;
    delete degreeJSON.courses[key];
  });

  populateDegreeArea();
}

const degreeSelected = document.querySelector('#degree-selected');
const degreeArea = document.querySelector('#degree-area');
function populateDegreeArea() {
  degreeSelected.innerHTML = degreeName;

  /* error doing it this way :/
  degreeJSON.requirements.forEach((requirement, key) => {
    console.log('ur momma');
  });
  */
  Object.keys(degreeJSON.requirements).forEach(key => {
    let requirement = createP(key);
    let hr = document.createElement('hr');
    requirement.parent(degreeArea);
    degreeArea.appendChild(hr);
  });
}
