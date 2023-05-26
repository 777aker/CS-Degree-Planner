// -------------------------------- Mode Handling -------------------------------- //
// this is the global mode variable
// tells us what mode we are in: draw, delete, edit, ""
let mode = modes.none;
// function called when user presses draw path button
function drawPath() {
  // have to have this moved mouse button nonsense because if you don't then
  // it draws a path when the user enter draw path mode because they click to enter it
  // so set moved mouse to false and wait until they move it before you start draw mode
  mousemovedbtn = false;
  // if we entered draw mode make a new line for us to draw on
  if(mode !== modes.draw)
    lineList.push([]);
  // mode changer helper function
  modeChanger(modes.draw, colors.draw);
}
// function called when user presses delete mode button
function deleteMode() {
  modeChanger(modes.delete, colors.delete);
}
// function called when user presses edit positions button
function editPositions() {
  modeChanger(modes.edit, colors.edit);
}
// changing the modes looks very similar for everying so here is a helper
// especially so we don't miss anything
function modeChanger(fmode, color) {
  // bug fix put this here
  lastCodeClicked = "";
  lastNodeTypeClicked = null;
  editNodesDiv.style.display = "none";
  // set each of the edit buttons to black
  let buttons = document.querySelectorAll(".editbuttons");
  buttons.forEach(button => {
    button.style.color = "white";
  });
  // I need this for the switcher later
  let prevmode = mode;
  // if we are in the mode of the button we just pressed then clear mode
  if(mode === fmode || fmode === modes.none) {
    mode = modes.none;
  } else {
    mode = fmode;
    // make the button the color passed so we can actually tell what mode we are in
    document.querySelector("#" + modenames[fmode] + "btn").style.color = color;
  }
  // if we got out of draw mode and the last line they were drawing isn't long enough
  // to actually be a line remove it
  if(lineList.length > 0 && mode !== modes.draw) {
    if(lineList[lineList.length - 1].length < 2) {
      lineList.pop();
    }
  }
  // this if statement makes sure we actually changed something
  if(mode !== modes.none || prevmode !== modes.none) {
    // popups for modes we enter
    switch(mode) {
      case modes.edit:
        popup('Able to Drag Courses', colors.edit, colors.editbg);
        break;
      case modes.draw:
        popup('Able to Draw Lines', colors.draw, colors.drawbg);
        break;
      case modes.delete:
        popup('Deleting Now Active', colors.delete, colors.deletebg);
        break;
      case modes.none:
        popup('Editing Disabled', colors.concrete, colors.asbestos);
        break;
    }
  }
}
function displayMode() {
  textSize(32);
  textAlign(CENTER, TOP);
  switch(mode) {
    case modes.edit:
      fill(colors.edit);
      text("Position Mode", width/2, 15);
      break;
    case modes.draw:
      fill(colors.draw);
      text("Line Mode", width/2, 15);
      break;
    case modes.delete:
      fill(colors.delete);
      text("Delete Mode", width/2, 15);
      break;
  }
}
