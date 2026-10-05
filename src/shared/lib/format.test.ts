import { describe, expect, it } from 'vitest';
import {
  EMPTY,
  formatChange,
  formatDayRange,
  formatDuration,
  formatMoney,
  plural,
} from '@/shared/lib/format';

// Intl separa numero y unidad con un espacio duro; se normaliza para comparar.
const plain = (text: string) => text.replace(/\s/g, ' ');

describe('formatDuration', () => {
  it('hasta un minuto en segundos, con un decimal', () => {
    expect(plain(formatDuration(0.84))).toBe('0,8 s');
  });

  it('desde un minuto, en minutos', () => {
    expect(plain(formatDuration('752.3'))).toBe('12,5 min');
  });

  it('sin dato, un guion y no un cero', () => {
    expect(formatDuration(null)).toBe(EMPTY);
  });
});

describe('formatDayRange', () => {
  it('no repite lo que comparten las dos fechas', () => {
    expect(formatDayRange('2026-09-01', '2026-09-15')).toBe('1 a 15 de sept de 2026');
    expect(formatDayRange('2025-12-20', '2026-01-05')).toBe(
      '20 de dic de 2025 al 5 de ene de 2026',
    );
  });
});

describe('formatChange', () => {
  it('siempre lleva signo, salvo el cero', () => {
    expect(plain(formatChange(0.12))).toBe('+12%');
    expect(plain(formatChange(-0.08))).toBe('-8%');
    expect(plain(formatChange(0))).toBe('0%');
  });
});

describe('formatMoney', () => {
  it('pesos sin decimales; texto invalido o nulo es un guion', () => {
    expect(plain(formatMoney('36000.00'))).toBe('$ 36.000');
    expect(formatMoney(null)).toBe(EMPTY);
    expect(formatMoney('abc')).toBe(EMPTY);
  });
});

describe('plural', () => {
  it('elige la forma por la cantidad', () => {
    expect(plural(1, 'turno', 'turnos')).toBe('1 turno');
    expect(plural(1200, 'turno', 'turnos')).toBe('1.200 turnos');
  });
});
