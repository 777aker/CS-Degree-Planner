// populate degree area with buttons and such
const degreeSelected = document.querySelector('#degree-selected');
const degreeArea = document.querySelector('#degree-area');
function populateDegreeArea() {
  // delete previous data
  degreeArea.innerHTML = '';
  // add degree name
  degreeSelected.innerHTML = degreeName + ' Requirements';
  degreeArea.appendChild(degreeSelected);
  //TODO: degreeArea.appendChild(requirementsCompleted);

  // populate each requirement
  //Object.keys(degreeJSON.requirements).forEach(key => createRequirement(key));

  //checkRequirements();
}
