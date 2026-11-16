import { Ficha } from '@/componentes/ficha/Ficha'

export default function FichaBusquedaInterpolacion() {
  return (
    <Ficha
      id="busqueda-interpolacion"
      analogia={
        <>
          <p>
            Si buscas el apellido Zamora en un directorio, no lo abres a la mitad: lo abres cerca del final, porque la
            Z está al final del alfabeto. Si buscas Bravo, lo abres cerca del principio.
          </p>
          <p>
            No usas sólo el orden de los datos, sino también su valor, para adivinar dónde están.
          </p>
        </>
      }
      comoFunciona={
        <>
          <p>Funciona como la búsqueda binaria, pero cambia la forma de elegir qué posición mirar.</p>
          <ol>
            <li>Toma el primer y el último valor del rango de búsqueda.</li>
            <li>
              Calcula qué fracción del camino entre esos dos valores representa el valor buscado. Si está a un 70 % del
              camino, estima que su posición también está a un 70 % del rango.
            </li>
            <li>Mira el elemento en esa posición estimada.</li>
            <li>Si es el buscado, terminaste. Si es menor, el rango continúa a la derecha; si es mayor, a la izquierda.</li>
            <li>Si el valor buscado queda fuera del intervalo de valores del rango, no está.</li>
          </ol>
          <p>
            Con la entrada de ejemplo, repartida de forma pareja, encuentra el valor al primer intento; la búsqueda
            binaria necesitaría cuatro. Prueba
            ahora con <code>1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 99</code> buscando el 15: el 99 deforma
            la estimación y la búsqueda avanza casi de uno en uno.
          </p>
        </>
      }
      requisitos={
        <>
          <p>
            <strong>Los datos deben estar ordenados y ser numéricos</strong>, o al menos convertibles a un número con
            el que tenga sentido hacer la cuenta.
          </p>
          <p>
            Para que rinda, además, deben estar repartidos de forma más o menos uniforme. Ese requisito no impide que
            funcione: sólo determina si va a ser rápida o lenta.
          </p>
        </>
      }
      complejidad={
        <>
          <p>
            Con datos uniformes, cada estimación cae tan cerca que el rango se reduce muchísimo más que a la mitad. En
            promedio necesita del orden de log log n intentos: para mil millones de elementos, unos cinco.
          </p>
          <p>
            Con datos muy disparejos, la estimación puede quedar siempre del mismo lado del valor y descartar un solo
            elemento por intento. En ese peor caso es tan lenta como la búsqueda lineal.
          </p>
        </>
      }
      usarlo={[
        'Los datos son números ordenados y repartidos de forma pareja, como identificadores consecutivos con algunos huecos.',
        'El arreglo es muy grande y cada acceso es caro, de modo que ahorrar intentos vale la pena.',
      ]}
      evitarlo={[
        'No sabes cómo están repartidos los datos y necesitas un tiempo predecible. La binaria garantiza log n.',
        'Los valores crecen de forma muy desigual, por ejemplo duplicándose.',
        'Los datos no son numéricos.',
      ]}
      implementacion={[
        <>
          Antes de dividir hay que comprobar que <code>arr[sup]</code> y <code>arr[inf]</code> sean distintos. Si son
          iguales, la fórmula divide entre cero.
        </>,
        <>
          La condición del ciclo también verifica que el valor esté dentro del intervalo{' '}
          <code>arr[inf]..arr[sup]</code>. Sin ella, la posición estimada podría caer fuera del arreglo.
        </>,
        <>
          La multiplicación de la fórmula puede desbordarse en lenguajes con enteros de tamaño fijo cuando los valores
          y el arreglo son grandes.
        </>,
      ]}
      relaciones={[
        {
          id: 'busqueda-binaria',
          texto:
            'Es la binaria con una estimación más inteligente del punto a mirar. Gana con datos uniformes y pierde, a veces por mucho, con datos disparejos.',
        },
        {
          id: 'cubetas',
          texto:
            'Hace la misma apuesta que el ordenamiento por cubetas: usar la magnitud del valor para saltar directo a la zona correcta. Ambos dependen de que los datos sean uniformes.',
        },
        {
          id: 'busqueda-lineal',
          texto: 'Es la referencia de su peor caso: con datos muy disparejos, interpolación termina revisando casi uno por uno.',
        },
      ]}
    />
  )
}
