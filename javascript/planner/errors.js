function throwCourseError(course, prereqs) {
  let text = '';
  text += 'Prerequisites for ' + course + ' not met\n';
  text += 'Requires the following:\n';
  for(let i = 0; i < prereqs.length; i++) {
    if(i !== 0)
      text += '\nAND\n';
    for(let j = 0; j < prereqs[i].length; j++) {
      if(j !== 0)
        text += ', or ' + prereqs[i][j];
      else
        text += prereqs[i][j];
    }
  }
  confirm(text);
}

function throwError(type) {
  return confirm(type);
}
