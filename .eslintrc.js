//@ts-check
const getTsLintConfig = require('./eslintrc-ts')
const getVueLintConfig = require('./eslintrc-vue')
const getReactLintConfig = require('./eslintrc-react')
// const getStencilLintConfig = require('./eslintrc-stencil')

module.exports = /** @type { import('eslint').Linter.Config } */ ({
  root: true,
  extends: [
    'eslint:recommended',
    'plugin:eslint-comments/recommended',
    'plugin:import/recommended',
    'plugin:unicorn/recommended',
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
  ignorePatterns: ['node_modules/*', '**/node_modules/*', 'dist/*', '**/dist/*'],
  rules: {
    /**
     * Turn-off recommended rules
     */
    'array-callback-return': 'off',
    'jsx-a11y/click-events-have-key-events': 'off',
    'jsx-a11y/no-autofocus': 'off',
    'eslint-comments/disable-enable-pair': 'off',
    'eslint-comments/no-unlimited-disable': 'off',
    'unicorn/no-array-reduce': 'off',
    'unicorn/filename-case': 'off',
    'unicorn/no-null': 'off',
    'unicorn/prevent-abbreviations': 'off',
    'unicorn/prefer-module': 'off',
    'unicorn/prefer-top-level-await': 'off',
    'unicorn/consistent-function-scoping': 'off',
    'unicorn/no-array-for-each': 'off',
    'unicorn/prefer-spread': 'off',
    'unicorn/no-abusive-eslint-disable': 'off',

    /**
     * Adjust recommended rules
     */
    'no-empty': ['error', {allowEmptyCatch: true}],
    'no-unused-vars': ['error', {args: 'none', ignoreRestSiblings: true}],

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
    strict: ['error', 'never']
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
      // 纯 ts 项目
      ...getTsLintConfig({
        files: [
          './*.ts?(x)',
          './scripts/**/*.ts?(x)',
          './types/**/*.ts?(x)',
          './packages/{vr360-core,vr360-ui,vr360-shared}/**/*.ts?(x)'
        ],
        project: ['./tsconfig.json', './packages/{vr360-core,vr360-ui,vr360-shared}/tsconfig.json']
      })
    },
    {
      // vue 项目
      ...getVueLintConfig({
        files: [
          './packages/{vr360-ui-vue3,vr360-ui-vue2,doc}/**/*.ts?(x)',
          './playgrounds/{vue3,vue2}/**/*.ts?(x)',
          '**/*.vue'
        ],
        project: [
          // './packages/vr360-ui-vue2/tsconfig.json',
          './packages/{doc,vr360-ui-vue3}/tsconfig.json',
          './playgrounds/{vue2,vue3}/tsconfig.json'
        ]
      })
    },
    {
      // react 项目
      ...getReactLintConfig({
        files: ['./packages/vr360-ui-react/**/*.ts?(x)', './playgrounds/react/**/*.ts?(x)'],
        project: ['./packages/vr360-ui-react/tsconfig.json', './playgrounds/react/tsconfig.json']
      })
    }
    // {
    //   // stencil 项目，因为 stencil lint 版本太旧，所以暂时不用
    //   ...getStencilLintConfig({
    //     files: ['./packages/vr360-ui/**/*.ts?(x)'],
    //     project: ['./packages/vr360-ui/tsconfig.json']
    //   })
    // }
  ]
})
// console.log('eslint', JSON.stringify(module.exports, null, 4))
