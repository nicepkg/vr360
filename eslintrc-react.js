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
      react: {version: 'detect'},
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
      'plugin:react/recommended',
      'plugin:react/jsx-runtime',
      'plugin:react-hooks/recommended',
      'plugin:prettier/recommended',
      'prettier'
    ],
    rules: {
      ...tsLintConfig.rules,

      // react
      'react/display-name': 'off',
      'react/prop-types': 'off',
      'react-hooks/exhaustive-deps': ['error', {additionalHooks: '(useRecoilCallback|useRecoilTransaction)'}],
      'react/jsx-pascal-case': ['error', {allowAllCaps: true}],
      'react/no-array-index-key': 'error',
      'react/no-typos': 'error',
      'react/style-prop-object': 'error'
    }
  })
}
