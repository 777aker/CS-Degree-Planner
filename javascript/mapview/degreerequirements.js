// get a reference to the degree requirements button
const degreqBtn = document.querySelector("#degreq");
// when you press the button open degree requirements
degreqBtn.addEventListener('click', openRequirements);
// temporarily we are hard coding requirements
// later I hope to add a way to actually save and load different degrees
let degreeRequirements = {
  foundations: ['CSCI 1300', 'CSCI 2270', 'CSCI 2400', 'CSCI 3308', 'CSCI 3155', 'CSCI 3104'],
  calculus1: ['APPM 1350', 'MATH 1300'],
  calculus2: ['MATH 2300', 'APPM 1360'],
  discrete: ['MATH 2001', 'CSCI 2824', 'ECEN 2703', 'APPM 3170'],
  core: ['CSCI 3002', 'CSCI 3202', 'CSCI 3287', 'CSCI 3302', 'CSCI 3403', 'CSCI 3434', 'CSCI 3656', 'CSCI 3753', 'CSCI 4022', 'CSCI 4273', 'CSCI 4448'],
  linear: ['CSCI 2820', 'MATH 2130', 'APPM 3310']
};
// get some rerences to the degree requirements areas
const degreqDiv = document.querySelector('.degree-requirements');
const drform = document.querySelector('.dr');
// when they click the button this is called and it sets up and shows some stuff
function openRequirements() {
  typing = true;
  drform.innerHTML = "";
  // check if requirements are met or not and display differently based on whether they are or not
  checkRequirements();
  degreqDiv.style.display = 'block';
}
// checks what requirements have and have not been met
function checkRequirements() {
  // create our diclaimer since this is definitely not the final version for degree requirements
  createFormText(drform, "Degree Requirements Design and Functionality WIP", false);
  // you need all foundations so check if you've met the foundations
  if(checkRequirementsHelperAll(degreeRequirements.foundations)) {
    createFormText(drform, "Foundation Requirement Complete", false);
  } else {
    createFormText(drform, "Foundation Requirement Incomplete", false);
  }
  // check if you've done any one calc course
  if(checkRequirementsHelperOne(degreeRequirements.calculus1)) {
    createFormText(drform, "Calculus 1 Requirement Complete", false);
  } else {
    createFormText(drform, "Calculus 1 Requirement Incomplete", false);
  }
  // check if you've done any calc 2 courses
  if(checkRequirementsHelperOne(degreeRequirements.calculus2)) {
    createFormText(drform, "Calculus 2 Requirement Complete", false);
  } else {
    createFormText(drform, "Calculus 2 Requirement Incomplete", false);
  }
  // check if you've done discrete
  if(checkRequirementsHelperOne(degreeRequirements.discrete)) {
    createFormText(drform, "Discrete Requirement Complete", false);
  } else {
    createFormText(drform, "Discrete Requirement Incomplete", false);
  }
  // make a button to close the form
  createFormButton(drform, "closereqs", "Close Degree Requirements", closeRequirements);
}
// helper that makes sure you've completed every course sent to it
// you send a list of courses it returns true or false depending on if
// they are all complete or not
function checkRequirementsHelperAll(list) {
  let met = true;
  list.forEach(code => {
    if(completionMap.get(code) !== completions.complete)
      met = false;
  });
  return met;
}
// this just checks and makes sure you've taken one of the courses passed to it
function checkRequirementsHelperOne(list) {
  let met = false;
  list.forEach(code => {
    if(completionMap.get(code) === completions.complete)
      met = true;
  });
  return met;
}
// this checks that you've taken a certain number of courses
function checkRequirementsHelperNumber(list, amount) {
  let number = 0;
  list.forEach(code => {
    if(completionMap.get(code) === completions.complete)
      number += 1
  });
  return number >= amount;
}
// this checks that you've met the credit hours
function checkRequirementsHelperCredits(list, amount) {
  let credits = 0;
  list.forEach(code => {
    if(completionMap.get(code) === completions.complete)
      credits += getElement(code).credits;
  });
  return credits >= amount;
}
// close the requirements view box thingy
function closeRequirements() {
  typing = false;
  degreqDiv.style.display = 'none';
}
// ok, let's do the convex hull
// this is called by draw every frame
function doTheConvexHull() {
  // draw a convex hull for foundations
  convexHull(degreeRequirements.foundations);
  // draw a convex hull for discrete
  convexHull(degreeRequirements.discrete);
}
// this is a function that will draw a convex hull around the courses passed
function convexHull(courses) {
  // our list of points for the hull
  let points = [];
  // go through each of the courses passed
  courses.forEach(coursecode => {
    // courses is a list of course codes so we need to
    // actually get the element to get the positions
    let course = getElement(coursecode);
    if(course === null || course === undefined)
      return;
    // put every single point into our convex hull check
    // we add every corner of the courses cause we want the hull to go around them not through them
    // we also do some math to get those corners
    // we also add some padding to each of the four corners so it looks better
    points.push({
      x: course.x-course.width/2-15,
      y: course.y+course.height/2+15
    });
    points.push({
      x: course.x+course.width/2+15,
      y: course.y+course.height/2+15
    });
    points.push({
      x: course.x+course.width/2+15,
      y: course.y-course.height/2-15
    });
    points.push({
      x: course.x-course.width/2-15,
      y: course.y-course.height/2-15
    });
  });
  // sort the points
  points.sort(function(p1, p2) {
    // x takes priority over y, so if x is equal sort by greater y, else sort by greater x
    return p1.x == p2.x ? p1.y - p2.y : p1.x - p2.x;
  });
  // get the lower part of the convex hull
  let lower = [];
  // go through every point
  for(let i = 0; i < points.length; i++) {
    // while lower has more than two points, we check cross to see if we need to remove points
    // basically, if this point is inside of our shape then remove it, if it's not inside our shape
    // then it gets to stay
    while(lower.length >= 2 && cross3(lower[lower.length - 2], lower[lower.length - 1], points[i]) <= 0) {
        lower.pop();
    }
    // put this point into lower
    lower.push(points[i]);
  }
  // get the upper part of the convex hull
  let upper = [];
  // this is the same thing as lower except go in reverse
  for(let i = points.length - 1; i >= 0; i--) {
    while(upper.length >= 2 && cross3(upper[upper.length - 2], upper[upper.length - 1], points[i]) <= 0) {
        upper.pop();
    }
    upper.push(points[i]);
  }
  // so the lower one makes the left side (since we sorted by x) and says if you're not in the shape you get to stay
  // the upper one goes to the right side and says if you're not in the shape you get to stay
  // together, they make a whole shape
  // remove duplicates (upper and lower get one duplicate each where they meet each other)
  lower.pop();
  upper.pop();
  // when we now concat the two we have a list of points that define
  // the outer area of our courses
  let convexHull = lower.concat(upper);
  for(let i = 0; i < convexHull.length-1; i++) {
    if(distance(convexHull[i], convexHull[i+1]) < 20) {

    }
  }

  // now we actually draw the convex hull
  beginShape();
  for(let i = 0; i < convexHull.length; i++) {
    fill(255, 255, 255, 50/zoom);
    curveVertex(convexHull[i].x, convexHull[i].y);
    //vertex(convexHull[i].x, convexHull[i].y);
  }
  endShape(CLOSE);
}
