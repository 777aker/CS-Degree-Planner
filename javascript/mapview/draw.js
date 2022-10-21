// -------------------------------- Draw Function -------------------------------- //
// movement speed (like moving the camera / all the courses and stuff)
let movespeed = 10;
// is the mouse dragging an element (for fixing a weird bug)
let draggingcourse = -1;
let draggingnote = -1;
// now time for subnode stuff
let subnodecourse = -1;
let subnodenote = -1;
// need a global variable of if we are moving the screen this frame
let xy = [0, 0];
// also a global variable for zoom
let zoom = 1;
let mxzoom = 0;
let myzoom = 0;
let calcMouseX;
let calcMouseY;
// global variable for dragging
let mouseOutsideWindow = false;
// keeping track of time
let timep = 0;
// p5js drawing code called every frame
// where most of the real meat happens
function draw() {
  // set background color
  background(220);
  // time for zooming
  translate(mxzoom, myzoom);
  scale(zoom);
  calcMouseX = (mouseX - mxzoom) / zoom;
  calcMouseY = (mouseY - myzoom) / zoom;
  /*
  translate(mouseX, mouseY);
  scale(zoom);
  translate(-mouseX, -mouseY);
  */
  //translate();
  // if the user is holding a key down move everything around
  xy = [0, 0];
  if(!typing) {
    if(keyIsDown(87) || keyIsDown(UP_ARROW))
      xy[1] += movespeed / zoom;
    if(keyIsDown(83) || keyIsDown(DOWN_ARROW))
      xy[1] -= movespeed / zoom;
    if(keyIsDown(65) || keyIsDown(LEFT_ARROW))
      xy[0] += movespeed / zoom;
    if(keyIsDown(68) || keyIsDown(RIGHT_ARROW))
      xy[0] -= movespeed / zoom;
  }
  // dragging time
  if(mouseIsPressed && mode === modes.none && !typing) {
    document.body.style.cursor = "all-scroll";
    xy[0] += (mouseX - pmouseX) / zoom;
    xy[1] += (mouseY - pmouseY) / zoom;
  } else {
    document.body.style.cursor = "auto";
  }
  /* I thought this would be a nice feature but I don't actually like it
  REMOVED: if you want mouse dragging edge of screen can use this
  if(!typing && focused && !mouseOutsideWindow) {
    if(mouseX > windowWidth * .9)
      xy[0] -= movespeed / zoom;
    if(mouseX < windowWidth * .1)
      xy[0] += movespeed / zoom;
    if(mouseY > windowHeight * .9)
      xy[1] -= movespeed / zoom;
    if(mouseY < windowHeight * .1)
      xy[1] += movespeed / zoom;
  }
  */
  // draw mode time, do some nonsense
  // draw the lines
  // I love anonymous functions apparently (I use them a lot)
  // for every line that exists this is going to draw them
  strokeWeight(12);
  stroke(0);
  noFill();
  timep += deltaTime / 25;
  drawingContext.lineDashOffset = -timep;
  lineList.forEach(lineListHandler);
  drawingContext.setLineDash([0,0]);
  noStroke();
  // draw all the subnode stuff
  strokeWeight(2);
  stroke(0);
  rectMode(CORNER);
  fill(255);
  subnodeboxesList.forEach(subnodeHandler);
  // foreach loop that does everything to every course we want to do
  // each frame. IE, move courses if keys held, draw them
  // loop that goes through and does everything we need for notes
  // mostly same as courses
  noteList.forEach(noteListHandler);
  // loop that goes through and does everything we want for each course
  courseList.forEach(courseListHandler);
  // move edit buttons around with nodes
  if(lastCodeClicked !== "" && lastNodeTypeClicked !== null) {
    let node = null;
    switch(lastNodeTypeClicked) {
      case nodeTypes.note:
        node = noteList[noteMap.get(lastCodeClicked)];
        break;
      case nodeTypes.course:
        node = courseList[courseMap.get(lastCodeClicked)];
        break;
    }
    if(node !== null && node !== undefined) {
      let posx = (node.x*zoom+mxzoom)-(node.width/2*zoom);
      let posy = (node.y*zoom+myzoom)+(node.height/2*zoom);
      //strokeWeight(5);
      //stroke(255, 0, 0);
      //line(0, 0, (posx-mxzoom)/zoom, (posy-myzoom)/zoom);
      //point(posx, posy);
      //print(posx);
      //print(posy);
      editNodesDiv.style.left = posx + 'px';
      editNodesDiv.style.top = posy + 'px';
    }
  }
}

// -------------------------------- Draw For Loops -------------------------------- //
// helper function that handles the linelist in draw
const lineListHandler = (ln, index, lines) => {
  if(ln.length === 0)
    return;
  let node1 = getElement(ln[0]);
  if(node1 === undefined)
    return;
  let p1 = {
    x: node1.x,
    y: node1.y
  };
  let p2;
  let node2 = undefined;
  if(mode === modes.draw && index === lines.length-1) {
    p2 = {
      x: calcMouseX,
      y: calcMouseY
    };
  } else {
    node2 = getElement(ln[1]);
    if(node2 === undefined)
      return;
    p2 = {
      x: node2.x,
      y: node2.y
    };
  }
  if(mode === modes.delete) {
    // if mouse intersecting line highlight it red
    // if mouse pressed also delete it
    // AAAHHHH, PAST ME MADE THIS ALREADY!!!!!!
    // yaaaayyyyyyyyy
    if(lineTest(20, p1.x, p1.y, p2.x, p2.y, calcMouseX, calcMouseY)) {
      if(mouseIsPressed && !typing) {
        lines.splice(index, 1);
        return;
      }
      // applying a gradient so directionality more clear
      lineGradient(node1.code, node2, true, p1.x, p1.y, p2.x, p2.y);
    } else {
      // applying a gradient so directionality more clear
      lineGradient(node1.code, node2, false, p1.x, p1.y, p2.x, p2.y);
    }
  } else {
    // applying a gradient so directionality more clear
    lineGradient(node1.code, node2, false, p1.x, p1.y, p2.x, p2.y);
  }
  line(p1.x, p1.y, p2.x, p2.y);
};
// helper function that draws gradients and stuff
function lineGradient(code, node, red, x1, y1, x2, y2) {
  let grad = drawingContext.createLinearGradient(x1, y1, x2, y2);
  switch(completionMap.get(code)) {
    case completions.complete:
      if(node !== undefined && completionMap.get(node.code) === completions.find) {
        let factor = sin(millis()/425)*60;
        let color1 = 195+factor;
        let color2 = 60+factor;
        grad.addColorStop(0, `rgba(${color1},${color1},${color1},255)`);
        grad.addColorStop(1, `rgba(${color2},${color2},${color2},255)`);
      } else if(red) {
        grad.addColorStop(0, 'rgba(255, 0, 0, 255)');
        grad.addColorStop(1, 'rgba(240, 200, 200, 50)');
      } else {
        grad.addColorStop(0, 'rgba(0, 0, 0, 255)');
        grad.addColorStop(1, 'rgba(200, 200, 200, 50)');
      }
      drawingContext.strokeStyle = grad;
      if(node !== undefined && completionMap.get(node.code) === completions.complete)
        drawingContext.setLineDash([0,0]);
      else
        drawingContext.setLineDash([15, 15]);
      break;
    case completions.inprogress:
      if(node !== undefined && completionMap.get(node.code) === completions.find) {
        let factor = sin(millis()/425)*60;
        let color1 = 195+factor;
        let color2 = 60+factor;
        grad.addColorStop(0, `rgba(${color1},${color1},${color1},255)`);
        grad.addColorStop(1, `rgba(${color2},${color2},${color2},255)`);
      } else if(red) {
        grad.addColorStop(0, 'rgba(255, 100, 100, 200)');
        grad.addColorStop(1, 'rgba(240, 200, 200, 50)');
      } else {
        grad.addColorStop(0, 'rgba(100, 100, 100, 200)');
        grad.addColorStop(1, 'rgba(200, 200, 200, 50)');
      }
      drawingContext.strokeStyle = grad;
      drawingContext.setLineDash([15, 30]);
      break;
    default:
      if(node !== undefined && completionMap.get(node.code) === completions.find) {
        let factor = sin(millis()/425)*60;
        let color1 = 195+factor;
        let color2 = 60+factor;
        grad.addColorStop(0, `rgba(${color1},${color1},${color1},255)`);
        grad.addColorStop(1, `rgba(${color2},${color2},${color2},255)`);
      } else if(red) {
        grad.addColorStop(0, 'rgba(200, 100, 100, 255)');
        grad.addColorStop(1, 'rgba(255, 200, 200, 50)');
      } else {
        grad.addColorStop(0, 'rgba(100, 100, 100, 255)');
        grad.addColorStop(1, 'rgba(200, 200, 200, 50)');
      }
      drawingContext.strokeStyle = grad;
      drawingContext.setLineDash([1, 40]);
  }
}
// helper function that handles the first courselist draw
// actually wait, with the new method we no longer need two draw calls to courselist
// incredible
const courseListHandler = (course, index, arr) => {
  // stroke stuff
  strokeWeight(1);
  stroke(0);
  textSize(fontsize);
  textFont(myFont);
  textStyle(NORMAL);
  textAlign(CENTER, CENTER);
  // move the courses based on which keys are held
  course.x += xy[0];
  course.y += xy[1];
  // if hovering over the box change fill
  // oh, but also to fix a weird bug if this is the course we are dragging then also set fill
  let mouseHovering = draggingcourse === index;
  // intersecting course check
  if(mouseHovering || (calcMouseX > course.x - course.width/2 && calcMouseX < course.x + course.width/2 && calcMouseY > course.y - course.height/2 && calcMouseY < course.y + course.height/2)) {
    mouseHovering = true;
  }
  // draw the rectangle around our course
  boxFill(course.code, mouseHovering);
  rectMode(CENTER);
  rect(course.x, course.y, course.width, course.height);
  // in different modes do some different things
  switch(mode) {
    case modes.delete:
      if(typing)
        break;
      // if you click the course delete it
      // deleting it in this case is just removing it from our master list of courses
      if(mouseIsPressed && mouseHovering) {
        // wait more complicated now obviously, because code getting more complicated
        // every course that comes after this one now moves positions backwards one
        deleteElementByIndex(courseList, courseMap, index);
      }
      break;
    case modes.edit:
      if(typing)
        break;
      // if we haven't been dragging a course then make this course the one we drag
      // this actually fixes a plethora of bugs
      // 1: moving more than one course at a time
      // 2: moving the mouse too fast and leaving the course so you just aren't dragging it anymore
      // 3: flashing fill
      if(draggingcourse === -1 && draggingnote === -1 && mouseIsPressed && mouseHovering) {
        draggingcourse = index;
      }
      // if this is the course we are dragging move it to mouse position
      // you might have noticed that when dragging the course the box lags behind the text
      // that's because we basically have to put this here and our box we have to draw before
      // we actually move the course
      // this is just the most efficient and it's actually a cool effect so it's staying
      // if there isn't any active subnoding right now, do the following
      if(subnodenote === -1 && subnodecourse === -1) {
        // if this is the course we are dragging then move it to the mouse
        if(draggingcourse === index) {
          course.x = calcMouseX;
          course.y = calcMouseY;
          // else if we are hovering and the mouse is pressed and there isn't a subnodecourse then make this the subnode course
        } else if(mouseHovering && mouseIsPressed && subnodecourse === -1 && subnodenote === -1) {
          // so before we actually make this a subnode, we have to check and make sure it is not
          // a subnode of what we are trying to make a subnode of it because then we get a weird
          // they're both subnodes of each other which doesn't make sense
          let test = false;
          if(draggingnote !== -1) {
            noteList[draggingnote].subnodes.forEach((subnode) => {
              if(subnode.code === course.code)
                test = true;
            });
          } else if(draggingcourse !== -1) {
            courseList[draggingcourse].subnodes.forEach((subnode) => {
              if(subnode.code === course.code)
                test = true;
            });
          }
          if(!test) {
            // put what we are dragging into the subnodes for this course
            course.subnodes.push(draggingcourse === -1 ? noteList[draggingnote].code : courseList[draggingcourse].code);
            subnodecourse = index;
          }
        }
      }
      // it this is the subnode and we stopped hovering over it remove the subnode we just added
      if(subnodecourse === index && !mouseHovering) {
        subnodecourse = -1;
        course.subnodes.pop();
      }
      break;
    case modes.draw:
      drawMode(course, mouseHovering);
      break;
    default:
      //TODO: expensive ish? rethink ways to do this
      let completion = completionMap.get(course.code);
      if(completion === completions.find) {
        course.prerequisites.forEach(prereqgroup => {
          let groupcomplete = false;
          prereqgroup.forEach(prereq => {
            if(completionMap.get(prereq) >= completions.available) {
              groupcomplete = true;
            }
          });
          if(!groupcomplete) {
            prereqgroup.forEach(prereq => {
              completionMap.set(prereq, completions.find);
            });
          }
        });
      } else if(completion === completions.incomplete || completion === undefined || completion === completions.available) {
        /*let available = true;
        course.prerequisites.forEach(prereqgroup => {
          let groupcomplete = false;
          prereqgroup.forEach(prereq => {
            let prev = completionMap.get(prereq);
            if(prev === completions.inprogress || prev === completions.complete || !courseMap.has(prereq))
              groupcomplete = true;
          });
          available = available && groupcomplete;
        });*/
        if(checkAvailable(course)) {
          completionMap.set(course.code, completions.available);
        } else {
          completionMap.set(course.code, completions.incomplete);
        }
      }
      if(mouseHovering)
        openNodeOptions(nodeTypes.course, course);
      else if(!onEditDiv && nodeOpened === course.code)
        closeNodeOptions();
  }
  // if we don't have any subnodes then break and remove us form the subnodes list
  if(course.subnodes.length === 0) {
    // if we exist in the list of subnodes then delete us since we don't have any anymore
    if(subnodeboxesMap.has(course.code)) {
      // jesus, this but took so long to figure out
      // not doing this means there are duplicate subnodes created
      // ok, now doing this makes duplicates???
      // ok, got it hopefully
      // ok, now that seems like a dumb thing to say, but I added a helper function now
      // before I was deleting but not moving everything which is why it broke
      // that probably doesn't make sense as an explanation but whatever
      deleteElement(subnodeboxesList, subnodeboxesMap, course.code);
    }
  } else {
    // subnodes can change in lots of ways, so each frame just check on and update your subnodes
    updateSubnodes(course, mouseHovering, true, false);
  }
  // we were doing a lot of drawing so just remove the stroke don't want it on the text
  noStroke();
  // draw course code, credit hours, and name to the screen
  textAlign(CENTER, TOP);
  textStyle(BOLD);
  textFill(course.code);
  text(course.code + "-" + course.credits, course.x, course.y - course.height/2 + boxpadding.y/2);
  textStyle(NORMAL);
  text(course.name, course.x, course.y - course.height/2 + boxpadding.y/2 + textLeading());
};
// helper function that handles everything for notes
const noteListHandler = (note, index, arr) => {
  // set some stroke stuff
  strokeWeight(1);
  stroke(0);
  textSize(fontsize);
  textFont(myFont);
  // move notes if moving screen
  note.x += xy[0];
  note.y += xy[1];
  // check if dragging this box
  let mouseHovering = draggingnote === index;
  // intersecting course check
  if(mouseHovering || (calcMouseX > note.x - note.width/2 && calcMouseX < note.x + note.width/2 && calcMouseY > note.y - note.height/2 & calcMouseY < note.y + note.height/2)) {
    mouseHovering = true;
  }
  // draw rect around note
  rectMode(CENTER);
  boxFill(note.code, mouseHovering);
  rect(note.x, note.y, note.width, note.height);
  switch(mode) {
    case modes.delete:
      if(typing)
        break;
      // if you click it delete it
      if(mouseIsPressed && mouseHovering) {
        deleteElementByIndex(noteList, noteMap, index);
      }
      break;
    case modes.edit:
      // this is just a copy of what class does
      if(typing)
        break;
      if(draggingnote === -1 && draggingcourse === -1 && mouseIsPressed && mouseHovering) {
        draggingnote = index;
      }
      // copying from course cause they work the same
      // should I just combine the two???
      // no, I guess they do work differently in many ways
      // but I could combine this function? eh, eh, seems risky for no reward
      if(subnodenote === -1 && subnodecourse === -1) {
        if(draggingnote === index) {
          note.x = calcMouseX;
          note.y = calcMouseY;
        } else if(mouseHovering && mouseIsPressed && subnodecourse === -1 && subnodenote === -1) {
          // so before we actually make this a subnode, we have to check and make sure it is not
          // a subnode of what we are trying to make a subnode of it because then we get a weird
          // they're both subnodes of each other which doesn't make sense
          let test = false;
          if(draggingnote !== -1) {
            noteList[draggingnote].subnodes.forEach((subnode) => {
              if(subnode.code === note.code)
                test = true;
            });
          } else if(draggingcourse !== -1) {
            courseList[draggingcourse].subnodes.forEach((subnode) => {
              if(subnode.code === note.code)
                test = true;
            });
          }
          if(!test) {
            // put what we are dragging into the subnodes for this course
            note.subnodes.push(draggingcourse === -1 ? noteList[draggingnote].code : courseList[draggingcourse].code);
            subnodenote = index;
          }
        }
      }
      if(subnodenote === index && !mouseHovering) {
        subnodenote = -1;
        note.subnodes.pop();
      }
      break;
    case modes.draw:
      drawMode(note, mouseHovering);
      break;
    default:
      if(mouseHovering) {
        openNodeOptions(nodeTypes.note, note);
      } else if(!onEditDiv && nodeOpened === note.code) {
        closeNodeOptions();
      }
  }
  if(note.subnodes.length === 0) {
    if(subnodeboxesMap.has(note.code)) {
      deleteElement(subnodeboxesList, subnodeboxesMap, note.code);
    }
  } else {
    // subnodes can change in lots of ways, so each frame just check on and update your subnodes
    updateSubnodes(note, mouseHovering, false, !note.gate);
  }
  if(note.gate) {
    let completion = completions.find;
    note.connections.forEach(connection => {
      let subcomp = completionMap.get(connection);
      if(subcomp > completion)
        completion = subcomp;
    });
    completionMap.set(note.code, completion);
  }
  // don't want stroke on text
  noStroke();
  // finally draw the text
  // if it doesn't have a title center text
  textFill(note.code);
  if(note.title === '') {
    textStyle(NORMAL);
    textAlign(LEFT, CENTER);
    text(note.text, note.x - note.width/2 + boxpadding.x/2, note.y);
  // if it does and text is blank then center it
  } else if(note.text === '') {
    textStyle(BOLD);
    textAlign(CENTER, CENTER);
    text(note.title, note.x, note.y);
  // both exist so put title at top and text after
  } else {
    textStyle(BOLD);
    textAlign(CENTER, TOP);
    text(note.title, note.x, note.y - note.height/2 + boxpadding.y/2);
    textStyle(NORMAL);
    textAlign(LEFT, TOP);
    text(note.text, note.x - note.width/2 + boxpadding.x/2, note.y - note.height/2 + boxpadding.y/2 + textLeading());
  }
};
// helper function that determines boxfill
function boxFill(code, mh) {
  switch(completionMap.get(code)) {
    case completions.find:
      stroke(0, 0, 0);
      let factor = 235 + sin(millis()/500)*20;
      if(mh)
        factor -= 25;
      fill(factor, factor, factor);
      break;
    case completions.available:
    case completions.inprogress:
      stroke(0, 0, 0);
      if(mh) {
        fill(230, 230, 230);
      } else {
        fill(255, 255, 255);
      }
      break;
    case completions.complete:
      stroke(0, 0, 0)
      if(mh) {
        if(mode === modes.delete) {
          fill(50, 0, 0);
        } else {
          fill(50, 50, 50);
        }
      } else {
        fill(0, 0, 0);
      }
      break;
    default:
      stroke(245, 245, 245);
      if(mh) {
        fill(215, 215, 215)
      } else {
        fill(225, 225, 225);
      }
      break;
  }
}
function textFill(code) {
  let r = 100;
  let g = 100;
  let b = 100;
  switch(completionMap.get(code)) {
    case completions.available:
      r = 50;
      g = 50;
      b = 50;
      break;
    case completions.inprogress:
      r = 0;
      g = 0;
      b = 0;
      break;
    case completions.complete:
      r = 255;
      g = 255;
      b = 255;
  }
  switch(mode) {
    case modes.delete:
      r += 125;
      break;
    case modes.edit:
      b += 125;
      break;
    case modes.draw:
      g += 125;
      break;
  }
  fill(r, g, b, 255);
}
// some variables for drawing a nice box
// spacing around the subnodes
let subnodepadding = 10;
// how far in a subnode goes
let subnodeinset = 18;
// spacing between subnode items
let subnodeleading = 6;
// helper function for handling subnode drawing
// this function just draws all the subnode boxes and lines connecting subnodes, very simple
const subnodeHandler = (subnode, ind, arr) => {
  if(!courseMap.has(subnode.code) && !noteMap.has(subnode.code)) {
    deleteElement(subnodeboxesList, subnodeboxesMap, subnode.code);
    return;
  }
  boxFill(subnode.code, false);
  rect(subnode.x - subnodepadding, subnode.y - subnodepadding, subnode.width + subnodepadding*2, subnode.height + subnodepadding*2);
  subnode.lines.forEach((ln) => {
    line(ln[0], ln[1], ln[2], ln[3]);
  });
};
// actually, changed my mind, this is a function that will update a nodes subnodes
function updateSubnodes(node, mh, childrencompletion, reflectChildren) {
  // sadly, this should just happen every frame for now since so many things effect this
  // this is the box around this course that holds all the subnodes
  let subnodebox = {
    code: node.code,
    x: node.x - node.width/2,
    y: node.y - node.height/2,
    width: node.width,
    height: node.height,
    lines: []
  };
  // this is how far in we place lines to subnodes
  let insetx = node.x - node.width/2 + subnodeinset/2;
  // well subnodebox isn't the box yet, we gotta calculate all it's stuff
  let currentcomp = completions.find;
  node.subnodes.forEach((sub, ind, ar) => {
    if(childrencompletion)
      completionMap.set(sub, completionMap.get(node.code));
    if(reflectChildren) {
      let subcomp = completionMap.get(sub);
      if(subcomp > currentcomp || (completionMap.get(node.code) === undefined && subcomp !== undefined)) {
        currentcomp = subcomp;
      }
    }
    subnodeboxmaker(node, mh, subnodebox, sub, ind, ar, insetx);
  });
  if(reflectChildren)
    completionMap.set(node.code, currentcomp);
  // now we have to update our map and list with our new subnodebox
  // replace the one that already exists for this, or if it doesn't make a new one
  pushElementNoPosition(subnodeboxesList, subnodeboxesMap, subnodebox);
}
// In edit, process subnodeboxes and make them and all that
function subnodeboxmaker(node, mouseHovering, subnodebox, fsub, sindex, sarr, insetx) {
    let subnode = "";
    // find the subnode
    if(courseMap.has(fsub)) {
      subnode = courseList[courseMap.get(fsub)];
    } else if(noteMap.has(fsub)) {
      subnode = noteList[noteMap.get(fsub)];
    // the subnode doesn't exist which must mean it was deleted so lets remove it from our subnodes, and return
    } else {
      sarr.splice(sindex, 1);
      return;
    }
    // if we are not hovering over this but dragging subnode, remove it from our subnodes
    if(!mouseHovering && (courseMap.get(fsub) === draggingcourse || noteMap.get(fsub) === draggingnote)) {
      sarr.splice(sindex, 1);
      return;
    }
    // if the subnode has subnodes, we gotta do some different math than if it doesn't
    if(subnode.subnodes.length > 0) {
      // get the subnodes subnodebox
      let position = subnodeboxesMap.get(subnode.code);
      let dsub = subnodeboxesList[position];
      // change the subnodes position to be under the current node
      subnode.x = subnodebox.x + subnode.width/2 + subnodeinset + subnodepadding;
      subnode.y = subnodebox.height + subnodebox.y + subnode.height/2 + subnodeleading + subnodepadding;
      // figure out our subnodebox size
      subnodebox.height += dsub.height + subnodeleading + subnodepadding*2;
      let width = dsub.width + subnodeinset + subnodepadding*2;
      if(subnodebox.width < width)
        subnodebox.width = width;
      // so p5js draws in the order you tell it, so here we can get a subnodebox on top of
      // another that is smaller and should be on top of the other
      // so if you're subnode's subnodebox is before yours, switch places in the map with each other
      let npos = subnodeboxesMap.get(node.code);
      if(npos !== undefined && position < npos) {
        switchElements(subnodeboxesList, subnodeboxesMap, position, npos);
      }
    // the subnode doesn't have subnodes so we can do some different stuff
    } else {
      // move our subnode to under us
      subnode.x = subnodebox.x + subnode.width/2 + subnodeinset;
      subnode.y = subnodebox.height + subnodebox.y + subnode.height/2 + subnodeleading;
      // calculate our subnodebox size
      subnodebox.height += subnode.height + subnodeleading;
      if(subnodebox.width < subnode.width + subnodeinset)
        subnodebox.width = subnode.width + subnodeinset;
    }
    // now we gotta add some nice lines to our subnodes
    // the first line is just horizontal, draw from the left, to the right
    let temparray = [insetx, subnode.y, subnode.x, subnode.y];
    subnodebox.lines.push(temparray);
    // the last line is the vertical line connecting all the horizontal lines
    if(sindex === sarr.length-1) {
      temparray = [insetx, node.y, insetx, subnode.y];
      subnodebox.lines.push(temparray);
    }
}
// this is just the method that nodes call in draw
function drawMode(node, mouseHovering) {
  if(!mouseHovering || !mouseIsPressed || typing)
    return;
  let lastitem = lineList[lineList.length-1];
  if(lastitem.length == 0) {
    lastitem.push(node.code);
  } else if(lastitem[lastitem.length-1] !== node.code) {
    if(getNodeType(node.code) === nodeTypes.note) {
      node.connections.push(lastitem[lastitem.length-1]);
    }
    lastitem.push(node.code);
    lineList.push([]);
  }
}
