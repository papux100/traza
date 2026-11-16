import { Link } from 'react-router'

export default function NoEncontrada() {
  return (
    <div className="max-w-xl py-10">
      <h1 className="text-4xl">Esta página no existe</h1>
      <p className="mt-4 text-lg text-foreground/85">
        Puede que la dirección esté mal escrita o que la ficha de ese algoritmo todavía no se haya publicado.
      </p>
      <p className="mt-6">
        <Link to="/" className="text-primary underline underline-offset-4">
          Ver el catálogo completo
        </Link>
      </p>
    </div>
  )
}
