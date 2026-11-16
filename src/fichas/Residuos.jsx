import { Link } from 'react-router'
import { Ficha } from '@/componentes/ficha/Ficha'

export default function FichaResiduos() {
  return (
    <Ficha
      id="residuos"
      analogia={
        <>
          <p>
            Tienes un montón de fechas para ordenar. Primero las acomodas por día. Luego, sin desordenar lo anterior,
            por mes. Por último, por año. Al terminar están en orden cronológico, aunque nunca comparaste dos fechas
            completas.
          </p>
          <p>
            Las máquinas clasificadoras de tarjetas perforadas trabajaban así: separaban las tarjetas por una columna,
            se volvían a apilar en orden y se pasaban de nuevo por la siguiente columna.
          </p>
        </>
      }
      comoFunciona={
        <>
          <p>Esta es la versión que empieza por la cifra menos significativa, la de las unidades.</p>
          <ol>
            <li>Prepara diez cubetas, una por cada dígito del 0 al 9.</li>
            <li>
              Recorre el arreglo y pon cada elemento al final de la cubeta que corresponde a su cifra de las unidades.
            </li>
            <li>Vacía las cubetas en orden, de la 0 a la 9, respetando el orden en que entró cada elemento.</li>
            <li>Repite con las decenas, luego con las centenas, hasta pasar por todas las cifras del mayor valor.</li>
          </ol>
          <p>
            En el visualizador, la cifra que decide la cubeta aparece subrayada en cada elemento. Después de la
            primera pasada, el arreglo está ordenado sólo por unidades; después de la segunda, ya está ordenado por
            completo.
          </p>
        </>
      }
      requisitos={
        <p>
          Los valores deben poder descomponerse en cifras o en partes que se comparan por separado: enteros, códigos
          de longitud fija, fechas. Además, cada pasada tiene que ser estable, o el orden logrado en las cifras
          anteriores se pierde.
        </p>
      }
      complejidad={
        <>
          <p>
            Cada pasada recorre los n elementos y las b cubetas, con b = 10 en base diez. Hay d pasadas, una por cifra.
            El costo es d·(n + b), con cualquier entrada.
          </p>
          <p>
            Si la cantidad de cifras es pequeña y fija, el costo crece de forma lineal con n. Por eso, para millones
            de enteros de tamaño acotado, puede superar a cualquier algoritmo basado en comparaciones.
          </p>
        </>
      }
      usarlo={[
        'Ordenas muchos enteros, o claves de longitud fija como códigos postales, matrículas o direcciones IP.',
        'Las claves tienen pocas cifras en comparación con la cantidad de elementos.',
      ]}
      evitarlo={[
        'Los valores tienen muchas cifras o longitudes muy distintas.',
        'Los datos son decimales o textos de longitud variable y no hay una forma natural de partirlos.',
        'La memoria es escasa: las cubetas llegan a contener todos los elementos.',
      ]}
      implementacion={[
        <>
          La cifra se obtiene con <code>Math.floor(valor / cifra) % 10</code>, donde <code>cifra</code> vale 1, 10,
          100… en cada pasada.
        </>,
        <>
          Cada elemento se agrega al final de su cubeta y las cubetas se vacían desde el principio. Si se invirtiera
          ese orden, la pasada dejaría de ser estable y el resultado sería incorrecto.
        </>,
        <>
          Con números negativos hay que tratarlos aparte, o desplazar todos los valores para que empiecen en cero.
        </>,
      ]}
      relaciones={[
        {
          id: 'conteo',
          texto:
            'Cada pasada puede hacerse con ordenamiento por conteo en lugar de cubetas. Es la forma más común en implementaciones reales, porque evita crear listas.',
        },
        {
          id: 'cubetas',
          texto:
            'Los dos reparten en cubetas, pero con criterios distintos. Residuos usa una cifra y nunca ordena dentro de las cubetas; cubetas usa la magnitud completa y sí las ordena.',
        },
        {
          id: 'quicksort',
          texto: (
            <>
              Para datos generales, <Link to="/algoritmos/quicksort">quicksort</Link> sigue siendo la opción por
              defecto. Residuos gana sólo cuando las claves tienen la forma adecuada.
            </>
          ),
        },
      ]}
    />
  )
}
