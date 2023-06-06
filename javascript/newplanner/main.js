function setup() {

  document.querySelectorAll('.close-btn').forEach(closeBTN => {
    closeBTN.addEventListener('click', function() {
      closeBTN.parentElement.style.display = 'none';
    });
  });
  
  degreeSelectorSetup();
}
