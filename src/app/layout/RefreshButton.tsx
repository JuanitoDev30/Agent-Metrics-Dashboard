import { useIsFetching, useQueryClient } from '@tanstack/react-query';
import { formatTime } from '@/shared/lib/format';

// Cuando se actualizo lo que se ve y un boton para no esperar al proximo
// refresco automatico.
export function RefreshButton() {
  const queryClient = useQueryClient();
  // Cuantas peticiones de metricas van en curso, de cualquier seccion.
  const fetching = useIsFetching({ queryKey: ['metrics'] }) > 0;
  // La hora de la respuesta mas reciente entre las consultas en pantalla. Cada
  // seccion tiene las suyas, asi que no se le puede pasar una sola. Se
  // recalcula en cada render, y useIsFetching vuelve a dibujar el boton cada
  // vez que una peticion empieza o termina.
  const updatedAt = Math.max(
    0,
    ...queryClient
      .getQueryCache()
      .findAll({ queryKey: ['metrics'], type: 'active' })
      .map(query => query.state.dataUpdatedAt),
  );

  return (
    <div className="flex items-center gap-2 text-sm text-ink-secondary">
      {/* 0 mientras no haya llegado nada. */}
      {updatedAt > 0 && <span>Actualizado a las {formatTime(updatedAt)}</span>}
      <button
        type="button"
        disabled={fetching}
        // Invalidar, y no refetch a mano: marca vieja toda respuesta que
        // empiece por 'metrics' y vuelve a pedir las que estan en pantalla.
        onClick={() => queryClient.invalidateQueries({ queryKey: ['metrics'] })}
        className="rounded-md border border-line px-2 py-1 hover:text-ink disabled:opacity-50"
      >
        {fetching ? 'Actualizando…' : 'Actualizar'}
      </button>
    </div>
  );
}
