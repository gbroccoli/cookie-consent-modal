import css from './cookies.css?inline';
import { getCookie, setCookie } from './utils/cookies';
import { applyStyles, generateStyle } from './utils/styles';

((): null | undefined => {
    function generateModalCookies(
        urlPolicy: string,
        isIcon: boolean = false,
        cookieName: string,
        daysCookies: number = 365
    ): void {
        let icon: HTMLDivElement | null = null;

        const main: HTMLElement = document.createElement('aside');
        main.id = 'cookies';
        main.setAttribute('role', 'alert');
        main.setAttribute('aria-label', 'Уведомление об использовании cookie');

        const wrapper: HTMLDivElement = document.createElement('div');
        wrapper.id = 'cookies-wrapper';

        const header: HTMLDivElement = document.createElement('div');
        header.classList.add('cookies-line');

        if (isIcon) {
            icon = document.createElement('div');
            icon.id = 'cookies-icon';
            icon.innerHTML = `<i class="fa fa-cookie-bite"></i>`;
        }

        const title: HTMLHeadingElement = document.createElement('h2');
        title.id = 'cookies-title';
        title.textContent = 'Наш сайт использует cookies';

        const body: HTMLDivElement = document.createElement('div');
        body.classList.add('cookies-line');

        const text: HTMLParagraphElement = document.createElement('p');
        text.id = 'cookies-text';
        text.innerHTML = `Наш сайт использует файлы cookie для улучшения работы сайта, данные обрабатываются с использованием интернет-сервиса Яндекс.Метрика. Продолжая использовать сайт, вы соглашаетесь с использованием cookie в соответствии с нашей <a href="${urlPolicy}" target="_blank" rel="noopener noreferrer">политикой конфиденциальности</a>.`;

        const btn: HTMLButtonElement = document.createElement('button');
        btn.id = 'cookies-btn';
        btn.type = 'button';
        btn.textContent = 'Принять';

        btn.addEventListener('click', () => {
            setCookie(cookieName, 'true', daysCookies);
            main.remove();
        });

        if (urlParams.get('btn-class')) {
            btn.classList.add(<string>urlParams.get('btn-class'));
        }

        if (icon) {
            header.appendChild(icon);
        }

        header.appendChild(title);
        body.appendChild(text);
        wrapper.appendChild(header);
        wrapper.appendChild(body);
        wrapper.appendChild(btn);
        main.appendChild(wrapper);

        document.body.appendChild(main);
    }

    const COOKIES_KEY: string = 'cookieAccepted';

    if (getCookie(COOKIES_KEY) === 'true') return null;

    const currentScript: HTMLOrSVGScriptElement =
        document.currentScript || [...Array.from(document.scripts)].pop()!;
    const scriptSrc: string = currentScript.getAttribute('src') || '';
    const queryString: string = scriptSrc.split('?')[1] || '';
    const urlParams = new URLSearchParams(queryString);

    let policyUrl: string | null = urlParams.get('policy-url') ?? null;

    if (!policyUrl?.trim()) {
        policyUrl = '/politika';
    }

    const isIcon: boolean = ['true', '1', 'yes'].includes(
        urlParams.get('icon')?.toLowerCase() || ''
    );

    applyStyles(urlParams.get('style-url')!, () => {
        generateStyle(css);
    });

    generateModalCookies(policyUrl, isIcon, COOKIES_KEY);

    return null;
})();
