import { useEffect } from 'react';
import { queryClient } from './api/queryClient';
import { useApiKey } from './auth/apiKey';
import { LoginForm } from './auth/LoginForm';
import { Dashboard } from './pages/Dashboard';

export default function App() {
  const apiKey = useApiKey();

  // Al salir, o si la clave deja de valer, se vacía la caché: las cifras
  // del negocio no quedan en memoria para el siguiente que use el navegador.
  useEffect(() => {
    if (!apiKey) queryClient.clear();
  }, [apiKey]);

  return apiKey ? <Dashboard /> : <LoginForm />;
}
