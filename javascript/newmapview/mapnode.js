// every single node
let mapNodes = [];
// these are every little guy in the map (courses and notes)
class MapNode {
  constructor() {
    this.fontSize = 32;
    this.p5Elt = createDiv('default text');
    this.p5Elt.class('map-node');
    mapNodes.push(this);
  }

  zoom(e) {
    this.fontSize += e.deltaY / 100;
  }

  draw() {
    this.p5Elt.position(this.x, this.y);
    this.p5Elt.style('font-size', this.fontSize + 'pt');
  }
}
