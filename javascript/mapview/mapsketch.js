// Putting some global variables up here like I should
let fontsize = 14;
let boxpadding = {
  x: 15,
  y: 10
}

// p5js setup function
function setup() {
  // create the canvas (subtract 20 so no scroll nonsense)
  createCanvas(windowWidth-20, windowHeight-20);
  // set framerate to 30 anything more is a waste of power
  frameRate(30);
  // set up the edit menu
  editMenuSetUp();
}

// set up the buttons for the edit menu
function editMenuSetUp() {
  // uses p5js to make buttons because much easier than actual html nonsense
  // create add course button (made a helper function for this)
  makeAButton('Add Course', addCourse, "editbuttons", "addcoursebtn", "#dropdown-content");
  // create add node button
  // idk what to tell you about the first being '' and the others being ""
  // ...it's a....convention thing....yea
  makeAButton('Add Note', addNode, "editbuttons", "addnodebtn", "#dropdown-content");
  // create draw path button
  makeAButton('Draw Path', drawPath, "editbuttons", "drawbtn", "#dropdown-content");
  // create delete button
  makeAButton('Delete Mode', deleteMode, "editbuttons", "deletebtn", "#dropdown-content");
  // create move button
  makeAButton('Edit Positions', editPositions, "editbuttons", "editbtn", "#dropdown-content");
}

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

// whether or not we are typing a form (so that we don't move the screen and stuff while typing / do special key presses)
let typing = false;
// get the course form and div containing it and save as global variables
const addCourseDiv = document.querySelector('.add-course-div');
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
  let tempbutton = document.createElement("input");
  tempbutton.setAttribute("id", "addprereqgroup");
  tempbutton.setAttribute("type", "button");
  tempbutton.setAttribute("value", "Add Prerequisite Group");
  addCourseForm.appendChild(tempbutton);
  tempbutton.addEventListener('click', addPrereqGroup);
  // remove a prereq group (does opposite of previous button)
  tempbutton = document.createElement("input");
  tempbutton.setAttribute("id", "removeprereqgroup");
  tempbutton.setAttribute("type", "button");
  tempbutton.setAttribute("value", "Remove Prerequisite Group");
  addCourseForm.appendChild(tempbutton);
  tempbutton.addEventListener('click', removePrereqGroup);
  // make it visible (it = the whole form)
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
  form.appendChild(tempinput);
  if(br)
    form.appendChild(document.createElement("br"));
}

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
      prereq.push(divlist[j].value);
    }
    // add that list to our list of lists of prereqs
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
  const course = {
    code: coursecode,
    credits: ch,
    name: coursename,
    prerequisites: prereqs,
    x: windowWidth / 2,
    y: windowHeight / 2,
    height: textLeading() * 2 + boxpadding.y,
    width: bold > textWidth(coursename) ? bold + boxpadding.x : textWidth(coursename) + boxpadding.x
  };
  // and also add a line connecting it to our linelist
  // but we have to do some special formatting so linelist can draw them easily
  prereqs.forEach(prereqgroup => {
    // since all of these are in the same prereq group we could probably do something fancy here
    // TODO this is a good spot to fix how prereqs with the same requirement are added
    prereqgroup.forEach(prereq => {
      lineList.push([coursecode, coursecode, prereq, prereq]);
    });
  });
  // if the courseMap already has this course code then replace it with the new one
  if(courseMap.has(coursecode)) {
    // also, set course position to where it was
    course.x = courseList[courseMap.get(coursecode)].x;
    course.y = courseList[courseMap.get(coursecode)].y;
    courseList[courseMap.get(coursecode)] = course;
  } else {
    // if the course map doesn't have it then the course doesn't exist push
    // it to the map and save where it is at
    courseMap.set(coursecode, courseList.length);
    courseList.push(course);
  }
  // clear and hide the form we're done with it
  addCourseForm.innerHTML = '';
  addCourseDiv.style.display = "none";
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

// function called when user presses add node button
// basically will do the same thing as add course button
// but this doesn't have to be a course this could just be a little
// box you want to make for your convenience / understanding
const addNodeDiv = document.querySelector('.add-node-div');
const addNodeForm = document.querySelector('.add-node-form');
function addNode() {
  // set typing to true so certain events aren't triggered
  typing = true;
  // clear the form
  addNodeForm.innerHTML = '';
  // create the labels and inputs for the form
  createFormTextField(addNodeForm, "Node Title:", "nodetitle", "Title of the node", true);
  createFormTextArea(addNodeForm, "Node Text:", "nodetext", "Text of the node", true);
  // make it visible
  addNodeDiv.style.display = 'block';
}

// submit for a new node
const submitnodebtn = document.querySelector('#submitnode');
submitnodebtn.addEventListener('click', submitNode);
// when submit node is pressed do the following
function submitNode() {
  // get info from form
  const title = addNodeForm.querySelector("#nodetitle").value;
  const text = addNodeForm.querySelector("#nodetext").value;
  // nodes behind the scenes need unique identifiers for connecting, drawing, and saving
  // so we are going to make a hash map
  // TODO: hash function may need some work since most nodes will have same text
  let hash = getHash(title + text + nodeList.length);
  while(nodeMap.has(hash)) {
    hash += 1;
    hash |= 0;
  }
  textSize(fontsize);
  let hasTitle = title !== '' && title !== 'Title of the node';
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
  // add the node
  const node = {
    code: hash,
    title: hasTitle ? title : '',
    text: hasText ? text : '',
    x: windowWidth / 2,
    y: windowHeight / 2,
    width: width,
    height: height
  };
  nodeMap.set(hash, nodeList.length);
  nodeList.push(node);
  addNodeForm.innerHTML = '';
  addNodeDiv.style.display = 'none';
  typing = false;
}

// this stores all of our nodes
/*
  node = {
    code:
    title:
    text:
    x:
    y:
  }
*/
let nodeList = [];
// this is our node hashmap for finding nodes
const nodeMap = new Map();

// need a hash function for the nodes
function getHash(str) {
  let hash = 0;
  for(let i = 0; i < str.length; i++) {
    let chr = str.charCodeAt(i);
    hash = (hash << 5) - hash + chr;
    hash |= 0;
  }
  return hash;
}

// cancel adding a node
const cancelnodebtn = document.querySelector("#cancelnode");
cancelnodebtn.addEventListener('click', cancelNode);
function cancelNode() {
  addNodeDiv.style.display = 'none';
  addNodeForm.innerHTML = '';
  typing = false;
}

// form holding the templates we can choose from


// this is the global mode variable
// tells us what mode we are in: draw, delete, edit, ""
let mode = "";

// function called when user presses draw path button
function drawPath() {
  // have to have this moved mouse button nonsense because if you don't then
  // it draws a path when the user enter draw path mode because they click to enter it
  // so set moved mouse to false and wait until they move it before you start draw mode
  mousemovedbtn = false;
  // if we entered draw mode make a new line for us to draw on
  if(mode !== "draw")
    lineList.push([]);
  // mode changer helper function
  modeChanger("draw", "rgb(0, 200, 0)");
}

// function called when user presses delete mode button
function deleteMode() {
  modeChanger("delete", "rgb(200, 0, 0)");
}

// function called when user presses edit positions button
function editPositions() {
  modeChanger("edit", "rgb(0, 0, 200)");
}

// changing the modes looks very similar for everying so here is a helper
// especially so we don't miss anything
function modeChanger(fmode, color) {
  // set each of the edit buttons to black
  let buttons = document.querySelectorAll(".editbuttons");
  buttons.forEach(button => {
    button.style.color = "rgb(0, 0, 0)";
  });
  // if we are in the mode of the button we just pressed then clear mode
  if(mode === fmode) {
    mode = "";
  } else {
    mode = fmode;
    // make the button the color passed so we can actually tell what mode we are in
    document.querySelector("#" + mode + "btn").style.color = color;
  }
  // if we got out of draw mode and the last line they were drawing isn't long enough
  // to actually be a line remove it
  if(lineList.length > 0 && mode !== "draw") {
    if(lineList[lineList.length - 1].length < 8) {
      lineList.pop();
    }
  }
}

// I can't handle having to make an entire set of nodes for testing anymore
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
const loadbutton = document.querySelector("#loadbtn");
loadbutton.addEventListener('click', loadFile);
const savetext = document.querySelector("#savetxt");
const loadtext = document.querySelector("#loadtxt");

// this takes the courselist and linelist we have for everything and saves
// them to a json file
function saveFile() {
  //print(savetext.value);
  let json = {};
  json.courses = courseList;
  json.coursemap = Object.fromEntries(courseMap);
  json.nodes = nodeList;
  json.nodemap = Object.fromEntries(nodeMap);
  json.lines = lineList;
  saveJSON(json, savetext.value);
}

// this loads a courselist and linelist from a json file
function loadFile() {
  //print(loadtext.value);
  loadJSON("/jsons/" + loadtext.value + ".json", processJSON);
}

// process json file loaded
function processJSON(json) {
  if(json.courses !== null && json.courses !== undefined)
    courseList = json.courses;
  if(json.coursemap !== null && json.coursemap !== undefined) {
    const remap = new Map(Object.entries(json.coursemap));
    courseMap.clear();
    remap.forEach(function(value, key) {
      courseMap.set(key, value);
    });
  }
  if(json.nodes !== null && json.nodes !== undefined)
    nodeList = json.nodes;
  if(json.nodemap !== null && json.nodemap !== undefined) {
    const remap2 = new Map(Object.entries(json.nodemap));
    nodeMap.clear();
    remap2.forEach(function(value, key) {
      nodeMap.set(key, value);
    });
  }
  lineList = json.lines;
}

// movement speed (like moving the camera / all the courses and stuff)
let movespeed = 5;
// is the mouse dragging an element (for fixing a weird bug)
let draggingcourse = -1;
let draggingnode = -1;
// need a global variable of if we are moving the screen this frame
let xy = [0, 0];
// p5js drawing code called every frame
// where most of the real meat happens
function draw() {
  // set background color
  background(220);
  // if the user is holding a key down move everything around
  xy = [0, 0];
  if(!typing) {
    if(keyIsDown(87) || keyIsDown(UP_ARROW))
      xy[1] += movespeed;
    if(keyIsDown(83) || keyIsDown(DOWN_ARROW))
      xy[1] -= movespeed;
    if(keyIsDown(65) || keyIsDown(LEFT_ARROW))
      xy[0] += movespeed;
    if(keyIsDown(68) || keyIsDown(RIGHT_ARROW))
      xy[0] -= movespeed;
  }
  // draw mode time, do some nonsense
  // I'm not sure what this will entail yet so gonna put it in another function
  // pass xy also so we can move some stuff around

  // draw the lines
  // I love anonymous functions apparently (I use them a lot)
  // for every line that exists this is going to draw them
  lineList.forEach(lineListHandler);
  // foreach loop that does everything to every course we want to do
  // each frame. IE, move courses if keys held, draw them
  // loop that goes through and does everything we need for nodes
  // mostly same as courses
  nodeList.forEach(nodeListHandler);
  // loop that goes through and does everything we want for each course
  courseList.forEach(courseListHandler);
}

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
  if(mode === "delete" && !typing) {
    strokeWeight(5);
    stroke(200, 0, 0);
    // so clicking on a point removes the whole line
    // I did it this way for now at least because any other way
    // is way more work and complicated and math and innefecient
    // than I want it to be
    for(let i = 0; i < line.length - 1; i += 2) {
      // draw some points so they can see what they are trying to delete
      point(line[i], line[i + 1]);
      if(dist(mouseX, mouseY, line[i], line[i + 1]) < 8) {
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
    if(mode === "draw" && index === lines.length - 1) {
      strokeWeight(5);
      point(line[i], line[i + 1]);
      strokeWeight(2);
    }
    curveVertex(line[i], line[i + 1]);
  }
  // if we are in draw mode so they can see what they are about to do treat
  // their mouse position as a point, ie when they click and actually make
  // a point they know what it will look like before they click
  if(mode === "draw" && index === lines.length - 1)
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
  textSize(14);
  textFont('Helvetica');
  textStyle(NORMAL);
  textAlign(CENTER, CENTER);
  // move the courses based on which keys are held
  course.x += xy[0];
  course.y += xy[1];

  // if hovering over the box change fill
  // oh, but also to fix a weird bug if this is the course we are dragging then also set fill
  let mouseHovering = draggingcourse === index;
  // intersecting course check
  if(mouseHovering || (mouseX > course.x - course.width/2 && mouseX < course.x + course.width/2 && mouseY > course.y - course.height/2 && mouseY < course.y + course.height/2))
    mouseHovering = true;
  if(mouseHovering)
    fill(200, 200, 200);
  else
    fill(255, 255, 255);
  // draw the rectangle around our course
  rectMode(CENTER);
  rect(course.x, course.y, course.width, course.height);
  // in different modes do some different things
  if(!typing) {
    switch(mode) {
      case "delete":
        // make the text fill different
        fill(200, 0, 0);
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
      case "edit":
        fill(0, 0, 200);
        // if we haven't been dragging a course then make this course the one we drag
        // this actually fixes a plethora of bugs
        // 1: moving more than one course at a time
        // 2: moving the mouse too fast and leaving the course so you just aren't dragging it anymore
        // 3: flashing fill
        if(draggingcourse === -1 && draggingnode === -1 && mouseIsPressed && mouseHovering) {
          draggingcourse = index;
        }
        // if this is the course we are dragging move it to mouse position
        // you might have noticed that when dragging the course the box lags behind the text
        // that's because we basically have to put this here and our box we have to draw before
        // we actually move the course
        // this is just the most efficient and it's actually a cool effect so it's staying
        if(draggingcourse === index) {
          course.x = mouseX;
          course.y = mouseY;
        }
        break;
      default:
        fill(0, 0, 0);
    }
  } else {
    fill(0);
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

// helper function that handles everything for nodes
const nodeListHandler = (node, index, arr) => {
  // set some stroke stuff
  strokeWeight(1);
  stroke(0);
  textSize(14);
  textFont('Helvetica');
  // move nodes if moving screen
  node.x += xy[0];
  node.y += xy[1];

  // check if dragging this box
  let mouseHovering = draggingnode === index;
  // intersecting course check
  if(mouseHovering || (mouseX > node.x - node.width/2 && mouseX < node.x + node.width/2 && mouseY > node.y - node.height/2 & mouseY < node.y + node.height/2))
    mouseHovering = true;
  if(mouseHovering)
    fill(200, 200, 200);
  else
    fill(255, 255, 255);
  // draw rect around node
  rectMode(CENTER);
  rect(node.x, node.y, node.width, node.height);
  // TODO: delete and edit
  if(!typing) {
    switch(mode) {
      case "delete":
        // make the text fill different
        fill(200, 0, 0);
        // if you click it delete it
        if(mouseIsPressed && mouseHovering) {
          nodeMap.delete(nodeList[index].code);
          arr.splice(index, 1);
        }
        break;
      case "edit":
        fill(0, 0, 200);
        if(draggingnode === -1 && draggingcourse === -1 && mouseIsPressed && mouseHovering) {
          draggingnode = index;
        }
        if(draggingnode === index) {
          node.x = mouseX;
          node.y = mouseY;
        }
        break;
      default:
        fill(0);
    }
  } else {
    fill(0);
  }
  // don't want stroke on text
  noStroke();
  // finally draw the text
  // if it doesn't have a title center text
  if(node.title === '') {
    textStyle(NORMAL);
    textAlign(LEFT, CENTER);
    text(node.text, node.x - node.width/2 + boxpadding.x/2, node.y);
  // if it does and text is blank then center it
  } else if(node.text === '') {
    textStyle(BOLD);
    textAlign(CENTER, CENTER);
    text(node.title, node.x, node.y);
  // both exist so put title at top and text after
  } else {
    textStyle(BOLD);
    textAlign(CENTER, TOP);
    text(node.title, node.x, node.y - node.height/2 + boxpadding.y/2);
    textStyle(NORMAL);
    textAlign(LEFT, TOP);
    text(node.text, node.x - node.width/2 + boxpadding.x/2, node.y - node.height/2 + boxpadding.y/2 + textLeading());
  }
};

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

// this is the only fix I can thing of for now
// it's like a weird drawing mode bug that happens because you click
// the drawing mode button to enter drawing mode so it counts that click
// in drawing mode as a point, so just say if they haven't moved the mouse since
// entering drawing mode just don't do anything
let mousemovedbtn = false;
function mouseMoved() {
  mousemovedbtn = true;
}

// when mouse is pressed do some stuff
function mousePressed() {
  // TODO
  // no longer check here for linelist check in courseList since want to know if intersecting
  // so delete this
  // there's a bug here, not sure how to fix it yet though
  // I fixed it. see mousemovedbtn variable
  // in drawing mode add a point to our list of lines if you click the mouse
  if(mode === "draw" && mousemovedbtn && !typing) {
    lineList[lineList.length - 1].push(mouseX);
    lineList[lineList.length - 1].push(mouseY);
  }
}

/*
course looks like
course = {
  code: coursecode,
  credits: ch,
  name: coursename,
  prerequisites: prereqs,
  x: number,
  y: number
};
*/

// when mouse is released do these things
function mouseReleased() {
  // no longer dragging a course
  draggingcourse = -1;
  draggingnode = -1;
}

// special key pressed
function keyPressed() {
  // this stupid collapse function thingy doesn't show up for this one
  // oh, I figured out how to fix it though, hover over the line number then
  // it'll fix all the stupid little arrows so you can collapse functions

  // if you press enter in drawing mode finish the line and start a new one
  if(keyCode === ENTER && mode === "draw") {
    // if the line was too short jk, just pop it and start a new one
    if(lineList[lineList.length - 1].length < 8)
      lineList.pop();
    lineList.push([]);
  }
}

// if the window is resized this function is called
function windowResized() {
  // resize the canvas to fit the screen
  resizeCanvas(windowWidth-20, windowHeight-20);
  // set background color
  background(220);
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
  // and nodes
  if(key === 'n') {
    print(nodeList);
    print(nodeMap);
  }
}
