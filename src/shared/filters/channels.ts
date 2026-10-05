// Los canales por donde atiende el agente. El valor es el prefijo del id de
// conversacion en el backend; sin canal, el panel cuenta todos.
export const CHANNEL_OPTIONS = [
  { value: undefined, label: 'Todos' },
  { value: 'web', label: 'Web' },
  { value: 'whatsapp', label: 'WhatsApp' },
] as const;

export type Channel = NonNullable<(typeof CHANNEL_OPTIONS)[number]['value']>;
