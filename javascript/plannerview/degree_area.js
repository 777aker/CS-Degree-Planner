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
  degreeSelected.innerHTML = degreeName + ' Requirements';
  degreeArea.appendChild(degreeSelected);
  degreeArea.appendChild(requirementsCompleted);

  // populate each requirement
  Object.keys(degreeJSON.requirements).forEach(key => createRequirement(key));

  checkRequirements();
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

  // add a description to the requirement
  createRequirementDescription(degreeJSON.requirements[key], courseHolder);

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

// give a requirement a description
function createRequirementDescription(requirement, parent) {
  let text;
  switch(requirement.type) {
    case 'Course':
    case 'Sequence':
      if(requirement.number == 1) {
        text = 'Complete 1 ' + requirement.type;
      } else if(requirement.number == requirement.courses.length) {
        text = 'Complete Every ' + requirement.type;
      } else {
        text = 'Complete ' + requirement.number + ' ' + requirement.type + 's';
      }
      if(requirement.type == 'Sequence') {
        text += '<br>';
        requirement.sequences.forEach(sequence => {
          text += '[ ';
          sequence.forEach(course => {
            text += course;
            text += ' and ';
          });
          text = text.slice(0, -4);
          text += '] <br>';
        });
        text = text.slice(0, -5);
      }
      break;
    case 'Credits':
      text = 'Complete ' + requirement.number + ' ' + requirement.type;
      break;
    default:
      console.log('requirement not handled');
  }

  let description = createP(text);
  description.parent(parent);
  // for some other guys to populate
  let completed = createP('');
  completed.parent(parent);
  completed.class('requirement-completion');
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
  addDegreeCourseEvents(courseP.elt);
}

// add events to degree course
function addDegreeCourseEvents(course) {
  course.addEventListener('dragstart', degreeCourseDragStart);
  course.addEventListener('dragend', degreeCourseDragEnd);

  course.addEventListener('mouseover', function() {
    courseHover(course.id);
  });
}

const testingMobile = document.querySelector('#more-course-info');

// when you start dragging an element
function degreeCourseDragStart(e) {
  this.style.opacity = '0.4';

  dragSrcElement = this;

  // TODO: thought this would look nice but it doesn't
  //new DragCircle();

  e.dataTransfer.effectAllowed = 'move';
  e.dataTransfer.setData('text/html', this.id);

  colorSemesters(this.id);
}

// when you stop dragging an element
function degreeCourseDragEnd(e) {
  this.style.opacity = '1';

  cleanUpDragEnd();
}

// check if degree requirements fulfilled
function checkRequirements() {
  totalRequirementsComplete = 0;
  totalRequirementsInProgress = 0;
  totalRequirementsPlanned = 0;

  let completedElements = document.querySelectorAll('.course');
  // oof, now comes the complicated part
  document.querySelectorAll('.degree-requirement').forEach(requirementElt => {
    let requirement = degreeJSON.requirements[requirementElt.getAttribute('requirementkey')];
    switch(requirement.type) {
      case 'Course':
      case 'Credits':
        checkNumberRequirement(requirement, requirementElt, completedElements);
        break;
      case 'Sequence':
        checkSequenceRequirement(requirement, requirementElt, completedElements);
        break;
      default:
        console.log('Not accounted for: ' + requirement.type);
    }
  });

  updateRequirementsCompletion();
}

// update requirement completion
const requirementsCompleted = document.querySelector('#requirements-completed');
let totalRequirementsComplete;
let totalRequirementsInProgress;
let totalRequirementsPlanned;
function updateRequirementsCompletion() {
  requirementsCompleted.innerHTML = '';

  let totalRequirements = Object.keys(degreeJSON.requirements).length;

  let completed = createElement(
    'h2',
    totalRequirementsComplete + ' / ' + totalRequirements + ' Completed'
  );
  completed.class('requirement-completion-display');
  completed.parent(requirementsCompleted);

  let inProgress = createElement(
    'h2',
    totalRequirementsInProgress + ' In Progress'
  );
  inProgress.class('requirement-completion-display');
  inProgress.parent(requirementsCompleted);

  let planned = createElement(
    'h2',
    int(totalRequirementsInProgress + totalRequirementsPlanned)
    + ' / ' + int(totalRequirements - totalRequirementsComplete) + ' left Planned'
  );
  planned.class('requirement-completion-display');
  planned.parent(requirementsCompleted);
}

// function for figuring out if you've met the number of whatever needed to complete the requirement
function checkNumberRequirement(requirement, element, completed) {
  // requirement completed in progress or planned
  let totalCompleted = 0;
  let totalInProgress = 0;
  let totalPlanned = 0;

  //console.log(Object.keys(requirement));

  completed.forEach(completedElt => {
    let counts = false;
    if(requirement.additional_count !== undefined) {
      switch(requirement.additional_count[0]) {
        case 'coursecode':
          counts = completedElt.getAttribute('coursecode').slice(0,4) == requirement.additional_count[1];
          break;
        case 'requirement':
          counts = degreeJSON.requirements[requirement.additional_count[1]].courses.includes(completedElt.getAttribute('coursecode'));
          break;
        default:
          console.log('additional not accounted for');
          console.log(requirement);
      }
    }
    let someList = addCourseCompletion(requirement, completedElt, counts);
    totalCompleted += someList[0];
    totalInProgress += someList[1];
    totalPlanned += someList[2];
  });
  // now actually handle the requirement
  if(totalCompleted >= requirement.number) {
    requirementCompleted(element);
  } else if(totalInProgress + totalCompleted >= requirement.number) {
    requirementInProgress(element);
  } else if(totalInProgress + totalCompleted + totalPlanned >= requirement.number) {
    requirementPlanned(element);
  } else {
    requirementIncomplete(element, totalInProgress + totalCompleted + totalPlanned, requirement);
  }
}

// this is the annoying function for figuring out if you've completed a sequence requirement
function checkSequenceRequirement(requirement, element, completed) {
  let sequenceCompletion = [];
  let sequenceInProgress = [];
  let sequencePlanned = []
  let sequenceLength = requirement.sequences.length;
  // keep track of every sequence and if we've completed that sequence
  for(let i = 0; i < sequenceLength; i++) {
    sequenceCompletion.push(0);
    sequenceInProgress.push(0);
    sequencePlanned.push(0);
  }
  // figure out which sequences are completed and which aren't
  completed.forEach(completedElt => {
    let courseCode = completedElt.getAttribute('coursecode');
    if(requirement.courses.includes(courseCode)) {
      for(let i = 0; i < sequenceLength; i++) {
        if(requirement.sequences[i].includes(courseCode)) {
          let order = completedElt.parentElement.getAttribute('order');
          if(order < currentSemester) {
            sequenceCompletion[i] += 1;
          } else if(order == currentSemester) {
            sequenceInProgress[i] += 1;
          } else {
            sequencePlanned[i] += 1;
          }
        }
      }
    }
  });
  // now do normal stuff
  // check if you've completed enough sequences to say this is complete
  let completion = 0;
  let inProgress = 0;
  let planned = 0;
  for(let i = 0; i < sequenceLength; i++) {
    if(sequenceCompletion[i] >= requirement.sequences[i].length) {
      completion += 1;
    } else if(sequenceCompletion[i] + sequenceInProgress[i] >= requirement.sequences[i].length) {
      inProgress += 1;
    } else if(sequenceCompletion[i] + sequenceInProgress[i] + sequencePlanned[i] >= requirement.sequences[i].length) {
      planned += 1;
    }
  }
  // update the requirement
  if(completion >= requirement.number) {
    requirementCompleted(element);
  } else if(completion + inProgress >= requirement.number) {
    requirementInProgress(element);
  } else if(completion + inProgress + planned >= requirement.number) {
    requirementPlanned(element);
  } else {
    requirementIncomplete(element, completion + inProgress + planned, requirement);
  }
}

// easy gg
function addCourseCompletion(requirement, completedElt, counts=false) {
  let totalCompleted = 0;
  let totalInProgress = 0;
  let totalPlanned = 0;

  // what you add to the total depending on the type of requirement
  let numberAdd;
  if(requirement.type == 'Course') {
    numberAdd = 1;
  } else {
    let jsonCourse = degreeJSON.courses[completedElt.getAttribute('coursecode')];
    // default if not actually in our degree json is 3 credits cause that's most common so most likely to be write
    if(jsonCourse == undefined) {
      numberAdd = 3;
    } else {
      numberAdd = int(jsonCourse.credits);
    }
  }
  // if the course is in our plan add it correctly
  if(requirement.courses.includes(completedElt.getAttribute('coursecode')) || counts) {
    if(completedElt.parentElement.getAttribute('order') < currentSemester) {
      totalCompleted += numberAdd;
    } else if(completedElt.parentElement.getAttribute('order') == currentSemester) {
      totalInProgress += numberAdd;
    } else {
      totalPlanned += numberAdd;
    }
  }

  return [totalCompleted, totalInProgress, totalPlanned];
}

// these functions are actually pretty straight forward
// right now they just color the requirement
// maybe in the future they'll involve more so they're here
function requirementCompleted(element) {
  element.nextSibling.querySelector('.requirement-completion').innerHTML = '';
  element.style.backgroundColor = Colors.complete;

  totalRequirementsComplete += 1;
}

function requirementInProgress(element) {
  element.nextSibling.querySelector('.requirement-completion').innerHTML = '';
  element.style.backgroundColor = Colors.inProgress;

  totalRequirementsInProgress += 1;
}

function requirementPlanned(element) {
  element.nextSibling.querySelector('.requirement-completion').innerHTML = '';
  element.style.backgroundColor = Colors.planned;

  totalRequirementsPlanned += 1;
}

// changed how incomplete works this is why we do this
function requirementIncomplete(element, number, requirement) {
  element.nextSibling.querySelector('.requirement-completion').innerHTML = number + '/' + requirement.number + ' in planner';
  element.style.backgroundColor = Colors.incomplete;
}
