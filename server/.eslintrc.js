module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: 'tsconfig.json',
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint/eslint-plugin', 'unused-imports', "import"],
  extends: [
    "airbnb-typescript",
    'plugin:@typescript-eslint/recommended',
    "plugin:react/recommended",
    "prettier",
    "plugin:prettier/recommended"
  ],
  root: true,
  env: {
    node: true,
    jest: true,
  },
  ignorePatterns: ['.eslintrc.js', "**/*.js"],
  rules: {
    "import/prefer-default-export": 0,
    '@typescript-eslint/explicit-module-boundary-types': 0,
    'unused-imports/no-unused-imports-ts': 2,
    "@typescript-eslint/no-unused-vars": [
      1,
      {
        "argsIgnorePattern": "^_"
      }
    ],
  },
};
