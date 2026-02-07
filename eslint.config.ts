import js from '@eslint/js';
import ts from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import prettier from 'eslint-plugin-prettier';

export default [
    {
        ignores: ['dist', 'node_modules'],
    },
    js.configs.recommended,
    {
        files: ['**/*.ts'],
        ignores: ['**/*.config.ts'],
        languageOptions: {
            parser: tsParser,
            globals: {
                process: 'readonly',
                console: 'readonly',
                URL: 'readonly',
            },
        },
        plugins: {
            '@typescript-eslint': ts,
            prettier: prettier,
        },
        rules: {
            'no-unused-vars': 'off',
            '@typescript-eslint/no-unused-vars': [
                'error',
                {
                    argsIgnorePattern: '^_',
                    varsIgnorePattern: '^_',
                    caughtErrorsIgnorePattern: '^_',
                },
            ],
            // Enforce the use of single quotes for strings
            quotes: ['error', 'single'],
            // Enforce semicolons at the end of statements
            semi: ['error', 'always'],
            // Enforce consistent line breaks (LF for Unix)
            'linebreak-style': ['error', 'unix'],
            // Require the use of === and !== (no implicit type conversions)
            eqeqeq: ['error', 'always'],
            // Enforce a maximum line length (usually 80 or 100 characters)
            'max-len': ['error', { code: 100 }],
            // Enable Prettier as a lint rule
            'prettier/prettier': [
                'error',
                {
                    tabWidth: 2,
                    printWidth: 100,
                    singleQuote: true,
                    semi: true,
                },
            ],
        },
    },
];
