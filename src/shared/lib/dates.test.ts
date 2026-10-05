import { describe, expect, it } from 'vitest';
import {
  countDays,
  lastDays,
  parseIsoDate,
  previousRange,
  rangeError,
  resolveRange,
  toIsoDate,
} from '@/shared/lib/dates';

describe('lastDays', () => {
  it('cuenta hoy: los ultimos 7 dias son hoy y los 6 anteriores', () => {
    expect(lastDays(7, new Date(2026, 9, 3))).toEqual({ start: '2026-09-27', end: '2026-10-03' });
  });
});

describe('toIsoDate / parseIsoDate', () => {
  it('usan la fecha local, no UTC: a las 11 p. m. en Bogota sigue siendo el mismo dia', () => {
    expect(toIsoDate(new Date(2026, 8, 28, 23, 30))).toBe('2026-09-28');
  });

  it('son inversas', () => {
    expect(toIsoDate(parseIsoDate('2026-02-28'))).toBe('2026-02-28');
  });
});

describe('countDays', () => {
  it('incluye los dos extremos', () => {
    expect(countDays({ start: '2026-09-01', end: '2026-09-30' })).toBe(30);
    expect(countDays({ start: '2026-10-03', end: '2026-10-03' })).toBe(1);
  });
});

describe('previousRange', () => {
  it('es el periodo de igual largo que termina el dia anterior', () => {
    expect(previousRange({ start: '2026-09-01', end: '2026-09-30' })).toEqual({
      start: '2026-08-02',
      end: '2026-08-31',
    });
  });

  it('cruza el cambio de ano', () => {
    expect(previousRange({ start: '2026-01-01', end: '2026-01-07' })).toEqual({
      start: '2025-12-25',
      end: '2025-12-31',
    });
  });

  it('respeta los anos bisiestos', () => {
    expect(previousRange({ start: '2028-03-01', end: '2028-03-01' })).toEqual({
      start: '2028-02-29',
      end: '2028-02-29',
    });
  });
});

describe('rangeError', () => {
  const today = '2026-10-03';

  it('acepta un rango valido', () => {
    expect(rangeError({ start: '2026-09-01', end: '2026-09-15' }, today)).toBeNull();
  });

  it.each([
    [{ start: '', end: '2026-09-15' }, 'Elige las dos fechas.'],
    [{ start: '2026-09-15', end: '2026-09-01' }, 'La fecha inicial es posterior a la final.'],
    [{ start: '2026-10-01', end: '2026-10-04' }, 'El rango no puede terminar después de hoy.'],
    [{ start: '2025-01-01', end: '2026-10-03' }, 'El rango máximo es de 366 días.'],
  ])('rechaza %o', (range, message) => {
    expect(rangeError(range, today)).toBe(message);
  });
});

describe('resolveRange', () => {
  it('un atajo se calcula desde hoy; un rango fijo se queda igual', () => {
    const today = new Date(2026, 9, 3);
    expect(resolveRange({ kind: 'preset', days: 30 }, today).start).toBe('2026-09-04');
    expect(
      resolveRange({ kind: 'custom', start: '2026-01-01', end: '2026-01-31' }, today),
    ).toEqual({ start: '2026-01-01', end: '2026-01-31' });
  });
});
