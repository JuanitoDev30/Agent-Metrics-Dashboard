import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  type TooltipContentProps,
} from 'recharts';
import type { Timeseries } from '../api/client';
import { formatCount, formatDay } from '../lib/format';
import { ChartCard } from './ChartCard';

type DayPoint = Timeseries['points'][number];

// Una sola definicion de las series: la usan las lineas, la leyenda y el
// tooltip. Asi los tres no pueden quedar con colores distintos.
const SERIES = [
  {
    key: 'conversations',
    label: 'Conversaciones',
    color: 'var(--color-series-1)',
  },
  { key: 'orders', label: 'Pedidos', color: 'var(--color-series-2)' },
] as const;

export function DailyActivityChart({ points }: { points: DayPoint[] }) {
  return (
    <ChartCard
      title="Conversaciones y pedidos diarios"
      subtitle="Cuántas conversaciones empezaron y cuántos pedidos se registraron"
      legend={SERIES.map(s => ({ label: s.label, color: s.color }))}
      table={<ActivityTable points={points} />}
    >
      <ResponsiveContainer width="100%" height={260}>
        <LineChart
          data={points}
          margin={{ top: 8, right: 8, bottom: 0, left: 0 }}
        >
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
            allowDecimals={false}
            tick={{ fill: 'var(--color-ink-muted)', fontSize: 12 }}
            axisLine={false}
            tickLine={false}
            width={32}
          />

          <Tooltip
            content={props => <ActivityTooltip {...props} />}
            cursor={{ stroke: 'var(--color-axis)' }}
          />
          {SERIES.map(s => (
            <Line
              key={s.key}
              type="linear"
              dataKey={s.key}
              name={s.label}
              stroke={s.color}
              strokeWidth={2}
              dot={false}
              activeDot={{
                r: 4,
                stroke: 'var(--color-surface-raised)',
                strokeWidth: 2,
              }}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}

function ActivityTooltip({ active, payload, label }: TooltipContentProps) {
  if (!active || !payload?.length) return null;

  return (
    <div className="rounded-md border border-line bg-surface-raised px-3 py-2 text-sm shadow-sm">
      <p className="text-ink-secondary">{formatDay(String(label))}</p>
      {SERIES.map(s => {
        const entry = payload.find(item => item.dataKey === s.key);
        return (
          <p key={s.key} className="mt-1 flex items-center gap-2">
            <span
              className="h-0.5 w-3 rounded"
              style={{ backgroundColor: s.color }}
            />
            <span className="font-semibold text-ink">
              {formatCount(Number(entry?.value ?? 0))}
            </span>
            <span className="text-ink-secondary">{s.label}</span>
          </p>
        );
      })}
    </div>
  );
}

function ActivityTable({ points }: { points: DayPoint[] }) {
  return (
    <table className="w-full tabular-nums">
      <thead className="text-left text-ink-secondary">
        <tr>
          <th className="py-1 font-normal">Día</th>
          <th className="py-1 text-right font-normal">Conversaciones</th>
          <th className="py-1 text-right font-normal">Pedidos</th>
        </tr>
      </thead>
      <tbody>
        {points.map(point => (
          <tr key={point.day} className="border-t border-line">
            <td className="py-1">{formatDay(point.day)}</td>
            <td className="py-1 text-right">
              {formatCount(point.conversations)}
            </td>
            <td className="py-1 text-right">{formatCount(point.orders)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
