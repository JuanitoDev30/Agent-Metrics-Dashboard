import type { Alert } from '@/shared/api/types';
import { formatSince } from '@/shared/lib/format';
import { WarningIcon } from './WarningIcon';

// Las alertas abiertas, arriba de cualquier seccion: un problema de ahora no
// puede depender de que alguien entre justo a Operacion.
export function AlertBanner({ alerts }: { alerts: Alert[] }) {
  if (alerts.length === 0) return null;

  return (
    // role="status" y no "alert": "alert" interrumpe al lector de pantalla en
    // cada aparicion, y esto vuelve a pintarse con cada refresco.
    <section
      role="status"
      aria-label="Alertas abiertas"
      className="rounded-xl border border-danger/40 bg-danger/5 p-5"
    >
      <h2 className="flex items-center gap-2 font-semibold text-danger">
        <WarningIcon />
        {alerts.length === 1
          ? 'Hay una alerta abierta'
          : `Hay ${alerts.length} alertas abiertas`}
      </h2>
      <ul className="mt-3 space-y-3">
        {alerts.map(alert => (
          <li key={alert.id}>
            <p className="font-medium text-ink">{alert.title}</p>
            <p className="text-sm text-ink-secondary">
              {alert.detail} · desde {formatSince(alert.opened_at)}
            </p>
          </li>
        ))}
      </ul>
    </section>
  );
}
