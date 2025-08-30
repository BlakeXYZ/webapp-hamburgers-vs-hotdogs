


document.querySelectorAll('.gallery-contestant').forEach(btn => {
  btn.addEventListener('click', function() {
    const contestantId = this.getAttribute('data-contestant-id');
    const extraInfo = this.querySelector('.contestant-stats'); // Example of another data attribute
    if (this.classList.contains('active')) {
        extraInfo.style.display = 'block';     
        console.log('Clicked contestant is Active:', contestantId);
        return;
    }
    extraInfo.style.display = 'none';
    console.log('Clicked contestant is Inactive:', contestantId);
  });
});