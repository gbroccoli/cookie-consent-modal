export class TemplateAnalytics {
    private enabled = false;

    constructor(enabled: boolean) {
        this.enabled = enabled;
    }

    public init(): void {
        if (this.enabled) {
            this.enable();
        }
    }

    public enable(): void {
        this.enabled = true;

        document
            .querySelectorAll<HTMLTemplateElement>('template[data-cookie-consent="analytics"]')
            .forEach((template) => this.activateTemplate(template));
    }

    public disable(): void {
        this.enabled = false;
    }

    private activateTemplate(template: HTMLTemplateElement): void {
        const fragment = template.content.cloneNode(true) as DocumentFragment;

        fragment.querySelectorAll<HTMLScriptElement>('script').forEach((sourceScript) => {
            const script = document.createElement('script');

            Array.from(sourceScript.attributes).forEach((attribute) => {
                script.setAttribute(attribute.name, attribute.value);
            });

            script.textContent = sourceScript.textContent;

            const parent = sourceScript.parentNode;

            if (parent) {
                parent.replaceChild(script, sourceScript);
            }
        });

        const parent = template.parentNode;

        if (!parent) {
            return;
        }

        parent.insertBefore(fragment, template);
        parent.removeChild(template);
    }
}
