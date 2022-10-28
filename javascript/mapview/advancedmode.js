let advanceduses = false;
let hiddenUses = [];

function hideUses() {
  hiddenUses.push([document.querySelector(".edit-dropdown"), 'flex']);
  hiddenUses.push([document.querySelector("#savebtn"), 'block']);
  hiddenUses.push([document.querySelector("#clearlayout"), 'block']);
  hiddenUses.push([document.querySelector("#saveboth"), 'block'])

  hiddenUses.forEach(element => {
    element[0].style.display = 'none';
  });
}

function rehideUses() {
  mode = modes.none;
  advanceduses = false;
  hiddenUses.forEach(element => {
    element[0].style.display = 'none';
  })
}

function showUses() {
  advanceduses = true;
  hiddenUses.forEach(element => {
    element[0].style.display = element[1];
  });
}
