// -------------------------------- Keyboard Events -------------------------------- //
// special key pressed
function keyPressed() {
  // this stupid collapse function thingy doesn't show up for this one
  // oh, I figured out how to fix it though, hover over the line number then
  // it'll fix all the stupid little arrows so you can collapse functions

  // if you press enter in drawing mode finish the line and start a new one
  if(keyCode === ENTER && mode === modes.draw) {
    // if the line was too short jk, just pop it and start a new one
    if(lineList[lineList.length - 1].length < 2)
      lineList.pop();
    lineList.push([]);
  }
  // nice shortcuts time
  // enter delete mode
  if(keyCode === DELETE) {
    modeChanger(modes.delete, "rgb(200, 0, 0)");
  }
  // ESCAPE close all forms and templates and whatever
  if(keyCode === ESCAPE) {
    cancelCourse();
    cancelNote();
    closeNodeOptions();
    closeTemplates();
    closeFL();
    closeHelp();
    closeClearForm();
    modeChanger(modes.none, '');
  }
}
//  key typed event not for special keys use keyPressed for those
function keyTyped() {
  // shouldn't be used because will fill out course forms
  // nevermind I fixed that with the typing variable
  // so if typing return
  if(typing)
    return;
  switch(key) {
    // reset zoom
    case 'z':
      zoom = 1;
      mxzoom = 0;
      myzoom = 0;
      break;
    // open help menu
    case 'h':
      openHelp();
      break;
    // open templates
    case 't':
      templatediv.style.display = 'block';
      break;
    // open file loader form
    case 'x':
      clearAndReplace.checked = false;
      fileloader.style.display = 'block';
      break;
    // open clear form
    case 'l':
      clearDiv.style.display = 'block';
      break;
    // enter advanced uses
    case 'g':
      if(!advanceduses && throwError("WARNING: about to enable advanced uses")) {
        showUses();
        hide_incompletes = false;
        colors.incomplete = 'rgba(149, 165, 166, 1.0)'; // Concrete
        colors. incompletehover = 'rgba(127, 140, 141, 1.0)'; // Asbestos
      } else {
        rehideUses();
        hide_incompletes = true;
        colors.incomplete = 'rgba(149, 165, 166, 0.0)'; // Concrete
        colors. incompletehover = 'rgba(127, 140, 141, 0.0)'; // Asbestos
      }
      break;
    // testing popups
    /*
    case 'p':
      popup('testing', '#9b59b6', '#8e44ad');
      break;
    */
  }
  if(!advanceduses)
    return;
  switch(key) {
    // toggle edit mode
    case 'e':
      modeChanger(modes.edit, "rgb(0, 0, 200)");
      break;
    // toggle delete mode
    case 'q':
      modeChanger(modes.delete, "rgb(200, 0, 0)");
      break;
    // toggle draw mode
    case 'r':
      if(mode !== modes.draw)
        lineList.push([]);
      modeChanger(modes.draw, "rgb(0, 200, 0)");
      break;
    // open add a course form
    case 'c':
      addCourse();
      break;
    // open add a note form
    case 'n':
      addNote();
      break;
    // shift S save layout
    case 'S':
      saveCourseLayout();
      break;
  }
  /*if(key === '[') {
    noteList.forEach(note => {
      print(note.gate);
      print(note.connections);
    });
  }*/
  // I needed a way in drawing mode to see what was going on when debugging
  // (ironic for a drawing mode)
  /*if(key === 'l') {
    print(lineList);
  }*/
  // I also wanna see the courselist and courseMap for debuggingc
  /*if(key === 'c') {
    print(courseList);
    print(courseMap);
  }*/
  // and notes
  /*if(key === 'n') {
    print(noteList);
    print(noteMap);
  }*/
  // and subnodes bc these are a pain
  /*if(key === 's') {
    print('====== Printing Subnodes ======');
    courseList.forEach(course => {
      print('---------------');
      print(course.code);
      print(course.subnodes);
    });
    noteList.forEach(note => {
      print('---------------');
      print(note.code);
      print(note.subnodes);
    });
    print(subnodeboxesList);
    print(subnodeboxesMap);
  }*/
  // just subnode list and map
  /*if(key === 'S') {
    subnodeboxesList.forEach(subnodebox => {
      print(subnodebox.code);
    });
    subnodeboxesMap.forEach((value, key) => {
      print(value + ":" + key)
    });
  }*/
}
// control s functionality
document.addEventListener("keydown", function(e) {
  if (e.keyCode === 83 && (navigator.platform.match("Mac") ? e.metaKey : e.ctrlKey)) {
    e.preventDefault();
    saveCourseWork();
  }
}, false);

// -------------------------------- Mouse Events -------------------------------- //
// when mouse is pressed do some stuff
function mousePressed() {

}
// do a zoom when mouseWheel moved
function mouseWheel(delta) {
  if(typing)
    return;
  let tmpzoom = delta > 0 ? 0.05 : -0.05;
  let wx = (mouseX - mxzoom) / (width * zoom);
  let wy = (mouseY - myzoom) / (height * zoom);
  zoom += tmpzoom;
  if(zoom < .14 || zoom > 6) {
    zoom -= tmpzoom;
    return;
  }
  mxzoom -= wx * width * tmpzoom;
  myzoom -= wy * height * tmpzoom;
}
// when mouse is released do these things
function mouseReleased() {
  // no longer dragging a course
  draggingcourse = -1;
  draggingnote = -1;
  subnodecourse = -1;
  subnodenote = -1;
}
// have to disable default zoom because it makes program weird
document.addEventListener('wheel', function(e) {
  //print(`X:${e.deltaX}, Y:${e.deltaY}, CTRL:${e.ctrlKey}`);
  // this confused me a little so writing out logic
  // if wheeldeltaY then if wheeldeltay = -3 deltay trackpad else not
  // if wheeldeltay is false, then use deltamode to check
  if(typing)
    return;
  e.preventDefault();
  e.stopPropagation();
  // in an attempt to make it good, it was overcomplicated and impossible to use
  // simple is better
  if(!isNaN(e.wheelDeltaY)) {
    mouseWheel(e.wheelDeltaY);
  }
  /* this is a nonsense complicated way to do this don't
  mouseWheel((e.deltaY / abs(e.deltaY)) * 100);

  let isTouchPad = e.wheelDeltaY ? e.wheelDeltaY === -3 * e.deltaY : e.deltaMode === 0
  print(isTouchPad);
  print(e.ctrlKey);
  if(!isTouchPad) {
    if(e.deltaY !== -e.wheelDeltaY)
      mouseWheel(e.deltaX + e.deltaY);
    else
      moveEverything(-e.deltaX, -e.deltaY, false);
  } else {
    if(e.ctrlKey) {
      mouseWheel((e.deltaX + e.deltaY)*20);
    } else {
      moveEverything(-e.deltaX, -e.deltaY, false);
    }
  }
  */
}, {
  passive: false
});

// -------------------------------- Miscellaneous Events -------------------------------- //
// if the window is resized this function is called
function windowResized() {
  // resize the canvas to fit the screen
  resizeCanvas(windowWidth, windowHeight);
  // set background color
  background(220);
}
