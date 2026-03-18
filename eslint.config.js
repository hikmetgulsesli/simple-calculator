import eslint from '@eslint/js';

export default [
    eslint.configs.recommended,
    {
        languageOptions: {
            globals: {
                browser: true,
                document: 'readonly',
            }
        }
    }
];
