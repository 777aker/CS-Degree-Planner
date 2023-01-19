function popup(string, color, bgcolor) {
  //print(string);
  // delete anything with the popup class
  cleanUpPopUps();
  // create the object
  // fill it with info
  // most of the styling and such is done with css
  let div = createDiv();
  div.class('popups');
  div.style('background', bgcolor);
  let textDiv = createDiv(string);
  textDiv.class('popup-inside');
  textDiv.style('background', color);
  textDiv.parent(div);
}
// delete all the previous popups just to be sure we aren't being silly and making a million of these dinguses
function cleanUpPopUps() {
  document.querySelectorAll(".popups").forEach(popup => {
    popup.remove();
  });
}
