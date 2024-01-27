/** @type { import("eslint").Linter.Config } */
module.exports = {
    root: true,
    extends: ['eslint:recommended', 'plugin:svelte/recommended', 'prettier', 'plugin:@typescript-eslint/eslint-recommended', 'plugin:@typescript-eslint/recommended'],
    "parser": "@typescript-eslint/parser",
    parserOptions: {
        sourceType: 'module',
        ecmaVersion: 2020,
        extraFileExtensions: ['.svelte']
    },
    "plugins": [
        "@typescript-eslint"
    ],
    env: {
        browser: true,
        es2017: true,
        node: true
    }
};
