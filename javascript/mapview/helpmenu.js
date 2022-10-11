// I've decided, that this has nothing to do with
// any other logic, and I'm just tired of that big file
// so here is a tiny little man for the help menu
// ok but, quick tangent / fun fact, I didn't know
// how js multiple files worked....this might be helpful
// I could split everything into smaller files
// display the help menu
const helpDiv = document.querySelector('.help-menu-div');
const openHelpBtn = document.querySelector('#openhelp');
const defaultViewDiv = document.querySelector('#overviewdiv');
let setupAlready = false;
openHelpBtn.addEventListener('click', openHelp);
function openHelp() {
  helpDiv.style.display = 'flex';
  divsList.forEach(tmpdiv => {
    tmpdiv.style.display = 'none';
  });
  defaultViewDiv.style.display = 'flex';
  typing = true;
  if(!setupAlready) {
    setupButtons();
    setupAlready = true;
  }
}
const closeHelpBtn = document.querySelector('#closehelp');
closeHelpBtn.addEventListener('click', closeHelp);
function closeHelp() {
  helpDiv.style.display = 'none';
  typing = false;
}
// ok, now let's create a million references
// wait, actually, what if I did this smart and not bad
const buttonsList = document.querySelectorAll('.helpbutton');
const divsList = document.querySelectorAll('.helpdivs');
function setupButtons() {
  buttonsList.forEach(button => {
    switch(button.id) {
      case "closehelp":
        return;
      case "advanceduses":
        button.addEventListener('click', function() {
          // TODO: change your style here to be toggled on @button
          // Also turn off everyone else's
          divsList.forEach(tmpdiv => {
            tmpdiv.style.display = 'none';
          });
          buttonsList.forEach(tmpbutton => {
            tmpbutton.style.background = "rgb(255, 255, 255)";
          });
          button.style.background = "rgb(200, 200, 200)";
          document.querySelector("#advancedcheck").checked = advanceduses;
          div.style.display = 'flex';
        });
    }
    if(button.id === "closehelp")
      return;
    const div = document.querySelector(`#${button.id}div`);
    if(button.id === "advanceduses") {

    }
    button.addEventListener('click', function() {
      // TODO: change your style here to be toggled on @button
      // Also turn off everyone else's
      divsList.forEach(tmpdiv => {
        tmpdiv.style.display = 'none';
      });
      buttonsList.forEach(tmpbutton => {
        tmpbutton.style.background = "rgb(255, 255, 255)";
      });
      button.style.background = "rgb(200, 200, 200)";
      div.style.display = 'flex';
    });
  });
}
// search time
const searchbtn = document.querySelector('#search');
const searchtxt = document.querySelector('#searchtxt');
searchbtn.addEventListener('click', search);
function search() {
  const searchterm = searchtxt.value;
  let node = getElement(searchterm.toUpperCase());
  if(node !== undefined) {
    let changex = width/2 - node.x;
    let changey = height/2 - node.y;
    moveEverything(changex, changey, true);
    return;
  }
  node = searchTitles(searchterm);
  if(node === undefined) {
    throwError("Nothing Found");
    return;
  }
  moveEverything(width/2 - node.x, height/2 - node.y, true);
}
function searchTitles(term) {
  let returns = undefined;
  term = term.toLowerCase();
  courseList.forEach(course => {
    if(returns !== undefined)
      return;
    if(course.name.toLowerCase().includes(term))
      returns = course
  });
  if(returns !== undefined)
    return returns;
  noteList.forEach(note => {
    if(returns !== undefined)
      return;
    if(note.title.toLowerCase().includes(term))
      returns = note;
  });
  return undefined;
}
const advancedCheck = document.querySelector("#advancedcheck");
advancedCheck.addEventListener('click', function() {
  if(advancedCheck.checked)
    showUses();
  else
    rehideUses();
});
