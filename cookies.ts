import css from './cookies.css?inline';
import {getCookie, setCookie} from './utils/cookies';
import {applyStyles, generateStyle, parseClassList} from './utils/styles';
import {isEmpty} from "./utils/array";
import {getScriptParams} from "./utils/params";
import replaceCustomTags from "./types/TextLink";

((): null | undefined => {
    function generateModalCookies(
        text_cookies: string,
        isIcon: boolean = false,
        cookieName: string,
        daysCookies: number = 365
    ): void {
        let icon: HTMLDivElement | null = null;

        const main: HTMLElement = document.createElement('aside');
        main.id = 'cookies';
        main.setAttribute('role', 'alert');
        main.setAttribute('aria-label', 'Уведомление об использовании файлов cookie');

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
        title.textContent = 'Наш сайт использует файлы cookie';

        const body: HTMLDivElement = document.createElement('div');
        body.classList.add('cookies-line');

        const text: HTMLParagraphElement = document.createElement('p');
        text.id = 'cookies-text';
        text.innerHTML = text_cookies;

        const btn: HTMLButtonElement = document.createElement('button');
        btn.id = 'cookies-btn';
        btn.type = 'button';
        btn.textContent = 'Принять';

        btn.addEventListener('click', () => {
            setCookie(cookieName, 'true', daysCookies);
            main.remove();
        });

        const classes = parseClassList(urlParams.get('btn-class'))
        if (!isEmpty(classes)) {
            btn.classList.add(...classes);
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

    const COOKIES_KEY: string = 'c_ok';

    if (getCookie(COOKIES_KEY) == 'true') return null;

    const urlParams = getScriptParams()

    let policyUrl: string | null = urlParams.get('policy-url') ?? null;

    if (!policyUrl?.trim()) {
        policyUrl = '/politika';
    }

    let soglasieUrl: string | null = urlParams.get('agree-url') ?? null;

    if (!soglasieUrl?.trim()) {
        soglasieUrl = '/soglasie';
    }

    const isIcon: boolean = ['true', '1', 'yes'].includes(
        urlParams.get('icon')?.toLowerCase() || ''
    )

    let days: string | number | null | undefined = urlParams.get('days')

    days = !isNaN(Number(days)) && Number.isInteger(Number(days)) ? Number(days) >= 0 ? Number(days) : undefined : undefined

    applyStyles(urlParams.get('style-url')!, () => {
        generateStyle(css);
    });

    let text = ''

    if (typeof textCookies !== 'undefined') {
        text = replaceCustomTags(textCookies, {policyUrl: policyUrl, soglasieUrl: soglasieUrl})
    } else {
        text = replaceCustomTags(`Мы используем файлы cookie. Используя сайт, вы автоматически соглашаетесь с Политикой использования cookie-файлов и выражаете свое {soglasie target="_blank"}согласие{/soglasie} на обработку ваших персональных данных с использованием сервисов аналитики Яндекс.Метрика и с {politika target="_blank"}политикой конфиденциальности{/politika}. В случае несогласия с обработкой ваших персональных данных вы можете отключить сохранение cookies в настройках вашего браузера.`, {policyUrl: policyUrl, soglasieUrl: soglasieUrl})
    }

    generateModalCookies(text, isIcon, COOKIES_KEY, days);

    return null;
})();