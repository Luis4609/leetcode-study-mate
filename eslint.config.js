import js from '@eslint/js';
import globals from 'globals';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import jsxA11y from 'eslint-plugin-jsx-a11y';
import importPlugin from 'eslint-plugin-import'; // Renamed to avoid conflict with keyword
import tseslint from 'typescript-eslint';

export default tseslint.config(
  { ignores: ['dist', 'node_modules', '.DS_Store', '*.log'] }, // Added more common ignores
  js.configs.recommended,
  ...tseslint.configs.recommendedTypeChecked, // Use type-aware linting
  ...tseslint.configs.stylisticTypeChecked, // Optional: for stylistic rules
  {
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      ecmaVersion: 2022, // Updated to a more recent ECMAScript version
      sourceType: 'module', // Explicitly set sourceType
      globals: {
        ...globals.browser,
        ...globals.es2021, // Add modern ES globals
      },
      parserOptions: {
        project: ['./tsconfig.app.json', './tsconfig.node.json'],
        tsconfigRootDir: import.meta.dirname,
        ecmaFeatures: {
          jsx: true, // Ensure JSX is enabled
        },
      },
    },
    plugins: {
      '@typescript-eslint': tseslint.plugin, // Ensure typescript-eslint plugin is explicitly available
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
      'jsx-a11y': jsxA11y,
      'import': importPlugin,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      ...jsxA11y.configs.recommended.rules, // Add jsx-a11y recommended rules
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],
      // TypeScript specific rules (can be adjusted)
      '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
      '@typescript-eslint/explicit-function-return-type': 'off', // Preference: often inferred
      '@typescript-eslint/no-explicit-any': 'warn', // Warn instead of error for 'any'
      '@typescript-eslint/no-floating-promises': 'warn',
      '@typescript-eslint/no-misused-promises': [
        'error',
        {
          checksVoidReturn: {
            attributes: false, // Allow promise-returning functions in JSX attributes like onClick
          },
        },
      ],


      // Import plugin rules
      'import/order': [
        'warn',
        {
          groups: ['builtin', 'external', 'internal', ['parent', 'sibling', 'index']],
          pathGroups: [
            {
              pattern: 'react',
              group: 'external',
              position: 'before',
            },
            {
              pattern: '@/**',
              group: 'internal',
            },
          ],
          pathGroupsExcludedImportTypes: ['react'],
          'newlines-between': 'always',
          alphabetize: {
            order: 'asc',
            caseInsensitive: true,
          },
        },
      ],
      'import/no-unresolved': 'off', // Often handled by TypeScript
      'import/named': 'warn',
      'import/namespace': 'warn',
      'import/default': 'warn',
      'import/export': 'warn',
      'import/no-duplicates': 'warn',

      // General best practices
      'no-console': ['warn', { allow: ['warn', 'error'] }], // Allow console.warn and .error
      'eqeqeq': ['error', 'always'], // Enforce strict equality
      'no-implicit-coercion': 'warn',
      'no-unused-expressions': 'warn',
      'prefer-const': 'warn',
      'curly': ['error', 'all'], // Enforce curly braces for all blocks
    },
    settings: {
      react: {
        version: 'detect', // Automatically detect the React version
      },
      'import/resolver': {
        typescript: {}, // Help eslint-plugin-import resolve TypeScript paths
      },
    },
  },
);
