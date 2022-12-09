function setup() {
  setupYears();
  setupDegreeSelector();
}

const activearea = document.querySelector("#active-area");

function setupYears() {
  const d = new Date();
  let year = d.getFullYear();
  for(let i = 0; i < 4; i++) {
    let yr = year+i;
    let newyear = createDiv('Spring ' + yr);
    newyear.class("year");
    newyear.parent('active-area');

    addDropArea(newyear);

    newyear = createDiv('Fall ' + yr);
    newyear.class('year');
    newyear.parent('active-area');

    addDropArea(newyear);
  }
  let newbtn = createButton('>');
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
  'Pre-Calculus': ['MATH 1150', 'APPM 1235'],
  'Calculus 1': ['MATH 1300', 'APPM 1350'],
  'Discrete': [ 'CSCI 2824', 'MATH 2001', 'APPM 3170', 'ECEN 2703'],
  'Calculus 2': ['MATH 2300', 'APPM 1360'],
  'Foundations': ['CSCI 1300', 'CSCI 2270', 'CSCI 2400', 'CSCI 3104', 'CSCI 3155', 'CSCI 3308']
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
      print(dragSrcEl.innerHTML + " prereqs not met");
      courses[dragSrcEl.innerHTML].forEach((prereqgroup) => {
        print(prereqgroup);
      });
    }
    if(!checkthis) {
      print(this.innerHTML + " prereqs not met");
      courses[this.innerHTML].forEach((prereqgroup) => {
        print(prereqgroup);
      });
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
    throwError("Prerequisites not met");
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
