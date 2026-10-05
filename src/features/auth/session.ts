import { useQuery } from '@tanstack/react-query';
import { ApiError, getJson, sendJson } from '@/shared/api/http';
import type { PanelSession } from '@/shared/api/types';
import { forgetSession, queryClient, SESSION_KEY } from '@/shared/api/queryClient';

// La sesion vive en una cookie HttpOnly: JavaScript no puede leerla, ni
// siquiera para saber si existe. Por eso se le pregunta al agente.
// null = no hay sesion (o vencio); es un dato, no un error.
async function fetchSession(signal: AbortSignal): Promise<PanelSession | null> {
  try {
    return await getJson<PanelSession>('/metrics/session', {}, signal);
  } catch (error) {
    if (error instanceof ApiError && error.status === 401) return null;
    throw error;
  }
}

export function useSession() {
  return useQuery({
    queryKey: SESSION_KEY,
    queryFn: ({ signal }) => fetchSession(signal),
    // Se pregunta una vez al abrir. Si vence despues, la siguiente consulta de
    // metricas recibe un 401 y forgetSession la marca como cerrada.
    staleTime: Infinity,
    refetchInterval: false,
    retry: false,
  });
}

export async function login(key: string): Promise<void> {
  const session = await sendJson<PanelSession>('POST', '/metrics/session', { key });
  queryClient.setQueryData(SESSION_KEY, session);
}

export async function logout(): Promise<void> {
  try {
    // Borra la cookie en el agente: desde aqui no se puede tocar.
    await sendJson('DELETE', '/metrics/session');
  } finally {
    // Aunque el agente no responda, en este navegador se sale igual.
    forgetSession();
  }
}
