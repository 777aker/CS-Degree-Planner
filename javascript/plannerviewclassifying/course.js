// course area information
let courseHover = document.querySelector('#course-hover');
let dragSrcElement = undefined;
let degreeCourses = {};
// degree and planner courses inherit some commonalities from here
class Course {
  constructor() {
    this.hoverCode = document.querySelector('#course-code-info');
    this.hoverTitle = document.querySelector('#course-title-info');
    this.hoverPrereqs = document.querySelector('#course-prereqs-info');
  }

  mouseOver(self) {
    if(self.code == undefined) {
      if((self.code = self.p5Element.elt.getAttribute('coursecode')) == undefined) {
        return;
      }
      let course;
      if((course = degreeJSON.courses[self.code]) == undefined) {
        return;
      }
      self.credits = course.credits;
      self.name = course.name;
      self.prerequisites = course.prerequisites;
    }

    if(self.credits == undefined) {
      self.hoverCode.innerHTML = self.code;
    } else {
      self.hoverCode.innerHTML = self.code + ' : ' + self.credits + ' credits';
    }

    if(self.name == undefined) {
      self.hoverTitle.innerHTML = 'No title information on course';
    } else {
      self.hoverTitle.innerHTML = self.name;
    }

    if(self.prerequisites == undefined) {
      self.hoverPrereqs.innerHTML = 'No prerequisite information';
    } else {
      let prerequisites = '';
      self.prerequisites.forEach(prereqGroup => {
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
      self.hoverPrereqs.innerHTML = 'Prerequisites: ' + prerequisites;
    }
  }

  courseEvents(self) {
    self.p5Element.elt.addEventListener('mouseover', function(){self.mouseOver(self)});
    self.p5Element.elt.addEventListener('dragstart', self.dragStart);
    self.p5Element.elt.addEventListener('dragover', self.dragOver);
    self.p5Element.elt.addEventListener('dragend', self.dragEnd);
    self.p5Element.elt.addEventListener('drop', self.drop);
  }

  dragStart(e) {
    this.style.opacity = '0.4';

    dragSrcElement = this;

    PlannerCourse.checkPlacement(this.getAttribute('coursecode'));

    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/html', this.getAttribute('coursecode'));

    return;
  }

  dragOver(e) {
    e.preventDefault();

    return;
  }

  dragEnd(e) {
    this.style.opacity = '1';

    let emptys = document.querySelectorAll('.invalid-empty-course');
    for(let i = 0; i < emptys.length; i++) {
      emptys[i].classList.remove('invalid-empty-course');
    }
    emptys = document.querySelectorAll('.valid-empty-course');
    for(let i = 0; i < emptys.length; i++) {
      emptys[i].classList.remove('valid-empty-course');
    }
    PlannerCourse.checkAllCourses();

    return;
  }

  static checkPrerequisites(prerequisites, completed) {
    groups: for(let i = 0; i < prerequisites.length; i++) {
      for(let j = 0; j < prerequisites[i].length; j++) {
        if(completed.includes(prerequisites[i][j])) {
          continue groups;
        }
      }
      return false;
    }
    return true;
  }
}

// courses class in the degree area
class DegreeCourse extends Course {
  constructor(code, jsonCourse, parent) {
    super();
    let courseP;

    if(jsonCourse !== undefined) {
      courseP = createP(
        code + ' : ' + jsonCourse.credits + ' credits'
        + '<br>' + jsonCourse.name
      );
    } else {
      this.code = code;
      courseP = createP(code);
    }

    courseP.class('degree-course');
    courseP.parent(parent);
    courseP.attribute('draggable', 'true');
    courseP.attribute('coursecode', code);

    this.p5Element = courseP;

    degreeCourses[code] = this;

    // connect dragging events
    this.courseEvents(this);
  }

  courseEvents(self) {
    super.courseEvents(self);
  }

  drop(e) {
    e.stopPropagation();
    return;
  }

  disable() {
    this.p5Element.attribute('class', 'disabled-degree-course');
    this.p5Element.attribute('draggable', false);
  }

  enable() {
    this.p5Element.attribute('class', 'degree-course');
    this.p5Element.attribute('draggable', true);
  }
}

// courses class in the planning area
class PlannerCourse extends Course {
  constructor(parent) {
    super();

    this.p5Element = createDiv();
    this.p5Element.class('empty-course-holder');
    this.p5Element.parent(parent);
    this.p5Element.attribute('draggable', 'true');
    this.courseEvents(this);
  }

  static destructor(element) {
    element.remove();
  }

  // check where courses can and can't go
  static checkPlacement(code) {
    // keep track of completed courses
    let coursesCompleted = [];
    // variable saying if we've met it or not
    let met = false;
    // get prerequisites from degreeJSON
    let prerequisites;
    try {
      prerequisites = degreeJSON.courses[code].prerequisites;
    } catch {
      prerequisites = [];
    }
    // iterate through semester objects
    let orders = Object.keys(semesters).sort();
    for(let i = 0; i < orders.length; i++) {
      let semesterObj = semesters[orders[i]];
      coursesCompleted += semesterObj.getCourses();
      // if it's a transfer semester just say valid and move on
      if(orders[i] <= 0) {
        semesterObj.valid();
        met = Course.checkPrerequisites(prerequisites, coursesCompleted);
        continue;
      }
      // if we haven't met requirements check if we have and make semester invalid
      if(!met) {
        semesterObj.invalid();
        met = Course.checkPrerequisites(prerequisites, coursesCompleted);
      } else {
        semesterObj.valid();
      }
    }
  }

  static checkAllCourses() {
    let completed = [];
    let orders = Object.keys(semesters).sort();
    for(let i = 0; i < orders.length; i++) {
      if(orders[i] <= 0) {
        completed += semesters[orders[i]].getCourses();
        continue;
      }
      semesters[orders[i]].checkCourses(completed);
      completed += semesters[orders[i]].getCourses();
    }
  }

  courseEvents(self) {
    super.courseEvents(self);
  }

  dragStart(e) {
    if(this.classList.contains('empty-course-holder')) {
      e.preventDefault();
      return;
    }

    super.dragStart(e);
  }

  drop(e) {
    e.stopPropagation();

    let thiscode = e.dataTransfer.getData('text/html');

    if(dragSrcElement.classList.contains('degree-course')) {
      degreeCourses[thiscode].disable();

      if(this.classList.contains('planner-course')) {
        degreeCourses[this.getAttribute('coursecode')].enable();
      }
    } else if(this.classList.contains('planner-course')) {
      dragSrcElement.innerHTML = this.innerHTML;
      dragSrcElement.setAttribute('coursecode', this.getAttribute('coursecode'));
    }

    this.setAttribute('coursecode', thiscode);
    try {
      this.innerHTML = thiscode + ' : ' + degreeJSON['courses'][thiscode].credits;
    } catch {
      this.innerHTML = thiscode + ' : ' + '?';
    }

    if(this.classList.contains('empty-course-holder')) {
      semesters[this.parentElement.getAttribute('order')].addEmpty();
      this.classList.remove('empty-course-holder');

      if(dragSrcElement.classList.contains('planner-course')) {
        PlannerCourse.destructor(dragSrcElement);
      }
    }

    this.classList.add('planner-course');

    return;
  }
}
