document.addEventListener('DOMContentLoaded', function() {
  const leftSphere = document.querySelector('.v-circle.left');
  const rightSphere = document.querySelector('.v-circle.right');
  const popup = document.getElementById('elderlyPopup');
  const overlay = document.getElementById('popupOverlay');
  const closeBtn = document.getElementById('popupClose');

  const isolationPopup = document.getElementById('isolationPopup');
  const overlayRight = document.getElementById('popupOverlayRight');
  const closeBtnRight = document.getElementById('popupCloseRight');

  if (leftSphere && popup && overlay && closeBtn) {
    leftSphere.addEventListener('click', function(e) {
      popup.classList.add('show');
      overlay.classList.add('show');
    });
    closeBtn.addEventListener('click', function() {
      popup.classList.remove('show');
      overlay.classList.remove('show');
    });
    overlay.addEventListener('click', function() {
      popup.classList.remove('show');
      overlay.classList.remove('show');
    });
  }

  if (rightSphere && isolationPopup && overlayRight && closeBtnRight) {
    rightSphere.addEventListener('click', function(e) {
      isolationPopup.classList.add('show');
      overlayRight.classList.add('show');
    });
    closeBtnRight.addEventListener('click', function() {
      isolationPopup.classList.remove('show');
      overlayRight.classList.remove('show');
    });
    overlayRight.addEventListener('click', function() {
      isolationPopup.classList.remove('show');
      overlayRight.classList.remove('show');
    });
  }
}); 