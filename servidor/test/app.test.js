import { after, before, describe, it } from 'node:test'
import assert from 'node:assert/strict'
import { crearApp } from '../src/app.js'
import { todasLasVistas } from '../src/rutas/vistasPrevias.js'

/** Datos y dependencias falsos: así se prueban las rutas sin base de datos real. */
const ALGORITMOS = [
  { id: 'insercion', nombre: 'Inserción', publico: true },
  { id: 'quicksort', nombre: 'Quicksort', publico: false },
  { id: 'vacio', nombre: 'Sin ficha', publico: false },
  { id: 'conteo', nombre: 'Conteo', publico: false },
  { id: 'busqueda-binaria', nombre: 'Búsqueda binaria', publico: true },
]
const FICHA = {
  analogia: 'a',
  comoFunciona: 'b',
  requisitos: 'c',
  complejidad: 'd',
  usarlo: ['e'],
  evitarlo: ['f'],
  implementacion: ['g'],
  relaciones: [{ id: 'burbuja', texto: 'h' }],
  campoInterno: 'no debe salir',
}

const consultas = {
  comprobarConexion: async () => {},
  listarAlgoritmos: async () => ALGORITMOS.map((a) => ({ ...a, secreto: 'no debe salir' })),
  buscarFicha: async (id) => {
    const a = ALGORITMOS.find((x) => x.id === id)
    if (!a) return { existe: false }
    return { existe: true, publico: a.publico, ficha: id === 'vacio' ? null : FICHA }
  },
  buscarAlgoritmo: async (id) => {
    const a = ALGORITMOS.find((x) => x.id === id)
    return a ? { id: a.id, publico: a.publico } : null
  },
  buscarPerfil: async (id) => (id === 'u1' ? { nombre: 'Ana Torres' } : null),
}

const tokens = { 'token-valido': { id: 'u1', correo: 'ana@correo.com' } }
let verificaciones = 0
const verificarToken = async (token) => {
  verificaciones++
  return tokens[token] ?? null
}

let app
before(async () => {
  app = await crearApp({ consultas, verificarToken, origenesPermitidos: ['http://localhost:5173'] })
})
after(() => app.close())

const pedir = (url, token) =>
  app.inject({ method: 'GET', url, headers: token ? { authorization: `Bearer ${token}` } : {} })

describe('GET /api/algoritmos', () => {
  it('devuelve el catálogo sin campos que no estén en el esquema', async () => {
    const r = await pedir('/api/algoritmos')
    assert.equal(r.statusCode, 200)
    const { algoritmos } = r.json()
    assert.equal(algoritmos.length, ALGORITMOS.length)
    assert.equal(algoritmos[0].secreto, undefined)
  })
})

describe('GET /api/fichas/:id', () => {
  it('una ficha pública se ve sin sesión, sin verificar ningún token', async () => {
    verificaciones = 0
    const r = await pedir('/api/fichas/insercion')
    assert.equal(r.statusCode, 200)
    assert.equal(r.json().ficha.analogia, 'a')
    assert.equal(r.json().ficha.campoInterno, undefined)
    assert.equal(verificaciones, 0)
  })

  it('una ficha privada sin sesión responde 401 requiere_cuenta', async () => {
    const r = await pedir('/api/fichas/quicksort')
    assert.equal(r.statusCode, 401)
    assert.equal(r.json().codigo, 'requiere_cuenta')
  })

  it('una ficha privada con un token falso responde 401', async () => {
    const r = await pedir('/api/fichas/quicksort', 'token-inventado')
    assert.equal(r.statusCode, 401)
  })

  it('una ficha privada con sesión válida se ve', async () => {
    const r = await pedir('/api/fichas/quicksort', 'token-valido')
    assert.equal(r.statusCode, 200)
    assert.equal(r.json().ficha.comoFunciona, 'b')
  })

  it('un algoritmo que no existe responde 404', async () => {
    const r = await pedir('/api/fichas/no-existe')
    assert.equal(r.statusCode, 404)
    assert.equal(r.json().codigo, 'no_encontrado')
  })

  it('un algoritmo sin contenido responde 404 sin_contenido', async () => {
    const r = await pedir('/api/fichas/vacio', 'token-valido')
    assert.equal(r.statusCode, 404)
    assert.equal(r.json().codigo, 'sin_contenido')
  })

  it('rechaza ids con caracteres no permitidos', async () => {
    for (const id of ["insercion'%20or%201=1", 'MAYUSCULAS', 'a'.repeat(60)]) {
      const r = await pedir(`/api/fichas/${id}`)
      assert.equal(r.statusCode, 400, id)
      assert.equal(r.json().codigo, 'peticion_invalida')
    }
  })
})

const ejecutar = (id, cuerpo, { token, encabezados = {} } = {}) =>
  app.inject({
    method: 'POST',
    url: `/api/algoritmos/${id}/ejecucion`,
    payload: cuerpo,
    headers: { ...(token ? { authorization: `Bearer ${token}` } : {}), ...encabezados },
  })

describe('POST /api/algoritmos/:id/ejecucion', () => {
  it('sin entrada usa los datos de ejemplo y devuelve el código y los pasos', async () => {
    const r = await ejecutar('insercion', {})
    assert.equal(r.statusCode, 200)
    const cuerpo = r.json()
    assert.deepEqual(cuerpo.entrada, [5, 2, 9, 1, 7, 3, 8])
    assert.deepEqual(cuerpo.resultado, [1, 2, 3, 5, 7, 8, 9])
    assert.ok(cuerpo.algoritmo.codigo.includes('function insercion'))
    assert.equal(cuerpo.algoritmo.familia, 'ordenamiento')
    assert.ok(cuerpo.pasos.length > 10)
    const ultimo = cuerpo.pasos.at(-1)
    assert.deepEqual(ultimo.elementos.map((e) => e.valor), [1, 2, 3, 5, 7, 8, 9])
    assert.ok(ultimo.estados.every((e) => e === 'ordenado'))
    assert.equal(typeof ultimo.contadores.comparaciones, 'number')
  })

  it('ejecuta con la entrada que manda el usuario', async () => {
    const r = await ejecutar('insercion', { entrada: [3, 1, 2] })
    assert.deepEqual(r.json().resultado, [1, 2, 3])
  })

  it('una búsqueda usa el valor buscado y ordena la entrada si lo necesita', async () => {
    const r = await ejecutar('busqueda-binaria', { entrada: [40, 7, 22, 15, 3], objetivo: 22 })
    const cuerpo = r.json()
    assert.equal(cuerpo.algoritmo.ordenaEntrada, true)
    assert.equal(cuerpo.resultado, 3)
    assert.equal(cuerpo.objetivo, 22)
  })

  it('un algoritmo privado sin sesión responde 401 y no ejecuta nada', async () => {
    const r = await ejecutar('quicksort', {})
    assert.equal(r.statusCode, 401)
    assert.equal(r.json().codigo, 'requiere_cuenta')
    assert.equal(r.json().pasos, undefined)
  })

  it('un algoritmo privado con sesión se ejecuta, y conserva la zona auxiliar', async () => {
    const r = await ejecutar('conteo', { entrada: [3, 1, 2] }, { token: 'token-valido' })
    assert.equal(r.statusCode, 200)
    const conAuxiliar = r.json().pasos.find((p) => p.auxiliar)
    assert.equal(conAuxiliar.auxiliar.tipo, 'conteo')
    assert.ok(Array.isArray(conAuxiliar.auxiliar.celdas))
  })

  it('rechaza entradas inválidas', async () => {
    const malas = [
      { entrada: [1] },
      { entrada: Array(17).fill(1) },
      { entrada: [1, 100] },
      { entrada: [1, 0] },
      { entrada: [1, 2.5] },
      { entrada: [1, 'x'] },
      { entrada: 'hola' },
      { entrada: [1, 2], objetivo: 500 },
    ]
    for (const cuerpo of malas) {
      const r = await ejecutar('insercion', cuerpo)
      assert.equal(r.statusCode, 400, JSON.stringify(cuerpo))
      assert.equal(r.json().codigo, 'peticion_invalida')
    }
  })

  it('descarta los campos que no están en el esquema', async () => {
    const r = await ejecutar('insercion', { entrada: [2, 1], extra: 'ignorado' })
    assert.equal(r.statusCode, 200)
    assert.deepEqual(r.json().resultado, [1, 2])
  })

  it('respeta el valor máximo propio de cada algoritmo', async () => {
    const r = await ejecutar('conteo', { entrada: [3, 20] }, { token: 'token-valido' })
    assert.equal(r.statusCode, 400)
    assert.equal(r.json().codigo, 'entrada_invalida')
  })

  it('un algoritmo inexistente responde 404', async () => {
    assert.equal((await ejecutar('no-existe', {})).statusCode, 404)
    // Existe en el catálogo de la base de datos pero no hay implementación.
    assert.equal((await ejecutar('vacio', {}, { token: 'token-valido' })).statusCode, 404)
  })

  it('una petición sin cuerpo o con JSON roto responde 400', async () => {
    const sinCuerpo = await app.inject({ method: 'POST', url: '/api/algoritmos/insercion/ejecucion' })
    assert.equal(sinCuerpo.statusCode, 400)
    const roto = await app.inject({
      method: 'POST',
      url: '/api/algoritmos/insercion/ejecucion',
      payload: '{"entrada": [1,',
      headers: { 'content-type': 'application/json' },
    })
    assert.equal(roto.statusCode, 400)
  })

  it('comprime la respuesta si el navegador lo acepta', async () => {
    const r = await ejecutar('insercion', {}, { encabezados: { 'accept-encoding': 'gzip' } })
    assert.equal(r.headers['content-encoding'], 'gzip')
  })

  it('CORS permite el POST desde los orígenes configurados', async () => {
    const r = await app.inject({
      method: 'OPTIONS',
      url: '/api/algoritmos/insercion/ejecucion',
      headers: {
        origin: 'http://localhost:5173',
        'access-control-request-method': 'POST',
        'access-control-request-headers': 'content-type,authorization',
      },
    })
    assert.equal(r.statusCode, 204)
    assert.match(r.headers['access-control-allow-methods'], /POST/)
  })
})

describe('GET /api/perfil', () => {
  it('sin sesión responde 401', async () => {
    assert.equal((await pedir('/api/perfil')).statusCode, 401)
  })

  it('con sesión devuelve el nombre', async () => {
    const r = await pedir('/api/perfil', 'token-valido')
    assert.equal(r.statusCode, 200)
    assert.deepEqual(r.json().perfil, { id: 'u1', correo: 'ana@correo.com', nombre: 'Ana Torres' })
  })
})

describe('GET /api/vistas-previas', () => {
  it('sin sesión sólo entrega las miniaturas de los algoritmos públicos', async () => {
    const r = await pedir('/api/vistas-previas')
    assert.equal(r.statusCode, 200)
    assert.deepEqual(Object.keys(r.json().vistas).sort(), ['busqueda-binaria', 'insercion'])
    assert.match(r.headers['cache-control'], /private/)
    assert.match(r.headers.vary, /Authorization/)
  })

  it('con un token falso se trata como sin sesión', async () => {
    const { vistas } = (await pedir('/api/vistas-previas', 'token-falso')).json()
    assert.deepEqual(Object.keys(vistas).sort(), ['busqueda-binaria', 'insercion'])
  })

  it('con sesión entrega todas las del catálogo', async () => {
    const { vistas } = (await pedir('/api/vistas-previas', 'token-valido')).json()
    // 'vacio' está en el catálogo falso pero no es un algoritmo real, así que no tiene miniatura.
    assert.deepEqual(Object.keys(vistas).sort(), ['busqueda-binaria', 'conteo', 'insercion', 'quicksort'])
  })

  it('cada uno de los 19 algoritmos tiene una miniatura bien formada', () => {
    const vistas = todasLasVistas()
    assert.equal(Object.keys(vistas).length, 19)
    for (const [id, vista] of Object.entries(vistas)) {
      assert.ok(vista.cuadros.length >= 2, id)
      assert.ok(vista.cuadros.length <= 61, id)
      for (const cuadro of vista.cuadros) assert.equal(cuadro.v.length, cuadro.e.length, id)
    }
  })

  it('sólo lleva alturas y estados: nada del código ni de los textos', async () => {
    const { vistas } = (await pedir('/api/vistas-previas', 'token-valido')).json()
    for (const vista of Object.values(vistas)) {
      assert.deepEqual(Object.keys(vista).sort(), ['cuadros', 'familia'])
      for (const cuadro of vista.cuadros) assert.deepEqual(Object.keys(cuadro).sort(), ['e', 'v'])
    }
  })

  it('el último cuadro de un ordenamiento queda ordenado', () => {
    for (const [id, vista] of Object.entries(todasLasVistas())) {
      if (vista.familia !== 'ordenamiento') continue
      const ultimo = vista.cuadros.at(-1).v
      assert.deepEqual(ultimo, [...ultimo].sort((a, b) => a - b), id)
    }
  })
})

describe('otros', () => {
  it('salud', async () => {
    assert.equal((await pedir('/api/salud')).json().estado, 'ok')
  })

  it('una ruta inexistente responde 404 en JSON', async () => {
    const r = await pedir('/api/nada')
    assert.equal(r.statusCode, 404)
    assert.equal(r.json().codigo, 'ruta_inexistente')
  })

  it('CORS sólo autoriza los orígenes configurados', async () => {
    const permitido = await app.inject({ method: 'GET', url: '/api/algoritmos', headers: { origin: 'http://localhost:5173' } })
    assert.equal(permitido.headers['access-control-allow-origin'], 'http://localhost:5173')
    const ajeno = await app.inject({ method: 'GET', url: '/api/algoritmos', headers: { origin: 'https://sitio-ajeno.com' } })
    assert.equal(ajeno.headers['access-control-allow-origin'], undefined)
  })

  it('si la base de datos falla, responde 500 sin detalles internos', async () => {
    const roto = await crearApp({
      consultas: { ...consultas, listarAlgoritmos: async () => { throw new Error('password authentication failed') } },
      verificarToken,
    })
    const r = await roto.inject({ method: 'GET', url: '/api/algoritmos' })
    assert.equal(r.statusCode, 500)
    assert.ok(!r.body.includes('password'))
    await roto.close()
  })

  it('limita las peticiones por IP', async () => {
    const limitada = await crearApp({ consultas, verificarToken })
    let ultima
    for (let i = 0; i < 121; i++) ultima = await limitada.inject({ method: 'GET', url: '/api/salud' })
    assert.equal(ultima.statusCode, 429)
    assert.equal(ultima.json().codigo, 'demasiadas_peticiones')
    await limitada.close()
  })
})
