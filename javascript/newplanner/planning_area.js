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
  // setup the semester stuff
  setupSemesters();
  // add/remove button setup
  setupButtons();
}

// setup the semesters with their titles and info
function setupSemesters() {
  let semesters = document.querySelectorAll('.semester');
  const date = new Date();
  const currentYear = date.getFullYear();
  const currentMonth = date.getMonth();
  currentSemester = currentYear;
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

  semesters[0].setAttribute('order', 0);

  for(let i = 1; i < semesters.length; i++) {
    let title = semesters[i].querySelector('.semester-title');
    if(currentMonth > 4) {
      let yearValue = int(currentYear + i / 2);
      if(i % 2 == 1) {
        title.innerHTML = 'Fall ' + yearValue;
        semesters[i].setAttribute('order', yearValue + SeasonValues.fall);
      } else {
        title.innerHTML = 'Spring ' + yearValue;
        semesters[i].setAttribute('order', yearValue + SeasonValues.spring);
      }
    } else {
      let yearValue = int(currentYear + (i - 1) / 2);
      if(i % 2 == 1) {
        title.innerHTML = 'Spring ' + yearValue;
        semesters[i].setAttribute('order', yearValue + SeasonValues.spring);
      } else {
        title.innerHTML = 'Fall ' + int(yearValue + (i - 1) / 2);
        semesters[i].setAttribute('order', yearValue + SeasonValues.fall);
      }
    }
  }
}

// setup the add/remove a semester buttons
const addSemesterForm = document.querySelector('#add-semester-form');
function setupButtons() {
  const seasonSelector = document.querySelector('#season-selector');
  const semesterYear = document.querySelector('#semester-year');
  document.querySelectorAll('.add-semester').forEach(button => {
    button.addEventListener('click', function() {
      addSemesterForm.style.display = 'flex';
      seasonSelector.value = 'spring';
      semesterYear.value = '';
    });
  });
  document.querySelectorAll('.remove-semester').forEach(button => {
    button.addEventListener('click', toggleDeleteSemester);
  });
  document.querySelectorAll('.delete-semester').forEach(button => {
    button.addEventListener('click', function() {
      deleteSemester(button.parentElement);
      toggleDeleteSemester();
    });
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
function deleteSemesterOn() {
  document.querySelectorAll('.delete-semester').forEach(button => {
    button.style.display = 'block';
  });
  document.querySelectorAll('.remove-semester').forEach(button => {
    button.innerHTML = 'Cancel';
    button.style.backgroundColor = '#c0392b';
  });
}

// add a semester
document.querySelector('#submit-semester').addEventListener('click', function(){
  addSemesterForm.style.display = 'none';
  addSemester(
    document.querySelector('#season-selector').value,
    document.querySelector('#semester-year').value
  );
});
function addSemester(season, year) {
  if(year == '') {
    let date = new Date();
    year = date.getFullYear();
  }

  let order = int(year) + SeasonValues[season];
  let newSemester = createDiv();
  newSemester.class('semester');
  newSemester.attribute('order', order);

  let deleteSemesterBtn = createButton('X');
  deleteSemesterBtn.mouseClicked(function() {
    deleteSemester(newSemester.elt);
    toggleDeleteSemester();
  });
  deleteSemesterBtn.parent(newSemester);
  deleteSemesterBtn.class('delete-semester');

  let title = createP(capatilize(season) + ' ' + year);
  title.parent(newSemester);
  title.class('semester-title');
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
  checkRequirements();
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

  resetSemesters();

  checkRequirements();
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
