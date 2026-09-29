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

// lo que se muestra cuando no hay dato. Un guion, no un cero

export const EMPTY = '—';

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

export function formatPercent(ratio: number | null): string {
  return ratio === null ? EMPTY : percent.format(ratio);
}

export function formatUSD(value: string | null): string {
  if (value === null) return EMPTY;
  const amount = Number(value);
  return Number.isFinite(amount) ? usd.format(amount) : EMPTY;
}
