import { describe, expect, it } from 'vitest'
import { obtenerAlgoritmo } from '@/algoritmos/registro'
import { crearReproductor } from './reproductor'
import { leerArreglo, leerObjetivo } from './entrada'
import { marcarCodigo } from './traza'

describe('reproductor', () => {
  const nuevo = () => crearReproductor(obtenerAlgoritmo('insercion'), { entrada: [3, 1, 2] })

  it('empieza en el primer paso y en pausa', () => {
    const { indice, reproduciendo, pasos } = nuevo().getState()
    expect(indice).toBe(0)
    expect(reproduciendo).toBe(false)
    expect(pasos.length).toBeGreaterThan(2)
  })

  it('avanza, retrocede y no se sale de los límites', () => {
    const r = nuevo()
    r.getState().retroceder()
    expect(r.getState().indice).toBe(0)
    r.getState().avanzar()
    r.getState().avanzar()
    expect(r.getState().indice).toBe(2)
    r.getState().retroceder()
    expect(r.getState().indice).toBe(1)
    r.getState().irA(9999)
    expect(r.getState().indice).toBe(r.getState().pasos.length - 1)
    r.getState().avanzar()
    expect(r.getState().indice).toBe(r.getState().pasos.length - 1)
    r.getState().irA(-5)
    expect(r.getState().indice).toBe(0)
  })

  it('retroceder muestra exactamente el mismo paso que antes', () => {
    const r = nuevo()
    const { pasos } = r.getState()
    r.getState().irA(4)
    r.getState().retroceder()
    expect(r.getState().pasos[r.getState().indice]).toBe(pasos[3])
  })

  it('la reproducción se detiene sola al llegar al final y reinicia al volver a reproducir', () => {
    const r = nuevo()
    r.getState().alternar()
    expect(r.getState().reproduciendo).toBe(true)
    const total = r.getState().pasos.length
    for (let i = 0; i < total + 3; i++) r.getState().avanzar()
    expect(r.getState().indice).toBe(total - 1)
    expect(r.getState().reproduciendo).toBe(false)
    r.getState().alternar()
    expect(r.getState().indice).toBe(0)
    expect(r.getState().reproduciendo).toBe(true)
  })

  it('cargar una entrada nueva regenera la traza', () => {
    const r = nuevo()
    r.getState().irA(3)
    r.getState().cargar([9, 8, 7, 6])
    expect(r.getState().indice).toBe(0)
    expect(r.getState().pasos[0].elementos.map((e) => e.valor)).toEqual([9, 8, 7, 6])
  })

  it('dos reproductores son independientes', () => {
    const a = nuevo()
    const b = nuevo()
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
  })

  it('valida el valor buscado', () => {
    expect(leerObjetivo(' 21 ').valor).toBe(21)
    expect(leerObjetivo('abc').error).toBeTruthy()
    expect(leerObjetivo('0').error).toBeTruthy()
  })
})

describe('marcarCodigo', () => {
  it('quita las marcas y recuerda en qué línea estaban', () => {
    const { codigo, L } = marcarCodigo(`
function f() {
  return 1;   //@fin
}
`)
    expect(codigo).toBe('function f() {\n  return 1;\n}')
    expect(L).toEqual({ fin: 2 })
  })
})
