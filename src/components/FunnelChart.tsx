import type { Summary } from '../api/client';
import { formatCount, formatPercent } from '../lib/format';
import { ChartCard } from './ChartCard';

type Funnel = Summary['funnel'];

type Stage = {
  label: string;
  count: number;
  color: string;
};

// Las etapas, en orden. Cada una incluye a las siguientes: quien hizo un
// pedido tambien cuenta como interesado, aunque no haya buscado.
function stagesOf(funnel: Funnel): Stage[] {
  return [
    { label: 'Conversaciones', count: funnel.conversations, color: 'var(--color-funnel-1)' },
    { label: 'Preguntaron por productos', count: funnel.interested, color: 'var(--color-funnel-2)' },
    { label: 'Armaron un carrito', count: funnel.with_cart, color: 'var(--color-funnel-3)' },
    { label: 'Hicieron un pedido', count: funnel.with_order, color: 'var(--color-funnel-4)' },
  ];
}

export function FunnelChart({ funnel }: { funnel: Funnel }) {
  const stages = stagesOf(funnel);
  const total = funnel.conversations;

  return (
    <ChartCard
      title="Embudo de conversión"
      subtitle="De las conversaciones que empezaron en el período, hasta dónde llegaron"
      table={<FunnelTable stages={stages} />}
    >
      {total === 0 ? (
        <p className="py-8 text-center text-sm text-ink-secondary">
          Sin conversaciones en este período.
        </p>
      ) : (
        <ol className="space-y-3">
          {stages.map(stage => (
            <li key={stage.label}>
              <div className="flex items-baseline justify-between gap-2 text-sm">
                <span className="text-ink-secondary">{stage.label}</span>
                <span>
                  <span className="font-semibold text-ink">{formatCount(stage.count)}</span>
                  <span className="ml-2 text-ink-muted">
                    {formatPercent(stage.count / total)}
                  </span>
                </span>
              </div>
              {/* La barra es solo la forma: el numero ya esta escrito arriba. */}
              <div className="mt-1 h-6" aria-hidden="true">
                <div
                  className="h-full rounded-r"
                  style={{
                    width: `${(stage.count / total) * 100}%`,
                    // Una etapa con alguien, aunque sea poco, no puede verse vacia.
                    minWidth: stage.count > 0 ? 2 : 0,
                    backgroundColor: stage.color,
                  }}
                />
              </div>
            </li>
          ))}
        </ol>
      )}
    </ChartCard>
  );
}

function FunnelTable({ stages }: { stages: Stage[] }) {
  return (
    <table className="w-full tabular-nums">
      <thead className="text-left text-ink-secondary">
        <tr>
          <th className="py-1 font-normal">Etapa</th>
          <th className="py-1 text-right font-normal">Conversaciones</th>
          <th className="py-1 text-right font-normal">Siguen desde la anterior</th>
        </tr>
      </thead>
      <tbody>
        {stages.map((stage, index) => {
          const previous = index > 0 ? stages[index - 1].count : null;
          return (
            <tr key={stage.label} className="border-t border-line">
              <td className="py-1">{stage.label}</td>
              <td className="py-1 text-right">{formatCount(stage.count)}</td>
              <td className="py-1 text-right">
                {previous ? formatPercent(stage.count / previous) : '—'}
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
