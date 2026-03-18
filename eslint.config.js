import eslint from '@eslint/js';
import globals from 'globals';

export default [
    eslint.configs.recommended,
    {
        files: ['script.js'],
        languageOptions: {
            globals: {
                ...globals.browser,
                window: 'readonly',
                document: 'readonly',
                console: 'readonly',
            }
        }
    },
    {
        files: ['test-css.js'],
        languageOptions: {
            globals: {
                ...globals.node,
                console: 'readonly',
                process: 'readonly',
                __dirname: 'readonly',
                require: 'readonly',
                module: 'readonly',
                exports: 'readonly',
            }
        }
    }
];
