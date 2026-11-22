import { Button } from '@/componentes/ui/button'

/** Mensaje de carga o de error, con opción de reintentar. */
export function EstadoCarga({ error, alReintentar, texto = 'Cargando…' }) {
  if (error) {
    return (
      <div role="alert" className="facetado max-w-xl border border-destructive/40 bg-destructive/5 px-5 py-4 [--borde-faceta:color-mix(in_oklab,var(--destructive)_40%,transparent)]">
        <p className="font-medium text-foreground">No se pudo cargar el contenido</p>
        <p className="mt-1 text-sm text-foreground/85">{error}</p>
        {alReintentar && (
          <Button variant="outline" size="sm" className="mt-3" onClick={alReintentar}>
            Reintentar
          </Button>
        )}
      </div>
    )
  }
  return (
    <p role="status" className="animate-pulse text-sm text-muted-foreground">
      {texto}
    </p>
  )
}
