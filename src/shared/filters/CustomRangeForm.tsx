import { useState, type FormEvent } from 'react';
import { rangeError, toIsoDate, type DateRange } from '@/shared/lib/dates';

type CustomRangeFormProps = {
  // El rango con que arranca el formulario: el que se estaba viendo.
  initial: DateRange;
  onApply: (range: DateRange) => void;
};

// Dos fechas y un boton. Mientras se escriben no se pide nada al agente: el rango solo cambia al aplicar, y solo si es valido

export function CustomRangeForm({ initial, onApply }: CustomRangeFormProps) {
  const [start, setStart] = useState(initial.start);
  const [end, setEnd] = useState(initial.end);
  const today = toIsoDate(new Date());
  const error = rangeError({ start, end }, today);

  function handleSubmit(event: FormEvent) {
    // sin esto el navegador recarga la pagina al enviar el formulario
    event.preventDefault();
    if (error === null) onApply({ start, end });
  }

  const inputClass =
    'rounded-md border border-line bg-surface-raised px-2 py-1 text-ink';

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-wrap items-end gap-3 text-sm"
    >
      <label className="flex flex-col gap-1 text-ink-secondary">
        Desde
        <input
          type="date"
          value={start}
          max={end || today}
          onChange={event => setStart(event.target.value)}
          className={inputClass}
        />
      </label>
      <label className="flex flex-col gap-1 text-ink-secondary">
        Hasta
        <input
          type="date"
          value={end}
          min={start}
          max={today}
          onChange={event => setEnd(event.target.value)}
          className={inputClass}
        />
      </label>
      <button
        type="submit"
        disabled={error !== null}
        className="rounded-md bg-accent px-3 py-1 text-white disabled:opacity-50"
      >
        Aplicar
      </button>
      {error && (
        <p role="alert" className="w-full text-danger">
          {error}
        </p>
      )}
    </form>
  );
}
