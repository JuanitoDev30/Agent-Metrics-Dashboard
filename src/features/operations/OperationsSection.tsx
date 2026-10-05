import type { Operations } from '@/shared/api/types';
import {
  formatCount,
  formatDecimal,
  formatDuration,
  formatPercent,
  formatUSD,
  plural,
} from '@/shared/lib/format';
import { CacheHitChart } from '@/features/operations/CacheHitChart';
import { DailyCostChart } from '@/features/operations/DailyCostChart';
import { RankedList, type RankedItem } from '@/shared/ui/RankedList';
import { StatTile } from '@/shared/ui/StatTile';

// Lo que anota el agente al cerrar cada turno, dicho para quien lee el panel.
const OUTCOME_LABELS: Record<string, string> = {
  ok: 'Respondió normalmente',
  backend_caido: 'El sistema del negocio no respondió',
  error_llm: 'El modelo no respondió',
  tope_iteraciones: 'Se alargó demasiado y se cortó',
  rechazo: 'El modelo se negó a responder',
};

const HANDOFF_LABELS: Record<string, string> = {
  pide_persona: 'El cliente pidió hablar con alguien',
  reclamo: 'El cliente hizo un reclamo',
  fuera_de_alcance: 'Algo que el agente no puede resolver',
};

export function OperationsSection({ stats }: { stats: Operations }) {
  const { tokens } = stats;
  const failed =
    stats.turns - (stats.outcomes.find(o => o.outcome === 'ok')?.turns ?? 0);
  const totalTokens =
    tokens.input + tokens.output + tokens.cache_read + tokens.cache_write;

  const outcomes: RankedItem[] = stats.outcomes.map(outcome => ({
    id: outcome.outcome,
    label: OUTCOME_LABELS[outcome.outcome] ?? outcome.outcome,
    value: outcome.turns,
    valueText: plural(outcome.turns, 'turno', 'turnos'),
    detail: formatPercent(stats.turns ? outcome.turns / stats.turns : null),
  }));

  const tools: RankedItem[] = stats.tools.map(tool => ({
    id: tool.tool,
    // El nombre interno de la herramienta: es lo que aparece en los logs.
    label: tool.tool,
    value: tool.calls,
    valueText: plural(tool.calls, 'llamada', 'llamadas'),
    detail: `en ${plural(tool.turns, 'turno', 'turnos')}`,
  }));

  const { latency, handoffs, voice_notes: voice } = stats;

  const handoffKinds: RankedItem[] = handoffs.by_kind.map(item => ({
    id: item.kind,
    label: HANDOFF_LABELS[item.kind] ?? item.kind,
    value: item.handoffs,
    valueText: plural(item.handoffs, 'vez', 'veces'),
  }));

  const models: RankedItem[] = stats.models.map(item => ({
    id: item.model,
    label: item.model,
    value: item.turns,
    valueText: plural(item.turns, 'turno', 'turnos'),
    detail: `${formatUSD(item.cost_usd)} en total`,
  }));

  return (
    <section className="space-y-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatTile
          label="Turnos atendidos"
          value={formatCount(stats.turns)}
          hint={`${formatPercent(stats.turns ? failed / stats.turns : null)} con problemas`}
        />
        <StatTile
          label="Acierto de caché"
          value={formatPercent(tokens.cache_hit_rate)}
          hint={`${formatCount(tokens.cache_read, true)} tokens leídos de caché`}
        />
        <StatTile
          label="Llamadas al modelo por turno"
          value={formatDecimal(stats.average_iterations)}
          hint="Cada una reenvía la conversación"
        />
        <StatTile
          label="Tokens procesados"
          value={formatCount(totalTokens, true)}
          hint={`${formatCount(tokens.input + tokens.cache_read + tokens.cache_write, true)} de entrada · ${formatCount(tokens.output, true)} de salida`}
        />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatTile
          label="Tiempo de respuesta"
          value={formatDuration(latency.p50_seconds)}
          hint={
            latency.measured_turns
              ? `1 de cada 10 espera más de ${formatDuration(latency.p90_seconds)}`
              : 'Sin turnos medidos todavía'
          }
        />
        <StatTile
          label="Pasados a una persona"
          value={formatCount(handoffs.total)}
          hint={
            stats.turns
              ? `${formatPercent(handoffs.total / stats.turns)} de los turnos`
              : undefined
          }
        />
        <StatTile
          label="Notas de voz"
          value={formatCount(voice.notes)}
          hint={
            voice.notes
              ? `${formatCount(voice.transcribed)} entendidas · ${formatDuration(voice.transcribed_seconds)} de audio`
              : undefined
          }
        />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <DailyCostChart days={stats.daily} />
        <CacheHitChart days={stats.daily} />
        <RankedList
          title="Cómo terminaron los turnos"
          subtitle="Todo lo que no sea una respuesta normal es un cliente mal atendido"
          items={outcomes}
          emptyText="No hubo turnos en este período."
        />
        <RankedList
          title="Herramientas más usadas"
          subtitle="Llamadas del modelo a cada herramienta del agente"
          items={tools}
          emptyText="El agente no usó herramientas en este período."
        />
        <RankedList
          title="Por qué se pasó a una persona"
          subtitle="Lo que el agente no pudo o no debía resolver solo"
          items={handoffKinds}
          emptyText="Ninguna conversación pasó a una persona en este período."
        />
        <RankedList
          title="Uso por modelo"
          subtitle="Turnos atendidos por cada modelo y lo que costaron"
          items={models}
          emptyText="Todavía no hay turnos con el modelo registrado."
        />
      </div>
    </section>
  );
}
