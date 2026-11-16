import { Link } from 'react-router'
import { Ficha } from '@/componentes/ficha/Ficha'

export default function FichaCoctelera() {
  return (
    <Ficha
      id="coctelera"
      analogia={
        <>
          <p>
            Para que la arena de un frasco se acomode, no lo agitas siempre en el mismo sentido: lo mueves hacia un
            lado y luego hacia el otro. Cada movimiento empuja algo a su sitio.
          </p>
          <p>
            Coctelera hace lo mismo con burbuja: una pasada hacia la derecha y otra hacia la izquierda, alternando,
            como quien agita una coctelera.
          </p>
        </>
      }
      comoFunciona={
        <>
          <p>
            En <Link to="/algoritmos/burbuja">burbuja</Link>, los valores grandes avanzan muy rápido hacia el final,
            pero los pequeños que están al final retroceden una sola posición por pasada. A esos elementos lentos se
            les suele llamar tortugas. Coctelera ataca justo ese problema.
          </p>
          <ol>
            <li>De ida, recorre de izquierda a derecha intercambiando vecinos en desorden. El mayor llega al final.</li>
            <li>De vuelta, recorre de derecha a izquierda. El menor llega al principio.</li>
            <li>Cada recorrido fija un elemento en un extremo, así que el tramo pendiente se encoge por ambos lados.</li>
            <li>En cuanto un recorrido termina sin intercambios, el arreglo está ordenado.</li>
          </ol>
          <p>
            La entrada de ejemplo tiene dos tortugas, el 2 y el 1, al final. Prueba la misma entrada en burbuja y
            compara cuántos pasos necesita cada uno.
          </p>
        </>
      }
      requisitos={<p>Ninguno. Sólo compara e intercambia elementos vecinos.</p>}
      complejidad={
        <>
          <p>
            Sigue siendo cuadrático en el caso promedio y en el peor. La mejora frente a burbuja es real pero
            moderada: suele necesitar menos pasadas, aunque no cambia la forma en que crece el trabajo.
          </p>
          <p>
            Con un arreglo ya ordenado basta una pasada de ida sin intercambios para terminar, igual que en burbuja.
          </p>
        </>
      }
      usarlo={[
        'Quieres mostrar cómo una idea simple corrige un defecto concreto de otro algoritmo.',
        'Los datos están casi ordenados pero tienen algunos elementos pequeños cerca del final.',
      ]}
      evitarlo={[
        'En casi cualquier caso real. Inserción es igual de sencilla y hace menos trabajo.',
        'El arreglo es grande. Sigue siendo cuadrático.',
      ]}
      implementacion={[
        <>
          Hay que mover los dos límites: <code>fin</code> baja después de cada ida y <code>inicio</code> sube después
          de cada vuelta. Así no se vuelve a revisar lo que ya quedó fijo en los extremos.
        </>,
        <>
          Revisar la bandera después de la ida permite terminar sin hacer una vuelta innecesaria.
        </>,
        <>Como en burbuja, la comparación estricta mantiene el algoritmo estable.</>,
      ]}
      relaciones={[
        {
          id: 'burbuja',
          texto: 'Es burbuja con recorridos alternados. Comparte su estabilidad, su sencillez y su costo cuadrático.',
        },
        {
          id: 'peine',
          texto:
            'Resuelve el mismo problema de las tortugas de otra forma: comparando elementos lejanos para que los pequeños avancen muchas posiciones de golpe. Funciona mucho mejor.',
        },
        {
          id: 'insercion',
          texto: 'Para los mismos casos en que coctelera ayuda, inserción suele ser más rápida.',
        },
      ]}
    />
  )
}
