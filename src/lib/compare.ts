// Cuanto cambio una cifra contra el periodo anterior, como fraccion: 0.12 es +12%
// null cuando no hay contra que comparar

export function changeRatio(
  current: number | string | null,
  previous: number | string | null,
): number | null {
  if (current === null || previous === null) return null;
  const now = Number(current);
  const before = Number(previous);

  if (!Number.isFinite(now) || !Number.isFinite(before) || before === 0)
    return null;
  return (now - before) / before;
}
