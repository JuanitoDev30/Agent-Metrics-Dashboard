import { describe, expect, it } from 'vitest';
import { parseFilters, toSearch } from '@/shared/filters/urlFilters';

const today = '2026-10-03';

describe('parseFilters', () => {
  it('lee un atajo y un canal', () => {
    expect(parseFilters('?periodo=7&canal=whatsapp', today)).toEqual({
      selection: { kind: 'preset', days: 7 },
      channel: 'whatsapp',
    });
  });

  it('lee un rango fijo', () => {
    expect(parseFilters('?desde=2026-09-01&hasta=2026-09-15', today).selection).toEqual({
      kind: 'custom',
      start: '2026-09-01',
      end: '2026-09-15',
    });
  });

  it('sin nada, 30 dias y todos los canales', () => {
    expect(parseFilters('', today)).toEqual({
      selection: { kind: 'preset', days: 30 },
      channel: undefined,
    });
  });

  it('lo que no reconoce cae al valor por defecto en vez de llegar al agente', () => {
    expect(
      parseFilters('?periodo=999&canal=telegram&desde=2026-10-09&hasta=2026-09-01', today),
    ).toEqual({ selection: { kind: 'preset', days: 30 }, channel: undefined });
  });
});

describe('toSearch', () => {
  it('es la inversa de parseFilters', () => {
    for (const search of ['?periodo=90&canal=web', '?desde=2026-09-01&hasta=2026-09-15']) {
      expect(toSearch(parseFilters(search, today))).toBe(search);
    }
  });
});
