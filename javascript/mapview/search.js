// search time
const searchbtn = document.querySelector('#search');
const searchtxt = document.querySelector('#searchtxt');
searchbtn.addEventListener('click', search);
searchtxt.addEventListener('keypress', function(event) {
  if(event.key === "Enter")
    search();
});
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
