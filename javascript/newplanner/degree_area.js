// button for showing the degree selection form
const degreeButton = document.querySelector('#menu-select-degree');
degreeButton.addEventListener('click', function() {
  document.querySelector('#select-degree-form').style.display = 'flex';
});

// form for selecting a degree
const degreeSelectorForm = document.querySelector('#select-degree-form');
function degreeSelectorSetup() {
  // TODO
  // temporary? load CS degree by default
  degreeName = 'CS BS Degree';
  degreeJSON = loadJSON(
    'https://777aker.github.io/CS-Degree-Planner/jsons/Computer-Science-BS-electives.json',
    processJSON
  );
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
  Object.keys(degreeJSON.requirements).forEach(key => createRequirement(key));
}

// create a requirement
function createRequirement(key) {
  // add the requirement to the degree area
  let requirement = createButton(key.replace(/_/g, ' '));
  requirement.parent(degreeArea);
  requirement.class('degree-requirement');
  requirement.attribute('requirementkey', key);

  // div holding the courses for this requirement
  let courseHolder = createDiv();
  courseHolder.class('course-holder');
  courseHolder.parent(degreeArea);
  courseHolder.attribute('style', 'display: none');

  // put each course under the requirement
  degreeJSON.requirements[key].courses.forEach(courseCode => createCourse(courseCode, courseHolder));

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
}

// create a course under a requirement
function createCourse(courseCode, courseHolder) {
  let course = degreeJSON.courses[courseCode];

  let courseP;
  if(course !== undefined) {
    courseP = createP(
      courseCode + ' : ' + course.credits + ' credits'
      + '<br>'
      + course.name
    );
  } else {
    courseP = createP(courseCode);
  }

  courseP.class('degree-course');
  courseP.parent(courseHolder);
  courseP.attribute('draggable', 'true');
  courseP.attribute('id', courseCode);

  // connect dragging events
  courseP.elt.addEventListener('dragstart', degreeCourseDragStart);
  courseP.elt.addEventListener('dragend', degreeCourseDragEnd);
}

// when you start dragging an element
function degreeCourseDragStart(e) {
  this.style.opacity = '0.4';

  dragSrcElement = this;

  e.dataTransfer.effectAllowed = 'move';
  e.dataTransfer.setData('text/html', this.id);

  colorSemesters(this.id);
}

// when you stop dragging an element
function degreeCourseDragEnd(e) {
  this.style.opacity = '1';

  resetSemesters();

  checkRequirements();
}

// check if degree requirements fulfilled
function checkRequirements() {
  let completedElements = document.querySelectorAll('.course');
  // oof, now comes the complicated part
  document.querySelectorAll('.degree-requirement').forEach(requirementElt => {
    let requirement = degreeJSON.requirements[requirementElt.getAttribute('requirementkey')];
    switch(requirement.type) {
      case 'Course':
        checkCourseRequirement(requirement, requirementElt, completedElements);
        break;
      case 'Credits':
        checkCreditsRequirement(requirement, requirementElt, completedElements);
        break;
      case 'Sequence':
        checkSequenceRequirement(requirement, requirementElt, completedElements);
        break;
      default:
        console.log('Not accounted for: ' + requirement.type);
    }
  });
}

function checkCourseRequirement(requirement, element, completed) {
  let totalCompleted = 0;
  let totalInProgress = 0;
  let totalPlanned = 0;
  completed.forEach(completedElt => {
    if(requirement.courses.includes(completedElt.getAttribute('coursecode'))) {
      console.log(currentSemester);
      console.log(element.parentElement.getAttribute('order'));
      console.log(element.parentElement);
      if(completedElt.parentElement.getAttribute('order') < currentSemester) {
        totalCompleted += 1;
      } else if(completedElt.parentElement.getAttribute('order') == currentSemester) {
        totalInProgress += 1;
      } else {
        totalPlanned += 1;
      }
    }
  });
  if(totalCompleted >= requirement.number) {
    requirementCompleted(element);
  } else if(totalInProgress + totalCompleted >= requirement.number) {
    requirementInProgress(element);
  } else if(totalInProgress + totalCompleted + totalPlanned >= requirement.number) {
    requirementPlanned(element);
  } else {
    requirementIncomplete(element);
  }
}

function checkCreditsRequirement(requirement, element, completed) {
  
}

function checkSequenceRequirement(requirement, element, completed) {

}

function requirementCompleted(requirement) {
  requirement.style.backgroundColor = Colors.complete;
}

function requirementInProgress(requirement) {
  requirement.style.backgroundColor = Colors.inProgress;
}

function requirementPlanned(requirement) {
  requirement.style.backgroundColor = Colors.planned;
}

function requirementIncomplete(requirement) {
  requirement.style.backgroundColor = Colors.incomplete;
}
