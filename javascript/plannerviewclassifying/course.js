// course area information
let courseHover = document.querySelector('#course-hover');
// degree and planner courses inherit some commonalities from here
class Course {
  constructor() {
    this.hoverCode = document.querySelector('#course-code-info');
    this.hoverTitle = document.querySelector('#course-title-info');
    this.hoverPrereqs = document.querySelector('#course-prereqs-info');

  }

  courseHover(self) {
    self.p5Element.elt.addEventListener('mouseover', function() {
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
    });
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

    this.p5Element = courseP;

    // connect dragging events
    this.degreeCourseEvents(this);
  }

  degreeCourseEvents(self) {
    self.courseHover(self);
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
    this.plannerCourseEvents(this);
  }

  plannerCourseEvents(self) {
    self.courseHover(self);
  }
}
