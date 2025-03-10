// import globals from 'globals';
// import pluginJs from '@eslint/js';

// /** @type {import('eslint').Linter.Config[]} */
// export default [
//     // Подключаем глобальные переменные для браузера
//     {
//         languageOptions: {
//             globals: {
//                 ...globals.browser, // Глобальные переменные браузера
//                 es6: true, // Поддержка ES6
//                 jest: true, // Глобальные переменные Jest
//             },
//             ecmaVersion: 2022, // Версия ECMAScript
//             sourceType: 'module', // Используем ES-модули
//         },
//     },

//     // Подключаем рекомендуемую конфигурацию от ESLint
//     pluginJs.configs.recommended,

//     // Дополнительные правила
//     {
//         rules: {
//             'no-restricted-syntax': [
//                 'error',
//                 'LabeledStatement',
//                 'WithStatement',
//             ],
//         },
//     },
// ];

import globals from "globals";
import pluginJs from "@eslint/js";
import jest from "eslint-plugin-jest";
import eslintPluginPrettierRecommended from "eslint-plugin-prettier/recommended";

export default [
  {
    languageOptions: { globals: { ...globals.browser, ...globals.node } },
  },
  pluginJs.configs.recommended,
  eslintPluginPrettierRecommended,
  {
    rules: {
      "no-unused-vars": "warn",
    },
  },
  {
    ignores: ["dist/*"],
  },
  {
    files: ["**/*.test.js"],
    ...jest.configs["flat/recommended"],
    rules: {
      ...jest.configs["flat/recommended"].rules,
      "jest/prefer-expect-assertions": "off",
    },
  },
];
