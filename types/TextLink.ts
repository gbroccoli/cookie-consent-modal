interface TagUrls {
    [key: string]: string;
}

function replaceCustomTags(text: string, urls: TagUrls): string {
    const pattern = /\{(\w+)([^}]*)\}(.*?)\{\/\1\}/g;

    return text.replace(pattern, (match, tagName, attributes, content) => {
        // Регулярка для одинарных и двойных кавычек
        const attrPattern = /(\w+)=(['"])([^\2]*?)\2/g;
        const attrs: Record<string, string> = {};
        let attrMatch;

        while ((attrMatch = attrPattern.exec(attributes)) !== null) {
            let [, attrName, , attrValue] = attrMatch;
            attrs[attrName] = attrValue;
        }

        // Маппинг тегов на переменные URL
        const tagToUrlKey: Record<string, string> = {
            'politika': 'policyUrl',
            'soglasie': 'soglasieUrl'
        };

        // Получаем ключ переменной для данного тега
        const urlKey = tagToUrlKey[tagName];

        // Подставляем URL из переданного объекта
        if (urlKey && urls[urlKey]) {
            attrs['href'] = urls[urlKey];
        } else if (attrs['to']) {
            // Если нет в маппинге, используем атрибут 'to'
            attrs['href'] = attrs['to'];
        }

        // Удаляем атрибут 'to', так как он заменен на 'href'
        delete attrs['to'];

        // Формируем строку атрибутов
        const attrString = Object.entries(attrs)
            .map(([key, value]) => `${key}="${value}"`)
            .join(' ');

        const htmlTag = 'a';

        return `<${htmlTag}${attrString ? ' ' + attrString : ''}>${content}</${htmlTag}>`;
    });
}

export default replaceCustomTags;