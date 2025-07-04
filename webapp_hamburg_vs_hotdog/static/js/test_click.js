function setupClickButton() {
    const clickBtn = document.getElementById('clickButton');
    if (clickBtn) {
        clickBtn.addEventListener('click', function() {
            fetch('/onclick_test/', {method: 'POST'})
                .then(response => response.json())
                .then(data => {
                    if (data.click_count !== undefined) {
                        document.getElementById('clickCount').textContent = 'Total Clicks: ' + data.click_count;
                    }
                });
        });
    }
}

// Call this on DOMContentLoaded or at the end of your JS file
document.addEventListener('DOMContentLoaded', function() {
    setupClickButton();
    // Call other setup functions here as needed
});