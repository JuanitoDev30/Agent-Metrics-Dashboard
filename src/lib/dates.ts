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

// NO usar toISOString() porque devuelve la fecha en UTC y no en la zona horaria local

export function toIsoDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}
