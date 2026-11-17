import { useId } from 'react'

/** Campo de formulario con su etiqueta y su mensaje de error. */
export function Campo({ etiqueta, error, ayuda, ...props }) {
  const id = useId()
  const idMensaje = useId()
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-sm font-medium">
        {etiqueta}
      </label>
      <input
        id={id}
        className="h-10 w-full rounded-md border border-input bg-background px-3 text-[0.9375rem] text-foreground placeholder:text-tenue aria-invalid:border-destructive"
        aria-invalid={error ? true : undefined}
        aria-describedby={error || ayuda ? idMensaje : undefined}
        {...props}
      />
      {error ? (
        <p id={idMensaje} className="mt-1.5 text-sm text-destructive">
          {error}
        </p>
      ) : (
        ayuda && (
          <p id={idMensaje} className="mt-1.5 text-xs text-tenue">
            {ayuda}
          </p>
        )
      )}
    </div>
  )
}
