// list holding the semesters
let semesters = [];
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
    for(let i = 0; i < semesters.length; i++) {
      if(float(semesters[i].order) > float(this.order)) {
        this.pushSemester(semesters[i].p5Element.elt, i);
        return;
      }
    }
    // push semester to where it needs to go in some stuff
    this.pushSemester(document.querySelectorAll('.button-holder')[1], semesters.length-1);
  }

  deleteSemester() {

  }

  pushSemester(before, i) {
    //TODO: this pushes to the end
    // needs to push into list where it belongs
    semesters.splice(i, 0, this);

    semestersHolder.insertBefore(
      this.p5Element.elt,
      before
    );
  }

  addEmpty() {
    new PlannerCourse(this.p5Element.elt);
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
