require('@rushstack/eslint-patch/modern-module-resolution')

module.exports = {
  root: true,
  env: {
    node: true,
  },
  extends: ['plugin:vue/vue3-recommended', '@vue/eslint-config-typescript/recommended', '@vue/eslint-config-prettier'],
  parserOptions: {
    ecmaVersion: 2020,
  },
  rules: {
    'no-console': 'warn',
    'no-debugger': 'warn',
    'max-len': [
      'warn',
      {
        code: 120,
        ignorePattern: '^\\s*(class|d)=("[^"]+"|\\{`)',
        ignoreComments: true,
      },
    ],
    'prettier/prettier': [
      'warn',
      {
        endOfLine: 'auto',
        semi: false,
        singleQuote: true,
        tabWidth: 2,
        trailingComma: 'all',
      },
    ],
  },
}
