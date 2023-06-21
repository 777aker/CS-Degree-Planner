// setup the planning area
function planningAreaSetup() {
  // connect dragging capability to empty course holders
  document.querySelectorAll('.empty-course-holder').forEach(course => {
    //TODO: addCourseEvents(course);
  });
  // trash can events
  //TODO: setupTrash();
  // add/remove button setup
  //TODO: setupButtons();
  // setup semester stuff
  setupSemesters();
}

// make 8 semesters
function setupSemesters() {
  const date = new Date();
  const currentYear = date.getFullYear();
  const currentMonth = date.getMonth();

  currentSemester = currentYear;
  // figure out which season we're in
  if(currentMonth < 4) {
    currentSemester += SeasonValues.spring;
  } else if(currentMonth == 4) {
    currentSemester += SeasonValues.maymester;
  } else if(currentMonth == 5) {
    currentSemester += SeasonValues.sessionsACD;
  } else if(currentMonth == 6) {
    currentSemester += SeasonValues.sessionB;
  } else if(currentMonth == 7) {
    currentSemester += SeasonValues.augmester;
  } else {
    currentSemester += SeasonValues.fall;
  }
  // transfer semester
  new Semester('transfer', 0);
  for(let i = 0; i < 8; i++) {
    let yearValue = int(currentYear + (i + (currentMonth > 4)) / 2);
    if(i % 2 == 0) {
      new Semester('fall', yearValue);
    } else {
      new Semester('spring', yearValue);
    }
  }
}
