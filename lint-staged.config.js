module.exports = {
  '*.{js,jsx,ts,tsx}': ['eslint --fix'],
  '*.json': ['prettier --write'],
  '*.vue': ['eslint --fix', 'stylelint --aei --fix'],
  '*.{scss,sass,less,css}': ['stylelint --aei --fix'],
  '*.md': ['prettier --write']
}
