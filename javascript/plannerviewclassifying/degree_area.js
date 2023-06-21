// requirement list
let requirements;
// populate degree area with buttons and such
const degreeSelected = document.querySelector('#degree-selected');
const degreeArea = document.querySelector('#degree-area');
const requirementsCompleted = document.querySelector('#requirements-completed');
function populateDegreeArea() {
  // delete previous data
  degreeArea.innerHTML = '';
  // add degree name
  degreeSelected.innerHTML = degreeName + ' Requirements';
  degreeArea.appendChild(degreeSelected);
  degreeArea.appendChild(requirementsCompleted);

  // populate each requirement
  for(let requirement in degreeJSON.requirements) {
    degreeJSON.requirements[requirement] = Object.assign(
      new Requirement(requirement, degreeJSON.requirements[requirement].courses),
      degreeJSON.requirements[requirement]
    );
  }

  //checkRequirements();
}
