module.exports = {
    root: true,
    parser: '@typescript-eslint/parser',
    extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended', 'plugin:@typescript-eslint/eslint-recommended', 'prettier'],
    plugins: ['svelte3', '@typescript-eslint', 'simple-import-sort'],
    ignorePatterns: ['*.cjs'],
    overrides: [{files: ['*.svelte'], processor: 'svelte3/svelte3'}],
    settings: {
        'svelte3/typescript': () => require('typescript')
    },
    parserOptions: {
        sourceType: 'module',
        ecmaVersion: 2020
    },
    env: {
        browser: true,
        es2017: true,
        node: true
    },
    rules: {
        'simple-import-sort/exports': 'error',
        'simple-import-sort/imports': 'error'
    }
}
