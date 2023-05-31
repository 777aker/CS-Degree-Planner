let dragSrcEl;
function handleDragStart(e) {
  this.style.opacity = '0.4';

  dragSrcEl = this;
  coloryears(dragSrcEl);

  e.dataTransfer.effectAllowed = 'copy';
  e.dataTransfer.setData('text/html', this.id);
}

function handleDragEnd(e) {
  this.style.opacity = '1';
  document.querySelectorAll('.course-drag').forEach(function(item) {
    item.classList.remove('over');
  });
  document.querySelectorAll('.coursedrop').forEach(function(item) {
    item.classList.remove('over');
  });
  decolor_years();
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
      if(dragSrcEl.id !== '' && this.id === '') {
        addDropArea(this.parentElement);
      }
      if(dragSrcEl.id === '' && this.id !== '') {
        addDropArea(dragSrcEl.parentElement);
      }
      dragSrcEl.id = this.id;
      dragSrcEl.innerHTML = this.innerHTML;
    } else {
      if(dragSrcEl.classList.contains('course-drag') && this.classList.contains('coursedrop') && this.id !== '') {
        resetElement(this);
        dragSrcEl.setAttribute('draggable', 'false');
        dragSrcEl.setAttribute('class', 'nocoursedrop');
      } else {
        dragSrcEl.setAttribute('draggable', 'false');
        dragSrcEl.setAttribute('class', 'nocoursedrop');
        if(this.id === '') {
          addDropArea(this.parentElement);
        }
      }
    }
    this.id = e.dataTransfer.getData('text/html');
    this.innerHTML = this.id;
  }

  if(this.classList.contains('coursedrop')) {
    if(this.id !== '' && dragSrcEl.id === '') {
      removeDropArea(dragSrcEl.parentElement);
    }
    if(this.id === '' && dragSrcEl.id !== '') {
      removeDropArea(this.parentElement);
    }
  }

  decolor_years();

  return false;
}

function handleMoveStart(e) {
  this.style.opacity = '0.4';

  dragSrcEl = this;
  coloryears(dragSrcEl);

  e.dataTransfer.effectAllowed = 'move';
  e.dataTransfer.setData('text/html', this.id);
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
    //print(dude.id);
    if(dude.id === '') {
      dude.remove();
      return;
    }
  }
}
