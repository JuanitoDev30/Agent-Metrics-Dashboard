import { useSyncExternalStore } from 'react';

const STORAGE_KEY = 'agent-dashboard:api-key';

// Funciones a llamar cuando la clave cambie
const listeners = new Set<() => void>();

// Respaldo por si el navegador bloquea sessionStorage

let memoryFallback: string | null = null;

function read(): string | null {
  try {
    return sessionStorage.getItem(STORAGE_KEY);
  } catch {
    return memoryFallback;
  }
}

function write(value: string | null): void {
  memoryFallback = value;
  try {
    if (value === null) sessionStorage.removeItem(STORAGE_KEY);
    else sessionStorage.setItem(STORAGE_KEY, value);
  } catch {
    // queda solo en memoria
  }
  listeners.forEach(notify => notify());
}

export function saveApiKey(value: string | null): void {
  write(value);
}

export function clearApiKey(): void {
  write(null);
}

export function getApiKey(): string | null {
  return read();
}

function subscribe(onChange: () => void): () => void {
  listeners.add(onChange);
  return () => {
    listeners.delete(onChange);
  };
}
// la clave como estado de React: cuando alguien llama a saveApiKey o clearApiKey, todo componente que uste este hook se vuelve a dibujar

export function useApiKey(): string | null {
  return useSyncExternalStore(subscribe, read);
}

// Este es el patron observador: listener es la lista de 'avisame' cuando cambie.
// write guarda el valir y llama a cada funcion de la lista
// subscribe agrega a alguien a la lista y devuelve la funcion para sacarlo
