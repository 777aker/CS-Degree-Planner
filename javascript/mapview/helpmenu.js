// I've decided, that this has nothing to do with
// any other logic, and I'm just tired of that big file
// so here is a tiny little man for the help menu
// ok but, quick tangent / fun fact, I didn't know
// how js multiple files worked....this might be helpful
// I could split everything into smaller files
// display the help menu
const helpDiv = document.querySelector('.help-menu-div');
helpDiv.addEventListener('mouseover', function() {
  typing = true;
});
helpDiv.addEventListener('mouseleave', function() {
  typing = false;
});
const closeHelpBtn = document.querySelector('#closehelp');
closeHelpBtn.addEventListener('click', closeHelp);
const openHelpBtn = document.querySelector('#openhelp');
const defaultViewDiv = document.querySelector('#overviewdiv');
let setupAlready = false;
openHelpBtn.addEventListener('click', openHelp);
function openHelp() {
  helpDiv.style.display = 'flex';
  divsList.forEach(tmpdiv => {
    tmpdiv.style.display = 'none';
  });
  buttonsList.forEach(tmpbutton => {
    if(tmpbutton.id === "overview") {
      tmpbutton.style.background = "#7f8c8d";
    } else {
      tmpbutton.style.background = "#2A4260";
    }
  });
  defaultViewDiv.style.display = 'flex';
  typing = true;
  if(!setupAlready) {
    setupButtons();
    setupAlready = true;
  }
}
function closeHelp() {
  helpDiv.style.display = 'none';
  typing = false;
}
// ok, now let's create a million references
// wait, actually, what if I did this smart and not bad
const buttonsList = document.querySelectorAll('.helpbutton');
const divsList = document.querySelectorAll('.helpdivs');
function setupButtons() {
  let advancedCheck = document.querySelector('#advancedcheck');
  advancedCheck.addEventListener('click', function() {
    if(advancedCheck.checked) {
      if(throwError('Warning: about to enable advanced uses')) {
        showUses();
      } else {
          advancedCheck.checked = false;
      }
    } else {
      rehideUses();
    }
  });
  buttonsList.forEach(button => {
    const div = document.querySelector(`#${button.id}div`);
    button.addEventListener('click', function() {
      // TODO: change your style here to be toggled on @button
      // Also turn off everyone else's
      divsList.forEach(tmpdiv => {
        tmpdiv.style.display = 'none';
      });
      buttonsList.forEach(tmpbutton => {
        tmpbutton.style.background = "#2A4260";
      });
      button.style.background = "#7f8c8d";
      div.style.display = 'flex';
    });
  });
}
