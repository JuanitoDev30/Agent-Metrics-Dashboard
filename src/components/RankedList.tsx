export type RankedItem = {
  // Unico dentro de la lista: React lo usa como key.
  id: string;
  label: string;
  value: number;
  // El numero ya formateado, p. ej. "12 unidades".
  valueText: string;
  // Contexto opcional debajo del nombre, p. ej. "en 8 conversaciones".
  detail?: string;
};

type RankedListProps = {
  title: string;
  subtitle: string;
  items: RankedItem[];
  // Lo que se muestra si la lista viene vacia. Depende de la lista: no es lo
  // mismo "nadie pidio nada" que "no falto ningun producto".
  emptyText: string;
};

export function RankedList({ title, subtitle, items, emptyText }: RankedListProps) {
  // Las barras se miden contra el primero de la lista, no contra un total: lo
  // que se compara aqui es cada producto con el que mas tiene.
  const max = Math.max(...items.map(item => item.value), 1);

  return (
    <section className="rounded-lg border border-line bg-surface-raised p-4">
      <h3 className="font-semibold">{title}</h3>
      <p className="text-sm text-ink-secondary">{subtitle}</p>

      {items.length === 0 ? (
        <p className="py-6 text-center text-sm text-ink-secondary">{emptyText}</p>
      ) : (
        <ol className="mt-4 space-y-3">
          {items.map(item => (
            <li key={item.id}>
              <div className="flex items-baseline justify-between gap-3 text-sm">
                {/* min-w-0 deja que el nombre se corte con "..." en vez de
                    empujar el numero fuera de la tarjeta. */}
                <span className="min-w-0 truncate text-ink" title={item.label}>
                  {item.label}
                </span>
                <span className="shrink-0 font-semibold text-ink">{item.valueText}</span>
              </div>
              {item.detail && <p className="text-xs text-ink-muted">{item.detail}</p>}
              <div className="mt-1 h-1.5" aria-hidden="true">
                <div
                  className="h-full rounded-r"
                  style={{
                    width: `${(item.value / max) * 100}%`,
                    minWidth: item.value > 0 ? 2 : 0,
                    backgroundColor: 'var(--color-series-1)',
                  }}
                />
              </div>
            </li>
          ))}
        </ol>
      )}
    </section>
  );
}
