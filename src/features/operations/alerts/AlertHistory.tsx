import type { Alert } from '@/shared/api/types';
import { formatDateTime, formatElapsed } from '@/shared/lib/format';

// Lo que paso mientras nadie miraba: cada alerta cuando empezo y cuanto duro.
// Las abiertas tambien estan en el aviso de arriba; Aqui va el historial

export function AlertHistory({ alerts }: { alerts: Alert[] }) {
  return (
    <section className="card">
      <h2 className="font-semibold">Historial de alertas</h2>
      <p className="text-sm text-ink-secondary">
        El agente revisa su salud cada pocos minutos y avisa cuando algo se
        degrada
      </p>

      {alerts.length === 0 ? (
        <p className="py-6 text-center text-sm text-ink-secondary">
          Sin alertas recientes. Todo en orden.
        </p>
      ) : (
        <ol className="mt-4 divide-y divide-line">
          {alerts.map(alert => (
            <li
              key={alert.id}
              className="flex flex-wrap items-start justify-between gap-2 py-3"
            >
              <div className="min-w-0">
                <p className="font-medium text-ink">{alert.title}</p>
                <p className="text-sm text-ink-secondary">{alert.detail}</p>
                <p className="text-xs text-ink-muted">
                  {formatDateTime(alert.opened_at)}
                </p>
              </div>
              <Status alert={alert} />
            </li>
          ))}
        </ol>
      )}
    </section>
  );
}

function Status({ alert }: { alert: Alert }) {
  if (alert.resolved_at === null || alert.resolved_at === undefined) {
    return (
      <span className="shrink-0 rounded-full bg-danger/10 px-2 py-0.5 text-xs font-medium text-danger">
        Abierta
      </span>
    );
  }
  return (
    <span className="shrink-0 rounded-full bg-surface px-2 py-0.5 text-xs text-ink-secondary">
      Resuelta · duró {formatElapsed(alert.opened_at, alert.resolved_at)}
    </span>
  );
}
