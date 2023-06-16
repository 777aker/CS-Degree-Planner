// every single node
class MapNodesHolder {
  // zooming variables for a nice feeling
  zoomFactor = 1;
  reduceZoom = 10;
  scaleFactor = .1;
  maxZoom = 3;
  minZoom = -1.2;

  // define our mapnodes list
  constructor() {
    this.mapNodes = [];
  }

  // add a node to our list
  addNode(node) {
    this.mapNodes.push(node);
  }

  // how we handle panning
  pan() {
    // calculate some variables so each node doesn't repeat the same calculation
    let zoomFactor = sqrt((this.zoomFactor + .1 - this.minZoom) / this.reduceZoom);

    let translate = new Vector(
      (pmouseX - mouseX) * zoomFactor,
      (pmouseY - mouseY) * zoomFactor
    );

    this.mapNodes.forEach(node => {
      node.pan(translate);
    });
  }

  // how we handle zooming
  zoom(e) {
    // get direction of zoom (in or out)
    let direction = e.deltaY > 0 ? -1 : 1;
    // do some magic so it feels good
    this.zoomFactor += this.scaleFactor * direction;

    if(this.zoomFactor > this.maxZoom) {
      this.zoomFactor = this.maxZoom;
      return;
    }
    if(this.zoomFactor < this.minZoom) {
      this.zoomFactor = this.minZoom;
      return;
    }

    let translate = new Vector(
      width/2 * this.scaleFactor * direction,
      height/2 * this.scaleFactor * direction
    );
    // pass magix to each node
    this.mapNodes.forEach(node => {
      node.zoom(e, this.scaleFactor, direction, translate);
    });
  }

  // just call draw on each node
  draw() {
    this.mapNodes.forEach(node => {
      node.draw();
    });
  }
}

// these are every little guy in the map (courses and notes)
class MapNode {
  fontSize = 32;

  // initialize some stuff
  constructor(json) {
    this.p5Elt = createDiv('');
    this.p5Elt.class('map-node');
    this.p5Elt.style('font-size', this.fontSize + 'pt');
    mapNodesHolder.addNode(this);
  }

  // move the element cause we're panning
  pan(translate) {
    this.x -= translate.x;
    this.y -= translate.y;
  }

  // do the zooming stuff and math
  zoom(e, scaleFactor, direction, translate) {
    this.x -= translate.x;
    this.y -= translate.y;

    this.x += this.x * scaleFactor * direction;
    this.y += this.y * scaleFactor * direction;
    this.fontSize += this.fontSize * scaleFactor * direction;

    this.p5Elt.style('font-size', this.fontSize + 'pt');
  }

  // just position the element
  draw() {
    this.p5Elt.position(this.x, this.y);
  }
}

// courses in the map
class Course extends MapNode {
  // only difference to a node is use code for innerhtml
  constructor(json) {
    super(json);
    let codeElt = createDiv(json.code);
    codeElt.class('map-course-code');
    codeElt.parent(this.p5Elt);
    let nameElt = createDiv(json.name);
    nameElt.class('map-course-name');
    nameElt.parent(this.p5Elt);
  }
}

// notes in the map
class Note extends MapNode {
  constructor(json) {
    super(json);
    let titleElt = createDiv(json.title);
    titleElt.parent(this.p5Elt);
    titleElt.class('map-note-title');
    let textElt = createDiv(json.text);
    textElt.parent(this.p5Elt);
    textElt.class('map-note-text');
  }

  // I think I'm going to need this later
  draw() {
    super.draw();
  }
}
