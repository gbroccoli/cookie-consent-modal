export class YandexMetrika {
    private readonly counters = new Set<number>();

    private readonly previousStates = new Map<number, boolean | undefined>();

    private enabled: boolean;

    private observer: MutationObserver | null = null;

    constructor(enabled: boolean, counterIds: number[] = []) {
        this.enabled = enabled;

        counterIds.forEach((id) => this.registerCounter(id));
    }

    public init(): void {
        this.detectExistingCounters();
        this.observeScripts();
        this.applyState();
    }

    public enable(): void {
        this.enabled = true;
        this.applyState();
    }

    public disable(): void {
        this.enabled = false;
        this.applyState();
    }

    private registerCounter(id: number): void {
        if (!Number.isInteger(id) || id <= 0 || this.counters.has(id)) {
            return;
        }

        const key = `disableYaCounter${id}`;

        this.counters.add(id);
        this.previousStates.set(id, window[key]);
        this.applyCounterState(id);
    }

    private applyState(): void {
        this.counters.forEach((id) => this.applyCounterState(id));
    }

    private applyCounterState(id: number): void {
        const key = `disableYaCounter${id}`;

        if (!this.enabled) {
            window[key] = true;
            return;
        }

        const previousState = this.previousStates.get(id);

        if (previousState === undefined) {
            delete window[key];
            return;
        }

        window[key] = previousState;
    }

    private detectExistingCounters(): void {
        Object.keys(window).forEach((key) => {
            const match = key.match(/^disableYaCounter(\d+)$/);

            if (match) {
                this.registerCounter(Number(match[1]));
            }
        });

        document.querySelectorAll<HTMLScriptElement>('script').forEach((script) => {
            this.detectCountersInScript(script);
        });
    }

    private observeScripts(): void {
        if (this.observer) {
            return;
        }

        this.observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                mutation.addedNodes.forEach((node) => {
                    if (node instanceof HTMLScriptElement) {
                        this.detectCountersInScript(node);
                        return;
                    }

                    if (node instanceof HTMLElement) {
                        node.querySelectorAll<HTMLScriptElement>('script').forEach((script) => {
                            this.detectCountersInScript(script);
                        });
                    }
                });
            });
        });

        this.observer.observe(document.documentElement, {
            childList: true,
            subtree: true,
        });
    }

    private detectCountersInScript(script: HTMLScriptElement): void {
        const idFromSrc = this.getCounterId(script.src);

        if (idFromSrc !== null) {
            this.registerCounter(idFromSrc);
        }

        this.getCounterIdsFromCode(script.textContent || '').forEach((id) => {
            this.registerCounter(id);
        });
    }

    private getCounterIdsFromCode(code: string): number[] {
        const ids = new Set<number>();
        const regexp = /\bym\s*\(\s*(\d+)\s*,\s*['"]init['"]/g;

        let match: RegExpExecArray | null;

        while ((match = regexp.exec(code)) !== null) {
            ids.add(Number(match[1]));
        }

        return [...ids];
    }

    private getCounterId(src: string): number | null {
        if (!src) {
            return null;
        }

        try {
            const url = new URL(src, window.location.href);

            if (url.hostname !== 'mc.yandex.ru' || url.pathname !== '/metrika/tag.js') {
                return null;
            }

            const id = url.searchParams.get('id');

            if (!id || !/^\d+$/.test(id)) {
                return null;
            }

            return Number(id);
        } catch {
            return null;
        }
    }
}
