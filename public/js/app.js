document.getElementById('year').textContent = new Date().getFullYear();

function copyCode(button) {
    const codeBlock = button.parentElement.nextElementSibling.querySelector('code');
    const text = codeBlock.textContent;

    navigator.clipboard.writeText(text).then(function () {
        const originalText = button.textContent;
        button.textContent = 'Скопировано!';
        button.style.background = 'var(--primary-green)';
        button.style.color = 'var(--white)';

        setTimeout(function () {
            button.textContent = originalText;
            button.style.background = 'var(--warning-yellow)';
            button.style.color = 'var(--primary-text)';
        }, 2000);
    });
}

// Smooth scrolling для навигации
document.querySelectorAll('nav a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start',
            });
        }
    });
});
