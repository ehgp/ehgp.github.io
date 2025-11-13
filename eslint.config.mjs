/* eslint-disable import/no-anonymous-default-export */
import next from 'eslint-config-next';
import tseslint from 'typescript-eslint';
import prettier from 'eslint-config-prettier';

const tsConfigs = tseslint.configs.recommendedTypeChecked.map((config) => ({
  ...config,
  files: config.files ?? ['**/*.{ts,tsx,cts,mts}']
}));

const projectRules = {
  files: ['**/*.{ts,tsx}'],
  languageOptions: {
    parserOptions: {
      project: './tsconfig.json',
      tsconfigRootDir: import.meta.dirname
    }
  },
  rules: {
    '@typescript-eslint/no-unused-vars': [
      'warn',
      { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }
    ]
  }
};

export default [
  {
    ignores: ['node_modules', '.next', 'out', 'public', '_build', 'legacy']
  },
  ...next,
  ...tsConfigs,
  projectRules,
  prettier
];
