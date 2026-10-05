import { useOperations } from '@/shared/api/metrics';
import type { Filters } from '@/shared/filters/filters';
import { LoadState } from '@/shared/ui/LoadState';
import { OperationsSection } from '@/features/operations/OperationsSection';

export function OperationsPage({ filters }: { filters: Filters }) {
  const operations = useOperations(filters);

  return (
    <>
      <LoadState isPending={operations.isPending} error={operations.error} />
      {operations.data && (
        <div className={`transition-opacity ${operations.isPlaceholderData ? 'opacity-60' : ''}`}>
          <OperationsSection stats={operations.data} />
        </div>
      )}
    </>
  );
}
