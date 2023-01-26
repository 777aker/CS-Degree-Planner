// set up some stuff
let requirement_keys = {}
function setupDegreeRequirements() {
  console.log('hey');
  console.log(noteList);
  noteList.forEach(note => {
    console.log(note.title);
    switch(note.title) {
      case 'Calculus 1':
        requirement_keys['Calculus 1'] = note.code;
        break;
    }
  });
}
// get a reference to the degree requirements button
const degreqBtn = document.querySelector("#degreq");
// when you press the button open degree requirements
degreqBtn.addEventListener('click', openRequirements);
// temporarily we are hard coding requirements
// later I hope to add a way to actually save and load different degrees
let degreeRequirements = {
  foundations: ['CSCI 1000', 'CSCI 1300', 'CSCI 2270', 'CSCI 2400', 'CSCI 3308', 'CSCI 3155', 'CSCI 3104'],
  calculus1: ['APPM 1350', 'MATH 1300'],
  calculus2: ['MATH 2300', 'APPM 1360'],
  discrete: ['MATH 2001', 'CSCI 2824', 'ECEN 2703', 'APPM 3170'],
  core: ['CSCI 3002', 'CSCI 3202', 'CSCI 3287', 'CSCI 3302', 'CSCI 3403', 'CSCI 3434', 'CSCI 3656', 'CSCI 3753', 'CSCI 4022', 'CSCI 4273', 'CSCI 4448'],
  linear: ['CSCI 2820', 'MATH 2130', 'APPM 3310'],
  probstat: ['APPM 3570', 'APPM 4570', 'CHEN 3010', 'CSCI 3022', 'CVEN 3227', 'ECEN 3810', 'ECON 3818', 'MATH 3510', 'MATH 4510', 'STAT 3100', 'STAT 4000'],
  naturalscience: ['PHYS 1110', 'PHYS 1120', 'PHYS 1140', 'CHEN 1201', 'CHEM 1114', 'CHEM 1113', 'EBIO 1210', 'EBIO 1230', 'MCDB 1150', 'MCDB 1161', 'MCDB 1171'],
  natural_science_electives: ['ASTR 1010', 'ASTR 1020', 'ASTR 2030', 'ASTR 2040', 'ATOC 1050', 'ATOC 1060', 'ATOC 1070', 'CHEN 1201', 'CHEN 1211', 'CHEM 1113',
                              'CHEM 1221', 'CHEM 1114', 'CHEM 1133', 'CHEM 1134', 'COEN 3210', 'EBIO 1030', 'EBIO 1040', 'EBIO 1210', 'EBIO 1220', 'EBIO 1230',
                              'EBIO 1240', 'GEOG 1001', 'GEOG 1011', 'GEOL 1010', 'GEOL 1020', 'GEOL 1030', 'GEOL 1150', 'MCDB 1150', 'MCDB 1161', 'MCDB 1171',
                              'PHYS 1120', 'PHYS 1140', 'PHYS 2130', 'PHYS 2150', 'PSYC 2012'],
  logic: ['PHIL 1440', 'PHIL 2440'],
  ethics: ['CSCI 2750', 'INFO 4601', 'PHIL 1100', 'PHIL 1200', 'PHIL 2160', 'EHON 1151', 'ENLP 2000'],
  writing: ['ENES 1010', 'ENES 3100', 'PHYS 3050', 'WRTG 3030', 'WRTG 3035'],
  cs_electives: ['CSCI 3010', 'CSCI 3022', 'CSCI 3090', 'CSCI 3112', 'CSCI 3150', 'CSCI 3352', 'CSCI 3702', 'CSCI 3832', 'CSCI 4113', 'CSCI 4114', 'CSCI 4122',
                 'CSCI 4200', 'CSCI 4229', 'CSCI 4239', 'CSCI 4240', 'CSCI 4253', 'CSCI 4302', 'CSCI 4314', 'CSCI 4413', 'CSCI 4446', 'CSCI 4502', 'CSCI 4555',
                 'CSCI 4576', 'CSCI 4593', 'CSCI 4616', 'CSCI 4622', 'CSCI 4753', 'CSCI 4802', 'CSCI 4809', 'CSCI 4830', 'CSCI 4831', 'CSCI 4849', 'CSCI 4889',
                 'CSCI 4900', 'APPM 4120', 'MATH 4120', 'APPM 4370', 'ATLS 4120', 'ATLS 4214', 'ATLS 4320', 'ECEN 2350', 'EVEN 4133', 'ECEN 4313', 'INFO 3504',
                 'INFO 4602', 'INFO 4604', 'INFO 4609', 'INFO 4611', 'MATH 4440', 'MCDB 4520']
};
let degree_check = {
  foundations: completions.incomplete,
  calculus1: completions.incomplete,
  calculus2: completions.incomplete,
  discrete: completions.incomplete,
  core: completions.incomplete,
  linear: completions.incomplete,
  probstat: completions.incomplete,
  naturalscience: completions.incomplete,
  natural_science_electives: completions.incomplete,
  logic: completions.incomplete,
  ethics: completions.incomplete,
  writing: completions.incomplete,
  cs_electives: completions.incomplete
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
function checkRequirements(key) {
  // create our diclaimer since this is definitely not the final version for degree requirements
  createFormText(drform, "Degree Requirements Design and Functionality WIP", false);
  switch(key) {
    case 'calculus1':
      //console.log(requirement_keys[key]);
      //console.log(hasElement(requirement_keys[key]));
      //checkRequirementsHelperOne(degreeRequirements[key], getElement(requirement_keys[key]), key);
      break;
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
function checkRequirementsHelperOne(list, node, key) {
  let met = false;
  list.forEach(code => {
    let comp = completionMap.get(code)
    if(comp > completionMap.get(node.code))
      completionMap.set(node.code, comp);
  });
  degree_check[key] = completionMap.get(node.code);
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
  // draw convexHull for all requirements
  var keys = Object.keys(degreeRequirements);
  keys.forEach(function(key) {
    checkRequirements(key);
    convexHull(degreeRequirements[key], degree_check[key]);
  });
  /*
  // draw a convex hull for foundations
  convexHull(degreeRequirements.foundations);
  // draw a convex hull for discrete
  convexHull(degreeRequirements.discrete);
  // draw for calculus
  convexHull(degreeRequirements.calculus1);
  */
}
// this is a function that will draw a convex hull around the courses passed
function convexHull(courses, completion) {
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
  if(points.length === 0)
    return;
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
    // also when drawing curve vertices if they're too close they act weird so remove close together ones too
    while(lower.length >= 2 && cross3(lower[lower.length - 2], lower[lower.length - 1], points[i]) <= 0) {
        //print(distance(lower.length-2, lower.length-1));
        //print(distance(lower[lower.length - 2], lower[lower.length - 1]) <= max_dis);
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
        //print(distance(upper[upper.length-2],upper[upper.length-1]) <= max_dis);
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
  // so now to get not weird edges we have to do something crazy
  // check if the end of lower and upper are too close together and if so
  // we are going to remove one of them but we have to decide carefully
  // so our shape doesn't go over our course
  let temp_dis = abs(lower[0].y - upper[upper.length-1].y);
  //let temp_dis = distance(lower[0], upper[upper.length-1]);
  if(temp_dis >= 74.5 && temp_dis <= 75.5) {
    if(lower[0].y < lower[1].y) {
      upper.splice(upper.length-1, 1);
    } else {
      lower.splice(0, 1);
    }
  }
  temp_dis = abs(lower[lower.length-1].y - upper[0].y);
  //temp_dis = distance(lower[lower.length-1], upper[0]);
  if(temp_dis >= 74.5 && temp_dis <= 75.5) {
    if(upper[0].y < upper[1].y) {
      lower.splice(lower.length-1, 1);
    } else {
      upper.splice(0, 1);
    }
  }
  // when we now concat the two we have a list of points that define
  // the outer area of our
  let convexHull = lower.concat(upper);
  /*
  if(convexHull.length == 8) {
    print(distance(convexHull[4], convexHull[5]));
    print(distance(convexHull[0], convexHull[7]));
  }
  */
  // now we actually draw the convex hull
  beginShape();
  //curveVertex(convexHull[convexHull.length-1].x, convexHull[convexHull.length-1].y);
  for(let i = 0; i < convexHull.length; i++) {
    fill(255, 255, 255, 50/zoom);
    curveVertex(convexHull[i].x, convexHull[i].y);
    //textSize(32);
    //text(i, convexHull[i].x, convexHull[i].y);
    //vertex(convexHull[i].x, convexHull[i].y);
  }
  // if you don't do this you get a gross straight edge
  curveVertex(convexHull[0].x, convexHull[0].y);
  curveVertex(convexHull[1].x, convexHull[1].y);
  endShape(CLOSE);
}
