const degreeButton = document.querySelector('#menu-select-degree');
degreeButton.addEventListener('click', function() {
  document.querySelector('#select-degree-form').style.display = 'flex';
});

let degreeJSON;

const degreeSelectorForm = document.querySelector('#select-degree-form');
function degreeSelectorSetup() {
  let csButton = createButton('CS BS Degree');
  csButton.parent(degreeSelectorForm);
  csButton.attribute('type', 'button');
  csButton.mousePressed(function() {

    csButton.elt.parentElement.style.display = 'none';
    
    degreeJSON = loadJSON(
      'https://777aker.github.io/CS-Degree-Planner/jsons/Computer-Science-BS-electives.json',
      processJSON
    );

    populateDegreeArea('CS BS Degree');

  });
}

function processJSON() {
  degreeJSON.courses.forEach((course, key) => {
    degreeJSON.courses[course.code] = course;
    delete degreeJSON.courses[key];
  });
}

const degreeSelected = document.querySelector('#degree-selected');
function populateDegreeArea(degreeName) {
  degreeSelected.innerHTML = degreeName;
}
