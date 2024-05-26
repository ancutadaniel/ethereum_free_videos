module.exports = {
    env: {
      es2021: true,
      node: true,
      mocha: true  // This line enables Mocha environment
    },
    "extends": [
      "eslint:recommended",
      "plugin:@typescript-eslint/recommended"
    ],
    parserOptions: {
      ecmaVersion: 12,
      sourceType: "module"
    },
    "parser": "@typescript-eslint/parser",
    "plugins": ["@typescript-eslint"],
  };
  