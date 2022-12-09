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

function handleDrop(e) {
  e.stopPropagation();

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
