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
      deleteSemester(this.elt.parentElement);
      toggleDeleteSemester();
    });
    deleteSemesterBtn.parent(this.p5Element);
    deleteSemesterBtn.class('delete-semester');

    let title = createP(capatilize(this.season) + ' ' + year);
    title.parent(this.p5Element);
    title.class('semester-title');

    let credits = createP('Credits: ' + '0');
    credits.parent(this.p5Element);
    credits.class('semester-credits');

    addCourse(this.p5Element);

    let semesterList = document.querySelectorAll('.semester');
    for(let i = 0; i < semesterList.length-1; i++) {
      if(float(semesterList[i].getAttribute('order')) > float(this.order)) {
        semesterList[i].parentElement.insertBefore(this.p5Element.elt, semesterList[i]);
        return;
      }
    }
    // put the little dingus at the end of the semesters if it's the last
    let buttonHolders = document.querySelectorAll('.button-holder');
    buttonHolders[buttonHolders.length-1].parentElement.insertBefore(
      this.p5Element.elt,
      buttonHolders[buttonHolders.length-1]
    );
  }

}
