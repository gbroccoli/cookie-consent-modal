import {copyFileSync, existsSync, mkdirSync} from 'fs';
import {dirname, resolve} from 'path';

const source = resolve('dist/cookies.min.js');
const destination = resolve('docs/cookies.min.js');

if (!existsSync(source)) {
    console.error(`Source file not found: ${source}`);
    process.exit(1);
}

mkdirSync(dirname(destination), {recursive: true});
copyFileSync(source, destination);
console.log(`Copied ${source} -> ${destination}`);
