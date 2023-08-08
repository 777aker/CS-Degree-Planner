// course area information
let courseHover = document.querySelector('#course-hover');
let dragSrcElement = undefined;
// degree and planner courses inherit some commonalities from here
class Course {
  constructor() {
    this.hoverCode = document.querySelector('#course-code-info');
    this.hoverTitle = document.querySelector('#course-title-info');
    this.hoverPrereqs = document.querySelector('#course-prereqs-info');
  }

  destructor() {

  }

  mouseOver(self) {
    if(self.code == undefined) {
      return;
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

    return;
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
    if(dragSrcElement.classList.contains('planner-course')) {
      dragSrcElement.innerHTML = this.innerHTML;
      dragSrcElement.setAttribute('coursecode', this.getAttribute('coursecode'));
    }

    let thiscode = e.dataTransfer.getData('text/html');
    this.setAttribute('coursecode', thiscode);
    try {
      this.innerHTML = thiscode + ' : ' + degreeJSON['courses'][thiscode].credits;
    } catch {
      this.innerHTML = thiscode + ' : ' + '?';
    }

    if(this.classList.contains('empty-course-holder')) {
      semesters[this.parentElement.getAttribute('order')].addEmpty();
      this.classList.remove('empty-course-holder');
    }

    this.classList.add('planner-course');

    return;
  }
}
