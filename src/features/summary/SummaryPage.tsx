import { useSummary, useTimeseries } from '@/shared/api/metrics';
import { previousFilters, type Filters } from '@/shared/filters/filters';
import { DailyActivityChart } from '@/features/summary/DailyActivityChart';
import { DailySalesChart } from '@/features/summary/DailySalesChart';
import { FunnelChart } from '@/features/summary/FunnelChart';
import { LoadState } from '@/shared/ui/LoadState';
import { StatTile } from '@/shared/ui/StatTile';
import { changeRatio } from '@/shared/lib/compare';
import {
  formatCount,
  formatMoney,
  formatPercent,
  formatUSD,
} from '@/shared/lib/format';

// Cada pagina pide solo lo que muestra: estar en Productos no consulta la
// operacion. Lo que dos paginas comparten (el resumen) sale de la cache.
export function SummaryPage({ filters }: { filters: Filters }) {
  const summary = useSummary(filters);
  const timeseries = useTimeseries(filters);
  // El mismo resumen, del periodo anterior de igual largo. Es otra queryKey,
  // asi que se cachea aparte y no pisa al actual.
  const previous = useSummary(previousFilters(filters));
  const before = previous.data;

  return (
    <>
      <LoadState isPending={summary.isPending} error={summary.error} />

      {summary.data && (
        <section
          className={`grid grid-cols-1 gap-4 transition-opacity sm:grid-cols-2 lg:grid-cols-4 ${summary.isPlaceholderData ? 'opacity-60' : ''}`}
        >
          <StatTile
            label="Ventas netas"
            value={formatMoney(summary.data.orders.net_sales, true)}
            hint={`${formatCount(summary.data.orders.placed)} pedidos · ${formatCount(summary.data.orders.cancelled)} cancelados`}
            change={
              before &&
              changeRatio(
                summary.data.orders.net_sales,
                before.orders.net_sales,
              )
            }
          />
          <StatTile
            label="Conversaciones"
            value={formatCount(summary.data.funnel.conversations)}
            hint={`${formatPercent(summary.data.funnel.conversion_rate)} terminó en pedido`}
            change={
              before &&
              changeRatio(
                summary.data.funnel.conversations,
                before.funnel.conversations,
              )
            }
          />
          <StatTile
            label="Clientes"
            value={formatCount(summary.data.customers.unique)}
            hint={`${formatCount(summary.data.customers.new)} nuevos · ${formatCount(summary.data.customers.returning)} recurrentes`}
            change={
              before &&
              changeRatio(
                summary.data.customers.unique,
                before.customers.unique,
              )
            }
          />
          <StatTile
            label="Ticket promedio"
            value={formatMoney(summary.data.orders.average_ticket)}
            change={
              before &&
              changeRatio(
                summary.data.orders.average_ticket,
                before.orders.average_ticket,
              )
            }
          />
          <StatTile
            label="Reservas"
            value={formatCount(summary.data.reservations.placed)}
            hint={`${formatCount(summary.data.reservations.guests)} personas`}
            change={
              before &&
              changeRatio(
                summary.data.reservations.placed,
                before.reservations.placed,
              )
            }
          />
          <StatTile
            label="Carritos abandonados"
            value={formatCount(summary.data.funnel.abandoned_carts)}
            hint={`de ${formatCount(summary.data.funnel.with_cart)} con carrito`}
            change={
              before &&
              changeRatio(
                summary.data.funnel.abandoned_carts,
                before.funnel.abandoned_carts,
              )
            }
            better="down"
          />
          <StatTile
            label="Costo del agente"
            value={formatUSD(summary.data.cost.total_usd)}
            hint={`${formatUSD(summary.data.cost.per_conversation_usd)} por conversación`}
            change={
              before &&
              changeRatio(summary.data.cost.total_usd, before.cost.total_usd)
            }
            better="neutral"
          />
          <StatTile
            label="Turnos con problemas"
            value={formatCount(summary.data.cost.failed_turns)}
            hint={`de ${formatCount(summary.data.cost.turns)} turnos`}
            change={
              before &&
              changeRatio(
                summary.data.cost.failed_turns,
                before.cost.failed_turns,
              )
            }
            better="down"
          />
        </section>
      )}

      <div
        className={`grid grid-cols-1 gap-4 transition-opacity lg:grid-cols-2 ${timeseries.isPlaceholderData || summary.isPlaceholderData ? 'opacity-60' : ''}`}
      >
        {timeseries.data && (
          <>
            <div className="lg:col-span-2">
              <DailyActivityChart points={timeseries.data.points} />
            </div>
            <DailySalesChart points={timeseries.data.points} />
          </>
        )}
        {summary.data && <FunnelChart funnel={summary.data.funnel} />}
      </div>
    </>
  );
}
