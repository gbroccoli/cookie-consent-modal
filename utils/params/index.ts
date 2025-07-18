export function getScriptParams(): URLSearchParams {
    const currentScript: HTMLOrSVGScriptElement =
        document.currentScript || [...Array.from(document.scripts)].pop()!;
    const scriptSrc: string = currentScript.getAttribute('src') || '';
    const queryString: string = scriptSrc.split('?')[1] || '';
    return new URLSearchParams(queryString);
}