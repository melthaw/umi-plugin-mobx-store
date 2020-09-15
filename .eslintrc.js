module.exports = {
  env: {
    browser: true,
    node: true,
    es2020: true,
    jest: true,
    jasmine: true,
  },
  extends: [
    'standard',
    'plugin:@typescript-eslint/recommended',
    'plugin:jest/recommended',
    'prettier',
    'prettier/@typescript-eslint',
    'prettier/standard',
  ],
  plugins: ['@typescript-eslint', 'jest', 'prettier', 'standard'],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 11,
    sourceType: 'module',
  },
  rules: {
    'prettier/prettier': 'error',
  },
};
