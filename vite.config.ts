import cssnano from 'cssnano';
import fs from 'fs';
import path from 'path';
import { defineConfig } from 'vite';
const version = JSON.parse(fs.readFileSync('./package.json', 'utf-8')).version;

export default defineConfig({
    build: {
        outDir: 'dist',
        emptyOutDir: true,
        cssCodeSplit: false,
        assetsInlineLimit: 0,
        minify: 'terser',
        sourcemap: false,
        terserOptions: {
            mangle: false,
            format: {
                beautify: false,
                preamble: `/*! CookiesModal v${version} */`,
            },
            compress: {
                drop_console: false,
                drop_debugger: true,
            },
        },
        rollupOptions: {
            input: path.resolve(__dirname, 'cookies.ts'),
            output: {
                entryFileNames: 'cookies.min.js',
                assetFileNames: () => {
                    throw new Error('Assets are not allowed');
                },
            },
        },
    },
    css: {
        postcss: {
            plugins: [
                cssnano({
                    preset: [
                        'default',
                        {
                            normalizeWhitespace: true,
                            minifySelectors: false,
                            discardComments: { removeAll: true },
                        },
                    ],
                }),
            ],
        },
    },
    publicDir: false,
    esbuild: {
        drop: ['console', 'debugger'],
    },
});
