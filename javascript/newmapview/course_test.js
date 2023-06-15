function setup() {
  new Course(50, 50, 'CSCI 1300');
}

function draw() {
  allCourses.forEach(course => {
    course.draw();
  });
}

let allCourses = [];
class Course {
  constructor(x, y, code) {
    this.p5Div = createDiv(code);
    this.p5Div.style('position', 'absolute');
    this.p5Div.class('course');
    this.x = x;
    this.y = y;
    this.fontSize = 32;
    allCourses.push(this);
  }

  draw() {
    this.p5Div.style('top', this.y + 'px');
    this.p5Div.style('left', this.x + 'px');
    this.p5Div.style('font-size', this.fontSize + 'pt');
  }

  zoom(value) {
    this.fontSize += value / 100;
  }
}

function mouseWheel(e) {
  allCourses.forEach(course => {
    course.zoom(e.delta);
  });
}
