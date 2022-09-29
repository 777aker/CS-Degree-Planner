// I've decided, that this has nothing to do with
// any other logic, and I'm just tired of that big file
// so here is a tiny little man for the help menu
// ok but, quick tangent / fun fact, I didn't know
// how js multiple files worked....this might be helpful
// I could split everything into smaller files
// display the help menu
const helpDiv = document.querySelector('.help-menu-div');
const openHelpBtn = document.querySelector('#openhelp');
let setupAlready = false;
openHelpBtn.addEventListener('click', function() {
  helpDiv.style.display = 'flex';
  if(!setupAlready) {
    setupButtons();
    setupAlready = true;
  }
});
const closeHelpBtn = document.querySelector('#closehelp');
closeHelpBtn.addEventListener('click', function() {
  helpDiv.style.display = 'none';
})
// ok, now let's create a million references
let buttons = {
  overview: 0,
  defaultview: 1,
  filedropdown: 2,
  editdropdown: 3,
  viewdropdown: 4,
  shortcuts: 5,
  advanceduses: 6,
  credits: 7,
  closehelp: 8
};
const buttonsList = document.querySelectorAll('.helpbutton');
function setupButtons() {
  buttonsList.forEach((button, index, array) => {
    
  });
}
