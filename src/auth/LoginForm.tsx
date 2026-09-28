import { useState, type FormEvent } from 'react';
import { getJson, type Summary } from '../api/client';
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
      </form>
    </main>
  );
}
