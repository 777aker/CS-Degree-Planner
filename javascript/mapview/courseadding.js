// -------------------------------- Adding Courses Section -------------------------------- //
// get the course form and div containing it and save as global variables
const addCourseDiv = document.querySelector('.add-course-div');
addCourseDiv.addEventListener('mouseover', function() {
  typing = true;
});
addCourseDiv.addEventListener('mouseleave', function() {
  typing = false;
});
const addCourseForm = document.querySelector('.add-course-form');
// function called when user presses add course button in the edit menu
function addCourse() {
  // set typing to true (so hitting keys doesn't trigger events)
  typing = true;
  // clear the form
  addCourseForm.innerHTML = '';
  // create a description explaining this thingy
  createFormText(addCourseForm, "This is a form that allows you to add courses to the layout", false);
  // create the labels and inputs for the form
  // first the course code input field
  // I was smart and made a form helper function
  createFormTextField(addCourseForm, "Course Code:", "coursecode", "Enter Course Code", false);
  createFormText(addCourseForm, "If the course code already exists this form will replace that course when submitted");
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
  const hr = document.createElement('hr');
  addCourseForm.appendChild(hr);
  createFormButtonWithTitle(addCourseForm, "addprereqgroup", "Add Prerequisite Group", addPrereqGroup,
    "This will add a group of prerequisites. Each group should contain prerequisites that fulfill the same requirement");
  // remove a prereq group (does opposite of previous button)
  createFormButtonWithTitle(addCourseForm, "removeprereqgroup", "Remove Prerequisite Group", removePrereqGroup,
    "This will remove the bottommost list of prerequisites");
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
  //gopenEditMenu();
  let course = courseList[courseMap.get(lastCodeClicked)];
  closeNodeOptions();
  createFormTextFieldWithValue(addCourseForm, "Course Code:", "coursecode", "Enter Course Code", course.code, false);
  createFormTextFieldWithValue(addCourseForm, "Credit Hours:", "ch", "Enter Credit Hours", course.credits, false);
  createFormTextFieldWithValue(addCourseForm, "Course Name:", "coursename", "Enter Course Name", course.name, false);
  // now time for the complicated part of this
  // for each group of prereqs create a div
  if(course.prerequisites !== undefined && course.prerequisites !== null) {
    course.prerequisites.forEach(prereqGroup => {
      let groupdiv = document.createElement('div');
      groupdiv.setAttribute('class', 'prereqGroupDiv');
      addCourseForm.appendChild(groupdiv);
      // for each actual prereq create a text field
      prereqGroup.forEach(prereq => {
        createFormTextFieldWithValue(groupdiv, "", "", "Enter Prerequisite Code Only", prereq);
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
  createFormButtonWithTitle(addCourseForm, "addprereqgroup", "Add Prerequisite Group", addPrereqGroup,
    "This will add a group of prerequisites. Each group should contain prerequisites that fulfill the same requirement");
  createFormButtonWithTitle(addCourseForm, "removeprereqgroup", "Remove Prerequisite Group", removePrereqGroup,
    "This will remove the bottommost list of prerequisites");
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
  let addabove = document.querySelector("#addprereqgroup");
  addCourseForm.insertBefore(groupdiv, addabove);
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
  prereqbtn.setAttribute("title", "Add another prerequisite code that fulfills the same requirement");
  addCourseForm.insertBefore(prereqbtn, addabove);
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
  prereqbtn.setAttribute("title", "Remove most recently added prerequisite code box");
  addCourseForm.insertBefore(prereqbtn, addabove);
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
      if(divlist[j].value !== "Enter Prerequisite Code Only" && divlist[j].value !== "") {
        prereq.push(divlist[j].value);
        lineList.push([divlist[j].value, coursecode]);
      }
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
  if(courseMap.has(lastCodeClicked)) {
    replaceElement(courseList, courseMap, lastCodeClicked, course);
  } else {
    // helper function that puts things into our course list
    pushElement(courseList, courseMap, course);
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
  lastCodeClicked = "";
  lastNodeTypeClicked = null;
  typing = false;
}
