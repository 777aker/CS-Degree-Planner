// setup the planning area
function planningAreaSetup() {
  // connect dragging capability to emptry course holders
  document.querySelectorAll('.empty-course-holder').forEach(course => {
    addCourseEvents(course);
  });
}

// add all events necessary to an empty
function addCourseEvents(course) {
  course.addEventListener('drop', courseDrop);
  course.addEventListener('dragover', courseDragOver);
  course.addEventListener('dragstart', courseDragStart);
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

    } else if(dragSrcElement.classList.contains('degree-course')) {
      addCourse(this.parentElement);
      let courseCode = e.dataTransfer.getData('text/html');
      this.innerHTML = courseCode + ' : ' + degreeJSON.courses[courseCode].credits;
      this.setAttribute('class', 'course');
      this.setAttribute('coursecode', courseCode);

      dragSrcElement.setAttribute('draggable', 'false');
      dragSrcElement.setAttribute('class', 'degree-no-drag');
    }
  } else if(this.classList.contains('course')) {

  }

  return false;
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

    e.dataTransfer.effectAllowed = 'copy';
    e.dataTransfer.setData('text/html', this.id);
  } else if(this.classList.contains('empty-course-holder')) {
    e.preventDefault();
  }
  return false;
}
