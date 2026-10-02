import { useState } from 'react';
import {
  useOperations,
  useProducts,
  useSummary,
  useTimeseries,
} from '../api/queries';
import { clearApiKey } from '../auth/apiKey';
import { DailyActivityChart } from '../components/DailyActivityChart';
import { DailySalesChart } from '../components/DailySalesChart';
import { FunnelChart } from '../components/FunnelChart';
import { OperationsSection } from '../components/OperationsSection';
import { ProductsSection } from '../components/ProductsSection';
import { Segmented } from '../components/Segmented';
import { StatTitle } from '../components/StatTitle';
import { CHANNEL_OPTIONS, type Channel } from '../lib/channels';
import { lastDays, RANGE_PRESETS, type PresetDays } from '../lib/dates';
import {
  formatCount,
  formatMoney,
  formatPercent,
  formatUSD,
} from '../lib/format';

export function Dashboard() {
  const [days, setDays] = useState<PresetDays>(30);
  const [channel, setChannel] = useState<Channel | undefined>(undefined);
  const filters = { range: lastDays(days), channel };
  const { range } = filters;
  const summary = useSummary(filters);
  const timeseries = useTimeseries(filters);
  const products = useProducts(filters, 5);
  const operations = useOperations(filters);

  return (
    <main className="mx-auto max-w-6xl p-4 sm:p-6">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Panel del agente</h1>
          <p className="text-sm text-ink-secondary">
            Del {range.start} al {range.end}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Segmented
            label="Canal"
            options={CHANNEL_OPTIONS}
            value={channel}
            onChange={setChannel}
          />
          <Segmented
            label="Período"
            options={RANGE_PRESETS.map(preset => ({
              value: preset.days,
              label: preset.label,
            }))}
            value={days}
            onChange={setDays}
          />
          <button
            type="button"
            onClick={clearApiKey}
            className="text-sm text-ink-secondary hover:text-ink"
          >
            Salir
          </button>
        </div>
      </header>

      {summary.isPending && (
        <p className="mt-8 text-ink-secondary">Cargando…</p>
      )}

      {summary.isError && (
        <p role="alert" className="mt-8 text-danger">
          {summary.error.message}
        </p>
      )}

      {summary.data && (
        <section
          className={`mt-6 grid grid-cols-1 gap-4 transition-opacity sm:grid-cols-2 lg:grid-cols-4 ${summary.isPlaceholderData ? 'opacity-60' : ''}`}
        >
          <StatTitle
            label="Ventas netas"
            value={formatMoney(summary.data.orders.net_sales, true)}
            hint={`${formatCount(summary.data.orders.placed)} pedidos · ${formatCount(summary.data.orders.cancelled)} cancelados`}
          />
          <StatTitle
            label="Conversaciones"
            value={formatCount(summary.data.funnel.conversations)}
            hint={`${formatPercent(summary.data.funnel.conversion_rate)} terminó en pedido`}
          />
          <StatTitle
            label="Clientes"
            value={formatCount(summary.data.customers.unique)}
            hint={`${formatCount(summary.data.customers.new)} nuevos · ${formatCount(summary.data.customers.returning)} recurrentes`}
          />
          <StatTitle
            label="Ticket promedio"
            value={formatMoney(summary.data.orders.average_ticket)}
          />
          <StatTitle
            label="Reservas"
            value={formatCount(summary.data.reservations.placed)}
            hint={`${formatCount(summary.data.reservations.guests)} personas`}
          />
          <StatTitle
            label="Carritos abandonados"
            value={formatCount(summary.data.funnel.abandoned_carts)}
            hint={`de ${formatCount(summary.data.funnel.with_cart)} con carrito`}
          />
          <StatTitle
            label="Costo del agente"
            value={formatUSD(summary.data.cost.total_usd)}
            hint={`${formatUSD(summary.data.cost.per_conversation_usd)} por conversación`}
          />
          <StatTitle
            label="Turnos con problemas"
            value={formatCount(summary.data.cost.failed_turns)}
            hint={`de ${formatCount(summary.data.cost.turns)} turnos`}
          />
        </section>
      )}

      <div
        className={`mt-6 grid grid-cols-1 gap-4 transition-opacity lg:grid-cols-2 ${timeseries.isPlaceholderData || summary.isPlaceholderData ? 'opacity-60' : ''}`}
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

      {products.data && (
        <div
          className={`transition-opacity ${products.isPlaceholderData ? 'opacity-60' : ''}`}
        >
          <ProductsSection stats={products.data} />
        </div>
      )}

      {operations.data && (
        <div
          className={`transition-opacity ${operations.isPlaceholderData ? 'opacity-60' : ''}`}
        >
          <OperationsSection stats={operations.data} />
        </div>
      )}
    </main>
  );
}
