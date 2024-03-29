
// setup everything for nav menu
function navigationSetup() {
  degreeSelectorSetup();
  // button for showing the degree selection form
  connectFormButton('#menu-select-degree', '#select-degree-form');
  // add semester form
  const addSemesterForm = document.querySelector('#add-semester-form');
  const seasonSelector = addSemesterForm.querySelector('#season-selector');
  const semesterYear = addSemesterForm.querySelector('#semester-year');
  // buttons for showing adding a semester
  document.querySelectorAll('.add-semester').forEach(button => {
    button.addEventListener('click', function() {
      addSemesterForm.style.display = 'flex';
      seasonSelector.value = 'spring';
      semesterYear.value = '';
    });
  });
  document.querySelectorAll('.remove-semester').forEach(button => {
    button.addEventListener('click', toggleDeleteSemester);
  });
  // actually add the semester when they submit
  document.querySelector('#submit-semester').addEventListener('click', function() {
    addSemesterForm.style.display = 'none';
    new Semester(
      seasonSelector.value,
      semesterYear.value
    );
  });
  // set up the trashcan
  new Trash();
}

// toggle the delete semester buttons
let deleteSemesterBtns = false;
function toggleDeleteSemester() {
  let display = deleteSemesterBtns ? 'none' : 'block';
  let color = deleteSemesterBtns ? '' : '#e74c3c';
  deleteSemesterBtns = !deleteSemesterBtns;
  document.querySelectorAll('.delete-semester').forEach(btn => {
    btn.style.display = display;
  });
  document.querySelectorAll('.remove-semester').forEach(btn => {
    btn.style.background = color;
  });
}

// form for selecting a degree
const degreeSelectorForm = document.querySelector('#select-degree-form');
// setup all the degree buttons here
function degreeSelectorSetup() {
  degreeButton('CS BS Degree', 'https://777aker.github.io/CS-Degree-Planner/jsons/Computer-Science-BS-electives.json');
}
// degree button button maker
function degreeButton(btnText, link) {
  let tmpBtn = createButton(btnText);
  tmpBtn.parent(degreeSelectorForm);
  tmpBtn.attribute('type', 'button');
  tmpBtn.mousePressed(function() {
    // hide form once done
    tmpBtn.elt.parentElement.style.display = 'none';
    // set degree name
    degreeName = btnText;
    // load degree
    degreeJSON = loadJSON(
      link,
      populateDegreeArea
    );
  });
}

// button forms often do
function connectFormButton(btnID, formID) {
  document.querySelector(btnID).addEventListener('click', function() {
    document.querySelector(formID).style.display = 'flex';
  });
}

class Trash {
  constructor() {
    const trashbin = document.querySelector('#trashcan');
    trashbin.addEventListener('dragstart', this.dragstart);
    trashbin.addEventListener('dragenter', this.dragenter);
    trashbin.addEventListener('dragleave', this.dragleave);
    trashbin.addEventListener('dragover', this.dragover);
    trashbin.addEventListener('drop', this.drop);
  }

  dragstart(e) {
    e.preventDefault();
    return;
  }

  dragenter(e) {
    this.classList.add('dragging-trash');
    return;
  }

  dragleave(e) {
    this.classList.remove('dragging-trash');
    return;
  }

  dragover(e) {
    e.preventDefault();
    return;
  }

  drop(e) {
    e.stopPropagation();

    if(dragSrcElement.classList.contains('planner-course')) {
      PlannerCourse.destructor(dragSrcElement);
    }

    this.classList.remove('dragging-trash');
    degreeCourses[e.dataTransfer.getData('text/html')].enable();
  }
}
