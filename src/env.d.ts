// Tipos de las variables de entorno: sin esto, import.meta.env.VITE_API_URL es
// `any` y un error de tipeo en el nombre pasa sin aviso.
interface ImportMetaEnv {
  readonly VITE_API_URL: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
