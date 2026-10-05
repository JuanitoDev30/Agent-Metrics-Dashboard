// Lo que se muestra mientras una seccion carga o si fallo. Cada pagina lo usa
// con su consulta principal, asi todas avisan igual.
type LoadStateProps = {
  isPending: boolean;
  error: Error | null;
};

export function LoadState({ isPending, error }: LoadStateProps) {
  if (error) {
    return (
      <p role="alert" className="card text-danger">
        {error.message}
      </p>
    );
  }
  if (isPending) return <p className="text-ink-secondary">Cargando…</p>;
  return null;
}
