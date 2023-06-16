// every single node
let mapNodes = [];
// these are every little guy in the map (courses and notes)
class MapNode {
  fontSize = 32;
  scaleFactor = .1;

  constructor(json) {
    if(json.name != undefined) {
      this.p5Elt = createDiv(json.name);
    } else {
      this.p5Elt = createDiv('undefined name');
    }
    this.p5Elt.class('map-node');
    mapNodes.push(this);
  }

  zoom(e) {
    let direction = e.deltaY > 0 ? -1 : 1;

    this.x += direction * mouseX;
    this.y += direction * mouseY;

    this.x += this.x * this.scaleFactor * direction;
    this.y += this.y * this.scaleFactor * direction;
    this.fontSize += this.fontSize * this.scaleFactor * direction;
  }

  draw() {
    this.p5Elt.position(this.x, this.y);
    this.p5Elt.style('font-size', this.fontSize + 'pt');
  }
}

class Vector {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  direction(x, y) {
    this.x -= x;
    this.y -= y;
  }

  normalize() {
    let len = sqrt(this.x**2 + this.y**2);
    this.x /= len;
    this.y /= len;
  }
}
