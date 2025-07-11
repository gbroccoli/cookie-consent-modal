import { defineConfig } from 'vite'
import path from 'path'
import cssnano from 'cssnano'

export default defineConfig({
    build: {
        outDir: 'dist',
        emptyOutDir: true,
        cssCodeSplit: false,
        assetsInlineLimit: 0,
        minify: 'terser',
        terserOptions: {
            mangle: false,
            format: {
                beautify: false,
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
                    throw new Error('Assets are not allowed')
                }
            },
        },
    },
    css: {
        postcss: {
            plugins: [
                cssnano({
                    preset: ['default', {
                        normalizeWhitespace: true,
                        minifySelectors: false,
                        discardComments: { removeAll: true },
                    }],
                }),
            ],
        },
    },
    publicDir: false,
})
