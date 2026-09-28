type StatTitleProps = {
  label: string;
  value: string;
  // contexto opcional debajo del valor
  hint?: string;
};

export function StatTitle({ label, value, hint }: StatTitleProps) {
  return (
    <div className="rounded-lg border border-line bg-surface-raised p-4">
      <p className="text-sm text-ink-secondary">{label}</p>
      <p className="text-2xl font-semibold text-ink">{value}</p>
      {hint && <p className="mt-1 text-xs text-ink-muted">{hint}</p>}
    </div>
  );
}
