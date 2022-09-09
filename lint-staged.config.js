module.exports = {
  '*.{js,jsx,ts,tsx}': ['eslint --fix', 'prettier --write'],
  'package.json': ['prettier --write'],
  '*.vue': ['eslint --fix', 'stylelint --aei --fix', 'prettier --write'],
  '*.{scss,sass,less,css}': ['stylelint --aei --fix', 'prettier --write'],
  '*.md': ['prettier --write']
}
