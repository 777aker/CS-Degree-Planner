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
    add_year(newyear);
    // add fall
    newyear = createDiv('Fall ' + yr);
    newyear.class('year');
    newyear.parent('active-area');
    addDropArea(newyear);
    add_year(newyear);
  }
  // this is a button that lets you move the years around
  newbtn = createButton('>');
  newbtn.id('go-right');
  newbtn.parent('active-area');
}
