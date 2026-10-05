import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    // @/ es src/: los imports dicen de que capa vienen (@/shared/..., @/features/...)
    // en vez de una cadena de ../../ que cambia al mover un archivo.
    // tsconfig.app.json declara lo mismo en "paths" para TypeScript.
    alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) },
  },
})
