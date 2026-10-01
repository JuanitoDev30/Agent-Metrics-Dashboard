import type { ProductStats } from '../api/client';
import { formatCount } from '../lib/format';
import { RankedList, type RankedItem } from './RankedList';

type ProductCount = ProductStats['most_ordered'][number];

function plural(count: number, one: string, many: string): string {
  return `${formatCount(count)} ${count === 1 ? one : many}`;
}

function conversationsDetail(count: number): string {
  return `en ${plural(count, 'conversación', 'conversaciones')}`;
}

// Cada lista dice cosas distintas con los mismos datos: por eso cada una
// arma sus propios items en vez de compartir un formato.
function ordered(products: ProductCount[]): RankedItem[] {
  return products.map(product => ({
    id: product.product_id,
    label: product.name,
    value: product.units ?? 0,
    valueText: plural(product.units ?? 0, 'unidad', 'unidades'),
    detail: conversationsDetail(product.conversations),
  }));
}

function interest(products: ProductCount[]): RankedItem[] {
  return products.map(product => ({
    id: product.product_id,
    label: product.name,
    value: product.conversations,
    valueText: plural(product.conversations, 'conversación', 'conversaciones'),
  }));
}

function outOfStock(products: ProductCount[]): RankedItem[] {
  return products.map(product => ({
    id: product.product_id,
    label: product.name,
    value: product.conversations,
    valueText: plural(product.conversations, 'cliente', 'clientes'),
    detail: `pidieron ${plural(product.units ?? 0, 'unidad', 'unidades')} en total`,
  }));
}

export function ProductsSection({ stats }: { stats: ProductStats }) {
  const searches: RankedItem[] = stats.failed_searches.map(search => ({
    id: search.query,
    label: `“${search.query}”`,
    value: search.times,
    valueText: plural(search.times, 'vez', 'veces'),
  }));

  return (
    <section className="mt-8">
      <h2 className="text-lg font-semibold">Productos</h2>
      <div className="mt-3 grid grid-cols-1 gap-4 lg:grid-cols-2">
        <RankedList
          title="Más pedidos"
          subtitle="Unidades en pedidos registrados"
          items={ordered(stats.most_ordered)}
          emptyText="Todavía no hay pedidos en este período."
        />
        <RankedList
          title="Más consultados"
          subtitle="Conversaciones que vieron el producto o lo agregaron al carrito"
          items={interest(stats.most_interest)}
          emptyText="Nadie consultó productos en este período."
        />
        <RankedList
          title="Pedidos sin stock"
          subtitle="Lo pidieron y no había: demanda que se está perdiendo"
          items={outOfStock(stats.out_of_stock)}
          emptyText="No faltó ningún producto en este período."
        />
        <RankedList
          title="Búsquedas sin resultado"
          subtitle="Lo que los clientes buscaron y el menú no tiene"
          items={searches}
          emptyText="Todas las búsquedas encontraron algo."
        />
      </div>
    </section>
  );
}
