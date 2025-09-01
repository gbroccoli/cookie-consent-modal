export function setCookie(name: string, value: string, days: number): void {
    const pair = `${encodeURIComponent(name)}=${encodeURIComponent(value)}`;

    if (days > 0) {
        const date = new Date();
        date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
        document.cookie = `${pair}; expires=${date.toUTCString()}; path=/`;
    } else {
        // сессионная кука — без expires
        document.cookie = pair;
    }
}

export function getCookie(name: string): string | null {
    const cookies: string[] = document.cookie.split('; ');
    for (const cookie of cookies) {
        const [key, val] = cookie.split('=');
        if (key === name) return val;
    }
    return null;
}
