// requirement class
class Requirement {
  constructor(requirement, courses) {
    // add the requirement to the degree area
    let reqBtn = createButton(requirement.replace(/_/g, ' '));
    reqBtn.parent(degreeArea);
    reqBtn.class('degree-requirement');
    reqBtn.attribute('requirementkey', requirement);

    // div holding the courses for this requirement
    let courseHolder = createDiv();
    courseHolder.class('course-holder');
    courseHolder.parent(degreeArea);
    courseHolder.attribute('style', 'display: none');

    // add description to requirement
    this.createRequirementDescription(courseHolder);

    // add each course to the requirement
    for(let code in courses) {
      degreeJSON.requirements[requirement].courses[code] = Object.assign(
        new Course(courses[code], degreeJSON.courses[courses[code]], courseHolder),
        degreeJSON.courses[courses[code]]
      );
    }

    // display or hide the requirement courses
    reqBtn.mousePressed(function() {
      if(courseHolder.elt.style.display == 'none') {
        courseHolder.attribute('style', 'display: block');
      } else {
        courseHolder.attribute('style', 'display: none');
      }
    });

    // make a horizontal bar to seperate each requirement
    let hr = document.createElement('hr');
    degreeArea.appendChild(hr);
  }

  createRequirementDescription(courseHolder) {

  }
}
