// eslint.config.js

import { FlatCompat } from '@eslint/eslintrc' // WAJIB untuk plugin lama
import path from 'path'
import { fileURLToPath } from 'url'

// 1. Inisialisasi FlatCompat untuk mengimpor konfigurasi lama
// FlatCompat membutuhkan __dirname dan __filename untuk bekerja di ES Module
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const compat = new FlatCompat({
  baseDirectory: __dirname,
})

// 2. Impor Configs yang Diperlukan
import tsParser from '@typescript-eslint/parser'
import tsPlugin from '@typescript-eslint/eslint-plugin'

const eslintConfig = [
  // =======================================================
  // 1. Global Ignores (untuk semua konfigurasi)
  // =======================================================
  {
    ignores: [
      '**/node_modules/**',
      '**/__temp/**',
      '**/.next/**',
      '**/.turbo/**',
      '**/dist/**',
      '**/out/**',
      '**/build/**',
      '**/coverage/**',
      '**/generated/**',
      '**/public/**',
      '**/.vercel/**',
      '**/.eslintcache',
    ],
  },

  ...compat.extends(
    // Menggunakan FlatCompat untuk "meng-flatten" konfigurasi lama
    'plugin:@typescript-eslint/recommended',
    'plugin:@typescript-eslint/recommended-type-checked',
    'plugin:import/recommended', // Setara dengan importPlugin.configs.recommended
    'plugin:import/typescript' // Setara dengan importPlugin.configs.typescript
    // Tambahkan 'plugin:react/recommended' jika Anda menggunakan React
  ),

  {
    files: ['**/*.ts', '**/*.tsx'],

    // Konfigurasi Parser dan Lingkungan (languageOptions)
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        // Penting: Anda perlu menyediakan path ke tsconfig.json
        project: ['./tsconfig.json'],
        ecmaFeatures: {
          jsx: true,
        },
      },
    },

    // Pendaftaran Plugin: WAJIB di flat config
    plugins: {
      '@typescript-eslint': tsPlugin,
      // Karena kita menggunakan compat.extends di atas, plugin import
      // sudah terdaftar, tetapi untuk aturan kustom tetap didefinisikan di sini
      // jika Anda tidak menggunakan compat.extends. Namun, jika menggunakan
      // compat.extends, plugin-plugin tersebut sudah terdaftar di dalamnya.
    },

    // Pengaturan Settings
    settings: {
      'import/resolver': {
        // Pastikan resolver typescript bekerja dengan parserOptions.project
        typescript: true,
      },
    },

    // =======================================================
    // 3. Aturan Kustom Anda
    // =======================================================
    rules: {
      // Aturan Import/TypeScript
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-unused-vars': [
        'warn',
        {
          caughtErrors: 'none',
        },
      ],
      '@tailwindcss/suggest-canonical-classes': 'off',
      '@typescript-eslint/consistent-type-imports': [
        'warn',
        {
          fixStyle: 'separate-type-imports',
          prefer: 'type-imports',
        },
      ],

      // Aturan Next.js (Anda perlu menginstal dan mengimpor plugin next/next)
      // '@next/next/no-img-element': 'off',

      // Aturan Import Order
      'import/order': [
        'warn',
        {
          groups: ['type', ['builtin', 'external', 'internal', 'sibling']],
          pathGroups: [
            {
              pattern: '@/feat/**/components/**',
              group: 'internal',
              position: 'after',
            },
            // Tambahkan pathGroups lain untuk alias Anda (@/...)
          ],
          alphabetize: { order: 'desc', caseInsensitive: true },
          pathGroupsExcludedImportTypes: ['type', 'external'],
          'newlines-between': 'always',
        },
      ],
      // Aturan yang Anda maksud:
      'import/consistent-type-specifier-style': ['warn', 'prefer-top-level'],

      // Menonaktifkan aturan yang digantikan oleh TypeScript/Import
      'no-unused-vars': 'off',
      'import/no-unresolved': 'off', // Dinonaktifkan karena ditangani oleh resolver TypeScript
    },
  },
]

export default eslintConfig
