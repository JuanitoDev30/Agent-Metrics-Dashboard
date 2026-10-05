# Panel del agente

Panel de métricas del agente de atención (pedidos y reservas). Lee los
endpoints `/metrics/*` del agente y muestra ventas, clientes, productos y cómo
trabajó el agente.

## Correr

```bash
npm install
npm run dev          # http://localhost:5173 (el agente en VITE_API_URL)
npm run build        # tipos + build de producción
npm run lint         # incluye las reglas de capas (ver abajo)
npm test             # pruebas de la lógica pura
npm run gen:api      # regenera los tipos desde el OpenAPI del agente
```

`.env.development` apunta al agente (`VITE_API_URL`). El agente tiene que
permitir el origen del panel en `ALLOWED_ORIGINS` y tener `METRICS_API_KEY`.

## Arquitectura

Tres capas. Las dependencias van en una sola dirección:

```
app  ──>  features  ──>  shared
```

| Capa        | Qué va                                                                    | Puede importar   |
| ----------- | ------------------------------------------------------------------------- | ---------------- |
| `app/`      | El marco: App, Dashboard, barra lateral, secciones, rutas                 | features, shared |
| `features/` | Una carpeta por sección (summary, customers, products, operations) y auth | shared           |
| `shared/`   | Lo que usan todas: API, filtros, componentes de UI, formato y fechas      | solo shared      |

```
src/
  main.tsx                  arranque: QueryClient + App
  app/
    App.tsx                 sesión -> login o panel
    Dashboard.tsx           marco + filtros + página de la sección activa
    sections.ts             las secciones: nombre, página, qué datos precargar
    useSection.ts           la sección vive en la ruta (/productos)
    layout/                 AppShell (barra lateral), PageHeader, RefreshButton
  features/
    auth/                   sesión con cookie, formulario de entrada
    summary/  customers/  products/  operations/
                            la página de cada sección y sus gráficos
  shared/
    api/                    http (transporte), types (del OpenAPI), metrics
                            (una consulta por endpoint), queryClient
    filters/                canal y período, en la URL (?periodo=30&canal=web)
    ui/                     tarjeta, indicador, lista, gráfico con tabla...
    lib/                    formato, fechas, comparación (con pruebas)
```

Reglas que sostienen esto:

- **ESLint las hace cumplir** (`eslint.config.js`): un import de `shared/` hacia
  `features/` o `app/`, o de una feature hacia `app/`, es un error de lint con
  el motivo. Entre capas se importa con el alias `@/`, nunca con `../`.
- **Una feature no importa otra.** Si dos secciones necesitan lo mismo, va a
  `shared/`.
- **Ningún componente llama a `fetch`.** Las páginas usan las consultas de
  `shared/api/metrics.ts`, y esas usan `shared/api/http.ts`.
- **Los tipos del backend no se escriben a mano**: salen de `npm run gen:api`.
  Si el agente cambia una respuesta, el panel no compila hasta adaptarse.

## Rendimiento

- **Cada sección es un archivo aparte** (`lazy` en `sections.ts`). La pantalla
  de entrada no descarga gráficos, y Recharts (~370 KB) solo se baja al abrir
  Resumen u Operación.
- **Precarga al pasar el mouse** por el menú: el código de la página y sus
  datos se piden antes del clic. Usa las mismas definiciones que la página
  (`queryOptions`), así que lo precargado es exactamente lo que se pinta.
- **Caché de React Query**: lo que dos secciones comparten (el resumen) se pide
  una vez; volver a una sección ya vista es instantáneo. Se refresca solo cada
  5 minutos con la pestaña visible.

## Agregar una sección

1. Su página en `src/features/<nombre>/<Nombre>Page.tsx`, recibiendo `filters`.
2. Si necesita un endpoint nuevo: su consulta en `shared/api/metrics.ts` y
   `npm run gen:api`.
3. Una entrada en `src/app/sections.ts` (id = ruta, nombre, página, precarga).
   El icono va en `app/layout/icons.tsx`; TypeScript avisa si falta.

## Seguridad

La clave del panel se usa una sola vez, al entrar: el agente la cambia por una
cookie HttpOnly firmada que vence (8 h). El navegador nunca guarda la clave y
JavaScript no puede leer la cookie. Toda petición va con
`credentials: 'include'`.
