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
  // create add course button
  button = createButton('Add Course');
  // function button calls when pressed
  button.mousePressed(addCourse);
  button.class("editbuttons");
  button.id("addcoursebtn");
  button.parent("#dropdown-content");
  // create add node button
  button = createButton('Add Node');
  button.mousePressed(addNode);
  button.class("editbuttons");
  button.id("addnodebtn");
  button.parent("#dropdown-content");
  // create draw path button
  button = createButton('Draw Path');
  button.mousePressed(drawPath);
  button.class("editbuttons");
  button.id("drawbtn");
  button.parent("#dropdown-content");
  // create delete button
  button = createButton('Delete Mode');
  button.mousePressed(deleteMode);
  button.class("editbuttons");
  button.id("deletebtn");
  button.parent("#dropdown-content");
  // create move button
  button = createButton('Edit Positions');
  button.mousePressed(editPositions);
  button.class("editbuttons");
  button.id("editbtn");
  button.parent("#dropdown-content");
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

// whether or not we are typing a form
let typing = false;
// get the course form and div containing it
const addCourseDiv = document.querySelector('.add-course-div');
const addCourseForm = document.querySelector('.add-course-form');
// function called when user presses add course button
function addCourse() {
  // set typing to true
  typing = true;
  // clear the form
  addCourseForm.innerHTML = '';
  // create the labels and inputs for the form
  // first the course code input field
  createFormTextField(addCourseForm, "Course Code:", "coursecode", "Enter Course Code", false);
  // credit hours input field
  createFormTextField(addCourseForm, "Credit Hours:", "ch", "Enter Credit Hours", false);
  // course name input field
  createFormTextField(addCourseForm, "Course Name:", "coursename", "Enter Course Name", false);
  // now this is more complicated because prereqs can have
  // any number so need to set up some buttons that let you
  // expand the number of prereqs
  let tempbutton = document.createElement("input");
  tempbutton.setAttribute("id", "addprereqgroup");
  tempbutton.setAttribute("type", "button");
  tempbutton.setAttribute("value", "Add Prerequisite Group");
  addCourseForm.appendChild(tempbutton);
  tempbutton.addEventListener('click', addPrereqGroup);
  // remove a prereq group
  tempbutton = document.createElement("input");
  tempbutton.setAttribute("id", "removeprereqgroup");
  tempbutton.setAttribute("type", "button");
  tempbutton.setAttribute("value", "Remove Prerequisite Group");
  addCourseForm.appendChild(tempbutton);
  tempbutton.addEventListener('click', removePrereqGroup);
  // make it visible
  addCourseDiv.style.display = 'block';
}

// remove a prerequisite group
function removePrereqGroup() {
  let lastgroup = document.querySelectorAll(".prereqGroupDiv");
  if(lastgroup.length > 0)
    lastgroup[lastgroup.length - 1].remove();
  let lastbtn = document.querySelectorAll(".addPrereqBtn");
  if(lastbtn.length > 0)
    lastbtn[lastbtn.length - 1].remove();
  lastbtn = document.querySelectorAll(".removePrereqBtn");
  if(lastbtn.length > 0)
    lastbtn[lastbtn.length - 1].remove();
}

// add prereq group button action
function addPrereqGroup() {
  // need to put all prereqs in a div so we can get to them later
  let groupdiv = document.createElement("div");
  groupdiv.setAttribute("class", "prereqGroupDiv");
  addCourseForm.appendChild(groupdiv);
  // prerequisite text boxes under div
  let prereqbox = document.createElement("input");
  prereqbox.setAttribute("type", "text");
  prereqbox.setAttribute("value", "Enter Prerequisite Code Only");
  prereqbox.setAttribute("onfocus", "this.value=''");
  groupdiv.appendChild(prereqbox);
  // add prerequisite button outside of div
  let prereqbtn = document.createElement("input");
  prereqbtn.setAttribute("type", "button");
  prereqbtn.setAttribute("class", "addPrereqBtn");
  prereqbtn.setAttribute("value", "Add Same Requirement Prerequisite");
  addCourseForm.appendChild(prereqbtn);
  // whenever add prereq button clicked create more prereq fields in that div
  prereqbtn.addEventListener('click', function(){
    let prereqbox = document.createElement("input");
    prereqbox.setAttribute("type", "text");
    prereqbox.setAttribute("value", "Enter Prerequisite Code Only");
    prereqbox.setAttribute("onfocus", "this.value=''");
    groupdiv.appendChild(prereqbox);
  });
  // remove prerequisite button below add
  prereqbtn = document.createElement("input");
  prereqbtn.setAttribute("type", "button");
  prereqbtn.setAttribute("class", "removePrereqBtn");
  prereqbtn.setAttribute("value", "Remove Prerequisite");
  addCourseForm.appendChild(prereqbtn);
  // whenever remove is clicked do this
  prereqbtn.addEventListener('click', function(){
    if(groupdiv.lastChild != null)
      groupdiv.lastChild.remove();
  });
}

// helper function for creating form text fields
function createFormTextField(form, label, id, value, br) {
  // create the label element using passed letiables
  let templabel = document.createElement("label");
  templabel.setAttribute("for", id);
  templabel.innerHTML = label;
  form.appendChild(templabel);
  if(br)
    form.appendChild(document.createElement("br"));
  // create the input element using passed letiables
  let tempinput = document.createElement("input");
  tempinput.setAttribute("type", "text");
  tempinput.setAttribute("id", id);
  tempinput.setAttribute("name", id);
  tempinput.setAttribute("value", value);
  tempinput.setAttribute("onfocus", "this.value=''");
  form.appendChild(tempinput);
  if(br)
    form.appendChild(document.createElement("br"));
}

// list of courses
let courseList = [];
// we also need a seperate list of lines
// that connect everything
let linelist = [];
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
  let i = 0;
  let j = 0;
  // loop through the groups of prereqs
  for(i = 0; i < prereqdivs.length; i++) {
    // loop through the div input fields to get each prereq
    const divlist = prereqdivs[i].children;
    let prereq = [];
    // put them all in the same list
    for(j = 0; j < divlist.length; j++) {
      prereq.push(divlist[j].value);
    }
    // add that list to our list of lists of prereqs
    prereqs.push(prereq);
  }
  // now we should actually add all this to the variable that stores all the courses
  const course = {
    code: coursecode,
    credits: ch,
    name: coursename,
    prerequisites: prereqs,
    x: windowWidth / 2,
    y: windowHeight / 2
  };
  courseList.push(course);
  // clear and hide the form
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
function addNode() {

}

// drawing path mode
let mode = "";
// function called when user presses draw path button
function drawPath() {
  mousemovedbtn = false;
  if(mode !== "draw")
    linelist.push([]);
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
  let buttons = document.querySelectorAll(".editbuttons");
  buttons.forEach(button => {
    button.style.color = "rgb(0, 0, 0)";
  });
  if(mode === fmode) {
    mode = "";
  } else {
    mode = fmode;
    document.querySelector("#" + mode + "btn").style.color = color;
  }
  if(linelist.length > 0 && mode !== "draw") {
    if(linelist[linelist.length - 1].length < 8) {
      linelist.pop();
    }
  }
}

// movement speed
let movespeed = 5;
// mouse dragging an element
let draggingcourse = -1;
// p5js drawing code called every frame
function draw() {
  // set background color
  background(220);
  // if the user is holding a key down move the courses around
  let xy = [0, 0];
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
  if(mode === "draw")
    drawmode();
  // draw the lines
  // set strokeWeight back to normal
  strokeWeight(2);
  stroke(0);
  noFill();
  // I love anonymous functions apparently
  linelist.forEach((line, index, lines) => {
    beginShape();
    let mousehovering = false;
    if(mode === "delete") {
      strokeWeight(5);
      stroke(200, 0, 0);
      for(let i = 0; i < line.length - 1; i += 2) {
        point(line[i], line[i + 1]);
        if(dist(mouseX, mouseY, line[i], line[i + 1]) < 8) {
          mousehovering = true;
          if(mouseIsPressed)
            lines.splice(index, 1);
        }
      }
      strokeWeight(2);
    }
    for(let i = 0; i < line.length - 1; i += 2) {
      if(mousehovering)
        stroke(200, 0, 0);
      else
        stroke(0);
      curveVertex(line[i], line[i + 1]);
    }
    if(mode === "draw" && index === lines.length - 1)
      curveVertex(mouseX, mouseY);
    endShape();
  });
  // foreach loop that does everything to every course we want to do
  // each frame. IE, move courses if keys held, draw them
  // rather than do styling each loop though, just do once out here
  textSize(14);
  textAlign(CENTER, CENTER);
  textFont('Helvetica');
  textStyle(NORMAL);
  courseList.forEach((course, index, arr) => {
    strokeWeight(1);
    stroke(0);
    // move the courses based on which keys are held
    course.x += xy[0];
    course.y += xy[1];
    // draw box around courses
    boxsize = course.name.length > course.code.length + course.credits.length ? course.name.length : course.code.length + course.credits.length;
    if(boxsize < 12)
      boxsize *= 5;
    else if(boxsize > 40)
      boxsize *= 3.5;
    else
      boxsize *= 4;
    // if hovering over the box change fill
    let mouseHovering = draggingcourse === index;
    if(mouseHovering || (mouseX > course.x - boxsize && mouseX < course.x + boxsize && mouseY > course.y - 15 && mouseY < course.y + 30))
      mouseHovering = true;
    if(mouseHovering)
      fill(200, 200, 200);
    else
      fill(255, 255, 255);
    rect(course.x - boxsize, course.y - 15, boxsize*2, 45);
    // in different modes do some different things
    switch(mode) {
      case "delete":
        fill(200, 0, 0);
        if(mouseIsPressed && mouseHovering)
          arr.splice(index, 1);
        break;
      case "edit":
        fill(0, 0, 200);
        if(draggingcourse === -1 && mouseIsPressed && mouseHovering) {
          draggingcourse = index;
        }
        if(draggingcourse === index) {
          course.x = mouseX;
          course.y = mouseY;
        }
        break;
      default:
        fill(0, 0, 0);
    }
    noStroke();
    // draw course code, credit hours, and name to the screen
    text(course.code + "-" + course.credits, course.x, course.y);
    text(course.name, course.x, course.y+15);
  });
}

// what to do in draw mode
function drawmode() {
  // draw a point at the cursor
  strokeWeight(5);
  stroke(0);
  for(let i = 0; i < linelist[linelist.length - 1].length - 1; i += 2) {
    point(linelist[linelist.length - 1][i], linelist[linelist.length - 1][i + 1]);
  }
  point(mouseX, mouseY);
}

let mousemovedbtn = false;
// this is the only fix I can thing of for now
function mouseMoved() {
  mousemovedbtn = true;
}

// when mouse is pressed do some stuff
function mousePressed() {
  // there's a bug here, not sure how to fix it yet though
  if(mode === "draw" && mousemovedbtn) {
    linelist[linelist.length - 1].push(mouseX);
    linelist[linelist.length - 1].push(mouseY);
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
}

// special key pressed
function keyPressed() {
  // this stupid collapse function thingy doesn't show up for this one
  // oh, I figured out how to fix it though, hover over the line number then
  // it'll fix all the stupid little arrows so you can collapse functions
  if(keyCode === ENTER && mode === "draw") {
    if(linelist[linelist.length - 1].length < 8)
      linelist.pop();
    linelist.push([]);
  }
}

// if the window is resized this function is called
function windowResized() {
  resizeCanvas(windowWidth-20, windowHeight-20);
  // set background color
  background(220);
}

//  key typed event not for special keys use keyPressed for those
function keyTyped() {
  // shouldn't be used because will fill out course forms
  // so if typing return
  if(typing)
    return;
  if(key === 'f' || key === 'F') {
    let fs = fullscreen();
    fullscreen(!fs);
  }
  if(key === 'l') {
    print(linelist);
  }
}
