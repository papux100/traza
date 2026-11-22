import { Fragmentos } from '@/componentes/Fragmentos'

/** Páginas de cuenta: el formulario a la izquierda y fragmentos a la derecha en pantallas anchas. */
export function MarcoCuenta({ semilla, children }) {
  return (
    <div className="grid items-start gap-12 lg:grid-cols-[minmax(0,28rem)_minmax(0,1fr)]">
      <div className="max-w-md">{children}</div>
      <div className="hidden h-[32rem] lg:block">
        <Fragmentos semilla={semilla} alto={520} />
      </div>
    </div>
  )
}
