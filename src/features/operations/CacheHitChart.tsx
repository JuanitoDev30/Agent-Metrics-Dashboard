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
import type { Operations } from '@/shared/api/types';
import { formatDay, formatPercent } from '@/shared/lib/format';
import { ChartCard } from '@/shared/ui/ChartCard';

type OperationsDay = Operations['daily'][number];

export function CacheHitChart({ days }: { days: OperationsDay[] }) {
  return (
    <ChartCard
      title="Acierto de caché por día"
      subtitle="Parte de la entrada que se leyó de caché. Si cae, cada turno se paga entero."
      table={<CacheTable days={days} />}
    >
      <ResponsiveContainer width="100%" height={240}>
        <LineChart data={days} margin={{ top: 8, right: 8, bottom: 0, left: 0 }}>
          <CartesianGrid vertical={false} stroke="var(--color-grid)" />
          <XAxis
            dataKey="day"
            tickFormatter={formatDay}
            tick={{ fill: 'var(--color-ink-muted)', fontSize: 12 }}
            stroke="var(--color-axis)"
            tickLine={false}
            minTickGap={24}
          />
          {/* Fijo de 0 a 100%: con la escala automatica, pasar de 92% a 90%
              pareceria un desplome. */}
          <YAxis
            domain={[0, 1]}
            ticks={[0, 0.25, 0.5, 0.75, 1]}
            tickFormatter={value => formatPercent(Number(value))}
            tick={{ fill: 'var(--color-ink-muted)', fontSize: 12 }}
            axisLine={false}
            tickLine={false}
            width={48}
          />
          <Tooltip
            content={props => <CacheTooltip {...props} />}
            cursor={{ stroke: 'var(--color-axis)' }}
          />
          {/* Los dias sin turnos no tienen acierto: quedan como hueco en la
              linea en vez de unirse con el dia siguiente. */}
          <Line
            type="linear"
            dataKey="cache_hit_rate"
            name="Acierto de caché"
            stroke="var(--color-series-1)"
            strokeWidth={2}
            dot={false}
            activeDot={{
              r: 4,
              stroke: 'var(--color-surface-raised)',
              strokeWidth: 2,
            }}
          />
        </LineChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}

function CacheTooltip({ active, payload, label }: TooltipContentProps) {
  if (!active || !payload?.length) return null;
  const value = payload[0].value;
  return (
    <div className="rounded-md border border-line bg-surface-raised px-3 py-2 text-sm shadow-sm">
      <p className="text-ink-secondary">{formatDay(String(label))}</p>
      <p className="mt-1 font-semibold text-ink">
        {value === null || value === undefined ? 'Sin turnos' : formatPercent(Number(value))}
      </p>
    </div>
  );
}

function CacheTable({ days }: { days: OperationsDay[] }) {
  return (
    <table className="w-full tabular-nums">
      <thead className="text-left text-ink-secondary">
        <tr>
          <th className="py-1 font-normal">Día</th>
          <th className="py-1 text-right font-normal">Acierto de caché</th>
        </tr>
      </thead>
      <tbody>
        {days.map(day => (
          <tr key={day.day} className="border-t border-line">
            <td className="py-1">{formatDay(day.day)}</td>
            <td className="py-1 text-right">{formatPercent(day.cache_hit_rate)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
