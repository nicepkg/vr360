//@ts-check

module.exports = ({files = [], project = []} = {}) =>
  /** @type { import('eslint').Linter.Config } */ ({
    files,
    parser: '@typescript-eslint/parser',
    parserOptions: {
      ecmaversion: 2022,
      sourceType: 'module',
      ecmaFeatures: {
        jsx: true
      },
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
      browser: true,
      node: true,
      es6: true,
      es2022: true
    },
    extends: [
      'plugin:@typescript-eslint/recommended',
      'plugin:@typescript-eslint/recommended-requiring-type-checking',
      'plugin:@typescript-eslint/strict',
      'plugin:import/typescript',
      ...(files.length > 0 ? ['plugin:prettier/recommended', 'prettier'] : [])
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
      '@typescript-eslint/prefer-ts-expect-error': 'off',

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
      '@typescript-eslint/no-useless-constructor': 'error'
    }
  })
