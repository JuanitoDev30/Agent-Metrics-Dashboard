import type { components } from './schema';

// Los tipos salen del backend
type Schemas = components['schemas'];

export type Summary = Schemas['Summary'];
export type Timeseries = Schemas['Timeseries'];
export type ProductStats = Schemas['ProductStats'];
export type Operations = Schemas['OperationsStats'];

const BASE_URL = import.meta.env.VITE_API_URL;

// un error que lleva el codigo http, para decidir segun el caso
// 401 -> volver al login; 503 > el panel no esta habilitado

export class ApiError extends Error {
  readonly status: number;

  constructor(status: number, message: string) {
    super(message);
    this.status = status;
    this.name = 'ApiError';
  }
}

type Params = Record<string, string | number | undefined>;

export async function getJson<T>(
  //Es un generico. Quien llama dice que tipo espera
  path: string,
  apiKey: string,
  params: Params = {},
  signal?: AbortSignal,
): Promise<T> {
  const url = new URL(path, BASE_URL);
  for (const [name, value] of Object.entries(params)) {
    if (value !== undefined) url.searchParams.set(name, String(value));
  }

  let response: Response;
  try {
    response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${apiKey}`,
      },
      signal,
    });
  } catch (error) {
    if (error instanceof DOMException && error.name === 'AbortError')
      throw error;
    // Fetch solo falla si no hubo respuesta: backend apagado, url mal o cors
    throw new ApiError(0, 'No se pudo conectar con el agente');
  }

  if (!response.ok) {
    throw new ApiError(response.status, await errorMessage(response));
  }
  return (await response.json()) as T;
}

// FastAPI manda el motivo del error en 'detail'

async function errorMessage(response: Response): Promise<string> {
  try {
    const body: unknown = await response.json();
    if (
      body &&
      typeof body === 'object' &&
      'detail' in body &&
      typeof body.detail === 'string'
    ) {
      return body.detail;
    }
  } catch {
    // El cuerpo no era JSON
  }
  return response.statusText || `Error ${response.status}`;
}
