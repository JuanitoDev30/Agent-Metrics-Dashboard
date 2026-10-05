import { lazy, Suspense } from 'react';
import { LoginForm } from '@/features/auth/LoginForm';
import { useSession } from '@/features/auth/session';

// El panel en su propio archivo: la pantalla de entrada no descarga React
// Query de las metricas ni los graficos. Quien no tiene sesion baja solo lo
// necesario para escribir la clave.
const Dashboard = lazy(() =>
  import('@/app/Dashboard').then(module => ({ default: module.Dashboard })),
);

function Loading() {
  return (
    <p className="flex min-h-screen items-center justify-center text-ink-secondary">
      Cargando…
    </p>
  );
}

export default function App() {
  const session = useSession();

  // Mientras se pregunta si hay sesion no se muestra nada: mostrar el login
  // un instante y luego saltar al panel se ve como un parpadeo.
  if (session.isPending) return <Loading />;

  // Sin sesion, o si el agente no responde: el formulario de entrada dice que
  // paso cuando se intente entrar.
  if (!session.data) return <LoginForm />;

  return (
    <Suspense fallback={<Loading />}>
      <Dashboard />
    </Suspense>
  );
}
