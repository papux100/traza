import { describe, expect, it } from 'vitest'
import { leerBloques, leerEnLinea } from './markdown'

describe('leerEnLinea', () => {
  it('reconoce código, negritas y enlaces', () => {
    expect(leerEnLinea('Usa `arr[j] > clave` y **no** [inserción](/algoritmos/insercion).')).toEqual([
      { tipo: 'texto', texto: 'Usa ' },
      { tipo: 'codigo', texto: 'arr[j] > clave' },
      { tipo: 'texto', texto: ' y ' },
      { tipo: 'negrita', hijos: [{ tipo: 'texto', texto: 'no' }] },
      { tipo: 'texto', texto: ' ' },
      { tipo: 'enlace', texto: 'inserción', url: '/algoritmos/insercion' },
      { tipo: 'texto', texto: '.' },
    ])
  })

  it('no convierte en enlace una dirección peligrosa', () => {
    expect(leerEnLinea('[clic](javascript:alert(1))')).toEqual([
      { tipo: 'texto', texto: 'clic' },
      { tipo: 'texto', texto: ')' },
    ])
    expect(leerEnLinea('[clic](javascript:void)')).toEqual([{ tipo: 'texto', texto: 'clic' }])
  })

  it('deja el HTML como texto', () => {
    expect(leerEnLinea('<img src=x onerror=alert(1)>')).toEqual([
      { tipo: 'texto', texto: '<img src=x onerror=alert(1)>' },
    ])
  })
})

describe('leerBloques', () => {
  it('separa párrafos y listas', () => {
    const bloques = leerBloques('Primer párrafo\nen dos líneas.\n\n1. Uno\n2. Dos\n\n- A\n- B')
    expect(bloques.map((b) => b.tipo)).toEqual(['parrafo', 'numerada', 'vinetas'])
    expect(bloques[0].fragmentos).toEqual([{ tipo: 'texto', texto: 'Primer párrafo en dos líneas.' }])
    expect(bloques[1].elementos).toHaveLength(2)
  })

  it('tolera texto vacío', () => {
    expect(leerBloques('')).toEqual([])
    expect(leerBloques(null)).toEqual([])
  })
})
