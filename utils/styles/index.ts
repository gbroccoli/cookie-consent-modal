export function applyStyles(styleUrl: string, fallback: () => void): void {
    if (styleUrl) {
        const link: HTMLLinkElement = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = styleUrl;
        document.head.appendChild(link);
    } else {
        fallback(); // если кастом не задан, подключаем стандартный стиль
    }
}

export function generateStyle(css: string): void {
    const style: HTMLStyleElement = document.createElement('style');
    style.textContent = css;
    document.head.appendChild(style);
}

export function parseClassList(param: string | null): string[] {
    return param
        ? param.split(/\s+/).map(cls => cls.trim()).filter(Boolean)
        : []
}