'use strict'

const { defineConfig } = require('eslint-define-config')

module.exports = defineConfig({
  ignorePatterns: ['dist', 'node_modules'],
  env: {
    node: true,
    es2021: true
  },
  parser: '@typescript-eslint/parser',
  // https://typescript-eslint.io/getting-started/typed-linting/
  parserOptions: {
    projectService: true,
    tsconfigRootDir: __dirname,
    project: './tsconfig.json',
  },
  plugins: ['@typescript-eslint'],
  extends: [
    'plugin:@typescript-eslint/recommended',
    'airbnb/base',
    'airbnb-typescript/base',
  ],
  rules: {
    indent: ['error', 2, { SwitchCase: 1 }],
    'linebreak-style': ['error', 'unix'],
    quotes: ['error', 'single'],
    semi: ['error', 'never'],
    'max-len': ['error', { code: 100 }],
    'space-before-function-paren': ['error', 'never'],
    'no-param-reassign': ['error', { props: false }],
    "class-methods-use-this": "off",
    "no-restricted-syntax": "off"
  },
  overrides: [
    {
      files: ['**/*.ts'],
      parser: '@typescript-eslint/parser',
      parserOptions: {
        project: './tsconfig.json'
      },

      rules: {
        '@typescript-eslint/semi': ['error', 'never'],
        'import/prefer-default-export': 'off',
        'import/no-default-export': "error",
        'max-classes-per-file': 'off',
        '@typescript-eslint/space-before-function-paren': ['error', 'never'],
        'arrow-body-style': 'off',
        'no-underscore-dangle': 'off',
        'max-len': ['error', 120]
      }
    }
  ]
})
