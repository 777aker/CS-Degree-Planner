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
  // make the software go fullscreen because that's nice
  if(key === 'f' || key === 'F') {
    let fs = fullscreen();
    fullscreen(!fs);
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
  if(key === 'g') {
    addNote();
  }
  // open file loader form
  if(key === 'x') {
    clearAndReplace.checked = false;
    fileloader.style.display = 'block';
  }
  // open help menu
  if(key === 'h') {
    openHelp();
  }
  // open templates
  if(key === 't') {
    templatediv.style.display = 'block';
  }
  // shift s save course file
  if(key === 'S') {
    saveCourseWork();
  }
  // shift e save layout
  if(key === 'E') {
    saveCourseLayout();
  }
  // open clear form
  if(key === 'l') {
    clearDiv.style.display = 'block';
  }
}
