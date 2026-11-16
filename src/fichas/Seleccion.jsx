import { Ficha } from '@/componentes/ficha/Ficha'

export default function FichaSeleccion() {
  return (
    <Ficha
      id="seleccion"
      analogia={
        <>
          <p>
            Imagina que acomodas libros en un estante por tamaño. Recorres con la vista todos los que están sin
            acomodar, localizas el más pequeño y lo pones en el primer lugar libre. Luego repites con los que quedan.
          </p>
          <p>
            Miras mucho y mueves poco: cada libro se levanta una sola vez, directo a su lugar definitivo.
          </p>
        </>
      }
      comoFunciona={
        <>
          <ol>
            <li>Supón que el primer elemento sin ordenar es el menor.</li>
            <li>Recorre el resto del arreglo. Cada vez que encuentres uno más pequeño, ese pasa a ser el menor.</li>
            <li>Al terminar el recorrido, intercambia el menor con el primer elemento sin ordenar.</li>
            <li>La parte ordenada creció una posición. Repite con lo que queda.</li>
          </ol>
          <p>
            Cuando sólo queda un elemento sin ordenar, forzosamente es el mayor y ya está en su lugar.
          </p>
        </>
      }
      requisitos={<p>Ninguno. Funciona con cualquier arreglo de elementos comparables.</p>}
      complejidad={
        <>
          <p>
            Hace exactamente las mismas comparaciones sin importar la entrada: para encontrar el menor tiene que
            revisar todos los que faltan, aunque el arreglo ya esté ordenado. Por eso su mejor caso es igual de
            costoso que el peor.
          </p>
          <p>
            A cambio, hace muy pocos movimientos: como máximo un intercambio por vuelta, es decir, n − 1 en total.
            Ningún otro algoritmo de este bloque mueve tan poco los datos.
          </p>
          <p>
            No es estable. El intercambio puede hacer que un elemento salte por encima de otro igual a él. Pruébalo en
            el visualizador con <code>3, 3, 1</code>: el primer 3 termina después del segundo.
          </p>
        </>
      }
      usarlo={[
        'Escribir en el arreglo es mucho más caro que leer, por ejemplo en memorias que se desgastan con cada escritura.',
        'El arreglo es pequeño y quieres un comportamiento totalmente predecible: siempre tarda lo mismo.',
      ]}
      evitarlo={[
        'Los datos ya están casi ordenados. Selección no lo aprovecha; inserción sí.',
        'Necesitas conservar el orden relativo de los elementos iguales.',
        'El arreglo es grande. Sigue siendo cuadrático.',
      ]}
      implementacion={[
        <>
          Guarda la posición del menor, no su valor. Al final necesitas saber dónde está para hacer el intercambio.
        </>,
        <>
          La comprobación <code>min !== i</code> evita intercambiar un elemento consigo mismo cuando ya estaba en su
          lugar.
        </>,
        <>
          El ciclo exterior termina en <code>arr.length - 1</code>: el último elemento queda acomodado por descarte.
        </>,
      ]}
      relaciones={[
        {
          id: 'insercion',
          texto:
            'Son opuestos en lo que ahorran. Inserción ahorra comparaciones cuando la entrada ayuda, pero mueve mucho. Selección compara siempre lo máximo, pero casi no mueve. Además, inserción es estable y selección no.',
        },
        {
          id: 'burbuja',
          texto:
            'Ambos fijan un elemento por pasada. Burbuja arrastra el mayor hasta el final a base de intercambios; selección localiza el menor y lo coloca con uno solo.',
        },
        {
          id: 'monticulos',
          texto:
            'Es la misma idea, extraer repetidamente el extremo de lo que falta, pero con una estructura que permite encontrarlo sin recorrer todo. Esa diferencia baja el costo de n² a n log n.',
        },
      ]}
    />
  )
}
