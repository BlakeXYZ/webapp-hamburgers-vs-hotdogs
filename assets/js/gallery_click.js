


document.querySelectorAll('.gallery-contestant').forEach(btn => {
  btn.addEventListener('click', function() {
    const contestantId = this.getAttribute('data-contestant-id');
    const extraInfo = this.querySelector('.contestant-stats'); // Example of another data attribute
    const chevronIcon = this.querySelector('.gallery-chevron-icon i');
    if (this.classList.contains('active')) {
        extraInfo.style.display = 'block';
        chevronIcon.classList.remove('fa-chevron-down');
        chevronIcon.classList.add('fa-chevron-up');
        // console.log('Clicked contestant is Active:', contestantId);
        return;
    }
    extraInfo.style.display = 'none';
    chevronIcon.classList.remove('fa-chevron-up');
    chevronIcon.classList.add('fa-chevron-down');
    // console.log('Clicked contestant is Inactive:', contestantId);
  });
});