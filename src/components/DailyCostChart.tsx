import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  type TooltipContentProps,
} from 'recharts';
import type { Operations } from '../api/client';
import { formatCount, formatDay, formatUSD } from '../lib/format';
import { ChartCard } from './ChartCard';

type OperationsDay = Operations['daily'][number];

export function DailyCostChart({ days }: { days: OperationsDay[] }) {
  // Un dia sin precio queda en null y Recharts no dibuja la barra: un hueco,
  // no un cero que pareceria gratis.
  const data = days.map(day => ({
    day: day.day,
    cost: day.cost_usd === null ? null : Number(day.cost_usd),
    turns: day.turns,
  }));

  return (
    <ChartCard
      title="Costo del modelo por día"
      subtitle="Lo que cobró el proveedor por los turnos del día, en dólares"
      table={<CostTable days={days} />}
    >
      <ResponsiveContainer width="100%" height={240}>
        <BarChart data={data} margin={{ top: 8, right: 8, bottom: 0, left: 0 }}>
          <CartesianGrid vertical={false} stroke="var(--color-grid)" />
          <XAxis
            dataKey="day"
            tickFormatter={formatDay}
            tick={{ fill: 'var(--color-ink-muted)', fontSize: 12 }}
            stroke="var(--color-axis)"
            tickLine={false}
            minTickGap={24}
          />
          <YAxis
            tickFormatter={value => formatUSD(String(value))}
            tick={{ fill: 'var(--color-ink-muted)', fontSize: 12 }}
            axisLine={false}
            tickLine={false}
            width={72}
          />
          <Tooltip
            content={props => <CostTooltip {...props} />}
            cursor={{ fill: 'var(--color-grid)', fillOpacity: 0.5 }}
          />
          <Bar
            dataKey="cost"
            name="Costo"
            fill="var(--color-series-1)"
            maxBarSize={24}
            radius={[4, 4, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}

function CostTooltip({ active, payload, label }: TooltipContentProps) {
  if (!active || !payload?.length) return null;
  const point = payload[0].payload as { cost: number | null; turns: number };
  return (
    <div className="rounded-md border border-line bg-surface-raised px-3 py-2 text-sm shadow-sm">
      <p className="text-ink-secondary">{formatDay(String(label))}</p>
      <p className="mt-1 font-semibold text-ink">
        {point.cost === null ? 'Sin precio configurado' : formatUSD(String(point.cost))}
      </p>
      <p className="text-ink-secondary">{formatCount(point.turns)} turnos</p>
    </div>
  );
}

function CostTable({ days }: { days: OperationsDay[] }) {
  return (
    <table className="w-full tabular-nums">
      <thead className="text-left text-ink-secondary">
        <tr>
          <th className="py-1 font-normal">Día</th>
          <th className="py-1 text-right font-normal">Turnos</th>
          <th className="py-1 text-right font-normal">Con problemas</th>
          <th className="py-1 text-right font-normal">Costo</th>
        </tr>
      </thead>
      <tbody>
        {days.map(day => (
          <tr key={day.day} className="border-t border-line">
            <td className="py-1">{formatDay(day.day)}</td>
            <td className="py-1 text-right">{formatCount(day.turns)}</td>
            <td className="py-1 text-right">{formatCount(day.failed_turns)}</td>
            <td className="py-1 text-right">{formatUSD(day.cost_usd)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
