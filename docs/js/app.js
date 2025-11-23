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

/**
 * @param {string} name
 * @param {string} value
 * @param {number} days
 * @return {void}
 */
function setCookie(name, value, days) {
    const date = new Date();
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
    document.cookie = `${name}=${value}; path=/; expires=${date.toUTCString()}`;
}

/**
 * @param {string} name
 * @return {null|string}
 */
function getCookie(name) {

    /**
     * @type {string[]}
     */
    const cookies = document.cookie.split('; ');
    for (const cookie of cookies) {
        const [key, val] = cookie.split('=');
        if (key === name) return val;
    }
    return null;
}

document.addEventListener('DOMContentLoaded', () => {
    const cookies = document.querySelector('#cookies');

    if (cookies) {
        if (getCookie("cookieAccepted") === 'true') {
            cookies.remove()
        } else {
            cookies.classList.remove('noshow')
            const btnSuccess = cookies.querySelector('.cookies-btn-success')
            const btnClose = cookies.querySelector('.cookies-btn-close')

            if (btnClose && btnSuccess) {

                btnClose.addEventListener('click', (e) => {
                    window.close()
                })

                btnSuccess.addEventListener('click', (e) => {
                    setCookie('cookieAccepted', 'true', 365)
                    cookies.remove()
                })
            }
        }
    }
})
