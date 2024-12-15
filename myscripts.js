
window.addEventListener('scroll', function () {
    const header = document.querySelector('header');
    if (window.scrollY > 0) {
        header.classList.add('sticky', 'transparent');
    } else {
        header.classList.remove('sticky', 'transparent');
    }
});



