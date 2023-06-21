// setup everything for nav menu
function navigationSetup() {
  degreeSelectorSetup();
  // button for showing the degree selection form
  connectFormButton('#menu-select-degree', '#select-degree-form');
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
