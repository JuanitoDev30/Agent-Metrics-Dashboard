import type { Channel } from '@/shared/filters/channels';
import { previousRange, type DateRange } from '@/shared/lib/dates';

// El rango y el canal: lo que filtra a todos los endpoints. Sin canal, se
// cuentan todos.
export type Filters = { range: DateRange; channel?: Channel };

// Los mismos filtros, un periodo atras: para comparar contra el anterior.
export function previousFilters(filters: Filters): Filters {
  return { ...filters, range: previousRange(filters.range) };
}
