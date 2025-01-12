document.addEventListener('DOMContentLoaded', function() {
    // Ensure smooth scrolling functionality on page load
    const container = document.querySelector('.scroll-container');

    // Adding an event listener for horizontal scroll
    container.addEventListener('wheel', function(event) {
        if (event.deltaY !== 0) {
            if (event.deltaY > 0) {
                container.scrollLeft += window.innerWidth; // Scroll to the right
            } else {
                container.scrollLeft -= window.innerWidth; // Scroll to the left
            }
        }
    });
});
