import { useEffect, useState } from 'react';
import { SECTIONS, type SectionId } from '@/app/sections';

// "/productos" -> 'productos'. Cualquier otra ruta (incluida "/") es el resumen.
function fromPath(pathname: string): SectionId {
  const id = pathname.replace(/^\/+|\/+$/g, '');
  return SECTIONS.find(section => section.id === id)?.id ?? 'resumen';
}

// Un enrutador minimo: cuatro secciones no justifican una libreria. La seccion
// vive en la ruta y los filtros en la query (?periodo=30), asi un enlace abre
// la misma seccion con los mismos filtros.
export function useSection() {
  const [section, setSection] = useState(() => fromPath(window.location.pathname));

  // Los botones atras/adelante del navegador cambian la URL sin avisar a
  // React: popstate es el aviso.
  useEffect(() => {
    const onPop = () => setSection(fromPath(window.location.pathname));
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, []);

  function navigate(id: SectionId) {
    if (id === section) return;
    // pushState y no replaceState (al reves que los filtros): cambiar de
    // seccion si es navegar, y "atras" tiene que volver a la anterior. Se
    // conserva la query para que los filtros sigan iguales.
    window.history.pushState(null, '', `/${id}${window.location.search}`);
    setSection(id);
    window.scrollTo({ top: 0 });
  }

  return { section, navigate };
}
