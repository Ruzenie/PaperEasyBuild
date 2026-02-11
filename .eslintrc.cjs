/** @type {import("eslint").Linter.Config} */
module.exports = {
  root: true,
  ignorePatterns: ["dist/", "node_modules/", ".pnpm-store/", "helloagents/"],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
    ecmaFeatures: { jsx: true }
  },
  plugins: ["@typescript-eslint", "react", "react-hooks"],
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:react/recommended",
    "plugin:react-hooks/recommended"
  ],
  settings: {
    react: { version: "detect" }
  },
  rules: {
    "react/react-in-jsx-scope": "off",
    "react/prop-types": "off",
    "no-unused-vars": "off",
    "@typescript-eslint/no-unused-vars": [
      "error",
      { argsIgnorePattern: "^_", varsIgnorePattern: "^_", ignoreRestSiblings: true }
    ]
  },
  overrides: [
    {
      files: ["src/main/**/*.{ts,tsx}", "src/preload/**/*.{ts,tsx}"],
      env: { node: true, browser: false }
    },
    {
      files: ["src/renderer/**/*.{ts,tsx}", "src/vite-env.d.ts"],
      env: { browser: true, node: false }
    },
    {
      files: ["tests/**/*.{ts,tsx}"],
      env: { node: true, browser: false }
    }
  ]
};

