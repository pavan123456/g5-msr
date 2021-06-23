module.exports = {
  root: true,
  env: {
    browser: true,
    node: true
  },
  parserOptions: {
    parser: 'babel-eslint'
  },
  extends: [
    '@nuxtjs',
    'plugin:nuxt/recommended'
  ],
  rules: {
    'nuxt/no-cjs-in-config': 0,
    curly: 0,
    'no-console': 1,
    camelcase: ['warn', { properties: 'never', ignoreDestructuring: true }]
  }
}
