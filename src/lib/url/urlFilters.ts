import { useEffect, useState } from 'react';
import { CHANNEL_OPTIONS, type Channel } from '../channels';
import {
  RANGE_PRESETS,
  rangeError,
  toIsoDate,
  type RangeSelection,
} from '../dates';

// Los filtros viven en la URL: al recargar no se pierden y un enlace abre el
// panel con la misma vista. Formas validas:
//   ?periodo=30
//   ?desde=2026-09-01&hasta=2026-09-15
//   ...&canal=whatsapp
type Filters = { selection: RangeSelection; channel?: Channel };

const DEFAULT_SELECTION: RangeSelection = { kind: 'preset', days: 30 };

// La URL la puede escribir cualquiera: todo lo que no se reconoce cae al valor
// por defecto en vez de llegar al agente como un 422

export function parseFilters(search: string, today: string): Filters {
  const params = new URLSearchParams(search);

  const channel = CHANNEL_OPTIONS.find(
    option =>
      option.value !== undefined && option.value === params.get('canal'),
  )?.value;

  const start = params.get('desde');
  const end = params.get('hasta');
  if (start && end && rangeError({ start, end }, today) === null) {
    return { selection: { kind: 'custom', start, end }, channel };
  }

  const preset = RANGE_PRESETS.find(
    p => String(p.days) === params.get('periodo'),
  );
  return {
    selection: preset
      ? { kind: 'preset', days: preset.days }
      : DEFAULT_SELECTION,
    channel,
  };
}

export function toSearch({ selection, channel }: Filters): string {
  const params = new URLSearchParams();
  if (selection.kind === 'preset') {
    params.set('periodo', String(selection.days));
  } else {
    params.set('desde', selection.start);
    params.set('hasta', selection.end);
  }
  if (channel) params.set('canal', channel);
  return `?${params}`;
}

// Igual que useState pero leyendo el valor inicial de la URL y escribiendo cada cambio de vuelta en ella

export function useURLFilters() {
  //La funcion dentro de useState solo corre en el primer render: la URL se lee una vez, no en cada render
  const [initial] = useState(() =>
    parseFilters(window.location.search, toIsoDate(new Date())),
  );
  const [selection, setSelection] = useState(initial.selection);
  const [channel, setChannel] = useState(initial.channel);

  useEffect(() => {
    // replaceState y no pushState: cambiar de filtro no deberia llenar el
    // boton "atras" del navegador con cada clic.
    window.history.replaceState(null, '', toSearch({ selection, channel }));
  }, [selection, channel]);

  return { selection, setSelection, channel, setChannel };
}
