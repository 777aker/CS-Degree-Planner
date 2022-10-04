// -------------------------------- Set up functions -------------------------------- //
// p5js setup function
function setup() {
  // create the canvas (subtract 20 so no scroll nonsense)
  let cnv = createCanvas(windowWidth-20, windowHeight-20);
  cnv.mouseOut(function () {
    mouseOutsideWindow = true;
  });
  cnv.mouseOver(function () {
    mouseOutsideWindow = false;
  });
  // set framerate to 30 anything more is a waste of power
  frameRate(30);
  // set up the edit menu
  editMenuSetUp();
  // set up templates
  setUpTemplates();
  // go ahead and load CS by default
  openTemplate("Computer-Science-BS-template.json");
  // hide advanced uses
  hideUses();
}
// set up the buttons for the edit menu
function editMenuSetUp() {
  // uses p5js to make buttons because much easier than actual html nonsense
  // create add course button (made a helper function for this)
  makeAButtonWithHover('Add Course', addCourse, "editbuttons", "addcoursebtn", "#edit-content",
  "Opens a form to add a course to the layout");
  // create add note button
  // idk what to tell you about the first being '' and the others being ""
  // ...it's a....convention thing....yea
  makeAButtonWithHover('Add Note', addNote, "editbuttons", "addnotebtn", "#edit-content",
  "Opens a form to add a note to the layout");
  // create draw path button
  makeAButtonWithHover('Draw Path', drawPath, "editbuttons", "drawbtn", "#edit-content",
  "Toggles ability to draw lines connecting courses and/or notes");
  // create delete button
  makeAButtonWithHover('Delete Mode', deleteMode, "editbuttons", "deletebtn", "#edit-content",
  "Toggles ability to delete lines, courses, or notes by clicking on them");
  // create move button
  makeAButtonWithHover('Edit Positions', editPositions, "editbuttons", "editbtn", "#edit-content",
  "Allows you to drag courses/notes to new positions");
}
