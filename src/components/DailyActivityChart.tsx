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
import { ChartCard } from './ChartCard';
import { formatDay } from '../lib/format';
import { Activity } from 'react';

type DayPoint = Timeseries['points'][number];

// una sola definicion de las series: las usan las lineas

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
      subtitle="Cuantas conversaciones empezaron y cuantos pedidos se registraron"
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
              stroke={s.color}
              strokeWidth={2}
              dot={{ r: 3, fill: s.color }}
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

  return <div className=""></div>;
}
