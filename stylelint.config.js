//@ts-check

module.exports = /** @type { Partial<import('stylelint').Config> } */ ({
  customSyntax: 'postcss-less',
  defaultSeverity: 'error',
  extends: [
    'stylelint-config-standard',
    'stylelint-config-recess-order',
    'stylelint-config-recommended-vue',
    'stylelint-prettier/recommended'
  ],
  plugins: ['stylelint-declaration-block-no-ignored-properties'],
  overrides: [
    {
      files: ['**/*.(less|css|html|vue)'],
      customSyntax: 'postcss-less',
      plugins: ['stylelint-less']
    },
    {
      files: ['**/*.(html|vue)'],
      customSyntax: 'postcss-html'
    }
  ],
  rules: {
    'media-feature-name-no-vendor-prefix': true,
    'at-rule-no-vendor-prefix': true,
    'selector-no-vendor-prefix': true,
    'property-no-vendor-prefix': true,
    'value-no-vendor-prefix': true,
    'block-no-empty': null,
    'comment-empty-line-before': null,
    'declaration-empty-line-before': null,
    'function-comma-newline-after': null,
    'function-name-case': null,
    'function-parentheses-newline-inside': null,
    'function-max-empty-lines': null,
    'function-whitespace-after': null,
    indentation: null,
    'number-leading-zero': null,
    'number-no-trailing-zeros': null,
    'rule-empty-line-before': null,
    'selector-combinator-space-after': null,
    'selector-list-comma-newline-after': null,
    'selector-pseudo-element-colon-notation': null,
    'unit-no-unknown': null,
    'value-list-max-empty-lines': null,
    'font-family-no-missing-generic-family-keyword': null,
    'no-descending-specificity': null,
    'selector-class-pattern': null,
    'keyframes-name-pattern': null,
    'color-function-notation': 'legacy',
    'alpha-value-notation': 'number',
    'no-empty-source': null,
    'function-no-unknown': [
      true,
      {
        ignoreFunctions: ['constant']
      }
    ],
    'at-rule-no-unknown': [
      true,
      {
        ignoreAtRules: ['extends', 'tailwind', 'apply', 'variants', 'responsive', 'screen']
      }
    ],
    'declaration-block-trailing-semicolon': null,
    'selector-pseudo-element-no-unknown': [
      true,
      {
        ignorePseudoElements: ['v-deep']
      }
    ]
  }
})
