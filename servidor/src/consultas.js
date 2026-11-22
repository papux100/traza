/**
 * Consultas SQL del servidor. Todo el acceso a la base de datos está aquí.
 *
 * El servidor se conecta con un usuario con permisos completos, así que las
 * reglas de acceso se aplican en estas consultas y en las rutas, no en RLS.
 * Todas usan parámetros ($1, $2) para evitar inyección de SQL.
 */

function aAlgoritmo(fila) {
  return {
    id: fila.id,
    nombre: fila.nombre,
    nombreCorto: fila.nombre_corto,
    familia: fila.familia,
    bloque: fila.bloque,
    intencion: fila.intencion,
    complejidad: { mejor: fila.complejidad_mejor, promedio: fila.complejidad_promedio, peor: fila.complejidad_peor },
    espacio: fila.espacio,
    estable: fila.estable,
    enSitio: fila.en_sitio,
    requisito: fila.requisito,
    publico: fila.publico,
  }
}

function aFicha(fila) {
  return {
    analogia: fila.analogia,
    comoFunciona: fila.como_funciona,
    requisitos: fila.requisitos,
    complejidad: fila.complejidad,
    usarlo: fila.usarlo,
    evitarlo: fila.evitarlo,
    implementacion: fila.implementacion,
    relaciones: fila.relaciones,
  }
}

export function crearConsultas(pool) {
  return {
    async comprobarConexion() {
      await pool.query('select 1')
    },

    async listarAlgoritmos() {
      const { rows } = await pool.query('select * from public.algoritmos order by orden')
      return rows.map(aAlgoritmo)
    },

    /** Devuelve { id, publico } o null si el algoritmo no está en el catálogo. */
    async buscarAlgoritmo(id) {
      const { rows } = await pool.query('select id, publico from public.algoritmos where id = $1', [id])
      return rows[0] ?? null
    },

    /**
     * Devuelve { existe, publico, ficha }. `ficha` es null si el algoritmo
     * existe pero todavía no tiene contenido.
     */
    async buscarFicha(id) {
      const { rows } = await pool.query(
        `select a.publico, f.*
           from public.algoritmos a
           left join public.fichas f on f.algoritmo_id = a.id
          where a.id = $1`,
        [id],
      )
      if (rows.length === 0) return { existe: false }
      const fila = rows[0]
      return { existe: true, publico: fila.publico, ficha: fila.algoritmo_id ? aFicha(fila) : null }
    },

    async buscarPerfil(idUsuario) {
      const { rows } = await pool.query('select nombre from public.perfiles where id = $1', [idUsuario])
      return rows[0] ?? null
    },
  }
}
