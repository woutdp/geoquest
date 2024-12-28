import path from 'node:path'
import {fileURLToPath} from 'node:url'

import {includeIgnoreFile} from '@eslint/compat'
import eslintJs from '@eslint/js'
import * as typescriptParser from '@typescript-eslint/parser'
import prettier from 'eslint-config-prettier'
import simpleImportSort from 'eslint-plugin-simple-import-sort'
import eslintPluginSvelte from 'eslint-plugin-svelte'
import globals from 'globals'
import * as svelteParser from 'svelte-eslint-parser'
import tseslint from 'typescript-eslint'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const gitignorePath = path.resolve(__dirname, '.gitignore')

/** @type {import("eslint").Linter.Config[]} */
const flatConfig = [
    includeIgnoreFile(gitignorePath),
    eslintJs.configs.recommended,
    ...tseslint.configs.recommended,
    ...eslintPluginSvelte.configs['flat/recommended'],
    prettier,
    {
        plugins: {'simple-import-sort': simpleImportSort},
        rules: {
            'simple-import-sort/exports': 'error',
            'simple-import-sort/imports': 'error'
        },
        languageOptions: {
            globals: {
                ...globals.browser,
                ...globals.node,
                ...globals.es2017
            }
        }
    },
    {
        ignores: ['*.cjs'],
        files: ['**/*.svelte'],
        languageOptions: {
            parser: svelteParser,
            parserOptions: {
                parser: {
                    // Specify a parser for each lang.
                    ts: typescriptParser,
                    typescript: typescriptParser
                },
                // project: './path/to/your/tsconfig.json',
                extraFileExtensions: ['.svelte']
            }
        }
    }
]

export default flatConfig
