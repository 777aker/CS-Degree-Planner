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
// I've created a prototype for the new lines, time to actually do it though
// https://editor.p5js.org/777aker/sketches/gHNWCe4Eu
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
// completing a course time
// this is a separate map because I want to actually save it differently than everything else
// that way you can just load a completed coursework specifically file
let completions = {
  incomplete: 0,
  available: 1,
  planned: 2,
  inprogress: 3,
  complete: 4,
};
let completionMap = new Map();
// -------------------------------- Miscellaneous Menu -------------------------------- //
// quick bug fix
const editdropdwn = document.querySelector('.edit-dropdown');
editdropdwn.addEventListener('mouseover', function() {
  typing = true;
});
editdropdwn.addEventListener('mouseleave', function() {
  typing = false;
});
const filedropdown = document.querySelector('.save-dropdown');
filedropdown.addEventListener('mouseover', function() {
  typing = true;
});
filedropdown.addEventListener('mouseleave', function() {
  typing = false;
});
const viewdropdown = document.querySelector('.view-dropdown');
viewdropdown.addEventListener('mouseover', function() {
  typing = true;
});
viewdropdown.addEventListener('mouseleave', function() {
  typing = false;
});
