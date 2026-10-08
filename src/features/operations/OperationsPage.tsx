import { useAlerts, useOperations } from '@/shared/api/metrics';
import type { Filters } from '@/shared/filters/filters';
import { LoadState } from '@/shared/ui/LoadState';
import { AlertHistory } from '@/features/operations/alerts/AlertHistory';
import { OperationsSection } from '@/features/operations/OperationsSection';

export function OperationsPage({ filters }: { filters: Filters }) {
  const operations = useOperations(filters);
  // La misma consulta que usa el aviso de arriba: sale de la cache.
  const alerts = useAlerts();

  return (
    <>
      <LoadState isPending={operations.isPending} error={operations.error} />
      {alerts.data && <AlertHistory alerts={alerts.data.recent} />}
      {operations.data && (
        <div
          className={`transition-opacity ${operations.isPlaceholderData ? 'opacity-60' : ''}`}
        >
          <OperationsSection stats={operations.data} />
        </div>
      )}
    </>
  );
}
