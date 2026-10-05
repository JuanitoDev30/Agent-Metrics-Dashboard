// Configuracion de TanSack Query para todo el panel: Cuanto tiempo confiar en la cache, que errores reintentar y que hacer con un 401

import { QueryClient, QueryCache } from '@tanstack/react-query';
import { ApiError } from '@/shared/api/http';

export const queryClient = new QueryClient({
  queryCache: new QueryCache({
    // Un solo lugar para el 401: si la clave dejo de vale, se borra y
    // la app vuelve sola al login
    onError: error => {
      if (error instanceof ApiError && error.status === 401) forgetSession();
    },
  }),
  defaultOptions: {
    queries: {
      // Durante un minuto, la respuesta en cache se da por buena
      staleTime: 60_000,
      // Cada 5 minutos se vuelve a pedir lo que esta en pantalla, solo con
      // la pestaña visible.
      refetchInterval: 5 * 60_000,
      // Reintentar solo lo que puede arreglarse solo: sin conexion (0) o
      // error de servidor (5xx)
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

// queryClient importa de client, y client no importa de queryClient. auth/ importa de los dos. Las dependencias van en una sola direccion
// Igual que las capas del backend

// La sesion vencio o se cerro: se olvidan las cifras, para que no queden en
// memoria para el siguiente que use el navegador, y se marca que no hay
// sesion, lo que lleva a la pantalla de entrada.
export function forgetSession(): void {
  queryClient.removeQueries({ queryKey: ['metrics'] });
  queryClient.setQueryData(SESSION_KEY, null);
}

// La clave de la consulta de sesion vive aqui y no en auth/: asi auth importa
// de api y nunca al reves.
export const SESSION_KEY = ['session'] as const;
