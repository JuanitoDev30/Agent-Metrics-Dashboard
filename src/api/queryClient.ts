// Configuracion de TanSack Query para todo el panel: Cuanto tiempo confiar en la cache, que errores reintentar y que hacer con un 401

import { QueryClient, QueryCache } from '@tanstack/react-query';
import { clearApiKey } from '../auth/apiKey';
import { ApiError } from './client';

export const queryClient = new QueryClient({
  queryCache: new QueryCache({
    // Un solo lugar para el 401: si la clave dejo de vale, se borra y
    // la app vuelve sola al login
    onError: error => {
      if (error instanceof ApiError && error.status === 401) clearApiKey();
    },
  }),
  defaultOptions: {
    queries: {
      // Durante un minuto, la respuesta en cache se da por buena
      staleTime: 60_000,
      // Reintentar solo lo que puede arreglarse solo: sin conexion (0) o
      // error de servidor (5xx)
      refetchInterval: 5 * 60_000,
      retry: (failureCount, error) => {
        if (error instanceof ApiError && error.status > 0 && error.status < 500)
          return false;
        return failureCount < 2;
      },
    },
  },
});

// Cada peticion se guarda bajo una clave (queryKey), por ejemplo ['metrics'].
// Si dos componentes piden lo mismo, se hace una sola peticion. Si se vuelve a un rango que ya se vio, aparece al instante

// queryClient importa de client y de apiKey, y ninguno de esos importa de queryClient. Las dependencias van en una sola direccion
// Igual que las capas del backend
