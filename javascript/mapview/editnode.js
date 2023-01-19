// -------------------------------- Edit Nodes Section -------------------------------- //
// not sure if this is a helper or miscellaneous menu
// actually, it's its own section
// opens the buttons that allow you to edit the last clicked element
const editNodesDiv = document.querySelector(".edit-nodes-div");
let onEditDiv = false;
editNodesDiv.addEventListener('mouseenter', function() {
  onEditDiv = true;
});
editNodesDiv.addEventListener('mouseleave', function() {
  closeNodeOptions();
});
// deals with opening a new window with the course html page
function openCourseHTML() {
  code = lastCodeClicked;
  courseOpened = getElement(lastCodeClicked);
  closeNodeOptions();
  if(doesFileExist(`coursehtmls/${code}.html`)) {
     window.open(`coursehtmls/${code}.html`);
  } else {
    window.open(`coursehtmls/`);
  }
}
function getCourseOpened() {
  return courseOpened;
}
let courseOpened;
function doesFileExist(path) {
  let http = new XMLHttpRequest();
  http.open('HEAD', path, false);
  http.send();
  return http.status != 404;
}
// form we populate
const editNodeForm = document.querySelector(".edit-node-form");
// close everything
let disabled = false;
function closeNodeOptions() {
  if(disabled)
    return;
  lastCodeClicked = "";
  lastNodeTypeClicked = null;
  editNodesDiv.style.display = "none";
  nodeOpened = "";
  onEditDiv = false;
  currentNodeOpen = false;
}
function openEditMenu() {
  disabled = true;
  editNodesDiv.style.display = "none";
}
// time to actually show the buttons
let lastNodeTypeClicked;
let nodeOpened;
let currentNodeOpen = false;
function openNodeOptions(nodeType, node) {
  // if typing don't show them do nothing just exit
  if(typing || currentNodeOpen || (nodeType === nodeTypes.note && advanceduses === false))
    return;
  disabled = false;
  currentNodeOpen = true;
  editNodesDiv.style.display = "inline-block";
  lastNodeTypeClicked = nodeType;
  lastCodeClicked = node.code;
  nodeOpened = lastCodeClicked;
  // we can expect every node to have an x, y, width, height
  // switch based on node type
  switch(nodeType) {
    case nodeTypes.note:
      editNodeForm.innerHTML = "";
      createFormButtonWithTitle(editNodeForm, "editnodebtn", "Edit Note", editNote,
        "Allows you to edit this notes information");
      editNodesDiv.style.width = '10%';
      updateStyles();
      break;
    case nodeTypes.course:
      editNodeForm.innerHTML = "";
      editNodesDiv.style.width = '30%';
      createFormText(editNodeForm, "Course Code: " + node.code, false);
      createFormText(editNodeForm, "Credit Hours: " + node.credits, false);
      createFormText(editNodeForm, "Course Name: " + node.name, false);
      switch(completionMap.get(node.code)) {
        case completions.available:
          createFormText(editNodeForm, "Completion: Available to Take", false);
          break;
        case completions.inprogress:
          createFormText(editNodeForm, "Completion: Currently Taking", false);
          break;
        case completions.complete:
          createFormText(editNodeForm, "Completion: Completed!", false);
          break;
        default:
          createFormText(editNodeForm, "Completion: Prerequisites not met", false);
          break;
      }
      let completion = completionMap.get(node.code);
      if(completion !== completions.incomplete && completion !== completions.find) {
        const inprogresscheck = createCheckboxes(editNodeForm, "progresscheck", "In Progress");
        const completecheck = createCheckboxes(editNodeForm, "completecheck", "Complete");
        inprogresscheck.addEventListener('click', function() {
          inprogressToggle(inprogresscheck.checked);
          completecheck.checked = false;
        });
        completecheck.addEventListener('click', function() {
          completeToggle(completecheck.checked);
          inprogresscheck.checked = false;
        });
        editNodeForm.appendChild(document.createElement('br'));
        switch(completion) {
          case completions.inprogress:
            inprogresscheck.checked = true;
            break;
          case completions.complete:
            completecheck.checked = true;
            break;
        }
      } else {
        if(pathfinding === node.code) {
          createFormButtonWithTitle(editNodeForm, "closepath", "Close Path to Course", closePath,
          "Closes the path to this Course");
        } else {
          createFormButtonWithTitle(editNodeForm, "showpath", "Show Path to Course", showPath,
          "Shows the courses you need to complete in order to take this course");
        }
      }
      createFormText(editNodeForm, "Prerequisites:", false);
      node.prerequisites.forEach((array) => {
        let str = "";
        array.forEach((code, ind, len) => {
          if(ind !== 0)
            str += " or " + code;
          else
            str += code;
        });
        createFormText(editNodeForm, str, false);
      });
      createFormButtonWithTitle(editNodeForm, "opencoursepage", "Open Course Page", openCourseHTML,
      "Opens a new webpage with more information on this course");
      editNodeForm.appendChild(document.createElement('br'));
      if(advanceduses) {
        createFormButtonWithTitle(editNodeForm, "editnodebtn", "Edit Course", editCourse,
        "Allows you to edit this courses information");
      }
      updateStyles();
      break;
  }
}
function updateStyles() {
  switch(completionMap.get(lastCodeClicked)) {
    case completions.inprogress:
      editNodesDiv.style.background = colors.inprogress;
      editNodesDiv.style.color = "rgb(0, 0, 0)";
      break;
    case completions.complete:
      editNodesDiv.style.background = colors.complete;
      editNodesDiv.style.color = "rgb(0, 0, 0)";
      break;
    case completions.available:
      editNodesDiv.style.background = colors.available;
      editNodesDiv.style.color = "rgb(0, 0, 0)";
      break;
    default:
      editNodesDiv.style.background = colors.incomplete;
      editNodesDiv.style.color = "rgb(0, 0, 0)";
  }
}
function inprogressToggle(tf) {
  if(tf) {
    completionMap.set(lastCodeClicked, completions.inprogress);
    popup(lastCodeClicked + '<br>In Progress', colors.inprogress, colors.inprogresshover);
  } else {
    completionMap.set(lastCodeClicked, completions.available);
    popup(lastCodeClicked + '<br>Available', colors.available, colors.availablehover);
  }
  updateStyles();
}
function completeToggle(tf) {
  if(tf) {
    completionMap.set(lastCodeClicked, completions.complete);
    popup(lastCodeClicked + '<br>Complete!', colors.complete, colors.completehover);
  } else {
    completionMap.set(lastCodeClicked, completions.available);
    popup(lastCodeClicked + '<br>Available', colors.available, colors.availablehover);
  }
  updateStyles();
}
// time to figure out how we show a path to a course
let pathfinding;
function showPath() {
  completionMap.forEach((value, key) => {
    if(value === completions.find) {
      completionMap.set(key, completions.incomplete);
    }
  });
  pathfinding = lastCodeClicked;
  completionMap.set(lastCodeClicked, completions.find);
  closeNodeOptions();
}
function closePath() {
  pathfinding = "";
  completionMap.forEach((value, key) => {
    if(value === completions.find) {
      completionMap.set(key, completions.incomplete);
    }
  });
  closeNodeOptions();
}
// TODO: nothing below this valid
/*
// opens the edit forms
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
const showNodeBtn = document.querySelector("#shownode");
showNodeBtn.addEventListener('click', function() {
  // TODO: view node information
  if(lastNodeTypeClicked === nodeTypes.course)
    openCourseHTML(lastCodeClicked);
});
function changeCompletion(code) {
  if(completionMap.has(code)) {
    completionMap.set(code, (completionMap.get(code) + 1) % 4);
  } else {
    completionMap.set(code, 0);
  }
}
*/
