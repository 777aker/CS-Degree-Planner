// courses in the map
class Course extends MapNode {
  constructor() {
    super();
    console.log(this);
    this.p5Elt.html(this.code);
  }
}
