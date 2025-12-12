import {readFileSync, statSync, writeFileSync} from 'fs';
import {resolve} from 'path';
import {gzipSync} from 'zlib';

const pkg = JSON.parse(readFileSync(resolve('package.json'), 'utf8'));
const docsPath = resolve('docs/index.html');
const scriptPath = resolve('docs/cookies.min.js');

const html = readFileSync(docsPath, 'utf8');
const scriptContent = readFileSync(scriptPath);
const scriptStat = statSync(scriptPath);

const version = pkg.version;
const lastEdit = scriptStat.mtime.toISOString().split('T')[0];
const gzipSizeKb = (gzipSync(scriptContent).length / 1024).toFixed(2);

function updateField(source, pattern, replacement) {
    const updated = source.replace(pattern, replacement);
    if (updated === source) {
        console.warn(`Pattern not found: ${pattern}`);
    }
    return updated;
}

let nextHtml = html;
nextHtml = updateField(nextHtml, /<h3>Cookies Modal v(?:\{\{VERSION\}\}|[\d.]+)<\/h3>/, `<h3>Cookies Modal v${version}</h3>`);
nextHtml = updateField(
    nextHtml,
    /<p><strong>Последнее обновление:<\/strong> (\{\{LAST_EDIT\}\}|[^<]+)<\/p>/,
    `<p><strong>Последнее обновление:</strong> ${lastEdit}</p>`,
);
nextHtml = updateField(
    nextHtml,
    /<p><strong>Размер:<\/strong> (\{\{FILE_SIZE\}\}|[^<]+) KB \(сжатый\)<\/p>/,
    `<p><strong>Размер:</strong> ${gzipSizeKb} KB (сжатый)</p>`,
);

writeFileSync(docsPath, nextHtml);
console.log(
    `Updated docs metadata -> version: ${version}, last edit: ${lastEdit}, gzip size: ${gzipSizeKb} KB`,
);
