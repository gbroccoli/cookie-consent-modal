// eslint.config.js
import tsPlugin from '@typescript-eslint/eslint-plugin';
import parser from '@typescript-eslint/parser';
import prettierConfig from 'eslint-config-prettier'; // ✅ вот это — важно
import importPlugin from 'eslint-plugin-import';
import simpleImportSort from 'eslint-plugin-simple-import-sort';
import unusedImports from 'eslint-plugin-unused-imports';

/** @type {import("eslint").Linter.FlatConfig[]} */
export default [
    prettierConfig, // ✅ подключаем Prettier конфиг правильно

    {
        files: ['**/*.ts', '**/*.tsx', '**/*.d.ts'],
        languageOptions: {
            parser,
            parserOptions: {
                ecmaVersion: 'latest',
                sourceType: 'module',
            },
            globals: {
                document: true,
                window: true,
                navigator: true,
                setTimeout: true,
                URLSearchParams: true,
                module: true,
            },
        },
        plugins: {
            '@typescript-eslint': tsPlugin,
            import: importPlugin,
            'unused-imports': unusedImports,
            'simple-import-sort': simpleImportSort,
        },
        rules: {
            '@typescript-eslint/no-unused-vars': 'off',
            'unused-imports/no-unused-imports': 'warn',
            'unused-imports/no-unused-vars': [
                'warn',
                {
                    vars: 'all',
                    varsIgnorePattern: '^_',
                    args: 'after-used',
                    argsIgnorePattern: '^_',
                },
            ],
            'simple-import-sort/imports': 'warn',
            'simple-import-sort/exports': 'warn',
            'import/order': 'off',
        },
    },

    {
        files: ['**/*.js'],
        languageOptions: {
            ecmaVersion: 'latest',
            sourceType: 'module',
            globals: {
                document: true,
                window: true,
                navigator: true,
                setTimeout: true,
                URLSearchParams: true,
                module: true,
            },
        },
        plugins: {
            import: importPlugin,
            'unused-imports': unusedImports,
            'simple-import-sort': simpleImportSort,
        },
        rules: {
            'no-unused-vars': 'warn',
            'unused-imports/no-unused-imports': 'warn',
            'simple-import-sort/imports': 'warn',
            'simple-import-sort/exports': 'warn',
        },
    },

    {
        ignores: ['node_modules', 'dist', 'build', 'public/js', '*.min.js'],
    },
];
