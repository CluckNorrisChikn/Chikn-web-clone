module.exports = {
  root: true,
  extends: ['eslint:recommended', 'standard', 'plugin:react/recommended', 'plugin:react-hooks/recommended'],
  env: {
    browser: true
  },
  rules: {
    'react/display-name': 0,
    'react/prop-types': 0,
    'space-before-function-paren': 0,
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'error'
  },
  settings: {
    react: {
      pragma: 'React',
      version: '16.12.0'
    }
  }
}
