/** @type {import("eslint").Linter.Config} */
const config = {
  extends: ["next/core-web-vitals"],
  rules: {
    "no-console": ["warn", { "allow": ["warn", "error"] }],
  },
};

module.exports = config;
