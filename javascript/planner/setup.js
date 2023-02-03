// call two functions that set up some stuff
function setup() {
  setupYears();
  setupDegreeSelector();
}
// this is the fun area in the middle of our screen
const activearea = document.querySelector("#active-area");
// so this gets the year from your computer and populates the active area
// with the years around you
// TODO: go-left and go-right button need to actually do something
function setupYears() {
  // this is a button that lets us move the years around
  let newbtn = createButton('<');
  newbtn.id('go-left');
  newbtn.parent('active-area');
  // get the year
  const d = new Date();
  let year = d.getFullYear();
  // typical school is 4 years so display 4 years starting from this year
  for(let i = 0; i < 4; i++) {
    let yr = year+i;
    // add spring
    let newyear = createDiv('Spring ' + yr);
    newyear.class("year");
    newyear.parent('active-area');
    // add a drop area to this year so classes can be dropped into it
    addDropArea(newyear);
    // add fall
    newyear = createDiv('Fall ' + yr);
    newyear.class('year');
    newyear.parent('active-area');
    addDropArea(newyear);
  }
  // this is a button that lets you move the years around
  newbtn = createButton('>');
  newbtn.id('go-right');
  newbtn.parent('active-area');
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

let csDegreeTest = {
  misc: ['MATH 1011'],
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

let dragSrcEl;
function handleDragStart(e) {
  this.style.opacity = '0.4';

  dragSrcEl = this;

  e.dataTransfer.effectAllowed = 'copy';
  e.dataTransfer.setData('text/html', this.innerHTML);
}

function handleDragEnd(e) {
  this.style.opacity = '1';
  document.querySelectorAll('.course-drag').forEach(function(item) {
    item.classList.remove('over');
  });
  document.querySelectorAll('.coursedrop').forEach(function(item) {
    item.classList.remove('over');
  });
}

function handleDragOver(e) {
  e.preventDefault();
  return false;
}

function handleDragEnter(e) {
  this.classList.add('over');
}

function handleDragLeave(e) {
  this.classList.remove('over');
}

let coursecomp = {};
function handleDrop(e) {
  e.stopPropagation();

  let srctmp;
  let thistmp;
  let checksrc = false;
  let checkthis = false;
  if(dragSrcEl.innerHTML !== '') {
    if(dragSrcEl.innerHTML in coursecomp) {
      let srctmp = coursecomp[dragSrcEl.innerHTML];
      delete coursecomp[dragSrcEl.innerHTML];
    }
  } else {
    checksrc = true;
  }
  if(this.innerHTML !== '') {
    if(this.innerHTML in coursecomp) {
      let thistmp = coursecomp[this.innerHTML];
      delete coursecomp[this.innerHTML];
    }
  } else {
    checkthis = true;
  }

  //print('----------------');
  let srcyear;
  if(dragSrcEl.classList.contains('coursedrop')) {
    let srcstr = dragSrcEl.parentElement.textContent;
    //print(dragSrcEl.parentElement);
    //print(srcstr);
    srcyear = srcstr.startsWith('Fall') ?
      .5 + parseInt(srcstr.substring(5, 9))
      : 0 + parseInt(srcstr.substring(7, 11));
  } else {
    checkthis = true;
  }

  let thisstr = this.parentElement.textContent;
  //print(this.parentElement);
  //print(thisstr);
  //print(thisstr);
  //print(thisstr.substring(5, 9));
  //print(thisstr.substring(7, 11));
  let thisyear;
  if(thisstr.startsWith('Fall')) {
    //print(thisstr.substring(5,9));
    //print(parseInt(thisstr.substring(5,9)));
    thisyear = parseInt(thisstr.substring(5,9));
    thisyear += .5;
  } else {
    //print(thisstr.substring(7,11));
    //print(parseInt(thisstr.substring(7,11)));
    thisyear = parseInt(thisstr.substring(7,11));
  }

  coursecomp[dragSrcEl.innerHTML] = thisyear;
  coursecomp[this.innerHTML] = srcyear;

  //print(srcyear);
  //print(thisyear);

  // if check is not true do this
  // for each prereq group
  // for each prereq
  // check if year saved is before this year being placed
  if(!checksrc) {
    checksrc = true;
    if(courses[dragSrcEl.innerHTML] !== undefined) {
      courses[dragSrcEl.innerHTML].forEach((prereqgroup) => {
        let groupcheck = false;
        prereqgroup.forEach((prereq) => {
          if(prereq in coursecomp) {
            //print(thisyear);
            //print(coursecomp[prereq]);
            if(coursecomp[prereq] < thisyear)
              groupcheck = true;
          }
        });
        if(!groupcheck) {
          //print(prereqgroup);
          checksrc = false;
        }
      });
    }
  }
  //print(checksrc);

  if(!checkthis) {
    checkthis = true;
    courses[this.innerHTML].forEach((prereqgroup) => {
      let groupcheck = false;
      //print(srcyear);
      //print(coursecomp[prereq]);
      prereqgroup.forEach((prereq) => {
        if(prereq in coursecomp) {
          if(coursecomp[prereq] < srcyear)
            groupcheck = true;
        }
      });
      if(!groupcheck) {
        //print(prereqgroup);
        checkthis = false;
      }
    })
  }

  //print("src check: " + checksrc);
  //print("plant check: " + checkthis);

  // if !(check 1 and check 2)
  // throwerror
  // return false

  if(!(checksrc && checkthis)) {
    if(!checksrc) {
      throwCourseError(dragSrcEl.innerHTML, courses[dragSrcEl.innerHTML]);
      /*
      print(dragSrcEl.innerHTML + " prereqs not met");
      courses[dragSrcEl.innerHTML].forEach((prereqgroup) => {
        print(prereqgroup);
      });
      */
    }
    if(!checkthis) {
      throwCourseError(dragSrcEl.innerHTML, courses[dragSrcEl.innerHTML]);
      /*
      print(this.innerHTML + " prereqs not met");
      courses[this.innerHTML].forEach((prereqgroup) => {
        print(prereqgroup);
      });
      */
    }
    if(dragSrcEl.innerHTML !== '') {
      //print('yo mama');
      if(srctmp !== undefined && srctmp !== null)
        coursecomp[dragSrcEl.innerHTML] = srctmp;
      //print(srctmp);
    }
    if(this.innerHTML !== '') {
      //print('yo mama');
      if(thistmp !== undefined && thistmp !== null)
        coursecomp[this.innerHTML] = thistmp;
      //print(thistmp);
    }
    //throwError("Prerequisites not met");
    return false;
  } else {
    if(thisyear !== null && thisyear !== undefined) {
      coursecomp[dragSrcEl.innerHTML] = thisyear;
    }
    if(srcyear !== null && srcyear !== undefined) {
      coursecomp[this.innerHTML] = srcyear;
    }
  }

  if(dragSrcEl !== this) {
    if(dragSrcEl.classList.contains('coursedrop')) {
      if(dragSrcEl.innerHTML !== '' && this.innerHTML === '') {
        addDropArea(this.parentElement);
      }
      if(dragSrcEl.innerHTML === '' && this.innerHTML !== '') {
        addDropArea(dragSrcEl.parentElement);
      }

      dragSrcEl.innerHTML = this.innerHTML;
    } else {
      dragSrcEl.setAttribute('draggable', 'false');
      dragSrcEl.setAttribute('class', 'nocoursedrop');
      if(this.innerHTML === '') {
        addDropArea(this.parentElement);
      }
    }
    this.innerHTML = e.dataTransfer.getData('text/html');
  }

  if(this.classList.contains('coursedrop')) {
    if(this.innerHTML !== '' && dragSrcEl.innerHTML === '') {
      removeDropArea(dragSrcEl.parentElement);
    }
    if(this.innerHTML === '' && dragSrcEl.innerHTML !== '') {
      removeDropArea(this.parentElement);
    }
  }

  return false;
}

function throwCourseError(course, prereqs) {
  let text = '';
  text += 'Prerequisites for ' + course + ' not met\n';
  text += 'Requires the following:\n';
  for(let i = 0; i < prereqs.length; i++) {
    if(i !== 0)
      text += '\nAND\n';
    for(let j = 0; j < prereqs[i].length; j++) {
      if(j !== 0)
        text += ', or ' + prereqs[i][j];
      else
        text += prereqs[i][j];
    }
  }
  confirm(text);
}

function throwError(type) {
  return confirm(type);
}

function handleMoveStart(e) {
  this.style.opacity = '0.4';

  dragSrcEl = this;

  e.dataTransfer.effectAllowed = 'move';
  e.dataTransfer.setData('text/html', this.innerHTML);
}

function addDropArea(parent) {
  let droparea = createDiv();
  droparea.parent(parent);
  droparea.class('coursedrop');
  droparea.attribute('draggable', 'true');
  droparea.elt.addEventListener('dragstart', handleMoveStart);
  droparea.elt.addEventListener('dragover', handleDragOver);
  droparea.elt.addEventListener('dragenter', handleDragEnter);
  droparea.elt.addEventListener('dragleave', handleDragLeave);
  droparea.elt.addEventListener('dragend', handleDragEnd);
  droparea.elt.addEventListener('drop', handleDrop);
}

function removeDropArea(item) {
  //print(item);
  let removaldude;
  for(const dude of item.children) {
    //print(dude);
    //print(dude.innerHTML);
    if(dude.innerHTML === '') {
      dude.remove();
      return;
    }
  }
}
