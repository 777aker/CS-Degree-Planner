let csDegreeTest = {
  precalculus: ['MATH 1150', 'APPM 1235'],
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
  cs_electives: ['CSCI 3010', 'CSCI 3090', 'CSCI 3112', 'CSCI 3150', 'CSCI 3352', 'CSCI 3702', 'CSCI 3832', 'CSCI 4113', 'CSCI 4114', 'CSCI 4122',
                 'CSCI 4200', 'CSCI 4229', 'CSCI 4239', 'CSCI 4240', 'CSCI 4253', 'CSCI 4302', 'CSCI 4314', 'CSCI 4413', 'CSCI 4446', 'CSCI 4502', 'CSCI 4555',
                 'CSCI 4576', 'CSCI 4593', 'CSCI 4616', 'CSCI 4622', 'CSCI 4753', 'CSCI 4802', 'CSCI 4809', 'CSCI 4830', 'CSCI 4831', 'CSCI 4849', 'CSCI 4889',
                 'CSCI 4900', 'APPM 4120', 'MATH 4120', 'APPM 4370', 'ATLS 4120', 'ATLS 4214', 'ATLS 4320', 'ECEN 2350', 'EVEN 4133', 'ECEN 4313', 'INFO 3504',
                 'INFO 4602', 'INFO 4604', 'INFO 4609', 'INFO 4611', 'MATH 4440', 'MCDB 4520']
}

const degDropdown = document.querySelector('#deg-sel');
function setupDegreeSelector() {
  let tmpbtn = createButton('Computer Science');
  tmpbtn.parent(degDropdown);
  tmpbtn.mousePressed(function(event) {
    selectDegree('CS');
  });
}

function selectDegree(degree) {
  switch(degree) {
    case 'CS':
      tempDegreeLoader();
      document.querySelector('#degree-selector').innerHTML = 'Computer Science';
      break;
  }
}

const classContentArea = document.querySelector("#class-content-area");
function tempDegreeLoader() {
  classContentArea.innerHTML = '';
  for(let key in csDegreeTest) {
    let tempdiv = createDiv();
    tempdiv.parent(classContentArea);
    let tempbtn = createButton(key);
    tempbtn.parent(tempdiv);
    let invisdiv = createDiv();
    invisdiv.parent(tempdiv);
    invisdiv.style('display', 'none');
    invisdiv.class('course-holders');
    for(let i in csDegreeTest[key]) {
      let coursediv = createDiv(csDegreeTest[key][i]);
      coursediv.parent(invisdiv);
      coursediv.attribute('draggable', 'true');
      coursediv.class('course-drag');
      coursediv.elt.addEventListener('dragstart', handleDragStart);
      coursediv.elt.addEventListener('dragend', handleDragEnd);
    }
    tempbtn.mousePressed(function() {
      if(invisdiv.style('display') == 'none') {
        invisdiv.style('display', 'flex');
      } else {
        invisdiv.style('display', 'none');
      }
    });
  }
  let furl = 'https://777aker.github.io/CS-Degree-Planner/jsons/Computer-Science-BS-template.json';
  loadJSON(furl, loadCourses);
}

let courses;
function loadCourses(jsonp) {
  let json = jsonp.courses;
  courses = {};
  json.forEach((course) => {
    //print(course);
    courses[course.code] = course.prerequisites;
  });
  //print(courses);
}
