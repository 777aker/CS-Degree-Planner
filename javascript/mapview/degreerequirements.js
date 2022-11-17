const degreqBtn = document.querySelector("#degreq");
degreqBtn.addEventListener('click', openRequirements);
let degreeRequirements = {
  foundations: ['CSCI 1300', 'CSCI 2270', 'CSCI 2400', 'CSCI 3308', 'CSCI 3155', 'CSCI 3104'],
  calculus1: ['APPM 1350', 'MATH 1300'],
  calculus2: ['MATH 2300', 'APPM 1360'],
  discrete: ['MATH 2001', 'CSCI 2824', 'ECEN 2703', 'APPM 3170'],
  core: ['CSCI 3002', 'CSCI 3202', 'CSCI 3287', 'CSCI 3302', 'CSCI 3403', 'CSCI 3434', 'CSCI 3656', 'CSCI 3753', 'CSCI 4022', 'CSCI 4273', 'CSCI 4448'],
  linear: ['CSCI 2820', 'MATH 2130', 'APPM 3310']
};
const degreqDiv = document.querySelector('.degree-requirements');
const drform = document.querySelector('.dr');
function openRequirements() {
  typing = true;
  drform.innerHTML = "";
  checkRequirements();
  degreqDiv.style.display = 'block';
}
function checkRequirements() {
  createFormText(drform, "Degree Requirements Design and Functionality WIP", false);
  if(checkRequirementsHelperAll(degreeRequirements.foundations)) {
    createFormText(drform, "Foundation Requirement Complete", false);
  } else {
    createFormText(drform, "Foundation Requirement Incomplete", false);
  }
  if(checkRequirementsHelperOne(degreeRequirements.calculus1)) {
    createFormText(drform, "Calculus 1 Requirement Complete", false);
  } else {
    createFormText(drform, "Calculus 1 Requirement Incomplete", false);
  }
  if(checkRequirementsHelperOne(degreeRequirements.calculus2)) {
    createFormText(drform, "Calculus 2 Requirement Complete", false);
  } else {
    createFormText(drform, "Calculus 2 Requirement Incomplete", false);
  }
  if(checkRequirementsHelperOne(degreeRequirements.discrete)) {
    createFormText(drform, "Discrete Requirement Complete", false);
  } else {
    createFormText(drform, "Discrete Requirement Incomplete", false);
  }
  createFormButton(drform, "closereqs", "Close Degree Requirements", closeRequirements);
}
function checkRequirementsHelperAll(list) {
  let met = true;
  list.forEach(code => {
    if(completionMap.get(code) !== completions.complete)
      met = false;
  });
  return met;
}
function checkRequirementsHelperOne(list) {
  let met = false;
  list.forEach(code => {
    if(completionMap.get(code) === completions.complete)
      met = true;
  });
  return met;
}
function checkRequirementsHelperNumber(list, amount) {
  let number = 0;
  list.forEach(code => {
    if(completionMap.get(code) === completions.complete)
      number += 1
  });
  return number >= amount;
}
function checkRequirementsHelperCredits(list, amount) {
  let credits = 0;
  list.forEach(code => {
    if(completionMap.get(code) === completions.complete)
      credits += getElement(code).credits;
  });
  return credits >= amount;
}
function closeRequirements() {
  typing = false;
  degreqDiv.style.display = 'none';
}
// ok, let's do the convex hull
// this is called by draw every frame
function doTheConvexHull() {
  convexHull(degreeRequirements.foundations);
  convexHull(degreeRequirements.discrete);
}
function convexHull(courses) {
  let points = [];
  courses.forEach(coursecode => {
    let course = getElement(coursecode);
    if(course === null || course === undefined)
      return;
    points.push({
      x: course.x-course.width/2,
      y: course.y+course.height/2
    });
    points.push({
      x: course.x+course.width/2,
      y: course.y+course.height/2
    });
    points.push({
      x: course.x+course.width/2,
      y: course.y-course.height/2
    });
    points.push({
      x: course.x-course.width/2,
      y: course.y-course.height/2
    });
  });
  points.sort(function(p1, p2) {
    return p1.x == p2.x ? p1.y - p2.y : p1.x - p2.x;
  });
  let lower = [];
  for(let i = 0; i < points.length; i++) {
    while(lower.length >= 2 &&
      cross3(lower[lower.length - 2], lower[lower.length - 1], points[i]) <= 0) {
        lower.pop();
      }
      lower.push(points[i]);
  }
  let upper = [];
  for(let i = points.length - 1; i >= 0; i--) {
    while(upper.length >= 2 &&
      cross3(upper[upper.length-2], upper[upper.length - 1], points[i]) <= 0) {
        upper.pop();
    }
    upper.push(points[i]);
  }
  lower.pop();
  upper.pop();
  let convexHull = lower.concat(upper);
  //convexHull.push(convexHull[0]);
  //convexHull.push(convexHull[1]);
  beginShape();
  for(let i = 0; i < convexHull.length; i++) {
    fill(255, 255, 255, 50/zoom);
    //curveVertex(convexHull[i].x, convexHull[i].y);
    vertex(convexHull[i].x, convexHull[i].y);
  }
  endShape(CLOSE);
}
