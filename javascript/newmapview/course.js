// courses in the map
class Course extends MapNode {
  constructor(json) {
    super(json);
    this.p5Elt.html(json.code + '<br>' + json.name);
  }
}
