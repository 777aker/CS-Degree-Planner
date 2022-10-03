// -------------------------------- Helper Functions -------------------------------- //
// this function makes a button so I don't have to
// some of the names are special because I accidently used keywords
// name of button, function button calls when pressed, class, id, parent
function makeAButton(name, fn, btnclass, btnid, parent) {
  let button = createButton(name);
  button.mousePressed(fn);
  button.class(btnclass);
  button.id(btnid);
  button.parent(parent);
}
function makeAButtonWithHover(name, fn, btnclass, btnid, parent, hovertext) {
  let button = createButton(name);
  button.mousePressed(fn);
  button.class(btnclass);
  button.id(btnid);
  button.parent(parent);
  button.attribute('title', hovertext);
}
// helper function for creating form text fields
// form - which form to append it to / element (doesn't have to be a form)
// label - label for the text box
// id - id for the text box
// value - value in the text box
// br - true or false, add breaks between text boxes or no
function createFormTextField(form, label, id, placeholder, br) {
  // create the label element using passed letiables
  // letiables??? I don't even know what that word is supposed to be
  if(label !== "") {
    let templabel = document.createElement("label");
    templabel.setAttribute("for", id);
    templabel.innerHTML = label;
    form.appendChild(templabel);
    if(br)
      form.appendChild(document.createElement("br"));
  }
  // create the input element using passed letiables
  // I did it again, what the freak is a letiable?
  // is there even such thing as a letiable or does it have to be letiables
  let tempinput = document.createElement("input");
  tempinput.setAttribute("type", "text");
  if(id !== "") {
    tempinput.setAttribute("id", id);
    tempinput.setAttribute("name", id);
  }
  tempinput.setAttribute("value", "");
  tempinput.setAttribute("placeholder", placeholder);
  form.appendChild(tempinput);
  if(br)
    form.appendChild(document.createElement("br"));
}
function createFormTextFieldWithValue(form, label, id, placeholder, value, br) {
  // create the label element using passed letiables
  // letiables??? I don't even know what that word is supposed to be
  if(label !== "") {
    let templabel = document.createElement("label");
    templabel.setAttribute("for", id);
    templabel.innerHTML = label;
    form.appendChild(templabel);
    if(br)
      form.appendChild(document.createElement("br"));
  }
  // create the input element using passed letiables
  // I did it again, what the freak is a letiable?
  // is there even such thing as a letiable or does it have to be letiables
  let tempinput = document.createElement("input");
  tempinput.setAttribute("type", "text");
  if(id !== "") {
    tempinput.setAttribute("id", id);
    tempinput.setAttribute("name", id);
  }
  tempinput.setAttribute("value", value);
  tempinput.setAttribute("placeholder", placeholder);
  form.appendChild(tempinput);
  if(br)
    form.appendChild(document.createElement("br"));
}
function createFormText(form, value, br) {
  let tempp = createElement("p", value);
  tempp.parent(form);
  if(br)
    form.appendChild(createElement("br"));
}
// I also need a text area so copying text field
function createFormTextArea(form, label, id, placeholder, br) {
  if(label !== "") {
    let templabel = document.createElement("label");
    templabel.setAttribute("for", id);
    templabel.innerHTML = label;
    form.appendChild(templabel);
    if(br)
      form.appendChild(document.createElement("br"));
  }
  let tempinput = document.createElement("textarea");
  if(id !== "") {
    tempinput.setAttribute("id", id);
    tempinput.setAttribute("name", id);
  }
  tempinput.setAttribute("value", "");
  tempinput.setAttribute("placeholder", placeholder);
  tempinput.setAttribute("rows", "10");
  tempinput.setAttribute("cols", "40");
  tempinput.setAttribute("wrap", "off");
  form.appendChild(tempinput);
  if(br)
    form.appendChild(document.createElement("br"));
}
function createFormTextAreaWithValue(form, label, id, placeholder, value, br) {
  if(label !== "") {
    let templabel = document.createElement("label");
    templabel.setAttribute("for", id);
    templabel.innerHTML = label;
    form.appendChild(templabel);
    if(br)
      form.appendChild(document.createElement("br"));
  }
  let tempinput = document.createElement("textarea");
  if(id !== "") {
    tempinput.setAttribute("id", id);
    tempinput.setAttribute("name", id);
  }
  tempinput.setAttribute("value", value);
  tempinput.setAttribute("placeholder", placeholder);
  tempinput.setAttribute("rows", "10");
  tempinput.setAttribute("cols", "40");
  tempinput.setAttribute("wrap", "off");
  form.appendChild(tempinput);
  if(br)
    form.appendChild(document.createElement("br"));
}
// need a hash function for the notes
function getHash(str) {
  let hash = 0;
  for(let i = 0; i < str.length; i++) {
    let chr = str.charCodeAt(i);
    hash = (hash << 5) - hash + chr;
    hash |= 0;
  }
  return hash;
}
// helper function that tells you if you are close to a line segment or not
// distance - distance from line this will return true at
// x1, y1, x2, y2 - your line segment
// px, py - the point you are testing
// I'M A GENIUS, I FORGOT I MADE THIS AH, SO HELPFUL PAST ME
function lineTest(distance, x1, y1, x2, y2, px, py) {
  let topleft = [min(x1, x2), min(y1, y2)];
  let bottomright = [max(x1, x2), max(y1, y2)];
  if(px > topleft[0] - distance && px < bottomright[0] + distance && py > topleft[1] - distance && py < bottomright[1] + distance) {
    let dis = abs((x2-x1)*(y1-py)-(x1-px)*(y2-y1));
    dis /= dist(x1, y1, x2, y2);
    if(dis < distance)
      return true
  }
  return false;
}
// also a button maker that's better than the other
function createFormButton(form, id, value, func) {
  let tempbutton = document.createElement("input");
  tempbutton.setAttribute("id", id);
  tempbutton.setAttribute("type", "button");
  tempbutton.setAttribute("value", value);
  form.appendChild(tempbutton);
  tempbutton.addEventListener('click', func);
}
function createFormButtonWithTitle(form, id, value, func, title) {
  let tempbutton = document.createElement("input");
  tempbutton.setAttribute("id", id);
  tempbutton.setAttribute("type", "button");
  tempbutton.setAttribute("value", value);
  tempbutton.setAttribute("title", title);
  form.appendChild(tempbutton);
  tempbutton.addEventListener('click', func);
}
// map and list helper functions
/* this will help us delete things properly
basically making these because I had impossible to find bugs because I didn't
do all the steps a delete takes
  list - list we delete from
  map - map that maps to the list
  key - key to delete or replace
  ind - delete index instead
  element - an element of the list type to add or replace
*/
function deleteElement(list, map, delkey) {
  let deleting = map.get(delkey);
  map.forEach((value, key) => {
    if(value > deleting)
      map.set(key, value-1);
  });
  list.splice(deleting, 1);
  map.delete(delkey);
}
function deleteElementByIndex(list, map, ind) {
  map.forEach((value, key) => {
    if(value > ind)
      map.set(key, value-1);
  });
  map.delete(list[ind].code);
  list.splice(ind, 1);
}
function replaceElement(list, map, key, element) {
  let keyind = map.get(key);
  element.x = list[keyind].x;
  element.y = list[keyind].y;
  element.subnodes = list[keyind].subnodes;
  list[keyind] = element;
  if(key !== element.code) {
    if(map.has(element.code)) {
      deleteElement(list, map, element.code);
    }
    map.set(element.code, keyind);
    map.delete(key);
  }
}
function replaceElementByKeys(list, map, key, seckey) {
  replaceElement(list, map, key, list[map.get(seckey)]);
}
function switchElements(list, map, ind, secind) {
  let tmpelement = list[ind];
  list[ind] = list[secind];
  list[secind] = tmpelement;
  map.set(list[ind].code, ind);
  map.set(list[secind].code, secind);
}
function pushElement(list, map, element) {
  if(map.has(element.code)) {
    replaceElement(list, map, element.code, element);
    return;
  }
  map.set(element.code, list.length);
  list.push(element);
}
function pushElementNoPosition(list, map, element) {
  if(map.has(element.code)) {
    list[map.get(element.code)] = element;
    return;
  }
  map.set(element.code, list.length);
  list.push(element);
}
function getElement(key) {
  return courseMap.has(key) ? courseList[courseMap.get(key)] : noteList[noteMap.get(key)];
}