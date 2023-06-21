// courses class
class Course {
  constructor(code, jsonCourse, parent) {
    let courseP;

    if(jsonCourse !== undefined) {
      courseP = createP(
        code + ' : ' + jsonCourse.credits + ' credits'
        + '<br>' + jsonCourse.name
      );
    } else {
      courseP = createP(code);
    }

    courseP.class('degree-course');
    courseP.parent(parent);
    courseP.attribute('draggable', 'true');

    this.p5Elt = courseP;

    // connect dragging events
    this.degreeCourseEvents();
  }

  degreeCourseEvents() {

  }
}
