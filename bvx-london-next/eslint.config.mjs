// ESLint flat config, required by ESLint 9 (which eslint-config-next@16.x
// now requires as a peer dependency). Next.js 16 removed the `next lint`
// CLI command, so linting runs via plain `eslint .` (see package.json's
// "lint" script) against this config instead.
import nextCoreWebVitals from 'eslint-config-next/core-web-vitals';

const eslintConfig = [
  ...nextCoreWebVitals,
  {
    ignores: ['.next/**', 'node_modules/**'],
  },
];

export default eslintConfig;
