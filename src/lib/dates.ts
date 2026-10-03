export const MAX_RANGE_DAYS = 366;

export type DateRange = {
  start: string;
  end: string;
};

export const RANGE_PRESETS = [
  { days: 7, label: '7 días' },
  { days: 30, label: '30 días' },
  { days: 90, label: '90 días' },
] as const;

export type PresetDays = (typeof RANGE_PRESETS)[number]['days'];

export function lastDays(days: number, today: Date = new Date()): DateRange {
  const start: Date = new Date(today);
  // hoy cuenta: los ultimos 7 dias son hoy y los 6 anteriores
  start.setDate(today.getDate() - (days - 1));
  return {
    start: toIsoDate(start),
    end: toIsoDate(today),
  };
}

export type RangeSelection =
  | { kind: 'preset'; days: PresetDays }
  | { kind: 'custom'; start: string; end: string };

export function resolveRange(
  selection: RangeSelection,
  today: Date = new Date(),
): DateRange {
  return selection.kind === 'preset'
    ? lastDays(selection.days, today)
    : { start: selection.start, end: selection.end };
}

// Dias del rango, con los dos extremos incluidos: del 1 al 30 son 30.
export function countDays(range: DateRange): number {
  const ms =
    parseIsoDate(range.end).getTime() - parseIsoDate(range.start).getTime();
  // round y no floor: un dia con cambio de horario no dura 24 horas exactas.
  return Math.round(ms / 86_400_000) + 1;
}

// null si el rango sirve; si no, el motivo para mostrarselo a la persona.
// Las fechas ISO se pueden comparar como texto: '2026-09-02' < '2026-10-01'.
export function rangeError(range: DateRange, today: string): string | null {
  if (!range.start || !range.end) return 'Elige las dos fechas.';
  if (range.start > range.end)
    return 'La fecha inicial es posterior a la final.';
  if (range.end > today) return 'El rango no puede terminar después de hoy.';
  if (countDays(range) > MAX_RANGE_DAYS)
    return `El rango máximo es de ${MAX_RANGE_DAYS} días.`;
  return null;
}

// NO usar toISOString() porque devuelve la fecha en UTC y no en la zona horaria local

export function toIsoDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

// Lo inverso de toIsoDate. NO usar new Date('2026-09-28'): lo interpreta como
// medianoche UTC, que en Colombia es el 27 a las 7 de la noche.
export function parseIsoDate(iso: string): Date {
  const [year, month, day] = iso.split('-').map(Number);
  return new Date(year, month - 1, day);
}

// El periodo de la misma longitud que termina justo antes de que empiece este:
// del 1 al 30 de septiembre -> del 2 al 31 de agosto.
export function previousRange(range: DateRange): DateRange {
  const days = countDays(range);
  const end = parseIsoDate(range.start);
  end.setDate(end.getDate() - 1);
  const start = new Date(end);
  start.setDate(end.getDate() - (days - 1));
  return { start: toIsoDate(start), end: toIsoDate(end) };
}
