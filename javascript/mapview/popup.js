function popup(string, color, bgcolor) {
  print(string);
  // delete anything with the popup class
  cleanUpPopUps();
  // create the object that takes up the screen
  let div =
  // fill it with info
  // make boy animate

}
// delete all the previous popups just to be sure we aren't being silly and making a million of these dinguses
function cleanUpPopUps() {
  document.querySelectorAll(".popups").forEach(popup => {
    popup.remove();
  });
}
