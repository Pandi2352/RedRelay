import js from '@eslint/js';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import globals from 'globals';
import tseslint from 'typescript-eslint';

const restrict = (patterns) => ['error', { patterns }];

export default tseslint.config(
  { ignores: ['dist', 'coverage', 'src/generated'] },
  {
    files: ['**/*.{ts,tsx}'],
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    languageOptions: { ecmaVersion: 2022, globals: globals.browser },
    plugins: { 'react-hooks': reactHooks, 'react-refresh': reactRefresh },
    rules: {
      ...reactHooks.configs.recommended.rules,
      'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_', ignoreRestSiblings: true }],
      'max-lines': ['warn', { max: 250, skipBlankLines: true, skipComments: true }],
      'no-restricted-syntax': [
        'error',
        {
          selector: "MemberExpression[object.meta.name='import'][property.name='env']",
          message: 'Read env through src/shared/config/env.ts only.',
        },
      ],
      // Features talk to each other only through their index.ts
      'no-restricted-imports': restrict([
        { group: ['@/features/*/*'], message: 'Import a feature through its index.ts.' },
      ]),
    },
  },
  {
    files: ['src/shared/**/*.{ts,tsx}'],
    rules: {
      'no-restricted-imports': restrict([
        { group: ['@/features/*', '@/app/*'], message: 'shared/ must not depend on features/ or app/.' },
      ]),
    },
  },
  {
    files: ['src/shared/config/env.ts'],
    rules: { 'no-restricted-syntax': 'off' },
  },
);
