import { useHeatmap, useSummary } from '@/shared/api/metrics';
import { previousFilters, type Filters } from '@/shared/filters/filters';
import { HeatmapChart } from '@/features/customers/HeatmapChart';
import { LoadState } from '@/shared/ui/LoadState';
import { StatTile } from '@/shared/ui/StatTile';
import { changeRatio } from '@/shared/lib/compare';
import { formatCount, formatPercent } from '@/shared/lib/format';

export function CustomersPage({ filters }: { filters: Filters }) {
  // Las mismas queryKey que en Resumen: si ya se vio, sale de la cache.
  const summary = useSummary(filters);
  const previous = useSummary(previousFilters(filters));
  const heatmap = useHeatmap(filters);
  const now = summary.data;
  const before = previous.data;

  return (
    <>
      <LoadState isPending={summary.isPending} error={summary.error} />

      {now && (
        <section
          className={`grid grid-cols-1 gap-4 transition-opacity sm:grid-cols-2 lg:grid-cols-4 ${summary.isPlaceholderData ? 'opacity-60' : ''}`}
        >
          <StatTile
            label="Clientes"
            value={formatCount(now.customers.unique)}
            hint="Dieron su teléfono en el período"
            change={before && changeRatio(now.customers.unique, before.customers.unique)}
          />
          <StatTile
            label="Nuevos"
            value={formatCount(now.customers.new)}
            hint="No existían en el sistema del negocio"
            change={before && changeRatio(now.customers.new, before.customers.new)}
          />
          <StatTile
            label="Recurrentes"
            value={formatCount(now.customers.returning)}
            hint="Ya estaban registrados"
            change={before && changeRatio(now.customers.returning, before.customers.returning)}
          />
          <StatTile
            label="Conversaciones"
            value={formatCount(now.funnel.conversations)}
            hint={`${formatPercent(now.funnel.conversion_rate)} terminó en pedido`}
            change={before && changeRatio(now.funnel.conversations, before.funnel.conversations)}
          />
        </section>
      )}

      {heatmap.data && (
        <div className={`transition-opacity ${heatmap.isPlaceholderData ? 'opacity-60' : ''}`}>
          <HeatmapChart heatmap={heatmap.data} />
        </div>
      )}
    </>
  );
}
