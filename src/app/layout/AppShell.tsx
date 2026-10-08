import type { MouseEvent, ReactNode } from 'react';
import { logout } from '@/features/auth/session';
import { SECTIONS, type SectionId } from '@/app/sections';
import { LogoutIcon, SectionIcon } from '@/app/layout/icons';

type AppShellProps = {
  section: SectionId;
  onNavigate: (id: SectionId) => void;
  // Adelantar codigo y datos de una seccion antes del clic.
  onPrefetch: (id: SectionId) => void;
  badges?: Partial<Record<SectionId, number>>;
  children: ReactNode;
};

// El marco de todas las paginas: barra lateral en pantallas anchas, barra de
// pestanas abajo en el celular. El contenido de cada seccion va en children.
export function AppShell({
  section,
  onNavigate,
  onPrefetch,
  badges = {},
  children,
}: AppShellProps) {
  return (
    <div className="min-h-screen lg:grid lg:grid-cols-[15rem_1fr]">
      <aside className="sticky top-0 hidden h-screen flex-col border-r border-line bg-surface-raised px-3 py-5 lg:flex">
        <Brand />
        <nav aria-label="Secciones" className="mt-8 flex flex-col gap-1">
          {SECTIONS.map(item => (
            <NavLink
              key={item.id}
              id={item.id}
              active={item.id === section}
              onNavigate={onNavigate}
              onPrefetch={onPrefetch}
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium"
            >
              <SectionIcon id={item.id} />
              {item.label}
              <Badge count={badges[item.id]} className="ml-auto" />
            </NavLink>
          ))}
        </nav>
        <LogoutButton className="mt-auto flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-ink-secondary hover:bg-surface hover:text-ink" />
      </aside>

      {/* pb-20 en el celular: espacio para que la barra de abajo no tape el
          final de la pagina. */}
      <div className="min-w-0 pb-20 lg:pb-0">{children}</div>

      <nav
        aria-label="Secciones"
        className="fixed inset-x-0 bottom-0 z-20 grid grid-cols-4 border-t border-line bg-surface-raised lg:hidden"
      >
        {SECTIONS.map(item => (
          <NavLink
            key={item.id}
            id={item.id}
            active={item.id === section}
            onNavigate={onNavigate}
            onPrefetch={onPrefetch}
            className="flex flex-col items-center gap-1 py-2 text-xs font-medium"
          >
            <span className="relative">
              <SectionIcon id={item.id} />
              <Badge
                count={badges[item.id]}
                className="absolute -top-1.5 -right-2.5"
              />
            </span>
            {/* "Clientes y horarios" no cabe en un cuarto de pantalla. */}
            {item.label.split(' ')[0]}
          </NavLink>
        ))}
      </nav>
    </div>
  );
}
function Badge({ count, className }: { count?: number; className: string }) {
  if (!count) return null;
  return (
    <span
      className={`${className} grid min-w-5 place-items-center rounded-full bg-danger px-1.5 text-xs font-semibold leading-5 text-white`}
    >
      {count}
      <span className="sr-only">
        {count === 1 ? ' alerta abierta' : ' alertas abiertas'}
      </span>
    </span>
  );
}

function Brand() {
  return (
    <div className="flex items-center gap-2 px-3">
      <span
        aria-hidden="true"
        className="grid size-8 place-items-center rounded-lg bg-accent text-sm font-bold text-white"
      >
        A
      </span>
      <span className="font-semibold">Panel del agente</span>
    </div>
  );
}

type NavLinkProps = {
  id: SectionId;
  active: boolean;
  onNavigate: (id: SectionId) => void;
  onPrefetch: (id: SectionId) => void;
  className: string;
  children: ReactNode;
};

// Un enlace de verdad (<a href>), no un boton: se puede abrir en otra
// pestana, copiar o compartir. El clic normal no recarga la pagina.
function NavLink({
  id,
  active,
  onNavigate,
  onPrefetch,
  className,
  children,
}: NavLinkProps) {
  function handleClick(event: MouseEvent<HTMLAnchorElement>) {
    // Ctrl/Cmd/Shift + clic: que el navegador haga lo suyo (pestana nueva).
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.button !== 0)
      return;
    event.preventDefault();
    onNavigate(id);
  }

  return (
    <a
      href={`/${id}${window.location.search}`}
      onClick={handleClick}
      // Mouse y teclado: quien navega con Tab tambien llega a una pagina lista.
      onMouseEnter={() => onPrefetch(id)}
      onFocus={() => onPrefetch(id)}
      // aria-current: el lector de pantalla anuncia "pagina actual".
      aria-current={active ? 'page' : undefined}
      className={`${className} ${
        active
          ? 'bg-accent/10 text-accent'
          : 'text-ink-secondary hover:bg-surface hover:text-ink'
      }`}
    >
      {children}
    </a>
  );
}

export function LogoutButton({ className }: { className: string }) {
  return (
    <button type="button" onClick={() => void logout()} className={className}>
      <LogoutIcon />
      Salir
    </button>
  );
}
