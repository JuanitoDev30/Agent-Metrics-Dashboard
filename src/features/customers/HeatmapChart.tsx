import { useState } from 'react';
import type { Heatmap } from '@/shared/api/types';
import { formatCount, formatDecimal } from '@/shared/lib/format';
import { ChartCard } from '@/shared/ui/ChartCard';

type HeatCell = Heatmap['cells'][number];

// El backend numera de 0 (lunes) a 6 (domingo), igual que este arreglo.
const WEEKDAYS = [
  'Lunes',
  'Martes',
  'Miércoles',
  'Jueves',
  'Viernes',
  'Sábado',
  'Domingo',
];
const HOURS = Array.from({ length: 24 }, (_, hour) => hour);

// Mensajes por dia de ese tipo: en un periodo con dos lunes y un domingo,
// sumar sin dividir haria ver el lunes el doble de ocupado. null si ese dia de
// la semana no cae en el periodo: no es cero, es que no hay dato.
function perDay(cell: HeatCell): number | null {
  return cell.days ? cell.turns / cell.days : null;
}

function hourLabel(hour: number): string {
  return `${String(hour).padStart(2, '0')}:00`;
}

// Un solo tono, del fondo de la tarjeta al azul de la serie: mas oscuro (o
// mas brillante en modo oscuro) es mas carga. color-mix hace la mezcla en el
// navegador, asi que sirve para los dos temas sin elegir colores a mano.
function cellColor(value: number | null, max: number): string {
  if (value === null || value === 0 || max === 0) return 'var(--color-surface)';
  // Minimo 12%: una celda con algo de actividad no puede verse vacia.
  const strength = 12 + 88 * (value / max);
  return `color-mix(in oklab, var(--color-series-1) ${strength.toFixed(0)}%, var(--color-surface-raised))`;
}

export function HeatmapChart({ heatmap }: { heatmap: Heatmap }) {
  const [active, setActive] = useState<HeatCell | null>(null);
  const max = Math.max(0, ...heatmap.cells.map(cell => perDay(cell) ?? 0));

  return (
    <ChartCard
      title="Cuándo escriben los clientes"
      subtitle="Mensajes atendidos por día de la semana y hora, en promedio por día"
      table={<BusiestTable cells={heatmap.cells} />}
    >
      {/* La lectura de la celda bajo el cursor. Alto reservado (dos lineas en
          el celular, una en pantallas mas anchas) para que el grafico no
          salte al pasar el mouse. */}
      <p
        className="min-h-10 text-sm text-ink-secondary sm:min-h-5"
        aria-live="polite"
      >
        {active ? (
          <CellReadout cell={active} />
        ) : (
          'Pasa el cursor por una celda para ver el detalle.'
        )}
      </p>

      <div
        className="mt-2 grid gap-0.5"
        style={{ gridTemplateColumns: 'auto repeat(24, minmax(0, 1fr))' }}
        onMouseLeave={() => setActive(null)}
      >
        {/* Fila de horas: una etiqueta cada tres para que no se encimen. */}
        <span />
        {HOURS.map(hour => (
          <span key={hour} className="text-center text-xs text-ink-muted">
            {hour % 3 === 0 ? hour : ''}
          </span>
        ))}

        {WEEKDAYS.map((name, weekday) => (
          <Row
            key={name}
            name={name}
            cells={heatmap.cells.filter(cell => cell.weekday === weekday)}
            max={max}
            onHover={setActive}
          />
        ))}
      </div>

      <Legend max={max} />
    </ChartCard>
  );
}

type RowProps = {
  name: string;
  cells: HeatCell[];
  max: number;
  onHover: (cell: HeatCell) => void;
};

function Row({ name, cells, max, onHover }: RowProps) {
  return (
    <>
      <span className="pr-2 text-xs leading-5 text-ink-secondary">
        {name.slice(0, 3)}
      </span>
      {cells.map(cell => (
        <div
          key={cell.hour}
          className="h-5 rounded-sm"
          style={{ backgroundColor: cellColor(perDay(cell), max) }}
          onMouseEnter={() => onHover(cell)}
          // La version accesible es la tabla de abajo; esto es solo forma.
          aria-hidden="true"
        />
      ))}
    </>
  );
}

function CellReadout({ cell }: { cell: HeatCell }) {
  const value = perDay(cell);
  const when = `${WEEKDAYS[cell.weekday]} ${hourLabel(cell.hour)}`;
  if (value === null) return <>{when}: ese día no cae en el período</>;
  return (
    <>
      {when}:{' '}
      <span className="font-semibold text-ink">{formatDecimal(value)}</span>{' '}
      mensajes por día · {formatCount(cell.conversations)} conversaciones nuevas
      en total
    </>
  );
}

function Legend({ max }: { max: number }) {
  return (
    <div className="mt-3 flex items-center gap-2 text-xs text-ink-muted">
      <span>Menos</span>
      <span
        className="h-2 w-24 rounded"
        style={{
          background:
            'linear-gradient(to right, color-mix(in oklab, var(--color-series-1) 12%, var(--color-surface-raised)), var(--color-series-1))',
        }}
      />
      <span>Más ({formatDecimal(max)} por día)</span>
    </div>
  );
}

// 168 filas no se leen: la tabla muestra las horas con mas carga, que es la
// pregunta que el grafico responde.
function BusiestTable({ cells }: { cells: HeatCell[] }) {
  const busiest = cells
    .filter(cell => cell.turns > 0 && cell.days > 0)
    .sort((a, b) => (perDay(b) ?? 0) - (perDay(a) ?? 0))
    .slice(0, 15);

  if (busiest.length === 0) {
    return <p className="text-ink-secondary">Sin mensajes en este período.</p>;
  }

  return (
    <table className="w-full tabular-nums">
      <thead className="text-left text-ink-secondary">
        <tr>
          <th className="py-1 font-normal">Día y hora</th>
          <th className="py-1 text-right font-normal">Mensajes por día</th>
          <th className="py-1 text-right font-normal">Conversaciones nuevas</th>
        </tr>
      </thead>
      <tbody>
        {busiest.map(cell => (
          <tr
            key={`${cell.weekday}-${cell.hour}`}
            className="border-t border-line"
          >
            <td className="py-1">
              {WEEKDAYS[cell.weekday]} {hourLabel(cell.hour)}
            </td>
            <td className="py-1 text-right">{formatDecimal(perDay(cell))}</td>
            <td className="py-1 text-right">
              {formatCount(cell.conversations)}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
