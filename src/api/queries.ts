// Un hook por endpoint --> Esta es la capa que usan los componentes para hacer las peticiones a la API.

import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { getApiKey } from '../auth/apiKey';
import type { Channel } from '../lib/channels';
import type { DateRange } from '../lib/dates';

import {
  ApiError,
  getJson,
  type Operations,
  type ProductStats,
  type Summary,
  type Timeseries,
} from './client';

// El rango y el canal: lo que filtra a todos los endpoints. Sin canal, el
// parametro no viaja y el backend cuenta todos.
type Filters = { range: DateRange; channel?: Channel };

function filterParams({ range, channel }: Filters) {
  return { start_date: range.start, end_date: range.end, channel };
}

function requireKey(): string {
  const key = getApiKey();
  // No deberia pasar: el panel no se muestra sin clave
  // si pasa, se trata como una clave invalida y vuelve al login
  if (!key) throw new ApiError(401, 'Falta la clave del panel');
  return key;
}

// la queryKey identifica la respuesta en la cache. Incluye los filtros porque
// 'resumen de 7 dias' y 'resumen de 30 dias' son datos distintos, y el de
// WhatsApp no es el de la web

export function useSummary(filters: Filters) {
  return useQuery({
    queryKey: ['metrics', 'summary', filters],
    placeholderData: keepPreviousData,
    queryFn: ({ signal }) =>
      getJson<Summary>(
        '/metrics/summary',
        requireKey(),
        filterParams(filters),
        signal,
      ),
  });
}

export function useTimeseries(filters: Filters) {
  return useQuery({
    queryKey: ['metrics', 'timeseries', filters],
    placeholderData: keepPreviousData,
    queryFn: ({ signal }) =>
      getJson<Timeseries>(
        '/metrics/timeseries',
        requireKey(),
        filterParams(filters),
        signal,
      ),
  });
}

export function useProducts(filters: Filters, limit = 10) {
  return useQuery({
    queryKey: ['metrics', 'products', filters, limit],
    placeholderData: keepPreviousData,
    queryFn: ({ signal }) =>
      getJson<ProductStats>(
        '/metrics/products',
        requireKey(),
        { ...filterParams(filters), limit },
        signal,
      ),
  });
}

export function useOperations(filters: Filters) {
  return useQuery({
    queryKey: ['metrics', 'operations', filters],
    placeholderData: keepPreviousData,
    queryFn: ({ signal }) =>
      getJson<Operations>(
        '/metrics/operations',
        requireKey(),
        filterParams(filters),
        signal,
      ),
  });
}

// useQuery recibe dos cosas: una clave (queryKey), que dice que datos son, y una funcion (queryFn), que dice como conseguirlos.
// Ya no se necesita useState para los datos, ni otro para cargando, ni otro para el error, ni un useEffect que coordine los tres

// La queyKey es un arreglo y su orden importa
