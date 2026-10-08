import type { QueryClient } from '@tanstack/react-query';
import { lazy } from 'react';
import {
  heatmapQuery,
  operationsQuery,
  productsQuery,
  summaryQuery,
  timeseriesQuery,
  alertsQuery,
} from '@/shared/api/metrics';
import { previousFilters, type Filters } from '@/shared/filters/filters';

// El import() de cada pagina, guardado para usarlo dos veces: lazy() lo llama
// al entrar a la seccion y el menu lo llama antes, al pasar el mouse. El
// navegador descarga el archivo una sola vez; la segunda llamada devuelve el
// mismo modulo ya cargado.
const loaders = {
  resumen: () =>
    import('@/features/summary/SummaryPage').then(m => ({
      default: m.SummaryPage,
    })),
  clientes: () =>
    import('@/features/customers/CustomersPage').then(m => ({
      default: m.CustomersPage,
    })),
  productos: () =>
    import('@/features/products/ProductsPage').then(m => ({
      default: m.ProductsPage,
    })),
  operacion: () =>
    import('@/features/operations/OperationsPage').then(m => ({
      default: m.OperationsPage,
    })),
};

// Las secciones del panel, en el orden del menu. El id es tambien la ruta:
// /resumen, /clientes... Agregar una seccion es agregar una entrada aqui y su
// pagina en features/.
export const SECTIONS = [
  {
    id: 'resumen',
    label: 'Resumen',
    description: 'Ventas, conversaciones y embudo',
    // Cada pagina en su propio archivo JS: entrar al panel no descarga los
    // graficos de una seccion que no se abrio.
    Page: lazy(loaders.resumen),
    preload: loaders.resumen,
    // Pide lo mismo que va a pedir la pagina, con las mismas definiciones que
    // usa ella: deja los datos en cache antes del clic.
    prefetch: (client: QueryClient, filters: Filters) => {
      void client.prefetchQuery(summaryQuery(filters));
      void client.prefetchQuery(summaryQuery(previousFilters(filters)));
      void client.prefetchQuery(timeseriesQuery(filters));
    },
  },
  {
    id: 'clientes',
    label: 'Clientes y horarios',
    description: 'Quién escribe y cuándo',
    Page: lazy(loaders.clientes),
    preload: loaders.clientes,
    prefetch: (client: QueryClient, filters: Filters) => {
      void client.prefetchQuery(summaryQuery(filters));
      void client.prefetchQuery(summaryQuery(previousFilters(filters)));
      void client.prefetchQuery(heatmapQuery(filters));
    },
  },
  {
    id: 'productos',
    label: 'Productos',
    description: 'Lo que se pide, se consulta y falta',
    Page: lazy(loaders.productos),
    preload: loaders.productos,
    prefetch: (client: QueryClient, filters: Filters) => {
      void client.prefetchQuery(productsQuery(filters));
    },
  },
  {
    id: 'operacion',
    label: 'Operación',
    description: 'Fallos, tiempos, traspasos y costo del agente',
    Page: lazy(loaders.operacion),
    preload: loaders.operacion,
    prefetch: (client: QueryClient, filters: Filters) => {
      void client.prefetchQuery(operationsQuery(filters));
      void client.prefetchQuery(alertsQuery());
    },
  },
] as const;

export type SectionId = (typeof SECTIONS)[number]['id'];
export type Section = (typeof SECTIONS)[number];

export function sectionById(id: SectionId): Section {
  return SECTIONS.find(section => section.id === id) ?? SECTIONS[0];
}
