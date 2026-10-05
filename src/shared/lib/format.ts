import { parseIsoDate } from '@/shared/lib/dates';

const LOCALE = 'es-CO';
const CURRENCY = 'COP';

// se crean una sola vez : construir un formateador es caro,
// usarlo muchas veces es barato

const money = new Intl.NumberFormat(LOCALE, {
  style: 'currency',
  currency: CURRENCY,
  maximumFractionDigits: 0,
});

const moneyCompact = new Intl.NumberFormat(LOCALE, {
  style: 'currency',
  currency: CURRENCY,
  notation: 'compact',
  maximumFractionDigits: 1,
});
const integer = new Intl.NumberFormat(LOCALE);
const integerCompact = new Intl.NumberFormat(LOCALE, {
  notation: 'compact',
  maximumFractionDigits: 1,
});
const percent = new Intl.NumberFormat(LOCALE, {
  style: 'percent',
  maximumFractionDigits: 1,
});

// El costo del modelo va en dolares y en fracciones de centavo: 4 decimales

const usd = new Intl.NumberFormat(LOCALE, {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 2,
  maximumFractionDigits: 4,
});

const seconds = new Intl.NumberFormat(LOCALE, {
  style: 'unit',
  unit: 'second',
  maximumFractionDigits: 1,
  unitDisplay: 'narrow',
});

const minutes = new Intl.NumberFormat(LOCALE, {
  style: 'unit',
  unit: 'minute',
  unitDisplay: 'narrow',
  maximumFractionDigits: 1,
});

// lo que se muestra cuando no hay dato. Un guion, no un cero

export const EMPTY = '—';

const clock = new Intl.DateTimeFormat(LOCALE, {
  hour: 'numeric',
  minute: '2-digit',
});

// el backend manda el dinero como texto: se convierte aqui

export function formatMoney(value: string | null, compact = false): string {
  if (value === null) return EMPTY;
  const amount = Number(value);
  if (!Number.isFinite(amount)) return EMPTY;
  return compact ? moneyCompact.format(amount) : money.format(amount);
}
export function formatCount(value: number, compact = false): string {
  if (!Number.isFinite(value)) return EMPTY;
  return compact ? integerCompact.format(value) : integer.format(value);
}

const decimal = new Intl.NumberFormat(LOCALE, { maximumFractionDigits: 1 });

export function formatDecimal(value: number | null): string {
  return value === null ? EMPTY : decimal.format(value);
}

// "1 unidad", "3 unidades"
export function plural(count: number, one: string, many: string): string {
  return `${formatCount(count)} ${count === 1 ? one : many}`;
}

export function formatPercent(ratio: number | null): string {
  return ratio === null ? EMPTY : percent.format(ratio);
}

export function formatUSD(value: string | null): string {
  if (value === null) return EMPTY;
  const amount = Number(value);
  return Number.isFinite(amount) ? usd.format(amount) : EMPTY;
}

const shortDay = new Intl.DateTimeFormat(LOCALE, {
  day: 'numeric',
  month: 'short',
});

// "2026-09-28" -> "28 de sept"
export function formatDay(iso: string): string {
  return shortDay.format(parseIsoDate(iso));
}

export function formatDuration(value: number | string | null): string {
  if (value === null) return EMPTY;
  const total = Number(value);
  if (!Number.isFinite(total)) return EMPTY;
  return total < 60 ? seconds.format(total) : minutes.format(total / 60);
}

export function formatTime(timestamp: number): string {
  return clock.format(timestamp);
}


const change = new Intl.NumberFormat(LOCALE, {
  style: 'percent',
  maximumFractionDigits: 0,
  // "+12%" y "-8%": el signo es la mitad del mensaje.
  signDisplay: 'exceptZero',
});

export function formatChange(ratio: number): string {
  return change.format(ratio);
}

const dayRange = new Intl.DateTimeFormat(LOCALE, {
  day: 'numeric',
  month: 'short',
  year: 'numeric',
});

// formatRange ya sabe no repetir lo comun: "1 a 15 de sept de 2026",
// "4 de sept al 3 de oct de 2026", "20 de dic de 2025 al 5 de ene de 2026".
export function formatDayRange(start: string, end: string): string {
  return dayRange.formatRange(parseIsoDate(start), parseIsoDate(end));
}
