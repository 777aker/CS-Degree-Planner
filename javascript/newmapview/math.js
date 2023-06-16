// a class for nice vectors to pass around and use
class Vector {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  // point the vector in a direction
  direction(x, y) {
    this.x -= x;
    this.y -= y;
  }

  // normalize the vector
  normalize() {
    let len = sqrt(this.x**2 + this.y**2);
    this.x /= len;
    this.y /= len;
  }
}
