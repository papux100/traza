import { useId, useState } from 'react'
import { Shuffle } from 'lucide-react'
import { useStore } from 'zustand'
import { Button } from '@/componentes/ui/button'
import { arregloAleatorio, leerArreglo, leerObjetivo, MAX_ELEMENTOS, VALOR_MAX, VALOR_MIN } from '@/motor/entrada'

const claseCampo =
  'h-9 w-full rounded-md border border-input bg-background px-3 font-mono text-sm text-foreground placeholder:text-tenue aria-invalid:border-destructive'

export function EditorEntrada({ reproductor, algoritmo }) {
  const esBusqueda = algoritmo.familia === 'busqueda'
  const valorMax = algoritmo.valorMax ?? VALOR_MAX
  const entrada = useStore(reproductor, (s) => s.entrada)
  const objetivo = useStore(reproductor, (s) => s.objetivo)
  const [texto, setTexto] = useState(entrada.join(', '))
  const [textoObjetivo, setTextoObjetivo] = useState(String(objetivo ?? ''))
  const [error, setError] = useState(null)
  const idArreglo = useId()
  const idObjetivo = useId()
  const idError = useId()

  function aplicar(evento) {
    evento.preventDefault()
    const arreglo = leerArreglo(texto, { valorMax })
    if (arreglo.error) return setError(arreglo.error)

    let buscado
    if (esBusqueda) {
      const leido = leerObjetivo(textoObjetivo)
      if (leido.error) return setError(leido.error)
      buscado = leido.valor
    }

    setError(null)
    reproductor.getState().cargar(arreglo.valores, buscado)
  }

  function aleatorio() {
    const valores = arregloAleatorio(esBusqueda ? 11 : 8, { valorMax })
    // En búsqueda, casi siempre se busca un valor que sí está.
    const buscado = esBusqueda
      ? Math.random() < 0.8
        ? valores[Math.floor(Math.random() * valores.length)]
        : arregloAleatorio(1, { valorMax })[0]
      : undefined

    setTexto(valores.join(', '))
    if (esBusqueda) setTextoObjetivo(String(buscado))
    setError(null)
    reproductor.getState().cargar(valores, buscado)
  }

  return (
    <form onSubmit={aplicar} noValidate className="flex flex-col gap-2">
      <div className="flex flex-wrap items-end gap-3">
        <div className="min-w-56 flex-1">
          <label htmlFor={idArreglo} className="mb-1 block text-xs text-muted-foreground">
            Tu arreglo
          </label>
          <input
            id={idArreglo}
            className={claseCampo}
            value={texto}
            onChange={(e) => {
              setTexto(e.target.value)
              setError(null)
            }}
            placeholder="5, 2, 9, 1, 7"
            inputMode="numeric"
            autoComplete="off"
            aria-invalid={error ? true : undefined}
            aria-describedby={error ? idError : undefined}
          />
        </div>

        {esBusqueda && (
          <div className="w-28">
            <label htmlFor={idObjetivo} className="mb-1 block text-xs text-muted-foreground">
              Valor buscado
            </label>
            <input
              id={idObjetivo}
              className={claseCampo}
              value={textoObjetivo}
              onChange={(e) => {
                setTextoObjetivo(e.target.value)
                setError(null)
              }}
              inputMode="numeric"
              autoComplete="off"
            />
          </div>
        )}

        <div className="flex gap-2">
          <Button type="submit" variant="secondary">
            Ejecutar con estos datos
          </Button>
          <Button type="button" variant="outline" onClick={aleatorio}>
            <Shuffle />
            Aleatorio
          </Button>
        </div>
      </div>

      {error ? (
        <p id={idError} role="alert" className="text-sm text-destructive">
          {error}
        </p>
      ) : (
        <p className="text-xs text-tenue">
          Hasta {MAX_ELEMENTOS} enteros entre {VALOR_MIN} y {valorMax}, separados por comas o espacios.
          {algoritmo.valorMax && ' Este algoritmo necesita un rango de valores pequeño, por eso el máximo es menor.'}
          {algoritmo.prepararEntrada && ' Este algoritmo exige datos ordenados, así que tu arreglo se ordena antes de empezar.'}
        </p>
      )}
    </form>
  )
}
