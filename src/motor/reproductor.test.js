import { describe, expect, it } from 'vitest'
import { ErrorApi } from '@/servicios/api'
import { crearReproductor } from './reproductor'
import { leerArreglo, leerObjetivo } from './entrada'

/** Traza falsa con `n` pasos, para no depender del servidor. */
function trazaFalsa(entrada = [3, 1, 2], n = 6) {
  const elementos = entrada.map((valor, i) => ({ id: `e${i}`, valor }))
  return {
    algoritmo: { id: 'insercion', familia: 'ordenamiento', codigo: 'function f() {}', leyenda: {} },
    entrada,
    objetivo: null,
    resultado: [...entrada].sort((a, b) => a - b),
    pasos: Array.from({ length: n }, (_, i) => ({ elementos, estados: [], descripcion: `paso ${i}` })),
  }
}

const listo = async (ejecutar = async (_id, { entrada } = {}) => trazaFalsa(entrada)) => {
  const r = crearReproductor('insercion', { ejecutar })
  await r.getState().cargar()
  return r
}

describe('reproductor', () => {
  it('pide la traza al servidor y queda listo en el primer paso', async () => {
    const llamadas = []
    const r = await listo(async (id, datos) => {
      llamadas.push([id, datos])
      return trazaFalsa()
    })
    expect(llamadas).toEqual([['insercion', { entrada: undefined, objetivo: undefined }]])
    const { estado, indice, reproduciendo, pasos } = r.getState()
    expect(estado).toBe('listo')
    expect(indice).toBe(0)
    expect(reproduciendo).toBe(false)
    expect(pasos).toHaveLength(6)
  })

  it('mientras espera está en estado cargando', async () => {
    let responder
    const r = crearReproductor('insercion', { ejecutar: () => new Promise((ok) => (responder = ok)) })
    const promesa = r.getState().cargar()
    expect(r.getState().estado).toBe('cargando')
    responder(trazaFalsa())
    await promesa
    expect(r.getState().estado).toBe('listo')
  })

  it('si el algoritmo pide cuenta queda bloqueado; otros errores quedan como error', async () => {
    const bloqueado = crearReproductor('quicksort', {
      ejecutar: async () => {
        throw new ErrorApi('Inicia sesión', { estado: 401, codigo: 'requiere_cuenta' })
      },
    })
    await bloqueado.getState().cargar()
    expect(bloqueado.getState().estado).toBe('bloqueado')

    const caido = crearReproductor('insercion', {
      ejecutar: async () => {
        throw new ErrorApi('No se pudo conectar')
      },
    })
    await caido.getState().cargar()
    expect(caido.getState().estado).toBe('error')
    expect(caido.getState().error).toBe('No se pudo conectar')
  })

  it('un error al volver a ejecutar conserva la traza anterior y devuelve el mensaje', async () => {
    let fallar = false
    const r = await listo(async (_id, { entrada } = {}) => {
      if (fallar) throw new ErrorApi('Entrada inválida')
      return trazaFalsa(entrada)
    })
    fallar = true
    const resultado = await r.getState().cargar([9, 9])
    expect(resultado).toEqual({ ok: false, error: 'Entrada inválida' })
    expect(r.getState().estado).toBe('listo')
    expect(r.getState().entrada).toEqual([3, 1, 2])
    expect(r.getState().recalculando).toBe(false)
  })

  it('si llegan dos respuestas, sólo cuenta la última petición', async () => {
    const pendientes = []
    const r = crearReproductor('insercion', {
      ejecutar: (_id, { entrada }) => new Promise((ok) => pendientes.push(() => ok(trazaFalsa(entrada)))),
    })
    const primera = r.getState().cargar([1, 2])
    const segunda = r.getState().cargar([5, 4])
    pendientes[1]()
    await segunda
    pendientes[0]()
    await primera
    expect(r.getState().entrada).toEqual([5, 4])
  })

  it('avanza, retrocede y no se sale de los límites', async () => {
    const r = await listo()
    r.getState().retroceder()
    expect(r.getState().indice).toBe(0)
    r.getState().avanzar()
    r.getState().avanzar()
    expect(r.getState().indice).toBe(2)
    r.getState().retroceder()
    expect(r.getState().indice).toBe(1)
    r.getState().irA(9999)
    expect(r.getState().indice).toBe(5)
    r.getState().avanzar()
    expect(r.getState().indice).toBe(5)
    r.getState().irA(-5)
    expect(r.getState().indice).toBe(0)
  })

  it('retroceder muestra exactamente el mismo paso que antes', async () => {
    const r = await listo()
    const { pasos } = r.getState()
    r.getState().irA(4)
    r.getState().retroceder()
    expect(r.getState().pasos[r.getState().indice]).toBe(pasos[3])
  })

  it('la reproducción se detiene sola al llegar al final y reinicia al volver a reproducir', async () => {
    const r = await listo()
    r.getState().alternar()
    expect(r.getState().reproduciendo).toBe(true)
    for (let i = 0; i < 10; i++) r.getState().avanzar()
    expect(r.getState().indice).toBe(5)
    expect(r.getState().reproduciendo).toBe(false)
    r.getState().alternar()
    expect(r.getState().indice).toBe(0)
    expect(r.getState().reproduciendo).toBe(true)
  })

  it('cargar una entrada nueva vuelve al primer paso', async () => {
    const r = await listo()
    r.getState().irA(3)
    await r.getState().cargar([9, 8, 7, 6])
    expect(r.getState().indice).toBe(0)
    expect(r.getState().entrada).toEqual([9, 8, 7, 6])
  })

  it('sin pasos, los controles no hacen nada', () => {
    const r = crearReproductor('insercion', { ejecutar: async () => trazaFalsa() })
    r.getState().alternar()
    r.getState().siguiente()
    r.getState().irA(3)
    expect(r.getState().reproduciendo).toBe(false)
    expect(r.getState().indice).toBe(0)
  })

  it('dos reproductores son independientes', async () => {
    const a = await listo()
    const b = await listo()
    a.getState().irA(3)
    expect(b.getState().indice).toBe(0)
  })
})

describe('lectura de la entrada', () => {
  it('acepta comas, espacios y saltos de línea', () => {
    expect(leerArreglo('5, 2 9\n1').valores).toEqual([5, 2, 9, 1])
  })

  it('rechaza entradas inválidas con una explicación', () => {
    expect(leerArreglo('').error).toBeTruthy()
    expect(leerArreglo('4').error).toBeTruthy()
    expect(leerArreglo('4, x').error).toMatch(/"x"/)
    expect(leerArreglo('4, 150').error).toMatch(/150/)
    expect(leerArreglo('4, -2').error).toBeTruthy()
    expect(leerArreglo('4, 2.5').error).toBeTruthy()
    expect(leerArreglo(Array(17).fill(1).join(',')).error).toMatch(/17/)
    expect(leerArreglo('4, 20', { valorMax: 15 }).error).toMatch(/20/)
  })

  it('valida el valor buscado', () => {
    expect(leerObjetivo(' 21 ').valor).toBe(21)
    expect(leerObjetivo('abc').error).toBeTruthy()
    expect(leerObjetivo('0').error).toBeTruthy()
  })
})
