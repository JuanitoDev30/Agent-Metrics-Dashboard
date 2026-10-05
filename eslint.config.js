import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      globals: globals.browser,
    },
  },
  // --- Las capas -------------------------------------------------------------
  // Las dependencias van en una sola direccion: app -> features -> shared.
  // shared no sabe que existen las secciones; una feature no sabe del marco ni
  // de las otras features. Asi una seccion se puede quitar o cambiar sin
  // romper las demas. Ver README.md.
  {
    files: ['src/shared/**/*.{ts,tsx}'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: ['@/features/*', '@/app/*'],
              message: 'shared/ es la base: no puede depender de features/ ni de app/.',
            },
            {
              group: ['../*'],
              message: 'Usa el alias @/ en vez de rutas relativas hacia arriba.',
            },
          ],
        },
      ],
    },
  },
  {
    files: ['src/features/**/*.{ts,tsx}'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: ['@/app/*'],
              message: 'Una feature no depende del marco (app/): recibe lo que necesita por props.',
            },
            {
              group: ['../*'],
              message:
                'Usa el alias @/. Si necesitas algo de otra feature, muevelo a shared/.',
            },
          ],
        },
      ],
    },
  },
])
