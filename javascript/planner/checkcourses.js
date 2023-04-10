let year_elements = []
let year_elements_dict = {}
let year_dict = {}

function add_year(element) {
  year_elements.push(element.elt.innerText);
  //console.log(element);
  //console.log(year_elements);
  year_dict[element.elt.innerText] = []
  //console.log(year_dict);
  year_elements_dict[element.elt.innerText] = element;
}
