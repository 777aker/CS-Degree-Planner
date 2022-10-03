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
  if(lastNodeTypeClicked === nodeTypes.course)
    openCourseHTML(lastCodeClicked);
});
function openCourseHTML(code) {
  lastWindowOpened = code;
  print(lastWindowOpened);
  if(doesFileExist(`../../coursehtmls/${code}.html`)) {
     window.open(`../../coursehtmls/${code}.html`);
  } else {
    let win = window.open(`../../coursehtmls/`);
    win.addEventListener('load', function() {
      win.changeCode(code);
    });
  }
  /*else {
    window.open(`https://catalog.colorado.edu/search/?search=${code}`);
  }*/
  /*else {
    window.open(`../../coursehtmls/`);
  }*/
}
let lastWindowOpened = "";
function doesFileExist(path) {
  let http = new XMLHttpRequest();
  http.open('HEAD', path, false);
  http.send();
  return http.status != 404;
}
const closeNodeBtn = document.querySelector("#closeeditnode");
closeNodeBtn.addEventListener("click", closeNodeOptions);
function closeNodeOptions() {
  lastCodeClicked = "";
  lostNodeTypeClicked = null;
  editNodesDiv.style.display = "none";
}
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
  lastCodeClicked = node.code;
  // fill in completed
  changeCompletionButtonLook(node.code);
  // we can expect every node to have an x, y, width, height
  editNodesDiv.style.top = node.y - node.height/2 - textLeading() - 5 + 'px';
  editNodesDiv.style.left = node.x - node.width/2 + 'px';
}
// now time for switching a courses completion
const completionBtn = document.querySelector("#completion");
completionBtn.addEventListener('mouseover', function() {
  typing = true;
});
completionBtn.addEventListener('mouseleave', function() {
  typing = false;
});
completionBtn.addEventListener('click', function() {
  changeCompletion(lastCodeClicked);
  changeCompletionButtonLook(lastCodeClicked);
});
function changeCompletion(code) {
  if(completionMap.has(code)) {
    completionMap.set(code, (completionMap.get(code) + 1) % 4);
  } else {
    completionMap.set(code, 0);
  }
}
function changeCompletionButtonLook(code) {
  if(completionMap.has(code)) {
    switch(completionMap.get(code)) {
      case completions.inprogress:
        completionBtn.innerHTML = "in progress";
        break;
      case completions.complete:
        completionBtn.innerHTML = "complete"
        break;
      case completions.planned:
        completionBtn.innerHTML = "planned";
        break;
      default:
        completionBtn.innerHTML = "incomplete";
    }
  } else {
    completionBtn.innerHTML = "incomplete";
  }
}
