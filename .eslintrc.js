//@ts-check

module.exports = /** @type { import('eslint').Linter.Config } */ ({
  root: true,

  env: {
    browser: true,
    node: true,
    es6: true
  },

  parser: 'vue-eslint-parser',

  parserOptions: {
    parser: '@typescript-eslint/parser',
    ecmaversion: 2022,
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true
    }
  },

  extends: [
    'eslint:recommended',
    'plugin:import/recommended',
    'plugin:import/typescript',
    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:vue/recommended',
    'plugin:prettier/recommended',
    'prettier'
  ],

  rules: {
    'import/no-unresolved': 'off',
    'no-unused-vars': 'off',
    'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    // vue
    'vue/no-v-html': 'off',
    'vue/singleline-html-element-content-newline': 'off',
    'vue/html-self-closing': 'off',
    'vue/max-attributes-per-line': [
      'error',
      {
        singleline: 10,
        multiline: 1
      }
    ],
    'vue/require-default-prop': 'off',
    'vue/html-closing-bracket-spacing': 'error',
    'vue/no-unused-vars': 'warn',
    'vue/multi-word-component-names': 'off',
    'vue/one-component-per-file': 'off',
    'vue/no-v-model-argument': 'off',
    'vue/comment-directive': [
      'warn',
      {
        reportUnusedDisableDirectives: false
      }
    ],
    '@typescript-eslint/ban-types': 'off',
    '@typescript-eslint/no-this-alias': 'off',
    '@typescript-eslint/triple-slash-reference': 'off',
    '@typescript-eslint/no-var-requires': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-non-null-assertion': 'off',
    '@typescript-eslint/no-unused-vars': ['warn', {argsIgnorePattern: '^h$', varsIgnorePattern: '^emits$|^props$'}],
    'mdx/no-unused-expressions': 'off',
    'no-undef': 'off'
  },

  globals: {
    h: true
  }
})
