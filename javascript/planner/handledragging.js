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
