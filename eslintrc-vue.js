//@ts-check
const getTsLintConfig = require('./eslintrc-ts')

module.exports = ({files = [], project = []}) => {
  const tsLintConfig = getTsLintConfig()
  return /** @type { import('eslint').Linter.Config } */ ({
    files,
    parser: 'vue-eslint-parser',
    parserOptions: {
      parser: '@typescript-eslint/parser',
      ...tsLintConfig.parserOptions,
      extraFileExtensions: ['.vue'],
      project
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
      ...tsLintConfig.env
    },
    // @ts-ignore
    extends: [...tsLintConfig.extends, 'plugin:vue/recommended', 'plugin:prettier/recommended', 'prettier'],
    rules: {
      ...tsLintConfig.rules,

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
  })
}
