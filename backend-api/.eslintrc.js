module.exports = {
  env: {
    browser: true,
    commonjs: true,
    es2021: true,
  },
  extends: [
    'airbnb-base',
  ],
  parserOptions: {
    ecmaVersion: 12,
  },
  rules: {
    'linebreak-style': 'off',
    'no-param-reassign': 'off',
    'no-underscore-dangle': 'off',
    'no-plusplus': 'off',
    'no-await-in-loop': 'off',
    'class-methods-use-this': 'off',
  },
};
