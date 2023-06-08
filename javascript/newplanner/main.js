function setup() {
  textFont('Gill Sans MT');
  // All close buttons close your parent object
  document.querySelectorAll('.close-btn').forEach(closeBTN => {
    closeBTN.addEventListener('click', function() {
      closeBTN.parentElement.style.display = 'none';
    });
  });
  // setup the degree selecting area
  degreeSelectorSetup();
}
