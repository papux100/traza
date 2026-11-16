import { Link } from 'react-router'
import { Ficha } from '@/componentes/ficha/Ficha'

export default function FichaBusquedaExponencial() {
  return (
    <Ficha
      id="busqueda-exponencial"
      analogia={
        <>
          <p>
            Perdiste algo en un camino largo y no sabes hasta dónde llegaste. Caminas un paso y miras; luego dos; luego
            cuatro; luego ocho. En cuanto ves que ya te pasaste, sabes que está en el último tramo que recorriste, y
            ahí sí buscas con cuidado.
          </p>
        </>
      }
      comoFunciona={
        <>
          <ol>
            <li>Revisa el primer elemento.</li>
            <li>
              Mira las posiciones 1, 2, 4, 8, 16… duplicando cada vez, mientras el elemento no sea mayor que el valor
              buscado.
            </li>
            <li>
              Al pasarse, el valor sólo puede estar entre la mitad de esa posición y la posición misma: el último
              tramo recorrido.
            </li>
            <li>Aplica búsqueda binaria en ese tramo.</li>
          </ol>
        </>
      }
      requisitos={
        <p>
          <strong>Los datos deben estar ordenados.</strong> A diferencia de la búsqueda binaria, no necesita conocer de
          antemano cuántos elementos hay: basta con poder preguntar si una posición existe.
        </p>
      }
      complejidad={
        <>
          <p>
            Si el valor está en la posición i, la fase de duplicar hace del orden de log i pasos y deja un tramo de
            tamaño parecido a i, que la búsqueda binaria resuelve en otros log i. El total depende de dónde está el
            valor, no del tamaño del arreglo.
          </p>
          <p>
            Por eso es muy rápida para valores cercanos al principio. En el peor caso, con el valor al final, iguala a
            la búsqueda binaria: log n.
          </p>
        </>
      }
      usarlo={[
        'No conoces el tamaño de los datos, o son una secuencia sin fin, como los resultados que va devolviendo un servicio.',
        'Es probable que el valor esté cerca del principio.',
      ]}
      evitarlo={[
        'Conoces el tamaño y el valor puede estar en cualquier parte. La binaria directa hace un poco menos de trabajo.',
        'Los datos no están ordenados.',
      ]}
      implementacion={[
        <>
          El tramo final va de <code>Math.floor(i / 2)</code> a <code>Math.min(i, n - 1)</code>. El mínimo evita leer
          fuera del arreglo cuando el último salto se pasó del final.
        </>,
        <>
          El primer elemento se revisa aparte, porque la duplicación empieza en la posición 1.
        </>,
        <>
          La fase de búsqueda binaria es la misma de su propia ficha, con el mismo cuidado para calcular el punto medio.
        </>,
      ]}
      relaciones={[
        {
          id: 'busqueda-binaria',
          texto: (
            <>
              La usa como segunda fase. La fase de duplicar sólo sirve para encontrar un tramo pequeño donde aplicar la{' '}
              <Link to="/algoritmos/busqueda-binaria">binaria</Link>.
            </>
          ),
        },
        {
          id: 'busqueda-saltos',
          texto: 'También avanza a saltos, pero de tamaño fijo, y termina revisando linealmente en lugar de con búsqueda binaria.',
        },
        {
          id: 'mezcla',
          texto:
            'Timsort, que se basa en la mezcla, usa esta misma idea en su modo de galope: cuando una mitad gana muchas veces seguidas, busca exponencialmente hasta dónde sigue ganando en vez de comparar uno por uno.',
        },
      ]}
    />
  )
}
