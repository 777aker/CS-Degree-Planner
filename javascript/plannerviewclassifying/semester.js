// dict holding the semesters for easy reference by order
let semesters = {};
// div holding the semesters
const semestersHolder = document.querySelector('#semesters-holder');
// semester class
class Semester {
  constructor(season, year) {
    // figure out the year and season
    this.season = season;
    if(year == '' && season != 'transfer') {
      let date = new Date();
      year = date.getFullYear();
    }

    // give it an order variable used for sorting
    this.order = int(year) + SeasonValues[season];
    semesters[this.order] = this;
    // create the actual element
    this.p5Element = createDiv();
    this.p5Element.class('semester');
    this.p5Element.attribute('order', this.order);
    // delete the semester button
    let deleteSemesterBtn = createButton('X');
    deleteSemesterBtn.mouseClicked(function() {
      deleteSemester(this);
      toggleDeleteSemester();
    });
    deleteSemesterBtn.parent(this.p5Element);
    deleteSemesterBtn.class('delete-semester');
    // title the semester
    let title;
    if(season == 'transfer') {
      title = createP('Transfer Courses');
    } else {
      title = createP(capatilize(this.season) + ' ' + year);
    }
    title.parent(this.p5Element);
    title.class('semester-title');
    // count credits in semester
    let credits = createP('Credits: 0');
    credits.parent(this.p5Element);
    credits.class('semester-credits');
    // add empty to drag onto
    this.addEmpty();
    // if it's transfer semester
    if(season == 'transfer') {
      this.pushSemester(semestersHolder.children[0], 0);
      return;
    }
    // put in correct position
    for(let i = 0; i < semestersHolder.children.length; i++) {
      if(float(semestersHolder.children[i].getAttribute('order')) > float(this.order)) {
        this.pushSemester(semestersHolder.children[i], i);
        return;
      }
    }
    // push semester to where it needs to go in some stuff
    this.pushSemester(document.querySelectorAll('.button-holder')[1]);
  }

  // helper function
  // put a semester in the schedule before certain element
  pushSemester(before) {
    // needs to push into list where it belongs
    semestersHolder.insertBefore(
      this.p5Element.elt,
      before
    );
  }

  // remove a semester from the schedule
  deleteSemester() {

  }

  // adds an empty course to the current semester
  addEmpty() {
    new PlannerCourse(this.p5Element.elt);
  }

  valid() {
    this.p5Element.elt.querySelector('.empty-course-holder').classList.add('valid-empty-course');
  }

  invalid() {
    this.p5Element.elt.querySelector('.empty-course-holder').classList.add('invalid-empty-course');
  }

  getCourses() {
    let courses = this.p5Element.elt.querySelectorAll('.planner-course');
    let codes = [];
    courses.forEach(courseElt => {
      codes.push(courseElt.getAttribute('coursecode'));
    });
    return codes;
  }

  checkCourses(completed) {
    let courses = this.p5Element.elt.querySelectorAll('.planner-course');
    courses.forEach(courseElt => {
      console.log('-----')
      console.log(completed);
      console.log(courseElt.getAttribute('coursecode'));
      if(Course.checkPrerequisites(degreeJSON.courses[courseElt.getAttribute('coursecode')].prerequisites, completed)) {
        courseElt.classList.remove('prereqs-not-met');
      } else {
        courseElt.classList.add('prereqs-not-met');
      }
    });
  }
}

// delete a semester
function deleteSemester(semesterObj) {
  semesterObj.deleteSemester();
}

// capatilize first letter of a string
function capatilize(aString) {
  const firstLetter = aString.charAt(0).toUpperCase();
  const remaining = aString.slice(1);
  return firstLetter + remaining;
}
