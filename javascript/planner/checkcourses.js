let year_elements = []
let year_elements_dict = {}
let year_dict = {}

function add_year(element) {
  year_elements.push(element.elt);
  //console.log(element);
  //console.log(year_elements);
  year_dict[element.elt.innerText] = []
  //console.log(year_dict);
  year_elements_dict[element.elt.innerText] = element;
}

function checkyear() {

}

function check_completed(element) {
  if(!courses[element.id]) {
    return true;
  }
  //print('prereqs');
  //print(courses[element.innerHTML]);
  //print('completed:')
  //print(courses_completed);
  for(prereqgroup of courses[element.id][0]) {
    let groupcheck = false;
    for(prereq of prereqgroup) {
      //print(prereq);
      if(courses_completed.includes(prereq)) {
        //print('true')
        groupcheck = true;
      }
    }
    if(!groupcheck)
      return false;
  }
  return true;
}

let courses_completed = []
function coloryears(element) {
  if(element.id === '')
    return;
  courses_completed = [];
  for(year_elt of year_elements) {
    let courses_this_year = []
    for(child of year_elt.children) {
      if(child.id === '') {
        if(check_completed(element))
          child.style.backgroundColor = 'green';
        else
          child.style.backgroundColor = 'red';
      } else {
        courses_this_year.push(child.id);
      }
    }
    //print('this year');
    //print(courses_this_year);
    for(course of courses_this_year) {
      //print('pushing');
      courses_completed.push(course);
    }
    //print('completed');
    //print(courses_completed);
  }
}

function decolor_years() {
  courses_completed = []
  for(year_elt of year_elements) {
    let courses_this_year = []
    for(child of year_elt.children) {
      if(child.id === '') {
        child.style.backgroundColor = '#3498db';
      } else {
        if(check_completed(child)) {
          child.style.backgroundColor = '#3498db';
        } else {
          child.style.backgroundColor = 'red';
        }
        courses_this_year.push(child.id);
      }
    }
    for(course of courses_this_year) {
      //print('pushing');
      courses_completed.push(course);
    }
  }
}
