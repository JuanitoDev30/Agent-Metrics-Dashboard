import type { components } from '@/shared/api/schema';

// Los tipos salen del backend: schema.d.ts se genera desde su OpenAPI con
// `npm run gen:api`. Si el agente cambia una respuesta, el panel no compila
// hasta adaptarse, en vez de fallar en produccion.
type Schemas = components['schemas'];

export type Summary = Schemas['Summary'];
export type Timeseries = Schemas['Timeseries'];
export type ProductStats = Schemas['ProductStats'];
export type Operations = Schemas['OperationsStats'];
export type Heatmap = Schemas['Heatmap'];
export type PanelSession = Schemas['PanelSession'];
export type AlertsView = Schemas['AlertsView'];
export type Alert = Schemas['Alert'];
