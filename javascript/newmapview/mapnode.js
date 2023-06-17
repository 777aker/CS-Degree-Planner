// every single node
class MapNodesHolder {
  // zooming variables for a nice feeling
  zoomFactor = 1;
  reduceZoom = 10;
  scaleFactor = .1;
  maxZoom = 3;
  minZoom = -0.8;

  draggingNode = false;

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
    if(this.draggingNode) {
      this.draggingNode.dragNode();
      return;
    }
    document.body.style.cursor = 'all-scroll';
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
      node.zoom(this.scaleFactor, direction, translate);
    });
  }

  // just call draw on each node
  draw() {
    this.mapNodes.forEach(node => {
      node.draw();
    });
  }

  mouseReleasedEvent(self) {
    self.releaseNode(self);
  }

  releaseNode(self=this) {
    if(self.draggingNode) {
      self.draggingNode.mouseReleased(self.draggingNode);
    }
    self.draggingNode = false;
  }

  grabNode(node) {
    this.draggingNode = node;
  }
}

// these are every little guy in the map (courses and notes)
class MapNode {
  fontSize = 32;
  dragging = false;
  child = false;

  hiddenX;
  hiddenY;

  set x(newx) {
    if(this.child) {
      return;
    }
    this.hiddenX = newx;
  }

  get x() {
    return this.hiddenX;
  }

  set y(newy) {
    if(this.child) {
      return;
    }
    this.hiddenY = newy;
  }

  get y() {
    return this.hiddenY;
  }

  // initialize some stuff
  constructor(json) {
    this.p5Elt = createDiv('');
    this.p5Elt.class('map-node');
    this.p5Elt.style('font-size', this.fontSize + 'pt');
    this.attachListeners();
    mapNodesHolder.addNode(this);
  }

  attachListeners() {
    let self = this;
    this.p5Elt.mouseOver(function() {
      self.mouseOver(self);
    });
    this.p5Elt.mousePressed(function() {
      self.mousePressed(self);
    });
    this.p5Elt.mouseReleased(function() {
      self.mouseReleased(self);
    });
    this.p5Elt.mouseOut(function() {
      self.mouseOut(self);
    });
  }

  // move the element cause we're panning
  pan(translate) {
    this.x -= translate.x;
    this.y -= translate.y;
  }

  // do the zooming stuff and math
  zoom(scaleFactor, direction, translate) {
    this.fontSize += this.fontSize * scaleFactor * direction;

    this.p5Elt.style('font-size', this.fontSize + 'pt');

    this.x -= translate.x;
    this.y -= translate.y;

    this.x += this.x * scaleFactor * direction;
    this.y += this.y * scaleFactor * direction;
  }

  // just position the element
  draw() {
    if(this.child) {
      return;
    }
    this.p5Elt.position(this.x, this.y);
  }

  // mouse is over the element
  mouseOver(self) {
    if(!mapNodesHolder.draggingNode) {
      document.body.style.cursor = 'grab';
    } else if(self != mapNodesHolder.draggingNode && !mapNodesHolder.draggingNode.contains(self)) {
        mapNodesHolder.draggingNode.makeParent(self.p5Elt);
    }
  }

  // do stuff to become a child of something
  makeParent(parent) {
    this.child = true;
    //this.x = 0;
    //this.y = 0;
    //this.p5Elt.position(0, 0);

    this.p5Elt.style('position', 'static');
    this.p5Elt.style('transform', 'translate(0%, 0%)');
    this.p5Elt.class('child-map-node');
    this.p5Elt.parent(parent);
  }

  // handle the element having mouse clicked above it
  mousePressed(self) {
    document.body.style.cursor = 'grabbing';
    mapNodesHolder.grabNode(self);
    self.p5Elt.style('z-index', '-1');
  }

  dragNode() {
    this.x = mouseX;
    this.y = mouseY;
  }

  // handle the element having mouse released above it
  mouseReleased(self) {
    document.body.style.cursor = 'grab';
    self.p5Elt.style('z-index', '');
  }

  // mouse leaves the element
  mouseOut(self) {
    if(!mapNodesHolder.draggingNode) {
      self.removeChild(mapNodesHolder.draggingNode);
      document.body.style.cursor = '';
    }
  }

  // basically html functions
  contains(node) {
    console.log(this);
    return this.p5Elt.elt.contains(node.p5Elt.elt);
  }

  removeChild(node) {
    console.log(this);
    this.p5Elt.elt.removeChild(node.p5Elt.elt);
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
