function inprogress_animation(x, y) {
  let yaygif = document.querySelector("#yaygif");
  yaygif.style.display = 'block';
  yaygif.style.position = 'absolute';
  yaygif.style.top = str(y) + 'px';
  yaygif.style.left = str(x) + 'px';
  yaygif.src = "";
  yaygif.src = "animations/yayonce.gif";
}

function complete_animation(x, y) {
  let yaygif = document.querySelector("#yaygif");
  yaygif.style.display = 'block';
  yaygif.style.position = 'absolute';
  yaygif.style.top = str(y) + 'px';
  yaygif.style.left = str(x) + 'px';
  yaygif.src = "";
  yaygif.src = "animations/yayonce.gif";
}
