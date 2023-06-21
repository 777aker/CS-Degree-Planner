// list holding the semesters
let semesters = [];
// div holding the semesters
const semestersHolder = document.querySelector('#semesters-holder');
// semester class
class Semester {
  constructor(season, year) {
    this.season = season;
    if(year == '') {
      let date = new Date();
      year = date.getFullYear();
    }

    this.order = int(year) + SeasonValues[season];

    this.p5Element = createDiv();
    this.p5Element.class('semester');
    this.p5Element.attribute('order', this.order);

    let deleteSemesterBtn = createButton('X');
    deleteSemesterBtn.mouseClicked(function() {
      deleteSemester(this);
      toggleDeleteSemester();
    });
    deleteSemesterBtn.parent(this.p5Element);
    deleteSemesterBtn.class('delete-semester');

    semesters.push(this);
  }

  deleteSemester() {
    console.log('delete');
  }
}

function deleteSemester(semesterObj) {
  semesterObj.deleteSemester();
}
