import { after, before, describe, it } from 'node:test'
import assert from 'node:assert/strict'
import { crearConsultas } from '../src/consultas.js'
import { crearPool } from '../src/db.js'

/**
 * Prueba las consultas contra una base de datos real con los scripts de
 * supabase/ ya ejecutados. Sólo corre si se define DATABASE_URL_PRUEBA.
 */
const url = process.env.DATABASE_URL_PRUEBA

describe('consultas contra PostgreSQL', { skip: !url && 'Define DATABASE_URL_PRUEBA para ejecutarla' }, () => {
  let pool
  let consultas
  before(() => {
    pool = crearPool({ urlBaseDeDatos: url, sslBaseDeDatos: false })
    consultas = crearConsultas(pool)
  })
  after(() => pool?.end())

  it('lista los 19 algoritmos en orden', async () => {
    const algoritmos = await consultas.listarAlgoritmos()
    assert.equal(algoritmos.length, 19)
    assert.equal(algoritmos[0].id, 'insercion')
    assert.deepEqual(Object.keys(algoritmos[0].complejidad), ['mejor', 'promedio', 'peor'])
    assert.equal(algoritmos.filter((a) => a.publico).length, 5)
  })

  it('trae una ficha completa', async () => {
    const r = await consultas.buscarFicha('quicksort')
    assert.equal(r.existe, true)
    assert.equal(r.publico, false)
    assert.ok(r.ficha.comoFunciona.includes('pivote'))
    assert.ok(Array.isArray(r.ficha.relaciones))
  })

  it('distingue un id inexistente', async () => {
    assert.deepEqual(await consultas.buscarFicha('no-existe'), { existe: false })
  })

  it('un intento de inyección se trata como texto', async () => {
    assert.deepEqual(await consultas.buscarFicha("x' or '1'='1"), { existe: false })
  })
})
