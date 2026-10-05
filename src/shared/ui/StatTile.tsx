import { formatChange } from '@/shared/lib/format';

// Hacia donde es buena noticia que se mueva la cifra. Ventas: arriba.
// Carritos abandonados: abajo. Costo: depende, no se colorea.
export type Better = 'up' | 'down' | 'neutral';

type StatTileProps = {
  label: string;
  value: string;
  // contexto opcional debajo del valor
  hint?: string;
  // Cambio contra el periodo anterior (0.12 = +12 %). Sin dato, no se muestra.
  change?: number | null;
  better?: Better;
};

export function StatTile({
  label,
  value,
  hint,
  change,
  better = 'up',
}: StatTileProps) {
  return (
    <div className="card">
      <p className="text-sm text-ink-secondary">{label}</p>
      <p className="mt-1 text-3xl font-semibold tracking-tight text-ink tabular-nums">{value}</p>
      {hint && <p className="mt-1 text-xs text-ink-muted">{hint}</p>}
      {change !== undefined && change !== null && (
        <ChangeLine change={change} better={better} />
      )}
    </div>
  );
}

function ChangeLine({ change, better }: { change: number; better: Better }) {
  const tone =
    better === 'neutral' || change === 0
      ? 'text-ink-secondary'
      : change > 0 === (better === 'up')
        ? 'text-success'
        : 'text-danger';
  // La flecha y el signo dicen la direccion; el color solo dice si es bueno.
  // Asi se entiende igual sin distinguir rojo de verde.
  const arrow = change > 0 ? '▲' : change < 0 ? '▼' : '';

  return (
    <p className={`mt-1 text-xs ${tone}`}>
      <span aria-hidden="true">{arrow} </span>
      {formatChange(change)} vs. período anterior
    </p>
  );
}
