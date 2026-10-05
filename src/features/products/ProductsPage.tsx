import { useProducts } from '@/shared/api/metrics';
import type { Filters } from '@/shared/filters/filters';
import { LoadState } from '@/shared/ui/LoadState';
import { ProductsSection } from '@/features/products/ProductsSection';

export function ProductsPage({ filters }: { filters: Filters }) {
  // Con pagina propia hay espacio para 10 por lista, no 5.
  const products = useProducts(filters, 10);

  return (
    <>
      <LoadState isPending={products.isPending} error={products.error} />
      {products.data && (
        <div className={`transition-opacity ${products.isPlaceholderData ? 'opacity-60' : ''}`}>
          <ProductsSection stats={products.data} />
        </div>
      )}
    </>
  );
}
