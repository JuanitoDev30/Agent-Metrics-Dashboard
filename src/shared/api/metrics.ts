// Un endpoint de metricas, una definicion de consulta. Esta es la capa que usan
// las paginas para pedir datos; ninguna llama a getJson directamente.

import { keepPreviousData, queryOptions, useQuery } from '@tanstack/react-query';
import { getJson } from '@/shared/api/http';
import type {
  Heatmap,
  Operations,
  ProductStats,
  Summary,
  Timeseries,
} from '@/shared/api/types';
import type { Filters } from '@/shared/filters/filters';

type Extra = Record<string, string | number>;

// queryOptions arma clave + funcion en un solo objeto. El mismo objeto sirve
// para useQuery (pintar) y para queryClient.prefetchQuery (adelantarse): al
// compartirlo, lo precargado y lo pintado no pueden quedar con claves
// distintas, que es el error tipico de precargar a mano.
function metricsQuery<T>(endpoint: string, filters: Filters, extra: Extra = {}) {
  return queryOptions({
    // Empieza por 'metrics' (asi se invalidan o borran todas juntas) e incluye
    // todo lo que cambia la respuesta: 7 dias no es 30, WhatsApp no es la web.
    queryKey: ['metrics', endpoint, filters, extra],
    queryFn: ({ signal }) =>
      getJson<T>(
        `/metrics/${endpoint}`,
        {
          start_date: filters.range.start,
          end_date: filters.range.end,
          channel: filters.channel,
          ...extra,
        },
        signal,
      ),
    // Al cambiar de filtro se sigue viendo lo anterior (atenuado) hasta que
    // llega lo nuevo, en vez de un parpadeo a "Cargando".
    placeholderData: keepPreviousData,
  });
}

export const summaryQuery = (filters: Filters) => metricsQuery<Summary>('summary', filters);
export const timeseriesQuery = (filters: Filters) =>
  metricsQuery<Timeseries>('timeseries', filters);
export const productsQuery = (filters: Filters, limit = 10) =>
  metricsQuery<ProductStats>('products', filters, { limit });
export const operationsQuery = (filters: Filters) =>
  metricsQuery<Operations>('operations', filters);
export const heatmapQuery = (filters: Filters) => metricsQuery<Heatmap>('heatmap', filters);

export const useSummary = (filters: Filters) => useQuery(summaryQuery(filters));
export const useTimeseries = (filters: Filters) => useQuery(timeseriesQuery(filters));
export const useProducts = (filters: Filters, limit?: number) =>
  useQuery(productsQuery(filters, limit));
export const useOperations = (filters: Filters) => useQuery(operationsQuery(filters));
export const useHeatmap = (filters: Filters) => useQuery(heatmapQuery(filters));
