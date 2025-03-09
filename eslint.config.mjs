import globals from 'globals';
import pluginJs from '@eslint/js';

/** @type {import('eslint').Linter.Config[]} */
export default [
    // Подключаем глобальные переменные для браузера
    {
        languageOptions: {
            globals: {
                ...globals.browser, // Глобальные переменные браузера
                es6: true, // Поддержка ES6
                jest: true, // Глобальные переменные Jest
            },
            ecmaVersion: 2022, // Версия ECMAScript
            sourceType: 'module', // Используем ES-модули
        },
    },

    // Подключаем рекомендуемую конфигурацию от ESLint
    pluginJs.configs.recommended,

    // Дополнительные правила
    {
        rules: {
            'no-restricted-syntax': [
                'error',
                'LabeledStatement',
                'WithStatement',
            ],
        },
    },
];