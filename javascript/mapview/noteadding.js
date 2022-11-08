// -------------------------------- Adding Note Section -------------------------------- //
// function called when user presses add note button
// basically will do the same thing as add course button
// but this doesn't have to be a course this could just be a little
// box you want to make for your convenience / understanding
const addNoteDiv = document.querySelector('.add-note-div');
addNoteDiv.addEventListener('mouseover', function() {
  typing = true;
});
addNoteDiv.addEventListener('mouseleave', function() {
  typing = false;
});
const addNoteForm = document.querySelector('.add-note-form');
function addNote() {
  // set typing to true so certain events aren't triggered
  typing = true;
  // clear the form
  addNoteForm.innerHTML = '';
  // create the labels and inputs for the form
  createFormText(addNoteForm,
`This allows you to create notes for explanations, organization, or whatever is helpful.
The title will be bold and the text will be the default font. Both are optional`);
  createFormTextField(addNoteForm, "Note Title:", "notetitle", "Title of the note (Optional)", true);
  createFormTextArea(addNoteForm, "Note Text:", "notetext",
`Text of the note (Optional).
Will need to hit enter if you want line breaks`, true);
  createCheckboxes(addNoteForm, "gate", "Gate");
  // make it visible
  addNoteDiv.style.display = 'block';
}
// similar to addNote because it uses the same form just fills it out
function editNote() {
  // set typing to true so certain events aren't triggered
  typing = true;
  // clear the form
  addNoteForm.innerHTML = '';
  openEditMenu();
  // create the labels and inputs for the form
  let tempnote = noteList[noteMap.get(lastCodeClicked)];
  //closeNodeOptions();
  createFormText(addNoteForm,
`This allows you to create notes for explanations, organization, or whatever is helpful.
The title will be bold and the text will be the default font. Both are optional`);
  createFormTextFieldWithValue(addNoteForm, "Note Title:", "notetitle", "Enter title of note (optional)", tempnote.title, true);
  createFormTextAreaWithValue(addNoteForm, "Note Text:", "notetext",
`Text of the note (Optional)
Will need to hit enter if you want line breaks`, tempnote.text, true);
  let gate = createCheckboxes(addNoteForm, "gate", "Gate");
  gate.checked = tempnote.gate;
  addNoteForm.querySelector('#notetext').innerHTML = tempnote.text;
  // make it visible
  addNoteDiv.style.display = 'block';
}
// submit for a new note
const submitnotebtn = document.querySelector('#submitnote');
submitnotebtn.addEventListener('click', submitNote);
// when submit note is pressed do the following
function submitNote() {
  // get info from form
  const title = addNoteForm.querySelector("#notetitle").value;
  const text = addNoteForm.querySelector("#notetext").value;
  const gate = addNoteForm.querySelector("#gate").checked;
  // notes behind the scenes need unique identifiers for connecting, drawing, and saving
  // so we are going to make a hash map
  // TODO: hash function may need some work since most notes will have same text
  let hash;
  let tmpsubnodes = [];
  let connections = [];
  if(hasElement(lastCodeClicked)) {
    let tmpnote = noteList[noteMap.get(lastCodeClicked)];
    hash = tmpnote.code;
    tmpsubnodes = tmpnote.subnodes;
    connections = tmpnote.connections;
  } else {
    print('Does not have that note. noteadding.js Line 75')
    hash = getHash(title + text + noteList.length);
    while(hasElement(hash.toString())) {
      hash += 1;
      hash |= 0;
    }
    hash = hash.toString();
  }
  textSize(fontsize);
  let hasTitle = title !== '' && title !== 'Title of the note';
  let hasText = text !== '';
  let width = 0;
  let height = 0;
  textStyle(NORMAL);
  if(hasText) {
    let splittxt = text.split(/\r\n|\r|\n/);
    let gtext = textWidth(splittxt[0]);
    for(let i = 0; i < splittxt.length; i++) {
      const wid = textWidth(splittxt[i]);
      if(wid > gtext)
        gtext = wid;
    }
    textStyle(BOLD);
    width = textWidth(title) * hasTitle > gtext ? textWidth(title) * hasTitle + boxpadding.x : gtext + boxpadding.x;
    height = (splittxt.length + hasTitle) * textLeading() + boxpadding.y;
  } else {
    textStyle(BOLD);
    width = textWidth(title) + boxpadding.x;
    height = textLeading() + boxpadding.y;
  }
  // add the note
  const note = {
    code: hash,
    title: hasTitle ? title : '',
    text: hasText ? text : '',
    x: windowWidth / 2,
    y: windowHeight / 2,
    width: width,
    height: height,
    subnodes: tmpsubnodes,
    gate: gate,
    connections: connections === undefined ? [] : connections
  };
  pushElement(noteList, noteMap, note);
  addNoteForm.innerHTML = '';
  addNoteDiv.style.display = 'none';
  lastCodeClicked = "";
  lastNodeTypeClicked = null;
  typing = false;
  disabled = false;
  closeNodeOptions();
  return false;
}
// cancel adding a note
const cancelnotebtn = document.querySelector("#cancelnote");
cancelnotebtn.addEventListener('click', cancelNote);
function cancelNote() {
  disabled = false;
  closeNodeOptions();
  addNoteDiv.style.display = 'none';
  addNoteForm.innerHTML = '';
  lastCodeClicked = "";
  lastNodeTypeClicked = null;
  typing = false;
}
