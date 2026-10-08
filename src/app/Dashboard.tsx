import { useQueryClient } from '@tanstack/react-query';
import { Suspense } from 'react';
import { AppShell } from '@/app/layout/AppShell';
import { PageHeader } from '@/app/layout/PageHeader';
import { RefreshButton } from '@/app/layout/RefreshButton';
import { sectionById, type SectionId } from '@/app/sections';
import { useSection } from '@/app/useSection';
import { CustomRangeForm } from '@/shared/filters/CustomRangeForm';
import { FilterControls } from '@/shared/filters/FilterControls';
import type { Filters } from '@/shared/filters/filters';
import { useURLFilters } from '@/shared/filters/urlFilters';
import { resolveRange } from '@/shared/lib/dates';
import { formatDayRange } from '@/shared/lib/format';
import { LoadState } from '@/shared/ui/LoadState';
import { AlertBanner } from '@/features/operations/alerts/AlertBanner';
import { useAlerts } from '@/shared/api/metrics';

// La raiz del panel ya autenticado. No dibuja cifras: une el marco, los
// filtros y la pagina de la seccion activa.
export function Dashboard() {
  const queryClient = useQueryClient();
  const { section, navigate } = useSection();
  const { selection, setSelection, channel, setChannel } = useURLFilters();
  const range = resolveRange(selection);
  const filters: Filters = { range, channel };
  const alerts = useAlerts();
  const openAlerts = alerts.data?.open ?? [];
  const current = sectionById(section);
  const { Page } = current;

  // Al pasar el mouse (o el foco) por una seccion del menu: se descarga su
  // codigo y se piden sus datos. Para cuando llega el clic, normalmente ya
  // esta todo y la pagina aparece sin "Cargando". prefetchQuery no repite lo
  // que ya esta fresco en cache, asi que pasar el mouse varias veces no cuesta.
  function prefetch(id: SectionId) {
    const target = sectionById(id);
    void target.preload();
    target.prefetch(queryClient, filters);
  }

  return (
    <AppShell
      section={section}
      onNavigate={navigate}
      onPrefetch={prefetch}
      badges={{ operacion: openAlerts.length }}
    >
      <PageHeader
        title={current.label}
        description={`${current.description} · ${formatDayRange(range.start, range.end)}`}
        actions={
          <>
            <FilterControls
              selection={selection}
              onSelectionChange={setSelection}
              channel={channel}
              onChannelChange={setChannel}
              range={range}
            />
            <RefreshButton />
          </>
        }
      >
        {selection.kind === 'custom' && (
          <CustomRangeForm
            initial={range}
            onApply={applied => setSelection({ kind: 'custom', ...applied })}
          />
        )}
      </PageHeader>

      <main className="mx-auto max-w-6xl space-y-6 px-4 py-6 sm:px-6">
        <AlertBanner alerts={openAlerts} />
        {/* Mientras llega el archivo de la pagina (solo la primera vez). */}
        <Suspense fallback={<LoadState isPending error={null} />}>
          <Page filters={filters} />
        </Suspense>
      </main>
    </AppShell>
  );
}
