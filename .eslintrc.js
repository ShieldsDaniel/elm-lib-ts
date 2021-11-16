/* eslint-disable no-undef */
// eslint-disable-next-line fp/no-mutation
module.exports = {
  "env": {
    "browser": true,
    "es2021": true
  },
  "extends": [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "./eslint-common.json",
  ],
  "parser": "@typescript-eslint/parser",
  "parserOptions": {
    "ecmaVersion": 13,
    "sourceType": "module"
  },
  "plugins": [
    "@typescript-eslint",
    "fp"
  ],
  "rules": {
    "indent": [
      "error",
      2
    ],
    "linebreak-style": [
      "error",
      "unix"
    ],
    "quotes": [
      "error",
      "double"
    ],
    "semi": [
      "error",
      "never"
    ],
    "no-unused-vars": "off",
    "@typescript-eslint/no-unused-vars": "off",
    "fp/no-arguments": "error",
    "fp/no-class": "error",
    "fp/no-delete": "error",
    "fp/no-events": "error",
    "fp/no-get-set": "error",
    "fp/no-let": "error",
    "fp/no-loops": "error",
    "fp/no-mutating-assign": "error",
    "fp/no-mutating-methods": "error",
    "fp/no-mutation": "error",
    "fp/no-proxy": "error",
    "fp/no-rest-parameters": "error",
    "fp/no-this": "error",
    "fp/no-throw": "error",
    "fp/no-unused-expression": "error",
    "fp/no-valueof-field": "error",
    "no-var": "error",
    "arrow-body-style": ["error", "as-needed"],
    "arrow-parens": ["error", "as-needed"],
    "arrow-spacing": ["error", {"before": true, "after": true}],
    "comma-dangle": ["error", {"arrays": "always-multiline", "objects": "always-multiline", "imports": "always-multiline", "exports": "always-multiline", "functions": "never"}],
    "computed-property-spacing": ["error", "never"],
    "func-style": ["error", "declaration", {"allowArrowFunctions": true}],
    "generator-star-spacing": ["error", {"before": false, "after": true}],
    "no-const-assign": ["error"],
    "no-invalid-regexp": ["error", {"allowConstructorFlags": ["g", "i", "m", "u", "y"]}],
    "no-useless-computed-key": ["error"],
    "no-useless-rename": ["error"],
    "no-var": ["error"],
    "prefer-arrow-callback": ["error", {"allowNamedFunctions": false}],
    "prefer-const": ["error", {"destructuring": "any"}],
    "prefer-numeric-literals": ["error"],
    "prefer-rest-params": ["error"],
    "prefer-spread": ["error"],
    "prefer-template": ["off"],
    "template-curly-spacing": ["error", "never"],
    "template-tag-spacing": ["error", "never"],
    "yield-star-spacing": ["error", {"before": false, "after": true}],
    "multiline-comment-style": "off"
  }
}
