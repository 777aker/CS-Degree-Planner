const catalogRef = document.querySelector("#coursecatalog");
let codeOpened = "";
/*
function setup() {
  print(codeOpened);
  catalogRef.setAttribute("href", `https://catalog.colorado.edu/search/?search=${codeOpened}`);
}
*/

function changeCode(code) {
  catalogRef.setAttribute("href", `https://catalog.colorado.edu/search/?search=${code}`);
}
