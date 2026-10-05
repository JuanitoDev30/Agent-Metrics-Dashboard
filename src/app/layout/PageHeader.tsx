import type { ReactNode } from 'react';
import { LogoutButton } from '@/app/layout/AppShell';

type PageHeaderProps = {
  title: string;
  description: string;
  // Los filtros: canal, periodo, actualizar.
  actions: ReactNode;
  // Lo que va debajo, a todo el ancho (el formulario de fechas).
  children?: ReactNode;
};

// Fijo arriba en pantallas anchas: los filtros quedan a mano al bajar. En el
// celular no, porque con los filtros en dos lineas taparia media pantalla.
export function PageHeader({ title, description, actions, children }: PageHeaderProps) {
  return (
    <header className="border-b border-line bg-surface/95 backdrop-blur lg:sticky lg:top-0 lg:z-10">
      <div className="mx-auto flex max-w-6xl flex-wrap items-end justify-between gap-4 px-4 py-4 sm:px-6">
        <div className="min-w-0">
          <div className="flex items-center justify-between gap-3">
            <h1 className="text-xl font-semibold tracking-tight">{title}</h1>
            {/* En el celular no hay barra lateral: salir va aqui. */}
            <LogoutButton className="flex items-center gap-1 text-sm text-ink-secondary hover:text-ink lg:hidden" />
          </div>
          <p className="text-sm text-ink-secondary">{description}</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">{actions}</div>
      </div>
      {children && <div className="mx-auto max-w-6xl px-4 pb-4 sm:px-6">{children}</div>}
    </header>
  );
}
