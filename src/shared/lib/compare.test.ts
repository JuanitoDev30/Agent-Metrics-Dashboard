import { describe, expect, it } from 'vitest';
import { changeRatio } from '@/shared/lib/compare';

describe('changeRatio', () => {
  it('da el cambio como fraccion', () => {
    expect(changeRatio(112, 100)).toBeCloseTo(0.12);
    expect(changeRatio(80, 100)).toBeCloseTo(-0.2);
  });

  it('acepta dinero como texto, que es como llega del agente', () => {
    expect(changeRatio('36000.00', '30000.00')).toBeCloseTo(0.2);
  });

  it('sin base no hay porcentaje: de 0 a 5 no es "+infinito %"', () => {
    expect(changeRatio(5, 0)).toBeNull();
  });

  it('sin dato, null', () => {
    expect(changeRatio(null, 10)).toBeNull();
    expect(changeRatio(10, null)).toBeNull();
    expect(changeRatio('no-es-numero', 10)).toBeNull();
  });
});
