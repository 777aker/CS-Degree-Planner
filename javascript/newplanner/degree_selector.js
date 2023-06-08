// button for showing the degree selection form
const degreeButton = document.querySelector('#menu-select-degree');
degreeButton.addEventListener('click', function() {
  document.querySelector('#select-degree-form').style.display = 'flex';
});

// degree JSON object for degree information
let degreeJSON;
// name of the selected degree
let degreeName;

// form for selecting a degree
const degreeSelectorForm = document.querySelector('#select-degree-form');
function degreeSelectorSetup() {
  // create a button for the cs degree
  // if you want to
  let csButton = createButton('CS BS Degree');
  csButton.parent(degreeSelectorForm);
  csButton.attribute('type', 'button');
  csButton.mousePressed(function() {
    // hide form once done
    csButton.elt.parentElement.style.display = 'none';
    // set degree name
    degreeName = 'CS BS Degree';
    // load degree
    degreeJSON = loadJSON(
      'https://777aker.github.io/CS-Degree-Planner/jsons/Computer-Science-BS-electives.json',
      processJSON
    );
  });
  // make all empty courses draggable
  document.querySelectorAll('.empty-course-holder').forEach(empty => {
    empty.setAttribute('draggable', 'true');

  });
}

// do stuff once degree is loaded
function processJSON() {
  // change keys to be meaningful
  degreeJSON.courses.forEach((course, key) => {
    degreeJSON.courses[course.code] = course;
    delete degreeJSON.courses[key];
  });
  // populate degree area with buttons and such
  populateDegreeArea();
}

// populate degree area with buttons and such
const degreeSelected = document.querySelector('#degree-selected');
const degreeArea = document.querySelector('#degree-area');
function populateDegreeArea() {
  // delete previous data
  degreeArea.innerHTML = '';
  // add degree name
  degreeSelected.innerHTML = degreeName;
  degreeArea.appendChild(degreeSelected);

  /* error doing it this way :/
  degreeJSON.requirements.forEach((requirement, key) => {
    console.log('ur momma');
  });
  */
  // populate each requirement
  Object.keys(degreeJSON.requirements).forEach(key => {
    // add the requirement to the degree area
    let requirement = createButton(key.replace(/_/g, ' '));
    requirement.parent(degreeArea);
    requirement.class('degree-requirement');

    // div holding the courses for this requirement
    let courseHolder = createDiv();
    courseHolder.class('course-holder');
    courseHolder.parent(degreeArea);
    courseHolder.attribute('style', 'display: none');

    // put each course under the requirement
    degreeJSON.requirements[key].courses.forEach(course => {
      let courseP = createP(course);
      courseP.class('course degree-course');
      courseP.parent(courseHolder);
    });

    // display or hide the requirement courses
    requirement.mousePressed(function() {
      if(courseHolder.elt.style.display == 'none') {
        courseHolder.attribute('style', 'display: block');
      } else {
        courseHolder.attribute('style', 'display: none');
      }
    });

    // add a horizontal bar after each requirement
    let hr = document.createElement('hr');
    degreeArea.appendChild(hr);
  });


}
