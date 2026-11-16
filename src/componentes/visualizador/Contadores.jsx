const POR_FAMILIA = {
  ordenamiento: [
    { clave: 'comparaciones', etiqueta: 'Comparaciones' },
    { clave: 'intercambios', etiqueta: 'Intercambios' },
    { clave: 'escrituras', etiqueta: 'Escrituras' },
  ],
  busqueda: [
    { clave: 'comparaciones', etiqueta: 'Comparaciones' },
    { clave: 'descartados', etiqueta: 'Descartados' },
  ],
}

export function Contadores({ familia, contadores }) {
  return (
    <dl className="flex flex-wrap gap-x-8 gap-y-2">
      {POR_FAMILIA[familia].map(({ clave, etiqueta }) => (
        <div key={clave} className="flex items-baseline gap-2">
          <dt className="text-xs text-muted-foreground">{etiqueta}</dt>
          <dd className="font-mono text-lg font-medium tabular-nums">{contadores[clave]}</dd>
        </div>
      ))}
    </dl>
  )
}
