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
    newyear = createDiv('Fall ' + yr);
    newyear.class('year');
    newyear.parent('active-area');
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
  print(degree);
}
