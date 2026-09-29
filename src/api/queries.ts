// Un hook por endpoint --> Esta es la capa que usan los componentes para hacer las peticiones a la API.

import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { getApiKey } from '../auth/apiKey';
import type { DateRange } from '../lib/dates';

import {
  ApiError,
  getJson,
  type ProductStats,
  type Summary,
  type Timeseries,
} from './client';

function rangeParams(range: DateRange) {
  return { start_date: range.start, end_date: range.end };
}

function requireKey(): string {
  const key = getApiKey();
  // No deberia pasar: el panel no se muestra sin clave
  // si pasa, se trata como una clave invalida y vuelve al login
  if (!key) throw new ApiError(401, 'Falta la clave del panel');
  return key;
}

// la queryKey identifica la respuesta en la cache. Incluye el rango porque
// 'resumen de 7 dias' y 'resumen de 30 dias' son datos distintos

export function useSummary(range: DateRange) {
  return useQuery({
    queryKey: ['metrics', 'summary', range],
    placeholderData: keepPreviousData,
    queryFn: ({ signal }) =>
      getJson<Summary>(
        '/metrics/summary',
        requireKey(),
        rangeParams(range),
        signal,
      ),
  });
}

export function useTimeseries(range: DateRange) {
  return useQuery({
    queryKey: ['metrics', 'timeseries', range],
    queryFn: ({ signal }) =>
      getJson<Timeseries>(
        '/metrics/timeseries',
        requireKey(),
        rangeParams(range),
        signal,
      ),
  });
}

export function useProducts(range: DateRange, limit = 10) {
  return useQuery({
    queryKey: ['metrics', 'products', range, limit],
    queryFn: ({ signal }) =>
      getJson<ProductStats>(
        '/metrics/products',
        requireKey(),
        { ...rangeParams(range), limit },
        signal,
      ),
  });
}

// useQuery recibe dos cosas: una clave (queryKey), que dice que datos son, y una funcion (queryFn), que dice como conseguirlos.
// Ya no se necesita useState para los datos, ni otro para cargando, ni otro para el error, ni un useEffect que coordine los tres

// La queyKey es un arreglo y su orden importa
