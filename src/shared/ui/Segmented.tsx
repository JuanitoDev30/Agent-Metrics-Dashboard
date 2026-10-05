type Option<T> = {
  value: T;
  label: string;
};

type SegmentedProps<T> = {
  // Lo lee el lector de pantalla: "Período", "Canal".
  label: string;
  options: readonly Option<T>[];
  value: T;
  onChange: (value: T) => void;
};

// Un grupo de botones donde uno solo esta activo. Generico en el valor: el
// rango usa numeros y el canal texto (o undefined para "todos").
export function Segmented<T>({ label, options, value, onChange }: SegmentedProps<T>) {
  return (
    <div
      role="group"
      aria-label={label}
      className="flex rounded-md border border-line bg-surface-raised p-0.5"
    >
      {options.map(option => (
        <button
          key={option.label}
          type="button"
          aria-pressed={value === option.value}
          onClick={() => onChange(option.value)}
          className="rounded px-3 py-1 text-sm text-ink-secondary aria-pressed:bg-accent aria-pressed:text-white"
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}
