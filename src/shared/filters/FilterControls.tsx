import { CHANNEL_OPTIONS, type Channel } from '@/shared/filters/channels';
import type { DateRange, PresetDays, RangeSelection } from '@/shared/lib/dates';
import { RANGE_PRESETS } from '@/shared/lib/dates';
import { Segmented } from '@/shared/ui/Segmented';

// Los atajos mas una opcion para elegir las fechas a mano. El tipo va
// explicito porque mezcla numeros (los dias) con el texto 'custom'.
type PeriodOption = PresetDays | 'custom';

const PERIOD_OPTIONS: { value: PeriodOption; label: string }[] = [
  ...RANGE_PRESETS.map(preset => ({ value: preset.days, label: preset.label })),
  { value: 'custom', label: 'Personalizado' },
];

type FilterControlsProps = {
  selection: RangeSelection;
  onSelectionChange: (selection: RangeSelection) => void;
  channel: Channel | undefined;
  onChannelChange: (channel: Channel | undefined) => void;
  // El rango que se esta viendo: con el arranca "Personalizado".
  range: DateRange;
};

// Canal y periodo. Solo dibuja y avisa: donde se guardan los filtros (la URL)
// lo decide quien la usa.
export function FilterControls({
  selection,
  onSelectionChange,
  channel,
  onChannelChange,
  range,
}: FilterControlsProps) {
  // Con el tipo anotado: si no, TypeScript lee 'custom' como un string
  // cualquiera y deja de saber que solo puede ser eso o un numero de dias.
  const period: PeriodOption = selection.kind === 'preset' ? selection.days : 'custom';

  return (
    <>
      <Segmented
        label="Canal"
        options={CHANNEL_OPTIONS}
        value={channel}
        onChange={onChannelChange}
      />
      <Segmented
        label="Período"
        options={PERIOD_OPTIONS}
        value={period}
        onChange={option =>
          // Al pasar a personalizado se arranca con el rango que se estaba
          // viendo: los datos no cambian hasta que se aplique otro.
          onSelectionChange(
            option === 'custom'
              ? { kind: 'custom', ...range }
              : { kind: 'preset', days: option },
          )
        }
      />
    </>
  );
}
