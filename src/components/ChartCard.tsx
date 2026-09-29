import type { ReactNode } from 'react';

export type LegendItem = {
  label: string;
  // Variable CSS del color de la serie, p. ej. 'var(--color-series-1)'.
  color: string;
};

type ChartCardProps = {
  title: string;
  subtitle?: string;
  legend?: LegendItem[];
  // La misma información como tabla: quien no distingue colores, usa un
  // lector de pantalla o necesita el número exacto, la lee aquí.
  table: ReactNode;
  children: ReactNode;
};

export function ChartCard({ title, subtitle, legend, table, children }: ChartCardProps) {
  return (
    <section className="rounded-lg border border-line bg-surface-raised p-4">
      <h2 className="font-semibold">{title}</h2>
      {subtitle && <p className="text-sm text-ink-secondary">{subtitle}</p>}

      {legend && (
        <ul className="mt-3 flex flex-wrap gap-4 text-sm text-ink-secondary">
          {legend.map(item => (
            <li key={item.label} className="flex items-center gap-2">
              {/* El color va en la marca, nunca en el texto. */}
              <span className="h-0.5 w-4 rounded" style={{ backgroundColor: item.color }} />
              {item.label}
            </li>
          ))}
        </ul>
      )}

      <div className="mt-4">{children}</div>

      <details className="mt-3 text-sm">
        <summary className="cursor-pointer text-ink-secondary">Ver como tabla</summary>
        <div className="mt-2 overflow-x-auto">{table}</div>
      </details>
    </section>
  );
}