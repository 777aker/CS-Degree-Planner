// Advanced mode is pretty straight forward
// variable of whether we are in advanced mode or not
let advanceduses = false;
// list holding everything we change for advanced mode
let hiddenUses = [];
// hide the uses upon starting the program
function hideUses() {
  // push everything that is part of our hiding to the list
  hiddenUses.push([document.querySelector(".edit-dropdown"), 'flex']);
  hiddenUses.push([document.querySelector("#savebtn"), 'block']);
  hiddenUses.push([document.querySelector("#clearlayout"), 'block']);
  hiddenUses.push([document.querySelector("#saveboth"), 'block'])
  // make everything in the list hidden
  hiddenUses.forEach(element => {
    element[0].style.display = 'none';
  });
}
// if we want to turn off advanced uses call this
function rehideUses() {
  // reset a lot of variables and rehide everything in the list
  mode = modes.none;
  advanceduses = false;
  hiddenUses.forEach(element => {
    element[0].style.display = 'none';
  })
}
// how we actually turn on advanced uses
function showUses() {
  // set are boolean to true so other things can check if in advanced mode or not
  advanceduses = true;
  // show all the fun advanced uses buttons
  hiddenUses.forEach(element => {
    element[0].style.display = element[1];
  });
}
