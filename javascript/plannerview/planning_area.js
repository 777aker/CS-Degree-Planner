// enum for sorting the semesters
const SeasonValues = {
  spring: .1,
  maymester: .2,
  sessionsACD: .3,
  sessionB: .4,
  augmester: .5,
  fall: .6
}

// setup the planning area
function planningAreaSetup() {
  // connect dragging capability to emptry course holders
  document.querySelectorAll('.empty-course-holder').forEach(course => {
    addCourseEvents(course);
  });
  // trash can events
  setupTrash();
  // add/remove button setup
  setupButtons();
  // setup the semester stuff
  setupSemesters();
}

// setup the semesters with their titles and info
function setupSemesters() {
  const date = new Date();
  const currentYear = date.getFullYear();
  const currentMonth = date.getMonth();

  currentSemester = currentYear;
  // figure out which season we're in
  if(currentMonth < 4) {
    currentSemester += SeasonValues.spring;
  } else if(currentMonth == 4) {
    currentSemester += SeasonValues.maymester;
  } else if(currentMonth == 5) {
    currentSemester += SeasonValues.sessionsACD;
  } else if(currentMonth == 6) {
    currentSemester += SeasonValues.sessionB;
  } else if(currentMonth == 7) {
    currentSemester += SeasonValues.augmester;
  } else {
    currentSemester += SeasonValues.fall;
  }
  // transfer semester = 0 so it's before everything ever
  let transferSemester = document.querySelector('#transfer-courses');
  transferSemester.setAttribute('order', 0);
  // populate 8 semesters ie: 4 year plan
  for(let i = 0; i < 8; i++) {
    let yearValue = int(currentYear + (i + (currentMonth > 4)) / 2);
    if(i % 2 == 0) {
      addSemester('fall', yearValue);
    } else {
      addSemester('spring', yearValue);
    }
  }
}

// setup the add/remove a semester buttons
const addSemesterForm = document.querySelector('#add-semester-form');
function setupButtons() {
  const seasonSelector = document.querySelector('#season-selector');
  const semesterYear = document.querySelector('#semester-year');
  // add semester button
  document.querySelectorAll('.add-semester').forEach(button => {
    button.addEventListener('click', function() {
      addSemesterForm.style.display = 'flex';
      seasonSelector.value = 'spring';
      semesterYear.value = '';
    });
  });
  // remove semester button
  document.querySelectorAll('.remove-semester').forEach(button => {
    button.addEventListener('click', toggleDeleteSemester);
  });
  // buttons on semesters to delete them
  document.querySelectorAll('.delete-semester').forEach(button => {
    button.addEventListener('click', function() {
      deleteSemester(button.parentElement);
      toggleDeleteSemester();
    });
  });
  // button to load file
  document.querySelector('#menu-load').addEventListener('click', uploadCoursework);
  // button to save file
  document.querySelector('#menu-save').addEventListener('click', downloadCoursework);
  // button for showing the degree selection form
  connectFormButton('#menu-select-degree', '#select-degree-form');
}

// downlaods coursework obviously
function downloadCoursework() {
  let courseWorkJSON = {};

  document.querySelectorAll('.course').forEach(courseElt => {
    courseWorkJSON[courseElt.getAttribute('coursecode')] = courseElt.parentElement.getAttribute('order');
  });
  
  saveJSON(courseWorkJSON, 'course_work');
}

// uploads coursework
function uploadCoursework() {

}

// button forms often do
function connectFormButton(btnID, formID) {
  document.querySelector(btnID).addEventListener('click', function() {
    document.querySelector(formID).style.display = 'flex';
  });
}

// toggle delete semester mode
let deleteSemesterToggle = false;
function toggleDeleteSemester() {
  if(deleteSemesterToggle) {
    deleteSemesterOff();
  } else {
    deleteSemesterOn();
  }
  deleteSemesterToggle = !deleteSemesterToggle;
}

// turn off delete semester mode
// hides all the delete buttons
function deleteSemesterOff() {
  document.querySelectorAll('.delete-semester').forEach(button => {
    button.style.display = 'none';
  });
  document.querySelectorAll('.remove-semester').forEach(button => {
    button.innerHTML = 'Remove a Semester';
    button.style.backgroundColor = '';
  });
}

// turn on delete semester mode
// shows all the delete buttons
function deleteSemesterOn() {
  document.querySelectorAll('.delete-semester').forEach(button => {
    button.style.display = 'block';
  });
  document.querySelectorAll('.remove-semester').forEach(button => {
    button.innerHTML = 'Cancel';
    button.style.backgroundColor = '#c0392b';
  });
}

// form you submit to add a semester
document.querySelector('#submit-semester').addEventListener('click', function(){
  addSemesterForm.style.display = 'none';
  addSemester(
    document.querySelector('#season-selector').value,
    document.querySelector('#semester-year').value
  );
});
// add a semester
function addSemester(season, year, orderVal=undefined) {
  // get the year if we don't have it
  if(year == '') {
    let date = new Date();
    year = date.getFullYear();
  }
  // figure out where this semester is
  let order = int(year) + SeasonValues[season];
  if(orderVal != undefined) {
    order = orderVal;
  }
  let newSemester = createDiv();
  newSemester.class('semester');
  newSemester.attribute('order', order);
  // make a delete semester button
  let deleteSemesterBtn = createButton('X');
  deleteSemesterBtn.mouseClicked(function() {
    deleteSemester(newSemester.elt);
    toggleDeleteSemester();
  });
  deleteSemesterBtn.parent(newSemester);
  deleteSemesterBtn.class('delete-semester');
  // title the semester
  let title = createP(capatilize(season) + ' ' + year);
  title.parent(newSemester);
  title.class('semester-title');
  // add the little credits thing to the semester
  let credits = createP('Credits: ' + '0');
  credits.parent(newSemester);
  credits.class('semester-credits');
  // add empty course to the semester
  addCourse(newSemester);

  // once finished making element insert it
  // length -1 because our new semester is part of these classes now
  let semesterList = document.querySelectorAll('.semester');
  for(let i = 0; i < semesterList.length-1; i++) {
    if(float(semesterList[i].getAttribute('order')) > float(order)) {
      semesterList[i].parentElement.insertBefore(newSemester.elt, semesterList[i]);
      return;
    }
  }
  // put the little dingus at the end of the semesters if it's the last
  let buttonHolders = document.querySelectorAll('.button-holder');
  buttonHolders[buttonHolders.length-1].parentElement.insertBefore(
    newSemester.elt,
    buttonHolders[buttonHolders.length-1]
  );
}

// everything you gotta do to delete a semester
function deleteSemester(semester) {
  semester.querySelectorAll('.course').forEach(course => {
    resetDegreeCourse(course.getAttribute('coursecode'));
  });
  semester.remove();

  cleanUpDragEnd();
}

// capatilize first letter of a string
function capatilize(aString) {
  const firstLetter = aString.charAt(0).toUpperCase();
  const remaining = aString.slice(1);
  return firstLetter + remaining;
}

// add all events necessary to a course object
function addCourseEvents(course) {
  course.addEventListener('drop', courseDrop);
  course.addEventListener('dragover', courseDragOver);
  course.addEventListener('dragstart', courseDragStart);
  course.addEventListener('dragend', courseDragEnd);

  course.addEventListener('mouseover', function() {
    courseHover(course.getAttribute('coursecode'));
  });
}

// add an empty to the semester
function addCourse(parent) {
  let newCourse = createDiv();
  newCourse.class('empty-course-holder');
  newCourse.parent(parent);
  newCourse.attribute('draggable', 'true');
  addCourseEvents(newCourse.elt);
}

// what to do when element dropped on you
function courseDrop(e) {
  e.stopPropagation();

  if(this.classList.contains('empty-course-holder')) {
    if(dragSrcElement.classList.contains('course')) {
      dropCourseOnEmpty(this, e.dataTransfer.getData('text/html'));
    } else if(dragSrcElement.classList.contains('degree-course')) {
      dropDegreeCourseOnEmpty(this, e.dataTransfer.getData('text/html'));
    }
  } else if(this.classList.contains('course')) {
    if(dragSrcElement.classList.contains('course')) {
      dropCourseOnCourse(this, e.dataTransfer.getData('text/html'));
    } else if(dragSrcElement.classList.contains('degree-course')) {
      dropDegreeCourseOnCourse(this, e.dataTransfer.getData('text/html'));
    }
  }
  return false;
}

// what happens when you drop a degree course on a planning view course
function dropDegreeCourseOnCourse(target, courseCode) {
  let oldCourseCode = target.getAttribute('coursecode');
  resetDegreeCourse(oldCourseCode);

  updateCourse(target, courseCode);

  noGrabDegreeCourse(dragSrcElement);
}

// what happens when you drop a course on another course
function dropCourseOnCourse(target, courseCode) {
  let switchCode = target.getAttribute('coursecode');

  updateCourse(target, courseCode);
  updateCourse(dragSrcElement, switchCode);
}

// what happens when a course is dropped on an empty course
function dropCourseOnEmpty(target, courseCode) {
  addCourse(target.parentElement);

  updateCourse(target, courseCode);

  dragSrcElement.remove();
}

// what happens when you drop a degree course on an empty object
function dropDegreeCourseOnEmpty(target, courseCode) {
  addCourse(target.parentElement);

  updateCourse(target, courseCode);

  noGrabDegreeCourse(dragSrcElement);
}

// reset a degree course element
function resetDegreeCourse(code) {
  let degreeCourse = document.getElementById(code);
  degreeCourse.setAttribute('draggable', 'true');
  degreeCourse.setAttribute('class', 'degree-course');
}

// set degree course to not usable anymore
function noGrabDegreeCourse(element) {
  element.setAttribute('draggable', 'false');
  element.setAttribute('class', 'degree-no-drag');
}

// how you make an element have the right data
function updateCourse(element, code) {
  if(degreeJSON.courses[code] == undefined) {
    element.innerHTML = code;
  } else {
    element.innerHTML = code + ' : ' + degreeJSON.courses[code].credits;
  }
  element.setAttribute('class', 'course');
  element.setAttribute('coursecode', code);
}

// what to do when element sitting over you
function courseDragOver(e) {
  e.preventDefault();
  return false;
}

// stop it from being draggable
function courseDragStart(e) {
  if(this.classList.contains('course')) {
    this.style.opacity = '0.4';

    dragSrcElement = this;

    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/html', this.getAttribute('coursecode'));

    colorSemesters(this.getAttribute('coursecode'));
  } else if(this.classList.contains('empty-course-holder')) {
    e.preventDefault();
  }
  return false;
}

// when you stop dragging a course
function courseDragEnd(e) {
  this.style.opacity = '1';

  cleanUpDragEnd();
}

// setup trashcan
function setupTrash() {
  let trashcan = document.querySelector('#trashcan');
  trashcan.setAttribute('draggable', 'true');
  trashcan.addEventListener('dragstart', dragStartTrash);
  trashcan.addEventListener('dragover', dragOverTrash);
  trashcan.addEventListener('drop', dropTrash);
  trashcan.addEventListener('dragenter', dragEnterTrash);
  trashcan.addEventListener('dragleave', dragLeaveTrash);
}

// get rid of default nonsense
function dragOverTrash(e) {
  e.preventDefault();
  return false;
}

// when holding element over trash
function dragEnterTrash(e) {
  if(dragSrcElement.classList.contains('course')) {
    this.setAttribute('class', 'menu-option dragging-trash');
  }
}

// when no longer holding element over trash
function dragLeaveTrash(e) {
  this.setAttribute('class', 'menu-option');
}

// when drop into trash
function dropTrash(e) {
  e.stopPropagation();

  this.setAttribute('class', 'menu-option');

  if(!dragSrcElement.classList.contains('course')) {
    return false;
  }

  resetDegreeCourse(dragSrcElement.getAttribute('coursecode'));
  dragSrcElement.remove();

  return false;
}

// don't let users drag trash
function dragStartTrash(e) {
  e.preventDefault();
  return false;
}

// color the semesters based on what you've done
function colorSemesters(code) {
  let completed = false;
  let coursesCompleted = [];

  let semesters = document.querySelectorAll('.semester');

  semesterComplete(semesters[0]);
  semesters[0].querySelectorAll('.course').forEach(course => {
    coursesCompleted.push(course.getAttribute('coursecode'));
  });
  completed = checkPrerequisites(code, coursesCompleted);

  for(let i = 1; i < semesters.length; i++) {
    if(!completed) {
      semesterIncomplete(semesters[i]);
      semesters[i].querySelectorAll('.course').forEach(course => {
        coursesCompleted.push(course.getAttribute('coursecode'));
      });
      completed = checkPrerequisites(code, coursesCompleted);
    } else {
      semesterComplete(semesters[i]);
    }
  }
}

// what to do if it's complete
function semesterComplete(element) {
  element.querySelectorAll('.empty-course-holder').forEach(empty => {
    empty.style.backgroundColor = '#2ecc71';
  });
}

// what to do if incomplete
function semesterIncomplete(element) {
  element.querySelectorAll('.empty-course-holder').forEach(empty => {
    empty.style.backgroundColor = '#e74c3c';
  });
}

// reset semesters
function resetSemesters() {
  document.querySelectorAll('.empty-course-holder').forEach(empty => {
    empty.style.backgroundColor = '';
  });
  document.querySelectorAll('.course').forEach(course => {
    course.style.backgroundColor = '';
  });
}

// check course prerequisites
function checkPrerequisites(code, completed) {
  if(degreeJSON.courses[code] == undefined) {
    return true;
  }
  for(prereqGroup of degreeJSON.courses[code].prerequisites) {
    let groupCheck = false;
    for(prereq of prereqGroup) {
      if(completed.includes(prereq)) {
        groupCheck = true;
      }
    }
    if(!groupCheck) {
      return false;
    }
  }
  return true;
}

// there's somewhere you can call this that's clever
// in main
function updateSemesterCredits() {
  document.querySelectorAll('.semester').forEach(semester => {
    let credits = 0;
    semester.querySelectorAll('.course').forEach(course => {
      let jsonCourse = degreeJSON.courses[course.getAttribute('coursecode')];
      if(jsonCourse == undefined) {
        credits += 3;
      } else {
        credits += int(jsonCourse.credits);
      }
    });
    semester.querySelector('.semester-credits').innerHTML = 'Credits: ' + int(credits);
  });
}

// update course colors with valid or not
function updateCourseColors() {
  let someOrders = {};
  document.querySelectorAll('.semester').forEach(semester => {
    semester.querySelectorAll('.course').forEach(course => {
      someOrders[course.getAttribute('coursecode')] = float(semester.getAttribute('order'));
    });
  });
  document.querySelectorAll('.course').forEach(courseElt => {
    if(courseElt.parentElement.id == 'transfer-courses') {
      return;
    }
    let completed = [];
    let courseCode = courseElt.getAttribute('coursecode');
    for(let code in someOrders) {
      if(someOrders[courseCode] > someOrders[code]) {
        completed.push(code);
      }
    }
    if(checkPrerequisites(courseCode, completed)) {
      courseElt.style.backgroundColor = '';
    } else {
      courseElt.style.backgroundColor = '#c0392b';
    }
  });
}

const courseCodeInfo = document.querySelector('#course-code-info');
const courseTitleInfo = document.querySelector('#course-title-info');
const coursePreqreqsInfo = document.querySelector('#course-prereqs-info');
// when you hover over a degree course do stuff
function courseHover(courseCode) {
  if(courseCode == undefined || courseCode == '')
    return;

  let courseJSON = degreeJSON.courses[courseCode];

  if(courseJSON == undefined) {
    courseCodeInfo.innerHTML = courseCode;
    courseTitleInfo.innerHTML = 'No information on course. Default credits for planner 3';
    coursePreqreqsInfo.innerHTML = "No prerequisite information";
  } else {
    courseCodeInfo.innerHTML = courseCode + ' : ' + courseJSON.credits + ' credits';
    courseTitleInfo.innerHTML = courseJSON.name;
    let prerequisites = '';
    courseJSON.prerequisites.forEach(prereqGroup => {
      prerequisites += '[';
      prereqGroup.forEach(prereq => {
        prerequisites += prereq + ' or ';
      });
      prerequisites = prerequisites.slice(0, -4);
      prerequisites += '] and ';
    });
    prerequisites = prerequisites.slice(0, -4);
    if(prerequisites == '') {
      prerequisites = 'None';
    }
    coursePreqreqsInfo.innerHTML = 'Prerequisites: ' + prerequisites;
  }
}
