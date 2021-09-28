module.exports = {
  root: true,
  env: {
    node: true,
  },
  extends: [
    "plugin:vue/recommended",
    "eslint:recommended",
    "@vue/airbnb",
    "@vue/typescript/recommended",
  ],
  parserOptions: {
    parser: "@typescript-eslint/parser",
    ecmaVersion: 2020,
  },
  rules: {
    "linebreak-style": 0,
    "vue/component-name-in-template-casing": ["error", "kebab-case"],
    "max-len": ["error", { code: 500 }],
    "no-alert": process.env.NODE_ENV === "production" ? "warn" : "off",
    "no-console": process.env.NODE_ENV === "production" ? "warn" : "off",
    "no-debugger": process.env.NODE_ENV === "production" ? "warn" : "off",
    "prefer-destructuring": ["error", { object: false, array: false }],
    radix: ["error", "as-needed"],
    "no-prototype-builtins": "error",
    "no-empty": ["error", { allowEmptyCatch: true }],
    "import/extensions": [
      "error",
      "always",
      {
        js: "never",
        jsx: "never",
        ts: "never",
        tsx: "never",
      },
    ],
    camelcase: "off",
    "vue/max-attributes-per-line": "off",
    "no-this-before-super": ["off"],
    "no-useless-constructor": ["off"],
    "no-empty-function": [
      "error",
      { allow: ["constructors", "arrowFunctions"] },
    ],
    "no-param-reassign": ["error", { props: false }],
    "no-underscore-dangle": ["off"],
    "import/no-extraneous-dependencies": [
      "error",
      {
        devDependencies: true,
      },
    ],
    "import/prefer-default-export": ["off"],
    "no-new": ["off"],
    "prefer-template": ["error"],
    "no-plusplus": ["off"],
    "import/no-cycle": "off",
    // typescript rules
    "@typescript-eslint/explicit-member-accessibility": [
      "error",
      {
        accessibility: "no-public",
        overrides: {
          accessors: "no-public",
          methods: "no-public",
          properties: "no-public",
          parameterProperties: "explicit",
        },
      },
    ],
    "@typescript-eslint/no-object-literal-type-assertion": ["off"],
    "@typescript-eslint/no-parameter-properties": [
      "error",
      { allows: ["protected", "public"] },
    ],
    "@typescript-eslint/camelcase": "off", // use eslint camelcase rule
    "@typescript-eslint/no-empty-function": ["off"], // use eslint no-empty-function rule
    "@typescript-eslint/no-use-before-define": ["off"], // use eslint no-use-before-define rule
    "@typescript-eslint/ban-ts-ignore": ["off"],
    "@typescript-eslint/explicit-function-return-type": ["off"],
    "@typescript-eslint/explicit-module-boundary-types": "off",
  },
};
