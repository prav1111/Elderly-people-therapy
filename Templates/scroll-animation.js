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

  // New: Mental Health Issues branch sphere popup
  const mentalSphere = document.querySelector('.v-circle.branch.left');
  const mentalPopup = document.getElementById('mentalPopup');
  const overlayMental = document.getElementById('popupOverlayMental');
  const closeBtnMental = document.getElementById('popupCloseMental');

  if (mentalSphere && mentalPopup && overlayMental && closeBtnMental) {
    mentalSphere.addEventListener('click', function(e) {
      mentalPopup.classList.add('show');
      overlayMental.classList.add('show');
    });
    closeBtnMental.addEventListener('click', function() {
      mentalPopup.classList.remove('show');
      overlayMental.classList.remove('show');
    });
    overlayMental.addEventListener('click', function() {
      mentalPopup.classList.remove('show');
      overlayMental.classList.remove('show');
    });
  }

  // New: Gaps in Elderly Care branch sphere popup
  const gapsSphere = document.querySelector('.v-circle.branch.right');
  const gapsPopup = document.getElementById('gapsPopup');
  const overlayGaps = document.getElementById('popupOverlayGaps');
  const closeBtnGaps = document.getElementById('popupCloseGaps');

  if (gapsSphere && gapsPopup && overlayGaps && closeBtnGaps) {
    gapsSphere.addEventListener('click', function(e) {
      gapsPopup.classList.add('show');
      overlayGaps.classList.add('show');
    });
    closeBtnGaps.addEventListener('click', function() {
      gapsPopup.classList.remove('show');
      overlayGaps.classList.remove('show');
    });
    overlayGaps.addEventListener('click', function() {
      gapsPopup.classList.remove('show');
      overlayGaps.classList.remove('show');
    });
  }

  // Innovative Solutions end-circle popup
  const innovativeCircle = document.querySelector('.v-circle.end-circle');
  const innovativePopup = document.getElementById('innovativePopup');
  const overlayInnovative = document.getElementById('popupOverlayInnovative');
  const closeBtnInnovative = document.getElementById('popupCloseInnovative');

  if (innovativeCircle && innovativePopup && overlayInnovative && closeBtnInnovative) {
    innovativeCircle.addEventListener('click', function(e) {
      innovativePopup.classList.add('show');
      overlayInnovative.classList.add('show');
    });
    closeBtnInnovative.addEventListener('click', function() {
      innovativePopup.classList.remove('show');
      overlayInnovative.classList.remove('show');
    });
    overlayInnovative.addEventListener('click', function() {
      innovativePopup.classList.remove('show');
      overlayInnovative.classList.remove('show');
    });
  }

  // Smooth scroll with offset for Learn More button
  const learnMoreBtn = document.getElementById('learn-more-btn');
  if (learnMoreBtn) {
    learnMoreBtn.addEventListener('click', function(e) {
      e.preventDefault();
      const target = document.getElementById('challenge-section');
      const yOffset = 550;//ased negative value for more space above
      const y = target.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    });
  }
}); 