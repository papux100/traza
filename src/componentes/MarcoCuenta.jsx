import { TrianguloRoto } from '@/componentes/Fragmentos'

/** Páginas de cuenta: el formulario a la izquierda y un triángulo que se parte a la derecha en pantallas anchas. */
export function MarcoCuenta({ semilla, children }) {
  return (
    <div className="grid items-center gap-12 lg:grid-cols-[minmax(0,28rem)_minmax(0,1fr)]">
      <div className="max-w-md">{children}</div>
      <div className="hidden justify-center lg:flex">
        <TrianguloRoto separacion={0.22} esquirlas={18} semilla={semilla} className="w-full max-w-[19rem]" />
      </div>
    </div>
  )
}
