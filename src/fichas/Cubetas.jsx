import { Link } from 'react-router'
import { Ficha } from '@/componentes/ficha/Ficha'

export default function FichaCubetas() {
  return (
    <Ficha
      id="cubetas"
      analogia={
        <>
          <p>
            Una profesora tiene cien exámenes para ordenar por apellido. Primero los reparte en cinco montones: de la A
            a la E, de la F a la J, y así. Cada montón es pequeño y se ordena rápido. Al final apila los montones en
            orden y listo.
          </p>
          <p>
            El truco funciona si los apellidos están repartidos de forma pareja. Si casi todos empiezan con la misma
            letra, un montón se queda con casi todo y el reparto no sirvió de nada.
          </p>
        </>
      }
      comoFunciona={
        <>
          <ol>
            <li>Divide el intervalo de valores en partes iguales, una por cubeta. Aquí se usan cinco.</li>
            <li>Recorre el arreglo y pon cada elemento en la cubeta del intervalo al que pertenece.</li>
            <li>
              Ordena cada cubeta por separado. Como suelen ser pequeñas, se usa{' '}
              <Link to="/algoritmos/insercion">inserción</Link>.
            </li>
            <li>Vacía las cubetas en orden. Todo lo de una cubeta es menor que lo de la siguiente.</li>
          </ol>
          <p>
            Prueba con <code>3, 5, 2, 8, 4, 6, 99</code>: el 99 obliga a que los intervalos sean amplios, y todos los
            demás valores caen en la primera cubeta.
          </p>
        </>
      }
      requisitos={
        <p>
          Hay que poder calcular a qué cubeta va cada elemento a partir de su valor, así que funciona con números. Y,
          sobre todo, rinde bien sólo si los valores están repartidos de manera uniforme dentro de su intervalo.
        </p>
      }
      complejidad={
        <>
          <p>
            Si los datos son uniformes, cada cubeta recibe pocos elementos y ordenarlas es barato. Con k cubetas, el
            costo esperado es del orden de n + k.
          </p>
          <p>
            Si los datos se amontonan, una cubeta puede recibir casi todo, y ordenarla con inserción cuesta n². Es el
            ejemplo más claro del catálogo de un algoritmo cuyo rendimiento depende de cómo vienen los datos, no sólo
            de cuántos son.
          </p>
          <p>Es estable siempre que el ordenamiento interno lo sea, como lo es inserción.</p>
        </>
      }
      usarlo={[
        'Los valores se reparten de forma pareja en un intervalo conocido, como números aleatorios uniformes.',
        'Ordenas números decimales en un rango fijo, por ejemplo entre 0 y 1.',
      ]}
      evitarlo={[
        'Los datos se concentran en una zona o tienen valores extremos que estiran el intervalo.',
        'No conoces la distribución de los datos y necesitas un tiempo predecible.',
      ]}
      implementacion={[
        <>
          La cubeta se calcula con <code>Math.floor((valor * k) / (max + 1))</code>. Sumar uno al máximo evita que el
          mayor valor caiga en una cubeta inexistente.
        </>,
        <>
          La cantidad de cubetas es una decisión de diseño. Lo habitual es usar tantas como elementos, para que cada
          una reciba uno en promedio.
        </>,
        <>
          Si el ordenamiento interno no es estable, el algoritmo completo tampoco lo será.
        </>,
      ]}
      relaciones={[
        {
          id: 'conteo',
          texto:
            'Si cada cubeta corresponde a un solo valor, ya no hace falta ordenarlas: eso es el ordenamiento por conteo.',
        },
        {
          id: 'residuos',
          texto: 'También reparte en cubetas, pero según una cifra a la vez y sin ordenar el interior de cada cubeta.',
        },
        {
          id: 'busqueda-interpolacion',
          texto:
            'Comparten la misma apuesta: que los valores estén repartidos de forma pareja. Cuando lo están, ambos aprovechan la magnitud para saltar directo a la zona correcta.',
        },
      ]}
    />
  )
}
