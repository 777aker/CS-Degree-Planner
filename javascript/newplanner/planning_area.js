const SeasonValues = {
  Spring: .1,
  Maymester: .2,
  Summer: .3,
  Fall: .4
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

  semesters[0].setAttribute('order', 0);

  for(let i = 1; i < semesters.length; i++) {
    let title = semesters[i].querySelector('.semester-title');
    if(currentMonth > 4) {
      let yearValue = int(currentYear + i / 2);
      if(i % 2 == 1) {
        title.innerHTML = 'Fall ' + yearValue;
        semesters[i].setAttribute('order', yearValue + SeasonValues.Fall);
      } else {
        title.innerHTML = 'Spring ' + yearValue;
        semesters[i].setAttribute('order', yearValue + SeasonValues.Spring);
      }
    } else {
      let yearValue = int(currentYear + (i - 1) / 2);
      if(i % 2 == 1) {
        title.innerHTML = 'Spring ' + yearValue;
        semesters[i].setAttribute('order', yearValue + SeasonValues.Spring);
      } else {
        title.innerHTML = 'Fall ' + int(yearValue + (i - 1) / 2);
        semesters[i].setAttribute('order', yearValue + SeasonValues.Fall);
      }
    }
  }
}

// setup the add/remove a semester buttons
function setupButtons() {
  document.querySelectorAll('.add-semester').forEach(button => {
    button.addEventListener('click', function() {

    });
  });
  document.querySelectorAll('.remove-semester').forEach(button => {
    button.addEventListener('click', function() {

    });
  });
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
  element.innerHTML = code + ' : ' + degreeJSON.courses[code].credits;
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
  } else if(this.classList.contains('empty-course-holder')) {
    e.preventDefault();
  }
  return false;
}

// when you stop dragging a course
function courseDragEnd(e) {
  this.style.opacity = '1';
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
