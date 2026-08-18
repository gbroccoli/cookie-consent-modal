export class YandexMetrika {
    private readonly counters = new Set<number>();

    private enabled: boolean;

    private originalInsertBefore: typeof Node.prototype.insertBefore | null = null;

    constructor(enabled: boolean) {
        this.enabled = enabled;
    }

    public init(): void {
        this.detectExistingCounters();
        this.interceptScripts();
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
        this.counters.add(id);

        window[`disableYaCounter${id}`] = !this.enabled;
    }

    private applyState(): void {
        this.counters.forEach((id) => {
            window[`disableYaCounter${id}`] = !this.enabled;
        });
    }

    private detectExistingCounters(): void {
        document
            .querySelectorAll<HTMLScriptElement>('script[src*="mc.yandex.ru/metrika/tag.js"]')
            .forEach((script) => {
                const id = this.getCounterId(script.src);

                if (id !== null) {
                    this.registerCounter(id);
                }
            });
    }

    private interceptScripts(): void {
        if (this.originalInsertBefore) {
            return;
        }

        this.originalInsertBefore = Node.prototype.insertBefore;

        const provider = this;

        Node.prototype.insertBefore = function <T extends Node>(
            newNode: T,
            referenceNode: Node | null
        ): T {
            if (newNode instanceof HTMLScriptElement) {
                const id = provider.getCounterId(newNode.src);

                if (id !== null) {
                    provider.registerCounter(id);
                }
            }

            return provider.originalInsertBefore!.call(this, newNode, referenceNode) as T;
        };
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
