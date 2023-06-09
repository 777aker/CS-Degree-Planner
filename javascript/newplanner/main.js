// setup everything that needs to be setup
function setup() {
  textFont('Gill Sans MT');
  frameRate(30);
  // All close buttons close your parent object
  document.querySelectorAll('.close-btn').forEach(closeBTN => {
    closeBTN.addEventListener('click', function() {
      closeBTN.parentElement.style.display = 'none';
    });
  });
  // setup the degree selecting area
  degreeSelectorSetup();
  // setup planning area
  planningAreaSetup();
}

// global variables
// source element dragged
let dragSrcElement;
// degree JSON object for degree information
let degreeJSON;
// name of the selected degree
let degreeName;
