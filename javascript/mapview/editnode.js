// -------------------------------- Edit Nodes Section -------------------------------- //
// not sure if this is a helper or miscellaneous menu
// actually, it's its own section
// opens the buttons that allow you to edit the last clicked element
const editNodesDiv = document.querySelector(".edit-nodes-div");
editNodesDiv.addEventListener('mouseleave', function() {
  closeNodeOptions();
});
// deals with opening a new window with the course html page
function openCourseHTML() {
  code = lastCodeClicked;
  closeNodeOptions();
  lastWindowOpened = code;
  if(doesFileExist(`../../coursehtmls/${code}.html`)) {
     window.open(`../../coursehtmls/${code}.html`);
  } else {
    let win = window.open(`../../coursehtmls/`);
    win.addEventListener('load', function() {
      win.changeCode(code);
    });
  }
}
let lastWindowOpened = "";
function doesFileExist(path) {
  let http = new XMLHttpRequest();
  http.open('HEAD', path, false);
  http.send();
  return http.status != 404;
}
// form we populate
const editNodeForm = document.querySelector(".edit-node-form");
// close everything
function closeNodeOptions() {
  typing = false;
  lastCodeClicked = "";
  lostNodeTypeClicked = null;
  editNodesDiv.style.display = "none";
}
// time to actually show the buttons
let lastNodeTypeClicked;
function openNodeOptions(nodeType, node) {
  // if typing don't show them do nothing just exit
  if(typing)
    return;
  typing = true;
  editNodesDiv.style.display = "block";
  lastNodeTypeClicked = nodeType;
  lastCodeClicked = node.code;
  // we can expect every node to have an x, y, width, height
  editNodesDiv.style.top = node.y - node.height/2 + 'px';
  editNodesDiv.style.left = node.x - node.width/2 + 'px';
  // switch based on node type
  switch(nodeType) {
    case nodeTypes.note:
      editNodeForm.innerHTML = "";
      if(advanceduses) {
        createFormButtonWithTitle(editNodeForm, "editnodebtn", "Edit Note", editNote,
        "Allows you to edit this notes information");
      } else
        closeNodeOptions();
      updateStyles();
      break;
    case nodeTypes.course:
      editNodeForm.innerHTML = "";
      createFormText(editNodeForm, "Course Code: " + node.code, false);
      createFormText(editNodeForm, "Credit Hours: " + node.credits, false);
      createFormText(editNodeForm, "Course Title: " + node.name, false);
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
      switch(completionMap.get(node.code)) {
        case completions.inprogress:
          inprogresscheck.checked = true;
          break;
        case completions.complete:
          completecheck.checked = true;
          break;
      }
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
      editNodesDiv.style.background = "rgb(255, 255, 255)";
      editNodesDiv.style.color = "rgb(0, 0, 0)";
      break;
    case completions.complete:
      editNodesDiv.style.background = "rgb(0, 0, 0)";
      editNodesDiv.style.color = "rgb(255, 255, 255)";
      break;
    case completions.available:
      editNodesDiv.style.background = "rgb(255, 255, 255)";
      editNodesDiv.style.color = "rgb(0, 0, 0)";
      break;
    default:
      editNodesDiv.style.background = "rgb(225, 225, 225)";
      editNodesDiv.style.color = "rgb(100, 100, 100)";
  }
}
function inprogressToggle(tf) {
  if(tf)
    completionMap.set(lastCodeClicked, completions.inprogress);
  else
    completionMap.set(lastCodeClicked, completions.incomplete);
  updateStyles();
}
function completeToggle(tf) {
  if(tf)
    completionMap.set(lastCodeClicked, completions.complete);
  else
    completionMap.set(lastCodeClicked, completions.incomplete);
  updateStyles();
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
