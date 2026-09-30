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
import type { Timeseries } from '../api/client';
import { formatDay, formatMoney } from '../lib/format';
import { ChartCard } from './ChartCard';

type DayPoint = Timeseries['points'][number];

export function DailySalesChart({ points }: { points: DayPoint[] }) {
  // Recharts necesita numeros para medir las barras; el backend manda texto.
  // Se convierte aqui, en una copia, y el original queda intacto.
  const data = points.map(point => ({
    day: point.day,
    sales: Number(point.gross_sales),
  }));

  return (
    <ChartCard
      title="Ventas por día"
      subtitle="Total de los pedidos registrados. No descuenta cancelaciones."
      table={<SalesTable points={points} />}
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
            tickFormatter={value => formatMoney(String(value), true)}
            tick={{ fill: 'var(--color-ink-muted)', fontSize: 12 }}
            axisLine={false}
            tickLine={false}
            width={64}
          />
          <Tooltip
            content={props => <SalesTooltip {...props} />}
            cursor={{ fill: 'var(--color-grid)', fillOpacity: 0.5 }}
          />
          <Bar
            dataKey="sales"
            name="Ventas"
            fill="var(--color-series-1)"
            maxBarSize={24}
            radius={[4, 4, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}

function SalesTooltip({ active, payload, label }: TooltipContentProps) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-md border border-line bg-surface-raised px-3 py-2 text-sm shadow-sm">
      <p className="text-ink-secondary">{formatDay(String(label))}</p>
      <p className="mt-1 font-semibold text-ink">
        {formatMoney(String(payload[0].value ?? 0))}
      </p>
    </div>
  );
}

function SalesTable({ points }: { points: DayPoint[] }) {
  return (
    <table className="w-full tabular-nums">
      <thead className="text-left text-ink-secondary">
        <tr>
          <th className="py-1 font-normal">Día</th>
          <th className="py-1 text-right font-normal">Pedidos</th>
          <th className="py-1 text-right font-normal">Ventas</th>
        </tr>
      </thead>
      <tbody>
        {points.map(point => (
          <tr key={point.day} className="border-t border-line">
            <td className="py-1">{formatDay(point.day)}</td>
            <td className="py-1 text-right">{point.orders}</td>
            <td className="py-1 text-right">{formatMoney(point.gross_sales)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
