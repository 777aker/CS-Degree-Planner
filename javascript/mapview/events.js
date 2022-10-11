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
  if(key === '[') {
    noteList.forEach(note => {
      print(note.gate);
      print(note.connections);
    });
  }
  if(key === 'z') {
    zoom = 1;
  }
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
  // open help menu
  if(key === 'h') {
    openHelp();
  }
  // open templates
  if(key === 't') {
    templatediv.style.display = 'block';
  }
  // open file loader form
  if(key === 'x') {
    clearAndReplace.checked = false;
    fileloader.style.display = 'block';
  }
  // shift s save course file
  if(key === 'S') {
    saveCourseWork();
  }
  // open clear form
  if(key === 'l') {
    clearDiv.style.display = 'block';
  }
  if(key === 'g') {
    if(!advanceduses && throwError("WARNING: about to enable advanced uses")) {
      showUses();
    } else {
      rehideUses();
    }
  }
  // but first, disable all advanced uses, which is all of these
  if(!advanceduses)
    return;
  // now time for some shortcuts to use this faster
  // toggle edit mode
  if(key === 'e') {
    modeChanger(modes.edit, "rgb(0, 0, 200)");
  }
  // toggle delete mode
  if(key === 'q') {
    modeChanger(modes.delete, "rgb(200, 0, 0)");
  }
  // toggle draw mode
  if(key === 'r') {
    if(mode !== modes.draw)
      lineList.push([]);
    modeChanger(modes.draw, "rgb(0, 200, 0)");
  }
  // open add a course form
  if(key === 'c') {
    addCourse();
  }
  // open add a note form
  if(key === 'n') {
    addNote();
  }
  // shift e save layout
  if(key === 'E') {
    saveCourseLayout();
  }
}

// -------------------------------- Mouse Events -------------------------------- //
// when mouse is pressed do some stuff
function mousePressed() {

}
// do a zoom when mouseWheel moved
function mouseWheel(delta) {
  if(typing)
    return;
  zoom += -delta / 1000;
  if(zoom < .2)
    zoom = .2;
  if(zoom > 3)
    zoom = 3;
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
  let isTouchPad = e.wheelDeltaY ? e.wheelDeltaY === -3 * e.deltaY : e.deltaMode === 0
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
}, {
  passive: false
});

// -------------------------------- Miscellaneous Events -------------------------------- //
// if the window is resized this function is called
function windowResized() {
  // resize the canvas to fit the screen
  resizeCanvas(windowWidth-20, windowHeight-20);
  // set background color
  background(220);
}
