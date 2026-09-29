import { useState, type FormEvent } from 'react';
import { ApiError, getJson, type Summary } from '../api/client';
import { saveApiKey } from './apiKey';

export function LoginForm() {
  const [key, setKey] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [checking, setChecking] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const candidate = key.trim();
    if (!candidate) return;

    setChecking(true);
    setError(null);

    try {
      // se prueba la clave antes de guardarla: si esta mal, el error
      // aparece aquim en el formulario y no despues dentro del panel
      await getJson<Summary>('/metrics/summary', candidate);
      saveApiKey(candidate);
    } catch (error) {
      setError(loginError(error));
    } finally {
      setChecking(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center p-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm rounded-lg border border-line bg-surface-raised p-6"
      >
        <h1 className="text-xl font-semibold">Panel del agente</h1>
        <p className="mt-1 text-sm text-ink-secondary">
          Inicia sesión para acceder al panel del agente.
        </p>

        <label htmlFor="api-key" className="mt-6 block text-sm font-medium">
          Clave
        </label>

        <input
          id="api-key"
          type="password"
          value={key}
          onChange={event => setKey(event.target.value)}
          autoFocus
          className="mt-1 w-full rounded-md border border-line bg-surface px-3 py-2 outline-none focus:border-accent"
        />
        {error && (
          <p role="alert" className="mt-2 text-sm text-danger">
            {error}
          </p>
        )}
        <button
          type="submit"
          disabled={checking || !key.trim()}
          className="mt-6 w-full rounded-md bg-accent px-3 py-2 text-sm font-medium text-white disabled:opacity-50"
        >
          {checking ? 'Comprobando…' : 'Entrar'}
        </button>
      </form>
    </main>
  );
}

// cada error con un mensaje que le diga al usuario que hacer

function loginError(error: unknown): string {
  if (!(error instanceof ApiError)) return 'Ocurrió un error inesperado.';
  if (error.status === 401) return 'Clave incorrecta.';
  if (error.status === 0)
    return 'No se pudo conectar con el servidor. Verifica si está encendido.';

  return error.message;
}
