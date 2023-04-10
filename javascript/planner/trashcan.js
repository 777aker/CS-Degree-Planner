const trashcan = document.querySelector('#trashcan');
function setupTrash() {
  trashcan.setAttribute('draggable', 'true');
  trashcan.addEventListener('dragstart', noStart);
  trashcan.addEventListener('dragover', overTheTrash);
  trashcan.addEventListener('drop', throwAway);
}

function noStart(e) {
  e.preventDefault();
  e.dataTransfer.effectAllowed = 'none';
}

function overTheTrash(e) {
  e.preventDefault();
  return false;
}

function throwAway(e) {
  e.stopPropagation();
  if(dragSrcEl.innerHTML === '')
    return false;
  //console.log(dragSrcEl);
  //console.log(dragSrcEl.innerHTML);

  //console.log(coursecomp);
  courselist = document.querySelectorAll('.nocoursedrop');
  courselist.forEach(course => {
    if(course.innerHTML === dragSrcEl.innerHTML) {
      course.setAttribute('draggable', 'true');
      course.setAttribute('class', 'course-drag');
    }
  });

  if(dragSrcEl.classList.contains('coursedrop')) {
    dragSrcEl.remove();
  }

  return false;
}

function resetElement(element) {
  courselist = document.querySelectorAll('.nocoursedrop');
  courselist.forEach(course => {
    if(course.innerHTML === element.innerHTML) {
      course.setAttribute('draggable', 'true');
      course.setAttribute('class', 'course-drag');
    }
  });
}
