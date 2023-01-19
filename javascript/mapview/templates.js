// -------------------------------- Template Section -------------------------------- //
// this is the form with templates
const templateform = document.querySelector('.template-form');
// this is the div holding the form that we show and hide
const templatediv = document.querySelector('.template-div');
// when using div disable events
templatediv.addEventListener('mouseover', function() {
  typing = true;
});
templatediv.addEventListener('mouseleave', function() {
  typing = false;
});
// this button shows templates when pressed
const showtemplates = document.querySelector("#opentemplates");
showtemplates.addEventListener('click', function() {
  templatediv.style.display = "block";
});
// if you want to add a template option add it here after uploading
// the templates to the jsons folder
// WARNING: if hosting site changed need to change the prefix on templates
function setUpTemplates() {
  // create the cs button
  // WARNING: url prefix in openTemplate function needs to change if hosting site changes
  templateButton(templateform, 'Computer Science BS Degree', 'templateloadbtns', 'csbs',
  'This will load all the courses and degree requirements for CU CS BS degree',
  'Computer-Science-BS-template.json');
}
// template button setup function
function templateButton(form, name, btnclass, btnid, btntitle, url) {
  let button = createButton(name);
  button.class(btnclass);
  button.id(btnid);
  button.parent(form);
  button.attribute("title", btntitle);
  button.mousePressed(() => {
    popup("Opened Template<br>" + name, colors.concrete, colors.asbestos);
    openTemplate(url);
  });
  return button;
}
// helper function that loads a json from the templates
function openTemplate(url) {
  let furl = 'https://777aker.github.io/CS-Degree-Planner/jsons/' + url;
  loadJSON(furl, processJSON);
  closeTemplates();
}
// closes the template options
function closeTemplates() {
  templatediv.style.display = 'none';
  typing = false;
}
// button that can close template options
const canceltemplates = document.querySelector('#canceltemplate');
canceltemplates.addEventListener('click', closeTemplates);
