-- Contenido del catálogo: los 19 algoritmos y sus fichas.
-- Ejecútalo en el SQL Editor de Supabase después de 01-esquema.sql.

begin;

insert into public.algoritmos (id, nombre, nombre_corto, familia, bloque, orden, intencion, complejidad_mejor, complejidad_promedio, complejidad_peor, espacio, estable, en_sitio, requisito, publico) values ('insercion', 'Ordenamiento por inserción', 'Inserción', 'ordenamiento', 'cuadraticos', 1, 'Toma los elementos uno por uno y encaja cada uno en su lugar dentro de la parte que ya está ordenada.', 'O(n)', 'O(n²)', 'O(n²)', 'O(1)', true, true, null, true);
insert into public.algoritmos (id, nombre, nombre_corto, familia, bloque, orden, intencion, complejidad_mejor, complejidad_promedio, complejidad_peor, espacio, estable, en_sitio, requisito, publico) values ('insercion-binaria', 'Inserción binaria', 'Inserción binaria', 'ordenamiento', 'cuadraticos', 2, 'Igual que inserción, pero encuentra el lugar de cada elemento con búsqueda binaria en vez de recorrer la parte ordenada.', 'O(n log n)', 'O(n²)', 'O(n²)', 'O(1)', true, true, null, false);
insert into public.algoritmos (id, nombre, nombre_corto, familia, bloque, orden, intencion, complejidad_mejor, complejidad_promedio, complejidad_peor, espacio, estable, en_sitio, requisito, publico) values ('burbuja', 'Ordenamiento de burbuja', 'Burbuja', 'ordenamiento', 'cuadraticos', 3, 'Compara parejas de vecinos y las intercambia si están en desorden, pasada tras pasada, hasta que no queda nada que intercambiar.', 'O(n)', 'O(n²)', 'O(n²)', 'O(1)', true, true, null, true);
insert into public.algoritmos (id, nombre, nombre_corto, familia, bloque, orden, intencion, complejidad_mejor, complejidad_promedio, complejidad_peor, espacio, estable, en_sitio, requisito, publico) values ('coctelera', 'Ordenamiento de coctelera', 'Coctelera', 'ordenamiento', 'cuadraticos', 4, 'Burbuja en ambos sentidos: de ida lleva el mayor al final y de vuelta lleva el menor al principio.', 'O(n)', 'O(n²)', 'O(n²)', 'O(1)', true, true, null, false);
insert into public.algoritmos (id, nombre, nombre_corto, familia, bloque, orden, intencion, complejidad_mejor, complejidad_promedio, complejidad_peor, espacio, estable, en_sitio, requisito, publico) values ('seleccion', 'Ordenamiento por selección', 'Selección', 'ordenamiento', 'cuadraticos', 5, 'Busca el menor de los elementos que faltan y lo coloca al principio. Repite con el resto.', 'O(n²)', 'O(n²)', 'O(n²)', 'O(1)', false, true, null, true);
insert into public.algoritmos (id, nombre, nombre_corto, familia, bloque, orden, intencion, complejidad_mejor, complejidad_promedio, complejidad_peor, espacio, estable, en_sitio, requisito, publico) values ('shell', 'Ordenamiento Shell', 'Shell', 'ordenamiento', 'intervalos', 6, 'Aplica inserción entre elementos separados por un salto, y va reduciendo el salto hasta llegar a uno.', 'O(n log n)', 'Depende de los saltos', 'O(n²)', 'O(1)', false, true, null, false);
insert into public.algoritmos (id, nombre, nombre_corto, familia, bloque, orden, intencion, complejidad_mejor, complejidad_promedio, complejidad_peor, espacio, estable, en_sitio, requisito, publico) values ('peine', 'Ordenamiento de peine', 'Peine', 'ordenamiento', 'intervalos', 7, 'Burbuja que compara elementos lejanos y va acortando la distancia, dividiéndola entre 1.3 en cada pasada.', 'O(n log n)', 'Ω(n²/2ᵖ)', 'O(n²)', 'O(1)', false, true, null, false);
insert into public.algoritmos (id, nombre, nombre_corto, familia, bloque, orden, intencion, complejidad_mejor, complejidad_promedio, complejidad_peor, espacio, estable, en_sitio, requisito, publico) values ('mezcla', 'Ordenamiento por mezcla', 'Mezcla', 'ordenamiento', 'eficientes', 8, 'Parte el arreglo a la mitad, ordena cada mitad por separado y combina las dos mitades ordenadas en una sola.', 'O(n log n)', 'O(n log n)', 'O(n log n)', 'O(n)', true, false, null, false);
insert into public.algoritmos (id, nombre, nombre_corto, familia, bloque, orden, intencion, complejidad_mejor, complejidad_promedio, complejidad_peor, espacio, estable, en_sitio, requisito, publico) values ('quicksort', 'Quicksort', 'Quicksort', 'ordenamiento', 'eficientes', 9, 'Elige un pivote, deja a su izquierda los menores y a su derecha los demás, y repite lo mismo en cada lado.', 'O(n log n)', 'O(n log n)', 'O(n²)', 'O(log n)', false, true, null, false);
insert into public.algoritmos (id, nombre, nombre_corto, familia, bloque, orden, intencion, complejidad_mejor, complejidad_promedio, complejidad_peor, espacio, estable, en_sitio, requisito, publico) values ('monticulos', 'Ordenamiento por montículos', 'Montículos', 'ordenamiento', 'eficientes', 10, 'Organiza el arreglo como un montículo, donde el mayor siempre está arriba, y va extrayendo ese mayor hacia el final.', 'O(n log n)', 'O(n log n)', 'O(n log n)', 'O(1)', false, true, null, false);
insert into public.algoritmos (id, nombre, nombre_corto, familia, bloque, orden, intencion, complejidad_mejor, complejidad_promedio, complejidad_peor, espacio, estable, en_sitio, requisito, publico) values ('arbol', 'Ordenamiento por árbol', 'Árbol', 'ordenamiento', 'eficientes', 11, 'Inserta todos los elementos en un árbol binario de búsqueda y los recupera recorriéndolo en orden.', 'O(n log n)', 'O(n log n)', 'O(n²)', 'O(n)', true, false, null, false);
insert into public.algoritmos (id, nombre, nombre_corto, familia, bloque, orden, intencion, complejidad_mejor, complejidad_promedio, complejidad_peor, espacio, estable, en_sitio, requisito, publico) values ('conteo', 'Ordenamiento por conteo', 'Por conteo', 'ordenamiento', 'sin-comparaciones', 12, 'Cuenta cuántas veces aparece cada valor y, con esos conteos, calcula directamente la posición final de cada elemento.', 'O(n + k)', 'O(n + k)', 'O(n + k)', 'O(n + k)', true, false, null, false);
insert into public.algoritmos (id, nombre, nombre_corto, familia, bloque, orden, intencion, complejidad_mejor, complejidad_promedio, complejidad_peor, espacio, estable, en_sitio, requisito, publico) values ('residuos', 'Ordenamiento por residuos', 'Por residuos', 'ordenamiento', 'sin-comparaciones', 13, 'Ordena cifra por cifra, de las unidades hacia arriba, repartiendo los elementos en diez cubetas en cada pasada.', 'O(d·(n + b))', 'O(d·(n + b))', 'O(d·(n + b))', 'O(n + b)', true, false, null, false);
insert into public.algoritmos (id, nombre, nombre_corto, familia, bloque, orden, intencion, complejidad_mejor, complejidad_promedio, complejidad_peor, espacio, estable, en_sitio, requisito, publico) values ('cubetas', 'Ordenamiento por cubetas', 'Por cubetas', 'ordenamiento', 'sin-comparaciones', 14, 'Reparte los elementos en cubetas según su magnitud, ordena cada cubeta por separado y las vacía en orden.', 'O(n + k)', 'O(n + k)', 'O(n²)', 'O(n + k)', true, false, null, false);
insert into public.algoritmos (id, nombre, nombre_corto, familia, bloque, orden, intencion, complejidad_mejor, complejidad_promedio, complejidad_peor, espacio, estable, en_sitio, requisito, publico) values ('busqueda-lineal', 'Búsqueda lineal', 'Lineal', 'busqueda', 'busqueda', 15, 'Revisa los elementos uno por uno, desde el inicio, hasta encontrar el valor o llegar al final.', 'O(1)', 'O(n)', 'O(n)', 'O(1)', null, null, 'Ninguno', true);
insert into public.algoritmos (id, nombre, nombre_corto, familia, bloque, orden, intencion, complejidad_mejor, complejidad_promedio, complejidad_peor, espacio, estable, en_sitio, requisito, publico) values ('busqueda-binaria', 'Búsqueda binaria', 'Binaria', 'busqueda', 'busqueda', 16, 'Mira el elemento del medio y descarta la mitad donde el valor no puede estar. Repite con la mitad que queda.', 'O(1)', 'O(log n)', 'O(log n)', 'O(1)', null, null, 'Datos ordenados', true);
insert into public.algoritmos (id, nombre, nombre_corto, familia, bloque, orden, intencion, complejidad_mejor, complejidad_promedio, complejidad_peor, espacio, estable, en_sitio, requisito, publico) values ('busqueda-saltos', 'Búsqueda por saltos', 'Por saltos', 'busqueda', 'busqueda', 17, 'Avanza por bloques de tamaño fijo hasta pasarse del valor, y luego revisa uno por uno dentro del último bloque.', 'O(1)', 'O(√n)', 'O(√n)', 'O(1)', null, null, 'Datos ordenados', false);
insert into public.algoritmos (id, nombre, nombre_corto, familia, bloque, orden, intencion, complejidad_mejor, complejidad_promedio, complejidad_peor, espacio, estable, en_sitio, requisito, publico) values ('busqueda-interpolacion', 'Búsqueda por interpolación', 'Por interpolación', 'busqueda', 'busqueda', 18, 'Estima dónde debería estar el valor según su magnitud, como quien abre el directorio cerca del final para buscar un apellido con Z.', 'O(1)', 'O(log log n)', 'O(n)', 'O(1)', null, null, 'Datos ordenados y uniformes', false);
insert into public.algoritmos (id, nombre, nombre_corto, familia, bloque, orden, intencion, complejidad_mejor, complejidad_promedio, complejidad_peor, espacio, estable, en_sitio, requisito, publico) values ('busqueda-exponencial', 'Búsqueda exponencial', 'Exponencial', 'busqueda', 'busqueda', 19, 'Duplica la posición hasta pasarse del valor, y termina con búsqueda binaria en el último tramo recorrido.', 'O(1)', 'O(log i)', 'O(log n)', 'O(1)', null, null, 'Datos ordenados', false);

insert into public.fichas (algoritmo_id, analogia, como_funciona, requisitos, complejidad, usarlo, evitarlo, implementacion, relaciones) values (
  'insercion',
  'Es lo que haces al recibir cartas en una partida. Tienes en la mano las cartas que ya acomodaste. Llega una nueva, la comparas de derecha a izquierda con las que tienes y la metes justo donde le toca. Las cartas mayores se recorren un lugar para hacerle espacio.

Nunca reacomodas toda la mano: sólo buscas el lugar de la carta que acaba de llegar.',
  'El arreglo se divide mentalmente en dos partes: a la izquierda, una parte ordenada que al inicio tiene un solo elemento; a la derecha, lo que falta por procesar.

1. Toma el primer elemento de la parte sin procesar. Lo llamaremos la clave.
2. Compárala con los elementos de la parte ordenada, de derecha a izquierda.
3. Cada elemento mayor que la clave se desplaza una posición a la derecha.
4. Al encontrar uno que no es mayor, o al llegar al inicio, coloca la clave en el hueco que quedó.
5. Repite con el siguiente elemento hasta que no quede ninguno.',
  'Ninguno. Funciona con cualquier arreglo cuyos elementos se puedan comparar entre sí, y puede ordenar datos que van llegando de uno en uno, sin necesidad de conocerlos todos por adelantado.',
  'El costo depende de qué tan desordenada esté la entrada. Si el arreglo ya está ordenado, cada clave se compara una sola vez y no se mueve nada: el recorrido es lineal. Si está en orden inverso, cada clave tiene que cruzar toda la parte ordenada, y el trabajo crece con el cuadrado del tamaño.

Esa sensibilidad a la entrada es su mayor virtud. En un arreglo casi ordenado, donde cada elemento está cerca de su lugar final, se comporta prácticamente como un algoritmo lineal.',
  array['El arreglo es pequeño, de unas pocas decenas de elementos. Ahí su sencillez le gana a los algoritmos más elaborados.', 'Los datos ya vienen casi ordenados y sólo hay que corregir unos cuantos elementos fuera de lugar.', 'Los datos llegan poco a poco y quieres mantenerlos ordenados en todo momento.', 'Necesitas un ordenamiento estable que no use memoria adicional.']::text[],
  array['El arreglo es grande y no sabes nada de su orden. Con miles de elementos, el costo cuadrático se vuelve inaceptable.', 'Mover un elemento es caro. Inserción hace muchos desplazamientos; selección hace muchos menos.']::text[],
  array['La comparación debe ser estricta: `arr[j] > clave`. Si usas `>=`, los elementos iguales se saltan entre sí y el algoritmo deja de ser estable.', 'Guarda la clave en una variable antes de empezar a desplazar. El primer desplazamiento escribe encima de su posición original.', 'El orden de las condiciones del `while` importa: primero `j >= 0`, para no leer fuera del arreglo.']::text[],
  '[{"id":"seleccion","texto":"También construye una parte ordenada a la izquierda, pero selección decide qué elemento sigue y lo pone al final de esa parte; inserción toma el que sigue y decide dónde va. Selección compara siempre lo mismo; inserción se ahorra trabajo cuando la entrada ayuda."},{"id":"shell","texto":"Es inserción aplicada primero entre elementos lejanos. Así los elementos recorren distancias grandes en pocos movimientos y la pasada final, que es una inserción normal, encuentra el arreglo casi ordenado."},{"id":"mezcla","texto":"Las bibliotecas reales combinan ambos: parten el arreglo como lo hace mezcla, pero ordenan los tramos pequeños con inserción, porque en tamaños chicos es más rápida."},{"id":"insercion-binaria","texto":"Usa búsqueda binaria para encontrar el lugar de la clave. Reduce las comparaciones, pero los desplazamientos siguen siendo los mismos."}]'::jsonb
);
insert into public.fichas (algoritmo_id, analogia, como_funciona, requisitos, complejidad, usarlo, evitarlo, implementacion, relaciones) values (
  'insercion-binaria',
  'Vas a acomodar un libro nuevo en un estante ordenado por título. En lugar de leer los lomos uno por uno desde la izquierda, miras el del centro, decides si el tuyo va antes o después, y repites con la mitad que corresponde. En pocos vistazos sabes el lugar exacto.

Pero saber el lugar no te ahorra el esfuerzo de hacer espacio: todos los libros que quedan a la derecha tienen que recorrerse igual.',
  'Es [inserción](/algoritmos/insercion) con un solo cambio: la forma de encontrar dónde va cada elemento.

1. Toma el siguiente elemento sin ordenar, la clave.
2. Busca su lugar en la parte ordenada con [búsqueda binaria](/algoritmos/busqueda-binaria): mira el elemento del medio, descarta la mitad donde no puede ir y repite.
3. Desplaza una posición a la derecha todos los elementos que quedan entre ese lugar y la clave.
4. Coloca la clave en el hueco y continúa con el siguiente elemento.

En el visualizador, mira los contadores: las comparaciones crecen mucho más despacio que en inserción, pero las escrituras son exactamente las mismas.',
  'Necesita acceso directo por posición, porque la búsqueda binaria salta al medio del tramo. En una lista enlazada no tendría sentido.',
  'Encontrar el lugar de cada elemento cuesta log n comparaciones en lugar de hasta n, así que en total hace del orden de n log n comparaciones. Los desplazamientos no cambian: en el peor caso siguen siendo del orden de n², y son ellos los que dominan el tiempo.

Por eso el resultado es una mejora menor de lo que parece. Incluso su mejor caso es peor que el de inserción normal: con un arreglo ya ordenado, inserción hace una comparación por elemento y la versión binaria sigue haciendo log n.',
  array['Comparar es caro, por ejemplo con textos largos u objetos que se comparan por varios campos, y mover es barato.', 'Necesitas un ordenamiento estable y sencillo para arreglos pequeños.']::text[],
  array['Los datos ya vienen casi ordenados. Inserción normal lo aprovecha mejor.', 'El arreglo es grande. Los desplazamientos lo mantienen cuadrático.']::text[],
  array['Para conservar la estabilidad, la búsqueda debe encontrar la primera posición con un elemento estrictamente mayor que la clave. Por eso la condición es `arr[medio] <= clave`: ante un igual, la búsqueda sigue hacia la derecha.', 'Aquí el límite superior empieza en `i`, no en `i - 1`, porque la clave también puede quedarse donde está.', 'En lenguajes con funciones para mover bloques de memoria, los desplazamientos se pueden hacer de una sola vez, lo que reduce bastante su costo real.']::text[],
  '[{"id":"insercion","texto":"Es su variante directa. Ahorra comparaciones pero no movimientos, así que sólo gana cuando comparar es lo caro."},{"id":"busqueda-binaria","texto":"Es la búsqueda que usa por dentro, aplicada a la parte ya ordenada del arreglo."},{"id":"mezcla","texto":"Timsort, que combina las ideas de mezcla e inserción, usa precisamente inserción binaria para ordenar sus tramos cortos."}]'::jsonb
);
insert into public.fichas (algoritmo_id, analogia, como_funciona, requisitos, complejidad, usarlo, evitarlo, implementacion, relaciones) values (
  'burbuja',
  'Piensa en una fila de personas que quieren acomodarse por estatura, pero cada quien sólo puede compararse con quien tiene al lado. Si la persona de la izquierda es más alta, cambian de lugar. Se repite a lo largo de toda la fila, una y otra vez.

En cada recorrido, la persona más alta de las que faltan termina al final, igual que una burbuja que sube hasta la superficie. De ahí el nombre.',
  '1. Recorre el arreglo de izquierda a derecha comparando cada elemento con su vecino.
2. Si el de la izquierda es mayor, intercámbialos.
3. Al terminar la pasada, el mayor de los que faltaban quedó al final. Ya no hay que volver a revisarlo.
4. Repite con el tramo que queda, que es una posición más corto.
5. Si en una pasada completa no hubo ningún intercambio, el arreglo ya está ordenado y puedes detenerte.',
  'Ninguno. Sólo necesita poder comparar e intercambiar elementos vecinos.',
  'En el caso promedio y en el peor, hace del orden de n² comparaciones e intercambios. El mejor caso lineal existe sólo gracias a la bandera que detecta una pasada sin intercambios: con un arreglo ya ordenado basta una pasada para confirmarlo.

Su problema no son tanto las comparaciones como los intercambios. Un elemento que está lejos de su lugar avanza una sola posición por intercambio, y cada intercambio son dos escrituras en el arreglo. Observa el contador de escrituras en el visualizador y compáralo con el de inserción para la misma entrada.',
  array['Estás aprendiendo. Es el ordenamiento más fácil de entender y de escribir de memoria.', 'Sólo quieres comprobar si un arreglo ya está ordenado: una pasada sin intercambios lo confirma.']::text[],
  array['Casi siempre. Inserción es igual de sencilla, igual de estable, y hace menos trabajo con cualquier entrada.', 'Hay elementos pequeños cerca del final. Avanzan una sola posición por pasada, así que obligan a dar muchas vueltas.']::text[],
  array['La bandera `huboIntercambio` no es opcional si quieres el mejor caso lineal. Sin ella, el algoritmo hace todas las pasadas aunque el arreglo ya esté ordenado.', 'Reducir `n` después de cada pasada evita volver a comparar los elementos que ya quedaron en su lugar al final.', 'La comparación es estricta, `arr[j] > arr[j + 1]`, para no intercambiar elementos iguales y conservar la estabilidad.']::text[],
  '[{"id":"insercion","texto":"Ambos mueven elementos una posición a la vez, pero inserción desplaza con una sola escritura por posición y deja de comparar en cuanto encuentra el lugar. En la práctica, inserción gana siempre."},{"id":"seleccion","texto":"Los dos dejan un elemento en su lugar definitivo en cada pasada. Burbuja lo consigue con muchos intercambios; selección, con uno solo."},{"id":"coctelera","texto":"Recorre en ambas direcciones para que los elementos pequeños del final no tarden tanto en llegar al principio."},{"id":"peine","texto":"Compara elementos lejanos antes que vecinos. Con ese único cambio, burbuja pasa de inservible a competitivo."}]'::jsonb
);
insert into public.fichas (algoritmo_id, analogia, como_funciona, requisitos, complejidad, usarlo, evitarlo, implementacion, relaciones) values (
  'coctelera',
  'Para que la arena de un frasco se acomode, no lo agitas siempre en el mismo sentido: lo mueves hacia un lado y luego hacia el otro. Cada movimiento empuja algo a su sitio.

Coctelera hace lo mismo con burbuja: una pasada hacia la derecha y otra hacia la izquierda, alternando, como quien agita una coctelera.',
  'En [burbuja](/algoritmos/burbuja), los valores grandes avanzan muy rápido hacia el final, pero los pequeños que están al final retroceden una sola posición por pasada. A esos elementos lentos se les suele llamar tortugas. Coctelera ataca justo ese problema.

1. De ida, recorre de izquierda a derecha intercambiando vecinos en desorden. El mayor llega al final.
2. De vuelta, recorre de derecha a izquierda. El menor llega al principio.
3. Cada recorrido fija un elemento en un extremo, así que el tramo pendiente se encoge por ambos lados.
4. En cuanto un recorrido termina sin intercambios, el arreglo está ordenado.

La entrada de ejemplo tiene dos tortugas, el 2 y el 1, al final. Prueba la misma entrada en burbuja y compara cuántos pasos necesita cada uno.',
  'Ninguno. Sólo compara e intercambia elementos vecinos.',
  'Sigue siendo cuadrático en el caso promedio y en el peor. La mejora frente a burbuja es real pero moderada: suele necesitar menos pasadas, aunque no cambia la forma en que crece el trabajo.

Con un arreglo ya ordenado basta una pasada de ida sin intercambios para terminar, igual que en burbuja.',
  array['Quieres mostrar cómo una idea simple corrige un defecto concreto de otro algoritmo.', 'Los datos están casi ordenados pero tienen algunos elementos pequeños cerca del final.']::text[],
  array['En casi cualquier caso real. Inserción es igual de sencilla y hace menos trabajo.', 'El arreglo es grande. Sigue siendo cuadrático.']::text[],
  array['Hay que mover los dos límites: `fin` baja después de cada ida y `inicio` sube después de cada vuelta. Así no se vuelve a revisar lo que ya quedó fijo en los extremos.', 'Revisar la bandera después de la ida permite terminar sin hacer una vuelta innecesaria.', 'Como en burbuja, la comparación estricta mantiene el algoritmo estable.']::text[],
  '[{"id":"burbuja","texto":"Es burbuja con recorridos alternados. Comparte su estabilidad, su sencillez y su costo cuadrático."},{"id":"peine","texto":"Resuelve el mismo problema de las tortugas de otra forma: comparando elementos lejanos para que los pequeños avancen muchas posiciones de golpe. Funciona mucho mejor."},{"id":"insercion","texto":"Para los mismos casos en que coctelera ayuda, inserción suele ser más rápida."}]'::jsonb
);
insert into public.fichas (algoritmo_id, analogia, como_funciona, requisitos, complejidad, usarlo, evitarlo, implementacion, relaciones) values (
  'seleccion',
  'Imagina que acomodas libros en un estante por tamaño. Recorres con la vista todos los que están sin acomodar, localizas el más pequeño y lo pones en el primer lugar libre. Luego repites con los que quedan.

Miras mucho y mueves poco: cada libro se levanta una sola vez, directo a su lugar definitivo.',
  '1. Supón que el primer elemento sin ordenar es el menor.
2. Recorre el resto del arreglo. Cada vez que encuentres uno más pequeño, ese pasa a ser el menor.
3. Al terminar el recorrido, intercambia el menor con el primer elemento sin ordenar.
4. La parte ordenada creció una posición. Repite con lo que queda.

Cuando sólo queda un elemento sin ordenar, forzosamente es el mayor y ya está en su lugar.',
  'Ninguno. Funciona con cualquier arreglo de elementos comparables.',
  'Hace exactamente las mismas comparaciones sin importar la entrada: para encontrar el menor tiene que revisar todos los que faltan, aunque el arreglo ya esté ordenado. Por eso su mejor caso es igual de costoso que el peor.

A cambio, hace muy pocos movimientos: como máximo un intercambio por vuelta, es decir, n − 1 en total. Ningún otro algoritmo de este bloque mueve tan poco los datos.

No es estable. El intercambio puede hacer que un elemento salte por encima de otro igual a él. Pruébalo en el visualizador con `3, 3, 1`: el primer 3 termina después del segundo.',
  array['Escribir en el arreglo es mucho más caro que leer, por ejemplo en memorias que se desgastan con cada escritura.', 'El arreglo es pequeño y quieres un comportamiento totalmente predecible: siempre tarda lo mismo.']::text[],
  array['Los datos ya están casi ordenados. Selección no lo aprovecha; inserción sí.', 'Necesitas conservar el orden relativo de los elementos iguales.', 'El arreglo es grande. Sigue siendo cuadrático.']::text[],
  array['Guarda la posición del menor, no su valor. Al final necesitas saber dónde está para hacer el intercambio.', 'La comprobación `min !== i` evita intercambiar un elemento consigo mismo cuando ya estaba en su lugar.', 'El ciclo exterior termina en `arr.length - 1`: el último elemento queda acomodado por descarte.']::text[],
  '[{"id":"insercion","texto":"Son opuestos en lo que ahorran. Inserción ahorra comparaciones cuando la entrada ayuda, pero mueve mucho. Selección compara siempre lo máximo, pero casi no mueve. Además, inserción es estable y selección no."},{"id":"burbuja","texto":"Ambos fijan un elemento por pasada. Burbuja arrastra el mayor hasta el final a base de intercambios; selección localiza el menor y lo coloca con uno solo."},{"id":"monticulos","texto":"Es la misma idea, extraer repetidamente el extremo de lo que falta, pero con una estructura que permite encontrarlo sin recorrer todo. Esa diferencia baja el costo de n² a n log n."}]'::jsonb
);
insert into public.fichas (algoritmo_id, analogia, como_funciona, requisitos, complejidad, usarlo, evitarlo, implementacion, relaciones) values (
  'shell',
  'Cuando acomodas una baraja muy revuelta, no empiezas afinando carta por carta. Primero haces una separación gruesa: las bajas por un lado, las altas por otro. Después afinas cada grupo. El ajuste fino del final es rápido porque ninguna carta está ya muy lejos de su lugar.

Shell hace lo mismo con un arreglo: primero acomodos gruesos entre elementos lejanos, después ajustes cada vez más finos.',
  'El defecto de [inserción](/algoritmos/insercion) es que cada elemento avanza una posición por movimiento. Si un valor pequeño está al final, tiene que cruzar todo el arreglo paso a paso. Shell ataca justo ese defecto.

1. Elige un salto. Aquí se empieza con la mitad del tamaño del arreglo.
2. Aplica inserción, pero comparando cada elemento con el que está un salto atrás, en lugar de con su vecino.
3. Reduce el salto a la mitad y repite.
4. Cuando el salto llega a 1, la pasada es una inserción normal y el arreglo queda ordenado.

En el visualizador, las barras atenuadas son las que no participan en ese momento: con un salto de 4, por ejemplo, sólo se comparan entre sí las posiciones que están a cuatro lugares de distancia.',
  'Necesita acceso directo a cualquier posición, porque salta de un lugar a otro del arreglo. Por eso no se adapta bien a listas enlazadas.',
  'Es el mejor ejemplo del catálogo de un algoritmo cuyo rendimiento depende de un parámetro. La sucesión de saltos que se usa aquí, dividir entre dos cada vez, es la original y la más fácil de recordar, pero en el peor caso sigue siendo cuadrática.

Con otras sucesiones el resultado cambia por completo. La de Knuth (1, 4, 13, 40, …) baja el peor caso a aproximadamente n elevado a 1.5, y existen sucesiones encontradas por experimentación que rinden todavía mejor. El caso promedio exacto no se conoce para la mayoría de ellas.

No es estable: al saltar, un elemento puede pasar por encima de otro igual a él sin compararse nunca con él.',
  array['El arreglo es de tamaño mediano y quieres algo mucho mejor que inserción sin recursión ni memoria adicional.', 'Trabajas en un entorno con muy poca memoria o donde la recursión es un problema, como un sistema embebido.', 'Quieres un código corto y fácil de verificar.']::text[],
  array['El arreglo es grande. Mezcla, quicksort y montículos garantizan o promedian n log n; Shell no.', 'Necesitas estabilidad.', 'No puedes dedicar tiempo a elegir una buena sucesión de saltos: con la más simple, el peor caso es cuadrático.']::text[],
  array['La condición del ciclo interior es `j >= salto`, no `j > 0`. De lo contrario leerías posiciones negativas.', 'El último salto tiene que ser 1. Es esa pasada final la que garantiza que el arreglo quede ordenado; las anteriores sólo lo preparan.', 'Cambiar la sucesión de saltos no requiere tocar el resto del código: sólo cambia cómo se calcula el siguiente valor de `salto`.']::text[],
  '[{"id":"insercion","texto":"Shell con salto de 1 es exactamente inserción. Todo lo que Shell agrega son las pasadas previas, que acercan cada elemento a su lugar para que esa inserción final tenga poco que hacer."},{"id":"peine","texto":"Aplica la misma idea de los saltos decrecientes, pero sobre burbuja. Que funcione en ambos casos muestra que la técnica no depende del algoritmo de base."},{"id":"quicksort","texto":"Quicksort también mueve elementos a grandes distancias desde el principio, pero lo hace partiendo el problema en dos. Eso le da un promedio de n log n que Shell no alcanza."}]'::jsonb
);
insert into public.fichas (algoritmo_id, analogia, como_funciona, requisitos, complejidad, usarlo, evitarlo, implementacion, relaciones) values (
  'peine',
  'Para desenredar el cabello no se empieza con un peine fino. Primero pasas uno de dientes separados, que deshace los nudos grandes; después uno cada vez más cerrado, hasta que el último deja todo liso.

Este algoritmo compara primero elementos muy separados y va cerrando la distancia, igual que los dientes del peine.',
  '[Burbuja](/algoritmos/burbuja) sólo compara vecinos, así que un valor pequeño atrapado al final necesita muchas pasadas para llegar al principio. Peine le da a burbuja la misma idea que [Shell](/algoritmos/shell) le da a inserción.

1. Empieza con un salto igual al tamaño del arreglo y divídelo entre 1.3, redondeando hacia abajo.
2. Compara cada elemento con el que está un salto más adelante, e intercámbialos si están en desorden.
3. Divide otra vez el salto entre 1.3 y repite.
4. Cuando el salto llega a 1 es una pasada de burbuja normal. Se repite hasta que una pasada completa termina sin intercambios.

El factor 1.3 no sale de una fórmula: se encontró probando, porque con él se obtenían los mejores resultados en la práctica.',
  'Necesita acceso directo por posición, para comparar elementos separados por un salto.',
  'En el peor caso sigue siendo cuadrático, y su mejor caso es n log n, porque recorre todos los saltos aunque el arreglo ya esté ordenado. Para el caso promedio no hay una fórmula sencilla: depende de p, la cantidad de saltos que se usan.

Lo importante es lo que pasa en la práctica: con entradas comunes se acerca mucho al comportamiento de los algoritmos n log n, a pesar de ser apenas unas líneas más que burbuja.

No es estable. Al intercambiar elementos lejanos, uno puede saltar por encima de otro igual a él.',
  array['Quieres algo mucho mejor que burbuja sin complicar el código.', 'El arreglo es mediano y no necesitas estabilidad ni garantías.']::text[],
  array['Necesitas un tiempo garantizado o estabilidad.', 'El arreglo es grande y tienes a mano mezcla, quicksort o montículos.']::text[],
  array['La bandera `ordenado` sólo puede terminar el ciclo cuando el salto ya es 1. Con saltos mayores, que no haya intercambios no significa que el arreglo esté ordenado.', 'El ciclo interior va mientras `i + salto < arr.length`, para no comparar fuera del arreglo.', 'Hay variantes que nunca usan los saltos 9 y 10, sino 11 en su lugar, porque se observó que eso mejora el resultado.']::text[],
  '[{"id":"burbuja","texto":"Peine con salto 1 desde el principio sería burbuja. Las pasadas con saltos grandes son lo que lo vuelve útil."},{"id":"shell","texto":"Aplica la misma técnica de saltos decrecientes, pero sobre inserción. Que funcione en ambos muestra que la idea no depende del algoritmo de base."},{"id":"coctelera","texto":"Ataca el mismo defecto de burbuja, los elementos pequeños al final, pero con mucho más éxito."}]'::jsonb
);
insert into public.fichas (algoritmo_id, analogia, como_funciona, requisitos, complejidad, usarlo, evitarlo, implementacion, relaciones) values (
  'mezcla',
  'Dos personas tienen cada una un montón de exámenes ya ordenados por apellido y quieren juntarlos en uno solo. No hace falta revolver nada: cada quien muestra el examen de arriba de su montón, se toma el que va primero y se pone en el montón final. Se repite hasta que ambos montones se acaban.

Juntar dos montones ordenados es fácil y rápido. El algoritmo completo consiste en llegar a esa situación: partir el trabajo hasta que cada montón tenga un solo examen, que por definición ya está ordenado.',
  'Sigue la estrategia de divide y vencerás: resolver un problema grande partiéndolo en problemas más pequeños del mismo tipo.

1. Si el tramo tiene un solo elemento, ya está ordenado. No hay nada que hacer.
2. Parte el tramo a la mitad.
3. Ordena la mitad izquierda con este mismo procedimiento.
4. Ordena la mitad derecha con este mismo procedimiento.
5. Combina las dos mitades: compara el primer elemento de cada una, toma el menor y avanza en esa mitad. Cuando una mitad se acaba, copia lo que queda de la otra.

En el visualizador, el corchete azul bajo las barras marca el tramo que se está procesando. Fíjate en que los tramos pequeños se resuelven primero y los grandes se arman a partir de ellos.',
  'Necesita espacio para copiar las dos mitades antes de combinarlas. Si la memoria disponible es muy limitada, eso puede ser un impedimento.',
  'Tarda lo mismo con cualquier entrada. El arreglo se parte a la mitad unas log n veces, y en cada nivel de esa partición se combinan n elementos en total. De ahí sale n log n, sin casos malos.

El precio es la memoria: las copias de las mitades ocupan un espacio proporcional al tamaño del arreglo. Es el único algoritmo de este bloque que no trabaja en el sitio.

Observa los contadores: no hay intercambios, sólo escrituras. Mezcla no intercambia elementos de lugar; los copia a su posición final.',
  array['Necesitas un tiempo garantizado, sin importar cómo venga la entrada.', 'Necesitas estabilidad. Es el algoritmo eficiente y estable por excelencia.', 'Ordenas una lista enlazada. Ahí la combinación no requiere memoria adicional y mezcla es la mejor opción.', 'Los datos no caben en memoria. Se pueden ordenar por partes en disco y combinar los archivos resultantes.']::text[],
  array['La memoria es escasa. Duplicar el espacio del arreglo puede no ser aceptable.', 'El arreglo es pequeño. El costo de copiar y de las llamadas recursivas pesa más que el beneficio.']::text[],
  array['La comparación al combinar debe ser `izq[i] <= der[j]`. Con `<`, ante dos elementos iguales se tomaría primero el de la derecha y se perdería la estabilidad.', 'Las mitades se copian antes de combinar. Si leyeras directamente del arreglo, las escrituras irían destruyendo elementos que todavía no has usado.', 'Los dos ciclos finales no pueden ejecutarse ambos: cuando el ciclo principal termina, a lo mucho una de las mitades conserva elementos.']::text[],
  '[{"id":"quicksort","texto":"Los dos dividen y vencen, pero en orden contrario. Mezcla parte sin pensar y hace el trabajo al combinar. Quicksort hace el trabajo al partir y después no tiene nada que combinar. Mezcla garantiza n log n y es estable; quicksort no usa memoria adicional y suele ser más rápido."},{"id":"insercion","texto":"Timsort, el ordenamiento de Python y el que Java usa para objetos, es una mezcla que aprovecha los tramos que ya vienen ordenados y usa inserción para los tramos cortos."},{"id":"monticulos","texto":"Montículos también garantiza n log n y además trabaja en el sitio, pero no es estable."}]'::jsonb
);
insert into public.fichas (algoritmo_id, analogia, como_funciona, requisitos, complejidad, usarlo, evitarlo, implementacion, relaciones) values (
  'quicksort',
  'Un profesor quiere formar a su grupo por estatura. Elige a un alumno cualquiera y dice: los más bajos que él, a su izquierda; los demás, a su derecha. Ese alumno ya está en su lugar definitivo, aunque los dos grupos sigan revueltos.

Luego hace lo mismo dentro de cada grupo, con un nuevo alumno de referencia. Los grupos se van haciendo más pequeños hasta que cada uno tiene una sola persona, y entonces toda la fila está formada.',
  '1. Elige un elemento del tramo como pivote. Aquí se usa el último.
2. Recorre el tramo. Cada elemento menor que el pivote se envía a la zona de menores, que crece desde la izquierda.
3. Al terminar, coloca el pivote justo después de esa zona. A su izquierda quedaron los menores y a su derecha los demás: el pivote ya no se moverá.
4. Repite el procedimiento en el tramo de la izquierda y en el de la derecha.
5. Un tramo de uno o cero elementos ya está ordenado.

A este reparto alrededor del pivote se le llama partición. La versión que se muestra es la de Lomuto, la más fácil de seguir; existe otra, la de Hoare, que hace menos intercambios.',
  'Necesita acceso directo a cualquier posición del arreglo. No requiere memoria para copiar datos, aunque sí usa la pila de llamadas para la recursión.',
  'Todo depende de qué tan parejo salga el reparto. Si el pivote cae cerca de la mitad, el problema se divide en dos partes similares y el costo es n log n. Si el pivote resulta ser siempre el menor o el mayor, un lado queda vacío, el problema apenas se reduce en un elemento y el costo sube a n².

Con el pivote al final, ese peor caso ocurre justo con una entrada que parece inofensiva: un arreglo ya ordenado. Pruébalo en el visualizador con `1, 2, 3, 4, 5, 6, 7, 8` y compara las comparaciones con las de una entrada revuelta.

La memoria adicional es la profundidad de la recursión: del orden de log n cuando los repartos son parejos, y hasta n en el peor caso.',
  array['Ordenas arreglos grandes en memoria y te importa la velocidad promedio. En la práctica suele ser el más rápido.', 'No puedes gastar memoria en una copia del arreglo.', 'No necesitas estabilidad.']::text[],
  array['Necesitas un tiempo garantizado. Una entrada desfavorable, o elegida a propósito por alguien, puede llevarlo al caso cuadrático.', 'Necesitas conservar el orden de los elementos iguales.', 'Los datos suelen llegar ordenados o casi ordenados y usas un pivote fijo en un extremo.']::text[],
  array['Elegir el pivote es la decisión más importante. Tomarlo al azar, o usar la mediana entre el primero, el del medio y el último, vuelve muy improbable el peor caso.', 'Las llamadas recursivas excluyen al pivote: van de `inicio` a `i - 1` y de `i + 1` a `fin`. Incluirlo puede provocar una recursión que nunca termina.', 'Con muchos elementos repetidos, esta partición reparte mal. Existe una variante de tres zonas (menores, iguales y mayores) pensada para ese caso.']::text[],
  '[{"id":"mezcla","texto":"Ambos dividen y vencen. Quicksort trabaja antes de dividir y no necesita combinar; mezcla divide sin trabajo y combina después. Quicksort gana en memoria y velocidad promedio; mezcla gana en garantías y estabilidad."},{"id":"monticulos","texto":"Introsort, el ordenamiento de la biblioteca estándar de C++, empieza con quicksort y cambia a montículos si la recursión se vuelve demasiado profunda. Así conserva la velocidad de uno y la garantía del otro."},{"id":"insercion","texto":"Las implementaciones reales dejan de partir cuando el tramo es pequeño y lo terminan con inserción, que en tamaños chicos es más rápida."}]'::jsonb
);
insert into public.fichas (algoritmo_id, analogia, como_funciona, requisitos, complejidad, usarlo, evitarlo, implementacion, relaciones) values (
  'monticulos',
  'Un torneo por eliminación directa: en cada ronda gana el mejor de cada enfrentamiento y sube al siguiente nivel, hasta que queda un campeón arriba. Encontrar al campeón costó muchos partidos, pero encontrar al subcampeón cuesta muy pocos: basta revisar a quienes perdieron contra el campeón.

Un montículo conserva esa estructura de torneo. Por eso, después de sacar al mayor, reacomodar para encontrar el siguiente mayor es barato.',
  'Un montículo es un árbol en el que cada padre es mayor o igual que sus hijos. No hace falta construir ningún árbol aparte: se lee directamente sobre el arreglo. Los hijos del elemento en la posición `p` están en `2p + 1` y `2p + 2`.

1. Convierte el arreglo en un montículo. Para ello se recorren los padres de atrás hacia adelante y cada uno se hunde: si alguno de sus hijos es mayor, se intercambia con el mayor de ellos y sigue bajando.
2. Ahora el mayor de todos está en la primera posición. Intercámbialo con el último elemento.
3. El mayor quedó en su lugar definitivo. El montículo se encoge una posición y ya no lo incluye.
4. El elemento que llegó a la raíz rompe la regla. Húndelo hasta restaurarla.
5. Repite hasta que el montículo tenga un solo elemento.

En el visualizador, los marcadores `padre`, `izq` y `der` señalan en cada comparación quién es quién dentro del árbol.',
  'Necesita acceso directo por posición, porque salta constantemente entre un padre y sus hijos. Conviene entender primero la idea de montículo; sin ella, los saltos sobre el arreglo parecen arbitrarios.',
  'Construir el montículo cuesta un tiempo lineal. Después hay n extracciones, y en cada una el elemento que llega a la raíz baja como mucho la altura del árbol, que es log n. El total es n log n con cualquier entrada.

Es el único algoritmo del catálogo que reúne las dos garantías: tiempo n log n en el peor caso y ninguna memoria adicional.

En la práctica suele ser más lento que quicksort. Los saltos entre padres e hijos recorren posiciones muy alejadas del arreglo, y eso aprovecha mal la memoria caché del procesador.',
  array['Necesitas un tiempo garantizado y además no puedes gastar memoria adicional.', 'Sólo te interesan los k elementos mayores: puedes detener las extracciones en cuanto los tengas.', 'Como respaldo de quicksort, para cortar su peor caso.']::text[],
  array['Necesitas estabilidad. Los intercambios a larga distancia la rompen.', 'Los datos ya vienen casi ordenados. Montículos no lo aprovecha: primero deshace ese orden para construir el montículo.', 'Buscas la máxima velocidad promedio. Quicksort suele ganar.']::text[],
  array['La construcción empieza en `Math.floor(n / 2) - 1`, el último elemento que tiene al menos un hijo. Los que vienen después son hojas y no hay nada que hundir.', 'Al hundir, compara al padre con el mayor de sus dos hijos, no con el primero que resulte mayor. De lo contrario, el que sube podría ser menor que su nuevo hermano.', 'El parámetro `limite` marca dónde termina el montículo. Sin él, los elementos ya extraídos al final volverían a entrar en las comparaciones.']::text[],
  '[{"id":"seleccion","texto":"Hace lo mismo que [selección](/algoritmos/seleccion), pero al revés y con ayuda: extrae el mayor en lugar del menor, y lo encuentra en tiempo logarítmico gracias al montículo, en lugar de recorrer todo lo que falta."},{"id":"quicksort","texto":"Quicksort es más rápido en promedio pero tiene un peor caso cuadrático. Montículos es más lento en promedio pero nunca falla. Por eso introsort los combina."},{"id":"mezcla","texto":"Los dos garantizan n log n. Mezcla es estable pero necesita memoria adicional; montículos trabaja en el sitio pero no es estable."}]'::jsonb
);
insert into public.fichas (algoritmo_id, analogia, como_funciona, requisitos, complejidad, usarlo, evitarlo, implementacion, relaciones) values (
  'arbol',
  'Piensa en un juego de adivinanzas por bifurcaciones. Cada pregunta divide el camino: menor a la izquierda, mayor a la derecha. Cada número nuevo baja por esas preguntas hasta llegar a un lugar libre y se queda ahí.

Al final, si recorres el árbol siempre visitando primero todo lo de la izquierda, luego el nodo y luego lo de la derecha, lees los números en orden.',
  'Tiene dos fases muy distintas.

1. Construcción: cada elemento se inserta en un árbol binario de búsqueda. Empieza en la raíz y baja: si es menor que el nodo va a la izquierda, si no, a la derecha, hasta encontrar un lugar vacío.
2. Recorrido en orden: se visita el subárbol izquierdo, luego el nodo, luego el subárbol derecho. Cada nodo visitado se escribe en la siguiente posición del arreglo.

En el visualizador, los elementos salen del arreglo hacia el árbol y luego regresan ordenados. Prueba con `1, 2, 3, 4, 5, 6, 7, 8`: cada número va siempre a la derecha del anterior y el árbol se convierte en una sola rama larga.',
  'Necesita memoria para un nodo por cada elemento, con sus dos enlaces. Es bastante más de lo que usan los algoritmos que trabajan en el sitio.',
  'Si el árbol queda equilibrado, su altura es del orden de log n y cada inserción cuesta eso: el total es n log n. Si los datos llegan ordenados, el árbol degenera en una lista, cada inserción recorre todo lo anterior y el costo sube a n².

Se puede garantizar n log n usando un árbol que se reequilibra solo, como un AVL o un árbol rojinegro, a cambio de un código bastante más complejo.

Esta versión es estable: los elementos iguales a un nodo van a su derecha, así que el recorrido en orden los visita en el mismo orden en que llegaron.',
  array['Los datos llegan de uno en uno y necesitas tenerlos ordenados en todo momento, no sólo al final.', 'Además de ordenar, quieres buscar, insertar y borrar elementos después. El árbol sirve para todo eso.']::text[],
  array['Sólo necesitas ordenar una vez. Usa más memoria y suele ser más lento que quicksort o mezcla.', 'Los datos pueden venir ordenados o casi ordenados y no usas un árbol que se reequilibre.']::text[],
  array['La comparación es `valor < nodo.valor`, y todo lo demás va a la derecha. Ese detalle es lo que hace estable al algoritmo.', 'El recorrido es recursivo. Con un árbol degenerado, la profundidad de la recursión llega a n y puede agotar la pila en lenguajes con un límite bajo.', 'La función `insertar` devuelve el nodo para poder reconstruir los enlaces al regresar de la recursión. Es la forma más corta de escribirla, aunque también hay versiones con un ciclo.']::text[],
  '[{"id":"quicksort","texto":"Son parientes cercanos. La raíz de cada subárbol cumple el papel de un pivote: todo lo menor queda a un lado y lo demás al otro. Si quicksort usara como pivote el primer elemento de cada tramo y repartiera conservando el orden de llegada, haría exactamente las mismas comparaciones. La diferencia es que quicksort reparte en el sitio y el árbol guarda el reparto en una estructura."},{"id":"busqueda-binaria","texto":"Un árbol binario de búsqueda es la búsqueda binaria convertida en estructura de datos: cada nodo es un punto medio y cada rama, la mitad que queda."},{"id":"monticulos","texto":"También ordena con un árbol, pero con otra regla: el padre es mayor que sus hijos, sin importar izquierda o derecha. Esa regla más débil permite guardarlo dentro del mismo arreglo."}]'::jsonb
);
insert into public.fichas (algoritmo_id, analogia, como_funciona, requisitos, complejidad, usarlo, evitarlo, implementacion, relaciones) values (
  'conteo',
  'Al terminar una elección escolar, nadie ordena las boletas comparándolas entre sí. Se hace una columna por candidato y se pone una marca por cada voto. Al final, el conteo dice todo lo que hace falta.

Si además quisieras formar las boletas en una fila ordenada por candidato, el conteo te diría de inmediato dónde empieza el bloque de cada uno.',
  '1. Crea una casilla por cada valor posible, desde 0 hasta el mayor del arreglo.
2. Recorre el arreglo y suma uno a la casilla de cada valor.
3. Acumula: cada casilla pasa a valer la suma de sí misma y todas las anteriores. Ahora indica cuántos elementos son menores o iguales a ese valor, es decir, dónde termina su bloque en el arreglo final.
4. Recorre el arreglo desde el final. Cada elemento va a la posición que indica su casilla menos uno, y la casilla se reduce para el siguiente elemento con el mismo valor.
5. Copia el arreglo de salida sobre el original.

Fíjate en el contador de comparaciones del visualizador: se queda en cero durante toda la ejecución.',
  '**Los valores deben ser enteros dentro de un rango pequeño.** Hace falta una casilla por cada valor posible, así que ordenar diez números entre 1 y un millón obligaría a crear un millón de casillas. Por eso, en este visualizador, el mayor valor permitido es 15.

Necesita además un arreglo de salida del mismo tamaño que la entrada.',
  'Recorre el arreglo un número fijo de veces y recorre las casillas otro tanto. Si n es la cantidad de elementos y k la cantidad de valores posibles, el costo es n + k, con cualquier entrada.

Eso es más rápido que el límite de n log n que tienen todos los algoritmos basados en comparar. No es una contradicción: ese límite sólo aplica a quien ordena preguntando cuál de dos elementos es mayor, y conteo nunca lo pregunta. A cambio, depende de k: si el rango de valores es enorme, deja de convenir.',
  array['Los valores son enteros en un rango reducido: calificaciones de 0 a 10, edades, días del mes.', 'Hay muchos elementos y pocos valores distintos.', 'Como paso interno de otro algoritmo, como el ordenamiento por residuos.']::text[],
  array['Los valores tienen un rango muy grande en comparación con la cantidad de elementos.', 'Los valores no son enteros ni se pueden convertir de forma natural a una posición, como nombres o decimales.', 'La memoria es escasa. Necesita las casillas más un arreglo de salida completo.']::text[],
  array['El recorrido final va de atrás hacia adelante. Así, de dos elementos iguales, el último en aparecer ocupa la última posición de su bloque, y el algoritmo resulta estable. Recorrerlo al revés lo rompe.', 'Si los valores pueden ser negativos o empezar lejos de cero, se resta el mínimo antes de usarlos como índice y se crean sólo `max - min + 1` casillas.', 'Existe una versión más corta que reescribe cada valor tantas veces como indica su casilla. Funciona con números sueltos, pero pierde los datos que acompañan a cada elemento y no sirve dentro de residuos.']::text[],
  '[{"id":"residuos","texto":"Residuos aplica un ordenamiento estable como éste a cada cifra por separado. Así supera la limitación del rango pequeño: cada pasada sólo necesita diez casillas."},{"id":"cubetas","texto":"Conteo es el caso extremo de cubetas: una cubeta por cada valor posible, tan pequeñas que no hace falta ordenarlas por dentro."},{"id":"mezcla","texto":"[Mezcla](/algoritmos/mezcla) y los demás algoritmos de comparación funcionan con cualquier tipo de dato que se pueda comparar. Conteo es más rápido, pero sólo cuando los datos cumplen sus condiciones."}]'::jsonb
);
insert into public.fichas (algoritmo_id, analogia, como_funciona, requisitos, complejidad, usarlo, evitarlo, implementacion, relaciones) values (
  'residuos',
  'Tienes un montón de fechas para ordenar. Primero las acomodas por día. Luego, sin desordenar lo anterior, por mes. Por último, por año. Al terminar están en orden cronológico, aunque nunca comparaste dos fechas completas.

Las máquinas clasificadoras de tarjetas perforadas trabajaban así: separaban las tarjetas por una columna, se volvían a apilar en orden y se pasaban de nuevo por la siguiente columna.',
  'Esta es la versión que empieza por la cifra menos significativa, la de las unidades.

1. Prepara diez cubetas, una por cada dígito del 0 al 9.
2. Recorre el arreglo y pon cada elemento al final de la cubeta que corresponde a su cifra de las unidades.
3. Vacía las cubetas en orden, de la 0 a la 9, respetando el orden en que entró cada elemento.
4. Repite con las decenas, luego con las centenas, hasta pasar por todas las cifras del mayor valor.

En el visualizador, la cifra que decide la cubeta aparece subrayada en cada elemento. Después de la primera pasada, el arreglo está ordenado sólo por unidades; después de la segunda, ya está ordenado por completo.',
  'Los valores deben poder descomponerse en cifras o en partes que se comparan por separado: enteros, códigos de longitud fija, fechas. Además, cada pasada tiene que ser estable, o el orden logrado en las cifras anteriores se pierde.',
  'Cada pasada recorre los n elementos y las b cubetas, con b = 10 en base diez. Hay d pasadas, una por cifra. El costo es d·(n + b), con cualquier entrada.

Si la cantidad de cifras es pequeña y fija, el costo crece de forma lineal con n. Por eso, para millones de enteros de tamaño acotado, puede superar a cualquier algoritmo basado en comparaciones.',
  array['Ordenas muchos enteros, o claves de longitud fija como códigos postales, matrículas o direcciones IP.', 'Las claves tienen pocas cifras en comparación con la cantidad de elementos.']::text[],
  array['Los valores tienen muchas cifras o longitudes muy distintas.', 'Los datos son decimales o textos de longitud variable y no hay una forma natural de partirlos.', 'La memoria es escasa: las cubetas llegan a contener todos los elementos.']::text[],
  array['La cifra se obtiene con `Math.floor(valor / cifra) % 10`, donde `cifra` vale 1, 10, 100… en cada pasada.', 'Cada elemento se agrega al final de su cubeta y las cubetas se vacían desde el principio. Si se invirtiera ese orden, la pasada dejaría de ser estable y el resultado sería incorrecto.', 'Con números negativos hay que tratarlos aparte, o desplazar todos los valores para que empiecen en cero.']::text[],
  '[{"id":"conteo","texto":"Cada pasada puede hacerse con ordenamiento por conteo en lugar de cubetas. Es la forma más común en implementaciones reales, porque evita crear listas."},{"id":"cubetas","texto":"Los dos reparten en cubetas, pero con criterios distintos. Residuos usa una cifra y nunca ordena dentro de las cubetas; cubetas usa la magnitud completa y sí las ordena."},{"id":"quicksort","texto":"Para datos generales, [quicksort](/algoritmos/quicksort) sigue siendo la opción por defecto. Residuos gana sólo cuando las claves tienen la forma adecuada."}]'::jsonb
);
insert into public.fichas (algoritmo_id, analogia, como_funciona, requisitos, complejidad, usarlo, evitarlo, implementacion, relaciones) values (
  'cubetas',
  'Una profesora tiene cien exámenes para ordenar por apellido. Primero los reparte en cinco montones: de la A a la E, de la F a la J, y así. Cada montón es pequeño y se ordena rápido. Al final apila los montones en orden y listo.

El truco funciona si los apellidos están repartidos de forma pareja. Si casi todos empiezan con la misma letra, un montón se queda con casi todo y el reparto no sirvió de nada.',
  '1. Divide el intervalo de valores en partes iguales, una por cubeta. Aquí se usan cinco.
2. Recorre el arreglo y pon cada elemento en la cubeta del intervalo al que pertenece.
3. Ordena cada cubeta por separado. Como suelen ser pequeñas, se usa [inserción](/algoritmos/insercion).
4. Vacía las cubetas en orden. Todo lo de una cubeta es menor que lo de la siguiente.

Prueba con `3, 5, 2, 8, 4, 6, 99`: el 99 obliga a que los intervalos sean amplios, y todos los demás valores caen en la primera cubeta.',
  'Hay que poder calcular a qué cubeta va cada elemento a partir de su valor, así que funciona con números. Y, sobre todo, rinde bien sólo si los valores están repartidos de manera uniforme dentro de su intervalo.',
  'Si los datos son uniformes, cada cubeta recibe pocos elementos y ordenarlas es barato. Con k cubetas, el costo esperado es del orden de n + k.

Si los datos se amontonan, una cubeta puede recibir casi todo, y ordenarla con inserción cuesta n². Es el ejemplo más claro del catálogo de un algoritmo cuyo rendimiento depende de cómo vienen los datos, no sólo de cuántos son.

Es estable siempre que el ordenamiento interno lo sea, como lo es inserción.',
  array['Los valores se reparten de forma pareja en un intervalo conocido, como números aleatorios uniformes.', 'Ordenas números decimales en un rango fijo, por ejemplo entre 0 y 1.']::text[],
  array['Los datos se concentran en una zona o tienen valores extremos que estiran el intervalo.', 'No conoces la distribución de los datos y necesitas un tiempo predecible.']::text[],
  array['La cubeta se calcula con `Math.floor((valor * k) / (max + 1))`. Sumar uno al máximo evita que el mayor valor caiga en una cubeta inexistente.', 'La cantidad de cubetas es una decisión de diseño. Lo habitual es usar tantas como elementos, para que cada una reciba uno en promedio.', 'Si el ordenamiento interno no es estable, el algoritmo completo tampoco lo será.']::text[],
  '[{"id":"conteo","texto":"Si cada cubeta corresponde a un solo valor, ya no hace falta ordenarlas: eso es el ordenamiento por conteo."},{"id":"residuos","texto":"También reparte en cubetas, pero según una cifra a la vez y sin ordenar el interior de cada cubeta."},{"id":"busqueda-interpolacion","texto":"Comparten la misma apuesta: que los valores estén repartidos de forma pareja. Cuando lo están, ambos aprovechan la magnitud para saltar directo a la zona correcta."}]'::jsonb
);
insert into public.fichas (algoritmo_id, analogia, como_funciona, requisitos, complejidad, usarlo, evitarlo, implementacion, relaciones) values (
  'busqueda-lineal',
  'Buscas tus llaves en una casa donde nada tiene un lugar fijo. No hay atajo posible: revisas un sitio, luego el siguiente, y así hasta encontrarlas o hasta haber revisado todos.

Puede que aparezcan en el primer lugar donde miras, o en el último. Lo único seguro es que, si están, las vas a encontrar.',
  '1. Empieza en la primera posición del arreglo.
2. Compara el elemento de esa posición con el valor buscado.
3. Si son iguales, terminaste: devuelve la posición.
4. Si no, pasa a la siguiente posición y repite.
5. Si llegas al final sin encontrarlo, el valor no está.

Cada comparación descarta un solo elemento. En el visualizador, las barras que se apagan son las que ya se revisaron.',
  'Ninguno, y esa es su razón de ser. No exige que los datos estén ordenados ni que se pueda saltar a una posición cualquiera: basta con poder recorrerlos en secuencia. Funciona igual sobre arreglos, listas enlazadas o datos que se leen de un archivo.',
  'Si el valor está al inicio, basta una comparación. Si está al final, o no está, hay que revisar los n elementos. En promedio, cuando el valor sí está, se revisa la mitad.

Confirmar que un valor no está es siempre el peor caso: no hay forma de saberlo sin revisar todo.',
  array['Los datos no están ordenados y sólo vas a buscar una o pocas veces. Ordenar primero costaría más que recorrer.', 'El arreglo es pequeño. Con unas decenas de elementos, la diferencia con métodos más elaborados no se nota.', 'Los datos sólo se pueden recorrer en secuencia, como en una lista enlazada.']::text[],
  array['Vas a buscar muchas veces en los mismos datos. Conviene ordenarlos una vez y usar búsqueda binaria.', 'El arreglo es grande y ya está ordenado. Estarías desperdiciando la información que da el orden.']::text[],
  array['Devuelve en cuanto encuentres el valor. Seguir recorriendo después no cambia el resultado y desperdicia trabajo.', 'Devolver `-1` cuando no está es una convención: ninguna posición válida es negativa, así que no puede confundirse con un resultado real.', 'Si hay valores repetidos, esta versión devuelve la primera aparición. Para obtener todas, hay que seguir hasta el final y acumular las posiciones.']::text[],
  '[{"id":"busqueda-binaria","texto":"Es la alternativa cuando los datos están ordenados. La lineal descarta un elemento por comparación; la [binaria](/algoritmos/busqueda-binaria) descarta la mitad de los que quedan. En un millón de elementos, eso es la diferencia entre un millón de comparaciones y unas veinte."},{"id":"seleccion","texto":"El ciclo interior de selección, que busca el menor de los elementos restantes, es una búsqueda lineal. Por eso selección no puede bajar de n² comparaciones."},{"id":"busqueda-saltos","texto":"Sobre datos ordenados, avanza a brincos y sólo hace búsqueda lineal dentro del último brinco."}]'::jsonb
);
insert into public.fichas (algoritmo_id, analogia, como_funciona, requisitos, complejidad, usarlo, evitarlo, implementacion, relaciones) values (
  'busqueda-binaria',
  'Buscas una palabra en un diccionario de papel. No empiezas por la primera página: lo abres más o menos a la mitad. Si la palabra que buscas va antes de las que ves, ya sabes que toda la mitad derecha no te sirve. Repites con la mitad izquierda, y así, hasta dar con la página.

Funciona por una sola razón: el diccionario está en orden alfabético. Con las palabras revueltas, abrir a la mitad no te diría nada.',
  'Se mantiene un rango de posiciones donde el valor todavía podría estar. Al inicio, el rango es todo el arreglo.

1. Calcula la posición del medio del rango.
2. Si el elemento del medio es el valor buscado, terminaste.
3. Si es menor que el valor buscado, el valor sólo puede estar a la derecha: el nuevo límite inferior es la posición siguiente al medio.
4. Si es mayor, sólo puede estar a la izquierda: el nuevo límite superior es la posición anterior al medio.
5. Repite mientras el rango tenga al menos un elemento. Si queda vacío, el valor no está.

En el visualizador, los marcadores `inf`, `med` y `sup` muestran el rango en cada paso, y la línea punteada indica la altura del valor buscado.',
  '**Los datos deben estar ordenados.** Es el requisito que más se olvida y el que hace que el algoritmo devuelva resultados equivocados sin dar ningún error. Si el arreglo no está ordenado, descartar una mitad deja de ser válido.

También necesita acceso directo a cualquier posición, para poder saltar al medio. En una lista enlazada, llegar al medio ya cuesta un recorrido, y la ventaja se pierde.',
  'Cada comparación reduce el rango a la mitad. La pregunta es cuántas veces se puede partir n a la mitad hasta llegar a uno, y la respuesta es log n. Para un millón de elementos son unas veinte comparaciones; para mil millones, unas treinta.

Ese crecimiento tan lento es lo que la distingue. Duplicar el tamaño de los datos agrega una sola comparación.',
  array['Los datos ya están ordenados, o vas a buscar tantas veces que vale la pena ordenarlos una vez.', 'El arreglo es grande. Mientras más grande, mayor es la ventaja sobre la búsqueda lineal.', 'Buscas un límite más que un valor exacto: la primera posición que cumple una condición en una secuencia ordenada.']::text[],
  array['Los datos no están ordenados y vas a buscar una sola vez. Ordenar cuesta más que una búsqueda lineal.', 'Los datos cambian constantemente. Mantener el arreglo ordenado tras cada inserción puede costar más de lo que ahorra la búsqueda.', 'No hay acceso directo por posición, como en una lista enlazada.']::text[],
  array['El punto medio se calcula como `inf + Math.floor((sup - inf) / 2)`. La forma que parece más natural, `(inf + sup) / 2`, puede desbordarse en lenguajes con enteros de tamaño fijo, como Java o C++, cuando el arreglo es muy grande. Es un error famoso que pasó años sin detectarse en bibliotecas muy usadas.', 'La condición del ciclo es `inf <= sup`, con el igual. Sin él, un rango de un solo elemento no se revisaría.', 'Los límites se mueven a `medio + 1` y `medio - 1`, nunca a `medio`. De lo contrario, el rango podría dejar de encogerse y el ciclo no terminaría.', 'Si hay valores repetidos, esta versión devuelve cualquiera de sus posiciones, no necesariamente la primera.']::text[],
  '[{"id":"busqueda-lineal","texto":"La [búsqueda lineal](/algoritmos/busqueda-lineal) no pide nada a los datos y paga por ello revisando todo. La binaria exige orden y a cambio descarta la mitad en cada paso. Cuál conviene depende de cuántas veces vayas a buscar."},{"id":"mezcla","texto":"Los ordenamientos existen, en buena medida, para hacer posible esta búsqueda. Ordenar una vez con un algoritmo de n log n y luego buscar muchas veces en log n es de las combinaciones más rentables de la computación."},{"id":"insercion-binaria","texto":"Usa búsqueda binaria dentro de inserción para localizar dónde va cada elemento."},{"id":"busqueda-interpolacion","texto":"En lugar de ir siempre al medio, estima la posición según el valor. Gana cuando los datos están repartidos de manera uniforme."}]'::jsonb
);
insert into public.fichas (algoritmo_id, analogia, como_funciona, requisitos, complejidad, usarlo, evitarlo, implementacion, relaciones) values (
  'busqueda-saltos',
  'Buscas un número de página en un libro grueso. Pasas las hojas de diez en diez hasta que el número que ves ya es mayor que el que buscas. Entonces sabes que te pasaste por poco, regresas al bloque anterior y lo recorres hoja por hoja.',
  '1. Elige un tamaño de salto. El mejor valor es la raíz cuadrada de la cantidad de elementos, redondeada hacia abajo.
2. Avanza de bloque en bloque mirando sólo el último elemento de cada uno. Mientras sea menor que el valor buscado, el valor no puede estar en ese bloque.
3. Cuando el último elemento de un bloque ya no es menor, el valor, si está, tiene que estar dentro de ese bloque.
4. Recorre ese bloque uno por uno, como en la búsqueda lineal.',
  '**Los datos deben estar ordenados**, como en la búsqueda binaria. También necesita poder saltar hacia adelante a una posición concreta.',
  'Con bloques de tamaño √n hay como mucho √n bloques que saltar y √n elementos que revisar dentro del último: unas 2√n comparaciones en el peor caso. Para un millón de elementos son unas dos mil.

Es mucho mejor que la búsqueda lineal y mucho peor que la binaria, que necesitaría unas veinte. Su interés no está en la cantidad de comparaciones, sino en el tipo de movimiento que hace.',
  array['Retroceder es caro y avanzar es barato, como en datos que se leen en secuencia desde un medio lento. Esta búsqueda sólo retrocede una vez.', 'Quieres algo más rápido que la búsqueda lineal pero con un código igual de sencillo de verificar.']::text[],
  array['Tienes acceso directo y barato a cualquier posición. La búsqueda binaria es mucho más rápida.', 'Los datos no están ordenados.']::text[],
  array['Se usa `Math.min(actual, n) - 1` para mirar el final del bloque. El último bloque puede ser más corto que los demás y no hay que leer fuera del arreglo.', 'El ciclo de saltos se detiene si `anterior` llega a `n`: significa que todos los bloques terminaron en valores menores y el buscado no está.', 'Con valores repetidos, devuelve la primera aparición dentro del bloque donde la encuentra.']::text[],
  '[{"id":"busqueda-lineal","texto":"Es la búsqueda que hace dentro del último bloque. Los saltos sólo sirven para no tener que empezar desde el principio."},{"id":"busqueda-binaria","texto":"Con datos ordenados y acceso directo, la [binaria](/algoritmos/busqueda-binaria) siempre necesita menos comparaciones. Saltos sólo gana cuando retroceder cuesta más que comparar."},{"id":"busqueda-exponencial","texto":"También avanza a saltos, pero cada vez más largos, y termina con búsqueda binaria en lugar de lineal."}]'::jsonb
);
insert into public.fichas (algoritmo_id, analogia, como_funciona, requisitos, complejidad, usarlo, evitarlo, implementacion, relaciones) values (
  'busqueda-interpolacion',
  'Si buscas el apellido Zamora en un directorio, no lo abres a la mitad: lo abres cerca del final, porque la Z está al final del alfabeto. Si buscas Bravo, lo abres cerca del principio.

No usas sólo el orden de los datos, sino también su valor, para adivinar dónde están.',
  'Funciona como la búsqueda binaria, pero cambia la forma de elegir qué posición mirar.

1. Toma el primer y el último valor del rango de búsqueda.
2. Calcula qué fracción del camino entre esos dos valores representa el valor buscado. Si está a un 70 % del camino, estima que su posición también está a un 70 % del rango.
3. Mira el elemento en esa posición estimada.
4. Si es el buscado, terminaste. Si es menor, el rango continúa a la derecha; si es mayor, a la izquierda.
5. Si el valor buscado queda fuera del intervalo de valores del rango, no está.

Con la entrada de ejemplo, repartida de forma pareja, encuentra el valor al primer intento; la búsqueda binaria necesitaría cuatro. Prueba ahora con `1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 99` buscando el 15: el 99 deforma la estimación y la búsqueda avanza casi de uno en uno.',
  '**Los datos deben estar ordenados y ser numéricos**, o al menos convertibles a un número con el que tenga sentido hacer la cuenta.

Para que rinda, además, deben estar repartidos de forma más o menos uniforme. Ese requisito no impide que funcione: sólo determina si va a ser rápida o lenta.',
  'Con datos uniformes, cada estimación cae tan cerca que el rango se reduce muchísimo más que a la mitad. En promedio necesita del orden de log log n intentos: para mil millones de elementos, unos cinco.

Con datos muy disparejos, la estimación puede quedar siempre del mismo lado del valor y descartar un solo elemento por intento. En ese peor caso es tan lenta como la búsqueda lineal.',
  array['Los datos son números ordenados y repartidos de forma pareja, como identificadores consecutivos con algunos huecos.', 'El arreglo es muy grande y cada acceso es caro, de modo que ahorrar intentos vale la pena.']::text[],
  array['No sabes cómo están repartidos los datos y necesitas un tiempo predecible. La binaria garantiza log n.', 'Los valores crecen de forma muy desigual, por ejemplo duplicándose.', 'Los datos no son numéricos.']::text[],
  array['Antes de dividir hay que comprobar que `arr[sup]` y `arr[inf]` sean distintos. Si son iguales, la fórmula divide entre cero.', 'La condición del ciclo también verifica que el valor esté dentro del intervalo `arr[inf]..arr[sup]`. Sin ella, la posición estimada podría caer fuera del arreglo.', 'La multiplicación de la fórmula puede desbordarse en lenguajes con enteros de tamaño fijo cuando los valores y el arreglo son grandes.']::text[],
  '[{"id":"busqueda-binaria","texto":"Es la binaria con una estimación más inteligente del punto a mirar. Gana con datos uniformes y pierde, a veces por mucho, con datos disparejos."},{"id":"cubetas","texto":"Hace la misma apuesta que el ordenamiento por cubetas: usar la magnitud del valor para saltar directo a la zona correcta. Ambos dependen de que los datos sean uniformes."},{"id":"busqueda-lineal","texto":"Es la referencia de su peor caso: con datos muy disparejos, interpolación termina revisando casi uno por uno."}]'::jsonb
);
insert into public.fichas (algoritmo_id, analogia, como_funciona, requisitos, complejidad, usarlo, evitarlo, implementacion, relaciones) values (
  'busqueda-exponencial',
  'Perdiste algo en un camino largo y no sabes hasta dónde llegaste. Caminas un paso y miras; luego dos; luego cuatro; luego ocho. En cuanto ves que ya te pasaste, sabes que está en el último tramo que recorriste, y ahí sí buscas con cuidado.',
  '1. Revisa el primer elemento.
2. Mira las posiciones 1, 2, 4, 8, 16… duplicando cada vez, mientras el elemento no sea mayor que el valor buscado.
3. Al pasarse, el valor sólo puede estar entre la mitad de esa posición y la posición misma: el último tramo recorrido.
4. Aplica búsqueda binaria en ese tramo.',
  '**Los datos deben estar ordenados.** A diferencia de la búsqueda binaria, no necesita conocer de antemano cuántos elementos hay: basta con poder preguntar si una posición existe.',
  'Si el valor está en la posición i, la fase de duplicar hace del orden de log i pasos y deja un tramo de tamaño parecido a i, que la búsqueda binaria resuelve en otros log i. El total depende de dónde está el valor, no del tamaño del arreglo.

Por eso es muy rápida para valores cercanos al principio. En el peor caso, con el valor al final, iguala a la búsqueda binaria: log n.',
  array['No conoces el tamaño de los datos, o son una secuencia sin fin, como los resultados que va devolviendo un servicio.', 'Es probable que el valor esté cerca del principio.']::text[],
  array['Conoces el tamaño y el valor puede estar en cualquier parte. La binaria directa hace un poco menos de trabajo.', 'Los datos no están ordenados.']::text[],
  array['El tramo final va de `Math.floor(i / 2)` a `Math.min(i, n - 1)`. El mínimo evita leer fuera del arreglo cuando el último salto se pasó del final.', 'El primer elemento se revisa aparte, porque la duplicación empieza en la posición 1.', 'La fase de búsqueda binaria es la misma de su propia ficha, con el mismo cuidado para calcular el punto medio.']::text[],
  '[{"id":"busqueda-binaria","texto":"La usa como segunda fase. La fase de duplicar sólo sirve para encontrar un tramo pequeño donde aplicar la [binaria](/algoritmos/busqueda-binaria)."},{"id":"busqueda-saltos","texto":"También avanza a saltos, pero de tamaño fijo, y termina revisando linealmente en lugar de con búsqueda binaria."},{"id":"mezcla","texto":"Timsort, que se basa en la mezcla, usa esta misma idea en su modo de galope: cuando una mitad gana muchas veces seguidas, busca exponencialmente hasta dónde sigue ganando en vez de comparar uno por uno."}]'::jsonb
);

commit;
