//@ts-check

module.exports = /** @type { import('eslint').Linter.Config } */ ({
  root: true,
  extends: [
    'eslint:recommended',
    'plugin:eslint-comments/recommended',
    'plugin:import/recommended',
    'plugin:unicorn/recommended',
    'plugin:react/recommended',
    'plugin:react/jsx-runtime',
    'plugin:react-hooks/recommended',
    'plugin:jsx-a11y/recommended',
    'plugin:prettier/recommended',
    'prettier'
  ],
  env: {
    node: true,
    browser: true,
    es2022: true
  },
  parserOptions: {
    ecmaVersion: 2022,
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true
    }
  },
  settings: {
    react: {
      version: 'detect'
    },
    'import/extensions': ['.js', '.jsx']
  },
  ignorePatterns: ['node_modules/*'],
  rules: {
    /**
     * Turn-off recommended rules
     */
    'array-callback-return': 'off',
    'jsx-a11y/click-events-have-key-events': 'off',
    'jsx-a11y/no-autofocus': 'off',
    'react/display-name': 'off',
    'react/prop-types': 'off',
    'eslint-comments/disable-enable-pair': 'off',
    'unicorn/no-array-reduce': 'off',
    'unicorn/filename-case': 'off',
    'unicorn/no-null': 'off',
    'unicorn/prevent-abbreviations': 'off',
    'unicorn/prefer-module': 'off',
    'unicorn/prefer-top-level-await': 'off',
    'unicorn/consistent-function-scoping': 'off',
    'unicorn/no-array-for-each': 'off',

    /**
     * Adjust recommended rules
     */
    'no-empty': ['error', {allowEmptyCatch: true}],
    'no-unused-vars': ['error', {args: 'none', ignoreRestSiblings: true}],
    'react-hooks/exhaustive-deps': ['error', {additionalHooks: '(useRecoilCallback|useRecoilTransaction)'}],

    /**
     * Use additional rules
     */
    'default-case': 'error',
    eqeqeq: ['error', 'smart'],
    'no-array-constructor': 'error',
    'no-caller': 'error',
    'no-eval': 'error',
    'no-extend-native': 'error',
    'no-extra-bind': 'error',
    'no-extra-label': 'error',
    'no-implied-eval': 'error',
    'no-label-var': 'error',
    'no-labels': 'error',
    'no-lone-blocks': 'error',
    'no-loop-func': 'error',
    'no-multi-str': 'error',
    'no-new-func': 'error',
    'no-new-object': 'error',
    'no-new-wrappers': 'error',
    'no-restricted-globals': ['error', ...require('confusing-browser-globals')],
    'no-script-url': 'error',
    'no-self-compare': 'error',
    'no-sequences': 'error',
    'no-template-curly-in-string': 'error',
    'no-throw-literal': 'error',
    'no-unused-expressions': [
      'error',
      {
        allowShortCircuit: true,
        allowTernary: true,
        allowTaggedTemplates: true
      }
    ],
    'no-useless-computed-key': 'error',
    'no-useless-concat': 'error',
    'no-useless-constructor': 'error',
    'no-useless-rename': 'error',
    strict: ['error', 'never'],
    'react/jsx-pascal-case': ['error', {allowAllCaps: true}],
    'react/no-array-index-key': 'error',
    'react/no-typos': 'error',
    'react/style-prop-object': 'error'
  },
  overrides: [
    {
      files: ['**/__tests__/**/*', '**/*.{spec,test}.*'],
      extends: ['plugin:testing-library/react', 'plugin:jest-dom/recommended']
    },
    {
      files: ['**/*.stories.*'],
      rules: {
        'import/no-anonymous-default-export': 'off'
      }
    },
    {
      files: ['**/*.ts?(x)', '**/*.vue'],
      parser: 'vue-eslint-parser',
      parserOptions: {
        parser: '@typescript-eslint/parser',
        ecmaversion: 2022,
        sourceType: 'module',
        ecmaFeatures: {
          jsx: true
        },
        extraFileExtensions: ['.vue'],
        project: [
          './tsconfig.json',
          './packages/*/tsconfig.json',
          './examples/**/tsconfig.json',
          './playgrounds/**/tsconfig.json'
        ]
      },
      settings: {
        react: {version: 'detect'},
        'import/resolver': {
          typescript: {
            alwaysTryTypes: true
          }
        }
      },
      env: {
        browser: true,
        node: true,
        es6: true
      },
      extends: [
        'plugin:@typescript-eslint/recommended',
        'plugin:@typescript-eslint/recommended-requiring-type-checking',
        'plugin:@typescript-eslint/strict',
        'plugin:import/typescript',
        'plugin:vue/recommended',
        'plugin:prettier/recommended',
        'prettier'
      ],
      rules: {
        /**
         * Turn-off recommended rules
         */
        '@typescript-eslint/no-floating-promises': 'off',
        '@typescript-eslint/non-nullable-type-assertion-style': 'off',
        '@typescript-eslint/no-unsafe-assignment': 'off',
        '@typescript-eslint/no-non-null-assertion': 'off',
        '@typescript-eslint/no-unsafe-call': 'off',
        '@typescript-eslint/no-unnecessary-type-assertion': 'off',

        // 'tsc' already handles this (https://typescript-eslint.io/docs/linting/troubleshooting/#eslint-plugin-import)
        'import/default': 'off',
        'import/namespace': 'off',
        'import/no-named-as-default-member': 'off',
        'import/no-unresolved': 'off',

        /**
         * Adjust recommended rules
         */
        '@typescript-eslint/consistent-type-definitions': ['error', 'type'],
        '@typescript-eslint/no-misused-promises': ['error', {checksVoidReturn: {arguments: false, attributes: false}}],
        '@typescript-eslint/no-unused-vars': ['error', {args: 'none', ignoreRestSiblings: true}],

        /**
         * Use additional rules
         */
        '@typescript-eslint/consistent-type-imports': 'error',
        'import/first': 'error',
        'import/no-anonymous-default-export': 'error',

        /**
         * Replace additional rules
         */
        'default-case': 'off', // 'tsc' noFallthroughCasesInSwitch option is more robust
        'no-array-constructor': 'off',
        '@typescript-eslint/no-array-constructor': 'error',
        'no-implied-eval': 'off',
        '@typescript-eslint/no-implied-eval': 'error',
        'no-loop-func': 'off',
        '@typescript-eslint/no-loop-func': 'error',
        'no-unused-expressions': 'off',
        '@typescript-eslint/no-unused-expressions': [
          'error',
          {
            allowShortCircuit: true,
            allowTernary: true,
            allowTaggedTemplates: true
          }
        ],
        'no-throw-literal': 'off',
        '@typescript-eslint/no-throw-literal': 'error',
        'no-useless-constructor': 'off',
        '@typescript-eslint/no-useless-constructor': 'error',

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
        ]
      }
    }
  ]
})
