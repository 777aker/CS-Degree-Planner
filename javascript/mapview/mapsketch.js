// -------------------------------- Global Variables -------------------------------- //
// Putting some global variables up here like I should
let fontsize = 14;
let boxpadding = {
  x: 15,
  y: 10
}
// whether or not we are typing a form (so that we don't move the screen and stuff while typing / do special key presses)
let typing = false;
let myFont = 'Helvetica';
// global variable list of courses
let courseList = [];
// I'm also thinking of making a map that says code is key gives you index in course list
// would make a lot of things more efficient because idk how to do some weird reaching nonsense
// I have to do. Like, a lot of courses have to see other courses, and if I don't make this map
// then you have to like search through all the courses looking for one with a code you want
// initialize it here
const courseMap = new Map();
/*
course looks like
course = {
  code: coursecode,
  credits: ch,
  name: coursename,
  prerequisites: prereqs,
  x: number,
  y: number.
  lines: list of prereqs (removed)
};
*/
// we also need a seperate list of lines
// global variable of lines to draw
let lineList = [];
// this stores all of our notes
/*
  note = {
    code:
    title:
    text:
    x:
    y:
  }
*/
let noteList = [];
// this is our note hashmap for finding notes
const noteMap = new Map();
// this stores the last element we clicked for the edit functions to use
let lastCodeClicked = "";
// all the types of notes we currently have in an enum
let nodeTypes = {
  course: 0,
  note: 1
};
// all the mode types we have
let modes = {
  none: 0,
  delete: 1,
  edit: 2,
  draw: 3
};
// for referencing html
let modenames = {
  0: "none",
  1: "delete",
  2: "edit",
  3: "draw"
};
// subnode boxes we draw
let subnodeboxesList = [];
let subnodeboxesMap = new Map();

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
}
// set up the buttons for the edit menu
function editMenuSetUp() {
  // uses p5js to make buttons because much easier than actual html nonsense
  // create add course button (made a helper function for this)
  makeAButton('Add Course', addCourse, "editbuttons", "addcoursebtn", "#dropdown-content");
  // create add note button
  // idk what to tell you about the first being '' and the others being ""
  // ...it's a....convention thing....yea
  makeAButton('Add Note', addNote, "editbuttons", "addnotebtn", "#dropdown-content");
  // create draw path button
  makeAButton('Draw Path', drawPath, "editbuttons", "drawbtn", "#dropdown-content");
  // create delete button
  makeAButton('Delete Mode', deleteMode, "editbuttons", "deletebtn", "#dropdown-content");
  // create move button
  makeAButton('Edit Positions', editPositions, "editbuttons", "editbtn", "#dropdown-content");
}

// -------------------------------- Miscellaneous Menu -------------------------------- //
// quick bug fix
const editdropdwn = document.querySelector('.edit-dropdown');
editdropdwn.addEventListener('mouseover', function() {
  typing = true;
});
editdropdwn.addEventListener('mouseleave', function() {
  typing = false;
});

// -------------------------------- Helper Functions -------------------------------- //
// this function makes a button so I don't have to
// some of the names are special because I accidently used keywords
// name of button, function button calls when pressed, class, id, parent
function makeAButton(name, fn, btnclass, btnid, parent) {
  let button = createButton(name);
  button.mousePressed(fn);
  button.class(btnclass);
  button.id(btnid);
  button.parent(parent);
}
// helper function for creating form text fields
// form - which form to append it to / element (doesn't have to be a form)
// label - label for the text box
// id - id for the text box
// value - value in the text box
// br - true or false, add breaks between text boxes or no
function createFormTextField(form, label, id, value, br) {
  // create the label element using passed letiables
  // letiables??? I don't even know what that word is supposed to be
  if(label !== "") {
    let templabel = document.createElement("label");
    templabel.setAttribute("for", id);
    templabel.innerHTML = label;
    form.appendChild(templabel);
    if(br)
      form.appendChild(document.createElement("br"));
  }
  // create the input element using passed letiables
  // I did it again, what the freak is a letiable?
  // is there even such thing as a letiable or does it have to be letiables
  let tempinput = document.createElement("input");
  tempinput.setAttribute("type", "text");
  if(id !== "") {
    tempinput.setAttribute("id", id);
    tempinput.setAttribute("name", id);
  }
  tempinput.setAttribute("value", value);
  tempinput.setAttribute("onfocus", "this.value=''");
  form.appendChild(tempinput);
  if(br)
    form.appendChild(document.createElement("br"));
}
// I also need a text area so copying text field
function createFormTextArea(form, label, id, value, br) {
  if(label !== "") {
    let templabel = document.createElement("label");
    templabel.setAttribute("for", id);
    templabel.innerHTML = label;
    form.appendChild(templabel);
    if(br)
      form.appendChild(document.createElement("br"));
  }
  let tempinput = document.createElement("textarea");
  if(id !== "") {
    tempinput.setAttribute("id", id);
    tempinput.setAttribute("name", id);
  }
  tempinput.setAttribute("value", value);
  tempinput.setAttribute("onfocus", "this.value=''");
  tempinput.setAttribute("rows", "10");
  tempinput.setAttribute("cols", "40");
  tempinput.setAttribute("wrap", "off");
  form.appendChild(tempinput);
  if(br)
    form.appendChild(document.createElement("br"));
}
// need a hash function for the notes
function getHash(str) {
  let hash = 0;
  for(let i = 0; i < str.length; i++) {
    let chr = str.charCodeAt(i);
    hash = (hash << 5) - hash + chr;
    hash |= 0;
  }
  return hash;
}
// helper function that tells you if you are close to a line segment or not
// distance - distance from line this will return true at
// x1, y1, x2, y2 - your line segment
// px, py - the point you are testing
function lineTest(distance, x1, y1, x2, y2, px, py) {
  let topleft = [min(x1, x2), min(y1, y2)];
  let bottomright = [max(x1, x2), max(y1, y2)];
  if(px > topleft[0] - distance && px < bottomright[0] + distance && py > topleft[1] - distance && py < bottomright[1] + distance) {
    let dis = abs((x2-x1)*(y1-py)-(x1-px)*(y2-y1));
    dis /= dist(x1, y1, x2, y2);
    if(dis < distance)
      return true
  }
  return false;
}
// also a button maker that's better than the other
function createFormButton(form, id, value, func) {
  let tempbutton = document.createElement("input");
  tempbutton.setAttribute("id", id);
  tempbutton.setAttribute("type", "button");
  tempbutton.setAttribute("value", value);
  form.appendChild(tempbutton);
  tempbutton.addEventListener('click', func);
}

// -------------------------------- Adding Courses Section -------------------------------- //
// get the course form and div containing it and save as global variables
const addCourseDiv = document.querySelector('.add-course-div');
addCourseDiv.addEventListener('mouseover', function() {
  typing = true;
});
const addCourseForm = document.querySelector('.add-course-form');
// function called when user presses add course button in the edit menu
function addCourse() {
  // set typing to true (so hitting keys doesn't trigger events)
  typing = true;
  // clear the form
  addCourseForm.innerHTML = '';
  // create the labels and inputs for the form
  // first the course code input field
  // I was smart and made a form helper function
  createFormTextField(addCourseForm, "Course Code:", "coursecode", "Enter Course Code", false);
  // credit hours input field
  createFormTextField(addCourseForm, "Credit Hours:", "ch", "Enter Credit Hours", false);
  // course name input field
  createFormTextField(addCourseForm, "Course Name:", "coursename", "Enter Course Name", false);
  // now this is more complicated because prereqs can have
  // any number so need to set up some buttons that let you
  // expand the number of prereqs
  // ^ it's gross to read that because it's on multiple lines but I used // instead of /**/
  // I'm leaving it though hehehe
  // this is the button to add a group of prerequisites that fulfill the same requirement
  // if you're confused about this next part function submitCourse explains what's happening here a little better
  createFormButton(addCourseForm, "addprereqgroup", "Add Prerequisite Group", addPrereqGroup);
  // remove a prereq group (does opposite of previous button)
  createFormButton(addCourseForm, "removeprereqgroup", "Remove Prerequisite Group", removePrereqGroup);
  // make it visible (it = the whole form)
  addCourseDiv.style.display = 'block';
}
// function very similar to addCourse but instead is for editing a course when it is clicked
// similar because it uses the same form
function editCourse() {
  // same as addCourse but we have to fill in things including the complicated prereq nonsense
  // luckily, hopefully, we can use some stuff we've already created
  typing = true;
  addCourseForm.innerHTML = '';
  let course = courseList[courseMap.get(lastCodeClicked)];
  createFormTextField(addCourseForm, "Course Code:", "coursecode", course.code, false);
  createFormTextField(addCourseForm, "Credit Hours:", "ch", course.credits, false);
  createFormTextField(addCourseForm, "Course Name:", "coursename", course.name, false);
  createFormButton(addCourseForm, "addprereqgroup", "Add Prerequisite Group", addPrereqGroup);
  createFormButton(addCourseForm, "removeprereqgroup", "Remove Prerequisite Group", removePrereqGroup);
  // now time for the complicated part of this
  // for each group of prereqs create a div
  if(course.prerequisites !== undefined && course.prerequisites !== null) {
    course.prerequisites.forEach(prereqGroup => {
      let groupdiv = document.createElement('div');
      groupdiv.setAttribute('class', 'prereqGroupDiv');
      addCourseForm.appendChild(groupdiv);
      // for each actual prereq create a text field
      prereqGroup.forEach(prereq => {
        createFormTextField(groupdiv, "", "", prereq);
      });
      // buttons that let you add and remove prereqs from a group
      let prereqbtn = document.createElement("input");
      prereqbtn.setAttribute("type", "button");
      prereqbtn.setAttribute("class", "addPrereqBtn");
      prereqbtn.setAttribute("value", "Add Same Requirement Prerequisite");
      addCourseForm.appendChild(prereqbtn);
      // whenever add prereq button clicked create more prereq fields in that div
      prereqbtn.addEventListener('click', function(){
        // why is it 5 lines to make a text box, should I fix that?...nah I don't want to rn
        createFormTextField(groupdiv, "", "", "Enter Prerequisite Code Only");
      });
      // remove prerequisite button below add so you can remove a prereq if you made too many
      // (I kept doing that so I added this so I could undo my mistakes)
      prereqbtn = document.createElement("input");
      prereqbtn.setAttribute("type", "button");
      prereqbtn.setAttribute("class", "removePrereqBtn");
      prereqbtn.setAttribute("value", "Remove Prerequisite");
      addCourseForm.appendChild(prereqbtn);
      // whenever remove is clicked remove the last prerequisite of the group
      // even works if some jerk decides to press the button a million times
      // and there are no prerequisites left
      prereqbtn.addEventListener('click', function(){
        if(groupdiv.lastChild != null)
          groupdiv.lastChild.remove();
      });
    });
  }
  addCourseDiv.style.display = 'block';
}
// remove a prerequisite group
// called when add course form remove prerequisite button is pressed
function removePrereqGroup() {
  // get the last prerequisite group made and remove that one
  // but we have to do a lot of checks in case some idiot presses remove
  // when there's nothing to remove :/
  let lastgroup = document.querySelectorAll(".prereqGroupDiv");
  if(lastgroup.length > 0)
    lastgroup[lastgroup.length - 1].remove();
  // oh, also remove all the buttons for that group bc it'd be weird and awkward
  // if the buttons stayed but you couldn't do anything with them
  // (this was for some reason surprisingly difficult to implement right)
  let lastbtn = document.querySelectorAll(".addPrereqBtn");
  if(lastbtn.length > 0)
    lastbtn[lastbtn.length - 1].remove();
  lastbtn = document.querySelectorAll(".removePrereqBtn");
  if(lastbtn.length > 0)
    lastbtn[lastbtn.length - 1].remove();
}
// add prereq group button action in add course form
// ^ bad wording what does that mean?
// I'll tell you, it means in the add course form when someone presses the
// add a prerequisite group button do the following
function addPrereqGroup() {
  // need to put all prereqs in a div so we can get to them easily later
  let groupdiv = document.createElement("div");
  groupdiv.setAttribute("class", "prereqGroupDiv");
  addCourseForm.appendChild(groupdiv);
  // create prerequisite text boxes under div
  // spoiler, further along I get annoyed with typing 5 lines for a stupid text box
  // realized I had a helper just need to change a few things
  // soon I might make a button helper too, but unfortunately that's a little more
  // complicated than I want it to be because I use a lot of anonymous functions for buttons
  createFormTextField(groupdiv, "", "", "Enter Prerequisite Code Only");
  // add prerequisite button outside of div (for adding more prerequisites)
  let prereqbtn = document.createElement("input");
  prereqbtn.setAttribute("type", "button");
  prereqbtn.setAttribute("class", "addPrereqBtn");
  prereqbtn.setAttribute("value", "Add Same Requirement Prerequisite");
  addCourseForm.appendChild(prereqbtn);
  // whenever add prereq button clicked create more prereq fields in that div
  prereqbtn.addEventListener('click', function(){
    // why is it 5 lines to make a text box, should I fix that?...nah I don't want to rn
    createFormTextField(groupdiv, "", "", "Enter Prerequisite Code Only");
  });
  // remove prerequisite button below add so you can remove a prereq if you made too many
  // (I kept doing that so I added this so I could undo my mistakes)
  prereqbtn = document.createElement("input");
  prereqbtn.setAttribute("type", "button");
  prereqbtn.setAttribute("class", "removePrereqBtn");
  prereqbtn.setAttribute("value", "Remove Prerequisite");
  addCourseForm.appendChild(prereqbtn);
  // whenever remove is clicked remove the last prerequisite of the group
  // even works if some jerk decides to press the button a million times
  // and there are no prerequisites left
  prereqbtn.addEventListener('click', function(){
    if(groupdiv.lastChild != null)
      groupdiv.lastChild.remove();
  });
}
// set up the submit button for add course form
const submitcoursebtn = document.querySelector("#submitcourse");
submitcoursebtn.addEventListener('click', submitCourse);
// when submit course button on add course form is clicked do this
function submitCourse() {
  // get coursecode, name, and credit hours
  const coursecode = addCourseForm.querySelector("#coursecode").value;
  const ch = addCourseForm.querySelector("#ch").value;
  const coursename = addCourseForm.querySelector("#coursename").value;
  // get the prereq groups
  const prereqdivs = addCourseForm.querySelectorAll(".prereqGroupDiv");
  // list storing all the prereqs
  let prereqs = [];
  // some iteration variables
  // doing double for loop so putting them outside of it
  let i = 0;
  let j = 0;
  // loop through the groups of prereqs
  for(i = 0; i < prereqdivs.length; i++) {
    // loop through the div input fields to get each individual prereq
    const divlist = prereqdivs[i].children;
    // also, make a list because this group of prerequisites all fulfill
    // the same requirement
    let prereq = [];
    // put them all in the same list
    for(j = 0; j < divlist.length; j++) {
      if(divlist[j].value !== "Enter Prerequisite Code Only" && divlist[j].value !== "")
        prereq.push(divlist[j].value);
    }
    // add that list to our list of lists of prereqs
    if(prereq.length !== 0)
      prereqs.push(prereq);
  }
  // ok ^ that loop is a little confusing so let me reexplain
  // a course can have any number of prerequisites, and some prerequisites fulfill the same requirement
  // so to solve this in the form a group of prerequisites fulfill the same requirement, ie first loop
  // then the second loop is each prerequisite that fulfills that requirement, and hince why
  // we have a list of lists. the big list is basically requirements, and that requirement element in that
  // list holds a list of every course that will fulfill that requirement. Make sense? idk bc I can't
  // actually talk to anyone reading these comments
  textSize(fontsize);
  textStyle(BOLD);
  let bold = textWidth(coursecode + '-' + ch);
  textStyle(NORMAL);
  // now we should actually add all this to the variable that stores all the courses
  let course = {
    code: coursecode,
    credits: ch,
    name: coursename,
    prerequisites: prereqs,
    x: windowWidth / 2,
    y: windowHeight / 2,
    height: textLeading() * 2 + boxpadding.y,
    width: bold > textWidth(coursename) ? bold + boxpadding.x : textWidth(coursename) + boxpadding.x,
    subnodes: []
  };
  // if the courseMap already has this course code then replace it with the new one
  if(courseMap.has(coursecode)) {
    // also, set course position to where it was
    course.x = courseList[courseMap.get(coursecode)].x;
    course.y = courseList[courseMap.get(coursecode)].y;
    courseList[courseMap.get(coursecode)] = course;
  } else if(courseMap.has(lastCodeClicked)) {
    course.x = courseList[courseMap.get(lastCodeClicked)].x;
    course.y = courseList[courseMap.get(lastCodeClicked)].y;
    courseList[courseMap.get(lastCodeClicked)] = course;
  } else {
    // if the course map doesn't have it then the course doesn't exist push
    // it to the map and save where it is at
    courseMap.set(coursecode, courseList.length);
    courseList.push(course);
  }
  // clear and hide the form we're done with it
  addCourseForm.innerHTML = '';
  addCourseDiv.style.display = "none";
  lastCodeClicked = "";
  lastNodeTypeClicked = null;
  typing = false;
}
// set up the cancel button for add course form
const cancelcoursebtn = document.querySelector("#cancelcourse");
cancelcoursebtn.addEventListener('click', cancelCourse);
// when cancel course button is clicked do this
function cancelCourse() {
  // set form to invisible
  addCourseDiv.style.display = 'none';
  // clear form contents
  addCourseForm.innerHTML = '';
  typing = false;
}

// -------------------------------- Adding Note Section -------------------------------- //
// function called when user presses add note button
// basically will do the same thing as add course button
// but this doesn't have to be a course this could just be a little
// box you want to make for your convenience / understanding
const addNoteDiv = document.querySelector('.add-note-div');
addNoteDiv.addEventListener('mouseover', function() {
  typing = true;
});
const addNoteForm = document.querySelector('.add-note-form');
function addNote() {
  // set typing to true so certain events aren't triggered
  typing = true;
  // clear the form
  addNoteForm.innerHTML = '';
  // create the labels and inputs for the form
  createFormTextField(addNoteForm, "Note Title:", "notetitle", "Title of the note", true);
  createFormTextArea(addNoteForm, "Note Text:", "notetext", "Text of the note", true);
  // make it visible
  addNoteDiv.style.display = 'block';
}
// similar to addNote because it uses the same form just fills it out
function editNote() {
  // set typing to true so certain events aren't triggered
  typing = true;
  // clear the form
  addNoteForm.innerHTML = '';
  // create the labels and inputs for the form
  let tempnote = noteList[noteMap.get(lastCodeClicked)];
  createFormTextField(addNoteForm, "Note Title:", "notetitle", tempnote.title, true);
  createFormTextArea(addNoteForm, "Note Text:", "notetext", tempnote.text, true);
  addNoteForm.querySelector('#notetext').innerHTML = tempnote.text;
  // make it visible
  addNoteDiv.style.display = 'block';
}
// submit for a new note
const submitnotebtn = document.querySelector('#submitnote');
submitnotebtn.addEventListener('click', submitNote);
// when submit note is pressed do the following
function submitNote() {
  // get info from form
  const title = addNoteForm.querySelector("#notetitle").value;
  const text = addNoteForm.querySelector("#notetext").value;
  // notes behind the scenes need unique identifiers for connecting, drawing, and saving
  // so we are going to make a hash map
  // TODO: hash function may need some work since most notes will have same text
  let hash;
  let tempx = windowWidth / 2;
  let tempy = windowHeight / 2;
  if(lastNodeTypeClicked !== nodeTypes.note) {
    hash = getHash(title + text + noteList.length);
    while(noteMap.has(hash)) {
      hash += 1;
      hash |= 0;
    }
  } else {
    let tempnote = noteList[noteMap.get(lastCodeClicked)];
    hash = tempnote.code;
    tempx = tempnote.x;
    tempy = tempnote.y;
  }
  textSize(fontsize);
  let hasTitle = title !== '' && title !== 'Title of the note';
  let hasText = text !== '';
  let width = 0;
  let height = 0;
  textStyle(NORMAL);
  if(hasText) {
    let splittxt = text.split(/\r\n|\r|\n/);
    let gtext = textWidth(splittxt[0]);
    for(let i = 0; i < splittxt.length; i++) {
      const wid = textWidth(splittxt[i]);
      if(wid > gtext)
        gtext = wid;
    }
    textStyle(BOLD);
    width = textWidth(title) * hasTitle > gtext ? textWidth(title) * hasTitle + boxpadding.x : gtext + boxpadding.x;
    height = (splittxt.length + hasTitle) * textLeading() + boxpadding.y;
  } else {
    textStyle(BOLD);
    width = textWidth(title) + boxpadding.x;
    height = textLeading() + boxpadding.y;
  }
  // add the note
  const note = {
    code: hash,
    title: hasTitle ? title : '',
    text: hasText ? text : '',
    x: tempx,
    y: tempy,
    width: width,
    height: height,
    subnodes: []
  };
  if(lastNodeTypeClicked === nodeTypes.note) {
    noteList[noteMap.get(lastCodeClicked)] = note;
  } else {
    noteMap.set(hash, noteList.length);
    noteList.push(note);
  }
  addNoteForm.innerHTML = '';
  addNoteDiv.style.display = 'none';
  lastCodeClicked = "";
  lastNodeTypeClicked = null;
  typing = false;
}
// cancel adding a note
const cancelnotebtn = document.querySelector("#cancelnote");
cancelnotebtn.addEventListener('click', cancelNote);
function cancelNote() {
  addNoteDiv.style.display = 'none';
  addNoteForm.innerHTML = '';
  typing = false;
}

// -------------------------------- Edit Nodes Section -------------------------------- //
// not sure if this is a helper or miscellaneous menu
// actually, it's its own section
// opens the buttons that allow you to edit the last clicked element
const editNodesDiv = document.querySelector(".edit-nodes-div");
const editNodeBtn = document.querySelector("#editnode");
editNodeBtn.addEventListener('click', function() {
  switch(lastNodeTypeClicked) {
    case nodeTypes.note:
      editNote();
      break;
    case nodeTypes.course:
      editCourse();
      break;
  }
  editNodesDiv.style.display = "none";
});
const showNodeBtn = document.querySelector("#nodeinfo");
showNodeBtn.addEventListener('click', function() {
  // TODO: view node information
});
const closeNodeBtn = document.querySelector("#closeeditnode");
closeNodeBtn.addEventListener("click", function() {
  lastCodeClicked = "";
  lastNodeTypeClicked = null;
  editNodesDiv.style.display = "none";
});
// simple bug fix (the typing variable is a god send)
editNodeBtn.addEventListener('mouseover', function() {
  typing = true;
});
editNodeBtn.addEventListener('mouseleave', function() {
  typing = false;
});
showNodeBtn.addEventListener('mouseover', function() {
  typing = true;
});
showNodeBtn.addEventListener('mouseleave', function() {
  typing = false;
});
closeNodeBtn.addEventListener('mouseover', function() {
  typing = true;
});
closeNodeBtn.addEventListener('mouseleave', function() {
  typing = false;
});
// time to actually show the buttons
let lastNodeTypeClicked;
function openNodeOptions(nodeType, node) {
  // if typing don't show them do nothing just exit
  if(typing)
    return;
  editNodesDiv.style.display = "flex";
  lastNodeTypeClicked = nodeType;
  lastCodeClicked = node.code.toString();
  // we can expect every node to have an x, y, width, height
  editNodesDiv.style.top = node.y - node.height/2 - textLeading() - 5 + 'px';
  editNodesDiv.style.left = node.x - node.width/2 + 'px';
}

// -------------------------------- Template Section -------------------------------- //
// this is the form with templates
const templateform = document.querySelector('.template-form');
// this is the div holding the form that we show and hide
const templatediv = document.querySelector('.template-div');
// when using div disable events
templatediv.addEventListener('mouseover', function() {
  typing = true;
});
// this button shows templates when pressed
const showtemplates = document.querySelector("#opentemplates");
showtemplates.addEventListener('click', function() {
  templatediv.style.display = "block";
});
// if you want to add a template option add it here after uploading
// the templates to the jsons folder
// WARNING: if hosting site changed need to change the prefix on templates
function setUpTemplates() {
  // create the cs button
  // WARNING: url prefix in openTemplate function needs to change if hosting site changes
  templateButton(templateform, 'Computer Science BS Degree', 'templateloadbtns', 'csbs', 'Computer-Science-BS-template.json');
}
// template button setup function
function templateButton(form, name, btnclass, btnid, url) {
  let button = createButton(name);
  button.class(btnclass);
  button.id(btnid);
  button.parent(form);
  button.mousePressed(() => {
    openTemplate(url);
  });
  return button;
}
// helper function that loads a json from the templates
function openTemplate(url) {
  let furl = 'https://777aker.github.io/CS-Degree-Planner/jsons/' + url;
  loadJSON(furl, processJSON);
  closeTemplates();
}
// closes the template options
function closeTemplates() {
  templatediv.style.display = 'none';
  typing = false;
}
// button that can close template options
const canceltemplates = document.querySelector('#canceltemplate');
canceltemplates.addEventListener('click', closeTemplates);

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
// read from the textarea since they can edit file there then
// once it's an object send it to processJSON to use
// processJSON does stuff like json.courses so make it a dictionary basically
function importTextArea() {
  const json = JSON.parse(flresult.value);
  processJSON(json);
  closeFL();
}

// -------------------------------- File Saving -------------------------------- //
// I can't handle having to make an entire set of notes for testing anymore
// so I'm making a save feature
// set it up
const saveform = document.querySelector(".fileform");
saveform.addEventListener('mouseover', function() {
  typing = true;
});
saveform.addEventListener('mouseleave', function() {
  typing = false;
});
const savebutton = document.querySelector("#savebtn");
savebutton.addEventListener('click', saveFile);
const savetext = document.querySelector("#savetxt");
// this takes the courselist and linelist we have for everything and saves
// them to a json file
function saveFile() {
  let json = {};
  json.courses = courseList;
  json.coursemap = Object.fromEntries(courseMap);
  json.notes = noteList;
  json.notemap = Object.fromEntries(noteMap);
  json.lines = lineList;
  saveJSON(json, savetext.value);
}

// -------------------------------- JSON Processing -------------------------------- //
// process json file loaded
function processJSON(json) {
  // bug fix need this here
  lastCodeClicked = "";
  lastNodeTypeClicked = null;
  editNodesDiv.style.display = "none";
  // json stuff
  if(json.courses !== null && json.courses !== undefined)
    courseList = json.courses;
  if(json.coursemap !== null && json.coursemap !== undefined) {
    const remap = new Map(Object.entries(json.coursemap));
    courseMap.clear();
    remap.forEach(function(value, key) {
      courseMap.set(key, value);
    });
  }
  if(json.notes !== null && json.notes !== undefined)
    noteList = json.notes;
  if(json.notemap !== null && json.notemap !== undefined) {
    const remap2 = new Map(Object.entries(json.notemap));
    noteMap.clear();
    remap2.forEach(function(value, key) {
      noteMap.set(key, value);
    });
  }
  lineList = json.lines;
}

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
  modeChanger(modes.draw, "rgb(0, 200, 0)");
}
// function called when user presses delete mode button
function deleteMode() {
  modeChanger(modes.delete, "rgb(200, 0, 0)");
}
// function called when user presses edit positions button
function editPositions() {
  modeChanger(modes.edit, "rgb(0, 0, 200)");
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
    button.style.color = "rgb(0, 0, 0)";
  });
  // if we are in the mode of the button we just pressed then clear mode
  if(mode === fmode) {
    mode = modes.none;
  } else {
    mode = fmode;
    // make the button the color passed so we can actually tell what mode we are in
    document.querySelector("#" + modenames[fmode] + "btn").style.color = color;
  }
  // if we got out of draw mode and the last line they were drawing isn't long enough
  // to actually be a line remove it
  if(lineList.length > 0 && mode !== modes.draw) {
    if(lineList[lineList.length - 1].length < 8) {
      lineList.pop();
    }
  }
}

// -------------------------------- Draw Function -------------------------------- //
// movement speed (like moving the camera / all the courses and stuff)
let movespeed = 5;
// is the mouse dragging an element (for fixing a weird bug)
let draggingcourse = -1;
let draggingnote = -1;
// now time for subnode stuff
let subnodecourse = -1;
let subnodenote = -1;
// need a global variable of if we are moving the screen this frame
let xy = [0, 0];
// also a global variable for zoom
let zoom = 1;
// global variable for dragging
let mouseOutsideWindow = false;
// p5js drawing code called every frame
// where most of the real meat happens
function draw() {
  // set background color
  background(220);
  // time for zooming
  translate(mouseX, mouseY);
  scale(zoom);
  translate(-mouseX, -mouseY);
  translate();
  // if the user is holding a key down move everything around
  xy = [0, 0];
  if(!typing) {
    if(keyIsDown(87) || keyIsDown(UP_ARROW))
      xy[1] += movespeed / zoom;
    if(keyIsDown(83) || keyIsDown(DOWN_ARROW))
      xy[1] -= movespeed / zoom;
    if(keyIsDown(65) || keyIsDown(LEFT_ARROW))
      xy[0] += movespeed / zoom;
    if(keyIsDown(68) || keyIsDown(RIGHT_ARROW))
      xy[0] -= movespeed / zoom;
  }
  // dragging time
  if(mouseIsPressed) {
    if(mouseButton === CENTER) {
      xy[0] += mouseX - pmouseX;
      xy[1] += mouseY - pmouseY;
    }
  }
  /* I thought this would be a nice feature but I don't actually like it
  TODO: if you want mouse dragging can use this
  if(!typing && focused && !mouseOutsideWindow) {
    if(mouseX > windowWidth * .9)
      xy[0] -= movespeed / zoom;
    if(mouseX < windowWidth * .1)
      xy[0] += movespeed / zoom;
    if(mouseY > windowHeight * .9)
      xy[1] -= movespeed / zoom;
    if(mouseY < windowHeight * .1)
      xy[1] += movespeed / zoom;
  }
  */
  // draw mode time, do some nonsense
  // I'm not sure what this will entail yet so gonna put it in another function
  // pass xy also so we can move some stuff around
  // draw the lines
  // I love anonymous functions apparently (I use them a lot)
  // for every line that exists this is going to draw them
  lineList.forEach(lineListHandler);
  // draw all the subnode stuff
  strokeWeight(2);
  stroke(0);
  rectMode(CORNER);
  fill(255);
  subnodeboxesList.forEach(subnodeHandler);
  // foreach loop that does everything to every course we want to do
  // each frame. IE, move courses if keys held, draw them
  // loop that goes through and does everything we need for notes
  // mostly same as courses
  noteList.forEach(noteListHandler);
  // loop that goes through and does everything we want for each course
  courseList.forEach(courseListHandler);
  // move edit buttons around with nodes
  if(lastCodeClicked !== "" && lastNodeTypeClicked !== null) {
    let node = null;
    switch(lastNodeTypeClicked) {
      case nodeTypes.note:
        node = noteList[noteMap.get(lastCodeClicked)];
        break;
      case nodeTypes.course:
        node = courseList[courseMap.get(lastCodeClicked)];
        break;
    }
    if(node !== null && node !== undefined) {
      editNodesDiv.style.top = (node.y - node.height/2 - textLeading() - 5 - mouseY)*zoom + mouseY + 'px';
      editNodesDiv.style.left = (node.x - node.width/2 - mouseX)*zoom + mouseX + 'px';
    }
  }
}

// -------------------------------- Draw For Loops -------------------------------- //
// helper function that handles the linelist in draw
const lineListHandler = (line, index, lines) => {
  // set strokeWeight
  strokeWeight(2);
  stroke(0);
  // remove fill so lines don't do this weird nonsense effect where they
  // fill in the area you were drawing
  noFill();
  beginShape();
  let mousehovering = false;
  if(mode === modes.delete) {
    strokeWeight(5);
    stroke(200, 0, 0);
    // so clicking on a point removes the whole line
    // I did it this way for now at least because any other way
    // is way more work and complicated and math and innefecient
    // than I want it to be
    for(let i = 0; i < line.length - 1; i += 2) {
      // draw some points so they can see what they are trying to delete
      point(line[i], line[i + 1]);
      if(!typing && dist(mouseX, mouseY, line[i], line[i + 1]) < 8) {
        // mouse hovering is used later
        mousehovering = true;
        if(mouseIsPressed)
          lines.splice(index, 1);
      }
    }
    strokeWeight(2);
  }
  // you might have noticed we loop through the lines twice
  // this is because first we need to check if we are hovering over the line
  // because if we are we need to go through and draw the line in a different color
  // so users know what they are deleting
  for(let i = 0; i < line.length - 1; i += 2) {
    // highlight line if you are hovering over it
    if(mousehovering)
      stroke(200, 0, 0);
    else
      stroke(0);
    // if they are moving around the screen change line position
    line[i] += xy[0];
    line[i+1] += xy[1];
    if(mode === modes.draw && index === lines.length - 1) {
      strokeWeight(5);
      point(line[i], line[i + 1]);
      strokeWeight(2);
    }
    curveVertex(line[i], line[i + 1]);
  }
  // if we are in draw mode so they can see what they are about to do treat
  // their mouse position as a point, ie when they click and actually make
  // a point they know what it will look like before they click
  if(mode === modes.draw && index === lines.length - 1)
    curveVertex(mouseX, mouseY);
  endShape();
};
// helper function that handles the first courselist draw
// actually wait, with the new method we no longer need two draw calls to courselist
// incredible
const courseListHandler = (course, index, arr) => {
  // stroke stuff
  strokeWeight(1);
  stroke(0);
  textSize(fontsize);
  textFont(myFont);
  textStyle(NORMAL);
  textAlign(CENTER, CENTER);
  // move the courses based on which keys are held
  course.x += xy[0];
  course.y += xy[1];

  // if hovering over the box change fill
  // oh, but also to fix a weird bug if this is the course we are dragging then also set fill
  let mouseHovering = draggingcourse === index;
  // intersecting course check
  if(mouseHovering || (mouseX > course.x - course.width/2 && mouseX < course.x + course.width/2 && mouseY > course.y - course.height/2 && mouseY < course.y + course.height/2)) {
    mouseHovering = true;
    fill(200, 200, 200);
  } else {
    fill(255, 255, 255);
  }
  // draw the rectangle around our course
  rectMode(CENTER);
  rect(course.x, course.y, course.width, course.height);
  // in different modes do some different things
  switch(mode) {
    case modes.delete:
      // make the text fill different
      fill(200, 0, 0);
      if(typing)
        break;
      // if you click the course delete it
      // deleting it in this case is just removing it from our master list of courses
      if(mouseIsPressed && mouseHovering) {
        // wait more complicated now obviously, because code getting more complicated
        // every course that comes after this one now moves positions backwards one
        courseMap.forEach(function(value, key) {
          if(value > index) {
            courseMap.set(key, value - 1);
          }
        });
        courseMap.delete(courseList[index].code);
        arr.splice(index, 1);
      }
      break;
    case modes.edit:
      fill(0, 0, 200);
      if(typing)
        break;
      // if we haven't been dragging a course then make this course the one we drag
      // this actually fixes a plethora of bugs
      // 1: moving more than one course at a time
      // 2: moving the mouse too fast and leaving the course so you just aren't dragging it anymore
      // 3: flashing fill
      if(draggingcourse === -1 && draggingnote === -1 && mouseIsPressed && mouseHovering) {
        draggingcourse = index;
      }
      // if this is the course we are dragging move it to mouse position
      // you might have noticed that when dragging the course the box lags behind the text
      // that's because we basically have to put this here and our box we have to draw before
      // we actually move the course
      // this is just the most efficient and it's actually a cool effect so it's staying
      // if there isn't any active subnoding right now, do the following
      if(subnodenote === -1 && subnodecourse === -1) {
        // if this is the course we are dragging then move it to the mouse
        if(draggingcourse === index) {
          course.x = mouseX;
          course.y = mouseY;
          // else if we are hovering and the mouse is pressed and there isn't a subnodecourse then make this the subnode course
        } else if(mouseHovering && mouseIsPressed && subnodecourse === -1 && subnodenote === -1) {
          // put what we are dragging into the subnodes for this course
          course.subnodes.push(draggingcourse === -1 ? noteList[draggingnote].code.toString() : courseList[draggingcourse].code);
          subnodecourse = index;
        }
      }
      // it this is the subnode and we stopped hovering over it remove the subnode we just added
      if(subnodecourse === index && !mouseHovering) {
        subnodecourse = -1;
        course.subnodes.pop();
      }
      // if we don't have any subnodes then break and remove us form the subnodes list
      if(course.subnodes.length === 0) {
        // if we exist in the list of subnodes then delete us since we don't have any anymore
        if(subnodeboxesMap.has(course.code)) {
          // jesus, this but took so long to figure out
          // not doing this means there are duplicate subnodes created
          // ok, now doing this makes duplicates???
          // ok, got it hopefully
          let deleting = subnodeboxesMap.get(course.code);
          subnodeboxesMap.forEach((value, key) => {
            if(value > deleting)
              subnodeboxesMap.set(key, value - 1);
          });
          subnodeboxesList.splice(subnodeboxesMap.get(course.code), 1);
          subnodeboxesMap.delete(course.code);
        }
        break;
      }
      // this is the box around this course that holds all the subnodes
      let subnodebox = {
        code: course.code,
        x: course.x - course.width/2,
        y: course.y - course.height/2,
        width: course.width,
        height: course.height,
        lines: []
      }
      // this is how far in we place lines to subnodes
      let insetx = course.x - course.width/2 + subnodeinset/2;
      // well subnodebox isn't the box yet, we gotta calculate all it's stuff
      course.subnodes.forEach((sub, ind, ar) => {
        subnodeboxmaker(course, mouseHovering, subnodebox, sub, ind, ar, insetx);
      });
      // now we have to update our map and list with our new subnodebox
      // replace the one that already exists for this, or if it doesn't make a new one
      if(subnodeboxesMap.has(subnodebox.code)) {
        subnodeboxesList[subnodeboxesMap.get(subnodebox.code)] = subnodebox;
      } else {
        subnodeboxesMap.set(subnodebox.code, subnodeboxesList.length);
        subnodeboxesList.push(subnodebox);
      }
      break;
    default:
      if(mouseIsPressed && mouseHovering)
        openNodeOptions(nodeTypes.course, course);
      fill(0, 0, 0);
  }
  // we were doing a lot of drawing so just remove the stroke don't want it on the text
  noStroke();
  // draw course code, credit hours, and name to the screen
  textAlign(CENTER, TOP);
  textStyle(BOLD);
  text(course.code + "-" + course.credits, course.x, course.y - course.height/2 + boxpadding.y/2);
  textStyle(NORMAL);
  text(course.name, course.x, course.y - course.height/2 + boxpadding.y/2 + textLeading());
};
// helper function that handles everything for notes
const noteListHandler = (note, index, arr) => {
  // set some stroke stuff
  strokeWeight(1);
  stroke(0);
  textSize(fontsize);
  textFont(myFont);
  // move notes if moving screen
  note.x += xy[0];
  note.y += xy[1];

  // check if dragging this box
  let mouseHovering = draggingnote === index;
  // intersecting course check
  if(mouseHovering || (mouseX > note.x - note.width/2 && mouseX < note.x + note.width/2 && mouseY > note.y - note.height/2 & mouseY < note.y + note.height/2))
    mouseHovering = true;
  if(mouseHovering)
    fill(200, 200, 200);
  else
    fill(255, 255, 255);
  // draw rect around note
  rectMode(CENTER);
  rect(note.x, note.y, note.width, note.height);
  // TODO: delete and edit
  switch(mode) {
    case modes.delete:
      // make the text fill different
      fill(200, 0, 0);
      if(typing)
        break;
      // if you click it delete it
      if(mouseIsPressed && mouseHovering) {
        noteMap.delete(noteList[index].code.toString());
        arr.splice(index, 1);
      }
      break;
    case modes.edit:
      fill(0, 0, 200);
      if(typing)
        break;

      if(draggingnote === -1 && draggingcourse === -1 && mouseIsPressed && mouseHovering) {
        draggingnote = index;
      }
      // copying from course cause they work the same
      // should I just combine the two???
      // no, I guess they do work differently in many ways
      // but I could combine this function? eh, eh, seems risky for no reward
      if(subnodenote === -1 && subnodecourse === -1) {
        if(draggingnote === index) {
          note.x = mouseX;
          note.y = mouseY;
        } else if(mouseHovering && mouseIsPressed) {
          note.subnodes.push(draggingcourse === -1 ? noteList[draggingnote].code.toString() : courseList[draggingcourse].code);
          subnodenote = index;
        }
      }
      if(subnodenote === index && !mouseHovering) {
        subnodenote = -1;
        note.subnodes.pop();
      }
      // loop through subnodes time
      note.subnodes.forEach(subnodeHandler);
      break;
    default:
      if(mouseIsPressed && mouseHovering)
        openNodeOptions(nodeTypes.note, note);
      fill(0);
  }
  // don't want stroke on text
  noStroke();
  // finally draw the text
  // if it doesn't have a title center text
  if(note.title === '') {
    textStyle(NORMAL);
    textAlign(LEFT, CENTER);
    text(note.text, note.x - note.width/2 + boxpadding.x/2, note.y);
  // if it does and text is blank then center it
  } else if(note.text === '') {
    textStyle(BOLD);
    textAlign(CENTER, CENTER);
    text(note.title, note.x, note.y);
  // both exist so put title at top and text after
  } else {
    textStyle(BOLD);
    textAlign(CENTER, TOP);
    text(note.title, note.x, note.y - note.height/2 + boxpadding.y/2);
    textStyle(NORMAL);
    textAlign(LEFT, TOP);
    text(note.text, note.x - note.width/2 + boxpadding.x/2, note.y - note.height/2 + boxpadding.y/2 + textLeading());
  }
};
// In edit, process subnodeboxes and make them and all that
function subnodeboxmaker(node, mouseHovering, subnodebox, fsub, sindex, sarr, insetx) {
    let subnode = "";
    // find the subnode
    if(courseMap.has(fsub)) {
      subnode = courseList[courseMap.get(fsub)];
    } else if(noteMap.has(fsub)) {
      subnode = noteList[noteMap.get(fsub)];
    // the subnode doesn't exist which must mean it was deleted so lets remove it from our subnodes, and return
    } else {
      sarr.splice(sindex, 1);
      return;
    }
    // if we are not hovering over this but dragging subnode, remove it from our subnodes
    if(!mouseHovering && (courseMap.get(fsub) === draggingcourse || noteMap.get(fsub) === draggingnote)) {
      sarr.splice(sindex, 1);
      return;
    }
    // if the subnode has subnodes, we gotta do some different math than if it doesn't
    if(subnode.subnodes.length > 0) {
      // get the subnodes subnodebox
      let position = subnodeboxesMap.get(subnode.code);
      let dsub = subnodeboxesList[position];
      // change the subnodes position to be under the current node
      subnode.x = subnodebox.x + subnode.width/2 + subnodeinset + subnodepadding;
      subnode.y = subnodebox.height + subnodebox.y + subnode.height/2 + subnodeleading + subnodepadding;
      // figure out our subnodebox size
      subnodebox.height += dsub.height + subnodeleading + subnodepadding*2;
      let width = dsub.width + subnodeinset + subnodepadding*2;
      if(subnodebox.width < width)
        subnodebox.width = width;
      // TODO: check goes here for if subnodes in wrong order
      // so p5js draws in the order you tell it, so here we can get a subnodebox on top of
      // another that is smaller and should be on top of the other
      // so if you're subnode's subnodebox is before yours, switch places in the map with each other
      let npos = subnodeboxesMap.get(node.code);
      if(npos !== undefined && position < npos) {
        let tmpbox = subnodeboxesList[position];
        subnodeboxesList[position] = subnodeboxesList[npos];
        subnodeboxesList[npos] = tmpbox;
        subnodeboxesMap.set(node.code, position);
        subnodeboxesMap.set(subnode.code, npos);
      }
    // the subnode doesn't have subnodes so we can do some different stuff
    } else {
      // move our subnode to under us
      subnode.x = subnodebox.x + subnode.width/2 + subnodeinset;
      subnode.y = subnodebox.height + subnodebox.y + subnode.height/2 + subnodeleading;
      // calculate our subnodebox size
      subnodebox.height += subnode.height + subnodeleading;
      if(subnodebox.width < subnode.width + subnodeinset)
        subnodebox.width = subnode.width + subnodeinset;
    }
    // now we gotta add some nice lines to our subnodes
    // the first line is just horizontal, draw from the left, to the right
    let temparray = [insetx, subnode.y, subnode.x, subnode.y];
    subnodebox.lines.push(temparray);
    // the last line is the vertical line connecting all the horizontal lines
    if(sindex === sarr.length-1) {
      temparray = [insetx, node.y, insetx, subnode.y];
      subnodebox.lines.push(temparray);
    }
}
// helper function for handling subnode drawing
// plus some variables for drawing a nice box
// spacing around the subnodes
let subnodepadding = 10;
// how far in a subnode goes
let subnodeinset = 18;
// spacing between subnode items
let subnodeleading = 6;
// this function just draws all the subnode boxes and lines connecting subnodes, very simple
const subnodeHandler = (subnode) => {
  rect(subnode.x - subnodepadding, subnode.y - subnodepadding, subnode.width + subnodepadding*2, subnode.height + subnodepadding*2);
  subnode.lines.forEach((ln) => {
    line(ln[0], ln[1], ln[2], ln[3]);
  });
};

// -------------------------------- Mouse Events -------------------------------- //
// when mouse is pressed do some stuff
function mousePressed() {
  // TODO
  // no longer check here for linelist check in courseList since want to know if intersecting
  // so delete this
  // there's a bug here, not sure how to fix it yet though
  // I fixed it. see mousemovedbtn variable
  // in drawing mode add a point to our list of lines if you click the mouse
  if(mode === modes.draw && !typing) {
    lineList[lineList.length - 1].push(mouseX);
    lineList[lineList.length - 1].push(mouseY);
  }
}
// do a zoom when mouseWheel moved
function mouseWheel(event) {
  if(typing)
    return;
  zoom += -event.delta / 1000;
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

// -------------------------------- Keyboard Events -------------------------------- //
// special key pressed
function keyPressed() {
  // this stupid collapse function thingy doesn't show up for this one
  // oh, I figured out how to fix it though, hover over the line number then
  // it'll fix all the stupid little arrows so you can collapse functions

  // if you press enter in drawing mode finish the line and start a new one
  if(keyCode === ENTER && mode === modes.draw) {
    // if the line was too short jk, just pop it and start a new one
    if(lineList[lineList.length - 1].length < 8)
      lineList.pop();
    lineList.push([]);
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
  if(key === 'l') {
    print(lineList);
  }
  // I also wanna see the courselist and courseMap for debuggingc
  if(key === 'c') {
    print(courseList);
    print(courseMap);
  }
  // and notes
  if(key === 'n') {
    print(noteList);
    print(noteMap);
  }
  // and subnodes bc these are a pain
  if(key === 's') {
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
  }
  // just subnode list and map
  if(key === 'S') {
    subnodeboxesList.forEach(subnodebox => {
      print(subnodebox.code);
    });
    subnodeboxesMap.forEach((value, key) => {
      print(value + ":" + key)
    });
  }
}

// -------------------------------- Miscellaneous Events -------------------------------- //
// if the window is resized this function is called
function windowResized() {
  // resize the canvas to fit the screen
  resizeCanvas(windowWidth-20, windowHeight-20);
  // set background color
  background(220);
}
