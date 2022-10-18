//@ts-check
const getTsLintConfig = require('./eslintrc-ts')

module.exports = ({files = [], project = []}) => {
  const tsLintConfig = getTsLintConfig()
  return /** @type { import('eslint').Linter.Config } */ ({
    files,
    parser: '@typescript-eslint/parser',
    parserOptions: {
      ...tsLintConfig.parserOptions,
      project
    },
    settings: {
      'import/resolver': {
        typescript: {
          alwaysTryTypes: true
        }
      },
      'import/extensions': ['.js', '.jsx']
    },
    env: {
      ...tsLintConfig.env
    },
    extends: [
      // @ts-ignore
      ...tsLintConfig.extends,
      'plugin:@stencil/recommended',
      'plugin:prettier/recommended',
      'prettier'
    ],
    rules: {
      ...tsLintConfig.rules,

      // stencil
      '@stencil/strict-boolean-conditions': 'off',
      '@stencil/dependency-suggestions': 'off',
      '@stencil/prefer-vdom-listener': 'off',
      '@stencil/decorators-context': 'off'
    }
  })
}
