import { Link } from 'react-router'
import { TrianguloRoto } from '@/componentes/Fragmentos'

export default function NoEncontrada() {
  return (
    <div className="grid items-center gap-10 py-10 md:grid-cols-[minmax(0,1fr)_16rem]">
      <div className="max-w-xl">
        <h1 className="text-4xl">Esta página no existe</h1>
        <p className="mt-4 text-lg text-foreground/85">
          Puede que la dirección esté mal escrita o que la ficha de ese algoritmo todavía no se haya publicado.
        </p>
        <p className="mt-6">
          <Link to="/" className="text-enlace underline underline-offset-4">
            Ver el catálogo completo
          </Link>
        </p>
      </div>
      <div className="flex justify-center">
        <TrianguloRoto separacion={0.75} esquirlas={30} semilla={404} className="w-48 md:w-56" />
      </div>
    </div>
  )
}
