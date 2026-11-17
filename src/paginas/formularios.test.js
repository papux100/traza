import { describe, expect, it } from 'vitest'
import { destinoTrasEntrar, validarCuenta } from './formularios'

describe('validarCuenta', () => {
  it('acepta datos correctos', () => {
    expect(validarCuenta({ nombre: 'Ana', correo: 'ana@correo.com', contrasena: '12345678' }, { conNombre: true })).toEqual({})
  })

  it('explica cada campo inválido', () => {
    const errores = validarCuenta({ nombre: ' ', correo: 'ana', contrasena: '123' }, { conNombre: true })
    expect(Object.keys(errores).sort()).toEqual(['contrasena', 'correo', 'nombre'])
  })

  it('al iniciar sesión no pide nombre ni largo mínimo', () => {
    expect(validarCuenta({ nombre: '', correo: 'ana@correo.com', contrasena: '1' }, { conNombre: false })).toEqual({})
  })
})

describe('destinoTrasEntrar', () => {
  it('vuelve a la página de origen, salvo las de cuenta', () => {
    expect(destinoTrasEntrar({ desde: '/algoritmos/quicksort' })).toBe('/algoritmos/quicksort')
    expect(destinoTrasEntrar({ desde: '/entrar' })).toBe('/')
    expect(destinoTrasEntrar(null)).toBe('/')
  })
})
