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
    if(button.id === "closehelp")
      return;
    const div = document.querySelector(`#${button.id}div`);
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
