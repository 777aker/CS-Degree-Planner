// -------------------------------- File Loader Form -------------------------------- //
// div holding file loader
const fileloader = document.querySelector('.fileloader-div');
// disable events when filling out form
fileloader.addEventListener('mouseover', function() {
  typing = true;
});
// form for file loader
const fileform = document.querySelector('.fileloader-form');
// file input
const selectfiles = document.querySelector('#select-files');
// result display and editer
const flresult = document.querySelector('#result');
// button that opens file loader
const openfl = document.querySelector('#openloader');
openfl.addEventListener('click', function() {
  clearAndReplace.checked = false;
  fileloader.style.display = 'block';
});
// button that closes file loader
const closefl = document.querySelector('#cancelload');
closefl.addEventListener('click', closeFL);
// closes the file loader
// also need to clear inputs
function closeFL() {
  fileloader.style.display = 'none';
  flresult.value = '';
  selectfiles.value = '';
  typing = false;
}
// when user loads a file this event fired
selectfiles.addEventListener('change', fileChanged);
// file changed
function fileChanged() {
  // load the file, put it into the text area
  let files = selectfiles.files;
  if(files.length <= 0)
    return false;
  let fr = new FileReader();
  fr.onload = function(e) {
    let result = JSON.parse(e.target.result);
    let formatted = JSON.stringify(result, null, 2);
    flresult.value = formatted;
  }
  fr.readAsText(files.item(0));
}
// import button
// when clicked take the text area and process it
const importfile = document.querySelector("#import");
importfile.addEventListener('click', importTextArea);
// replace or don't replace
const clearAndReplace = document.querySelector("#clearandreplace");
// read from the textarea since they can edit file there then
// once it's an object send it to processJSON to use
// processJSON does stuff like json.courses so make it a dictionary basically
function importTextArea() {
  if(flresult.value === "" || flresult.value === undefined || flresult.value === null) {
    throwError("File Empty");
    return;
  }
  const json = JSON.parse(flresult.value);
  if(clearAndReplace.checked === true)
    processJSONAppend(json);
  else
    processJSON(json);
  closeFL();
}

// -------------------------------- File Saving -------------------------------- //
// I can't handle having to make an entire set of notes for testing anymore
// so I'm making a save feature
// set it up
/*
  All of this is course layout stuff
*/
const savebutton = document.querySelector("#savebtn");
savebutton.addEventListener('click', saveCourseLayout);
const savecourseworkbtn = document.querySelector("#courseworksave");
savecourseworkbtn.addEventListener('click', saveCourseWork);
//const savetext = document.querySelector("#savetxt");
// this takes the courselist and linelist we have for everything and saves
// them to a json file
function saveCourseLayout() {
  let json = {};
  json.fileType = "courselayout";
  json.courses = courseList;
  json.coursemap = Object.fromEntries(courseMap);
  json.notes = noteList;
  json.notemap = Object.fromEntries(noteMap);
  json.subnodes = subnodeboxesList;
  json.subnodemap = Object.fromEntries(subnodeboxesMap);
  json.lines = lineList;
  saveJSON(json, "Courses Layout");
}
function saveCourseWork() {
  let json = {};
  json.fileType = "coursework";
  json.completionMap = Object.fromEntries(completionMap);
  saveJSON(json, "Coursework");
}

// -------------------------------- JSON Processing -------------------------------- //
// process json file loaded (these completely replace current data)
function processJSON(json) {
  zoom = 1;
  // bug fix need this here
  switch(json.fileType) {
    case "courselayout":
      clearLayout();
      processCourseLayout(json);
      break;
    case "coursework":
      clearCoursework();
      processCoursework(json);
      break;
  }
}
function processCoursework(json) {
  let jsonmap = json.completionMap;
  if(jsonmap !== null && jsonmap !== undefined) {
    const remap = new Map(Object.entries(jsonmap));
    remap.forEach((value, key) => {
      if(completionMap.has(key)) {
        if(completionMap.get(key) < value || completionMap.get(key) === completions.incomplete)
          completionMap.set(key, value);
      } else {
        completionMap.set(key, value);
      }
    });
  }
}
function processCourseLayout(json) {
  let jsonlist = json.courses;
  jsonlist.forEach((course) => {
    pushElement(courseList, courseMap, course);
  });
  jsonlist = json.notes;
  jsonlist.forEach((note) => {
    pushElement(noteList, noteMap, note);
  });
  jsonlist = json.subnodes;
  jsonlist.forEach((subnode) => {
    pushElement(subnodeboxesList, subnodeboxesMap, subnode);
  });
  jsonlist = json.lines;
  jsonlist.forEach((line) => {
    lineList.push(line);
  });
}
// process json file loaded but append rather than replace
// this may look like a simple addition, but that's because I changed everything else
function processJSONAppend(json) {
  zoom = 1;
  switch(json.fileType) {
    case "courselayout":
      processCourseLayout(json);
      break;
    case "coursework":
      processCoursework(json);
      break;
  }
}

// -------------------------------- Clear Data -------------------------------- //
// some references to the html stuff
const openClearFormBtn = document.querySelector('#clearbtn');
const clearDiv = document.querySelector('.clear-data-div');
const clearLayoutBtn = document.querySelector('#clearlayout');
const clearCourseworkBtn = document.querySelector('#clearcoursework');
const closeClearFormBtn = document.querySelector('#closeclearform');
// ok, let's add some functionality
// this is really just a lot of very simple buttons, just make stuff empty
// when you click the button
openClearFormBtn.addEventListener('click', function() {
  clearDiv.style.display = 'block';
});
closeClearFormBtn.addEventListener('click', closeClearForm);
function closeClearForm() {
  clearDiv.style.display = 'none';
}
clearLayoutBtn.addEventListener('click', clearLayout);
clearCourseworkBtn.addEventListener('click', clearCoursework);
// some helper functions that clear data
//(putting them here rather than in event in case I want other things to call these)
function clearLayout() {
  courseList = [];
  courseMap.clear();
  lineList = [];
  noteList = [];
  noteMap.clear();
  subnodeboxesList = [];
  subnodeboxesMap.clear();
  closeNodeOptions();
  closeClearForm();
}
function clearCoursework() {
  completionMap.clear();
  closeClearForm();
}
