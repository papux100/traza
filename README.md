# Traza

Catálogo interactivo de algoritmos de ordenamiento y búsqueda. Cada ficha explica un algoritmo y permite ejecutarlo paso a paso con datos propios: avanzar, retroceder, cambiar la velocidad y seguir en el código la línea que se está ejecutando.

Proyecto de la materia Aplicaciones Web (UABC, FIAD).

## Cómo ejecutarlo

Requiere Node 20 o superior y pnpm.

```bash
pnpm install
pnpm dev        # servidor de desarrollo en http://localhost:5173
pnpm test       # pruebas del motor y de los algoritmos
pnpm build      # versión de producción en la carpeta dist
pnpm preview    # sirve la carpeta dist para revisarla
```

## Herramientas

| Herramienta | Uso en el proyecto |
|---|---|
| React + Vite | Interfaz y entorno de desarrollo |
| React Router | Una dirección por ficha (`/algoritmos/quicksort`) |
| Tailwind CSS + componentes estilo shadcn (Base UI) | Estilos, botones, deslizadores, tablas |
| Zustand | Estado del reproductor (un store por visualizador) y preferencias guardadas en el navegador |
| Motion | Animación de las barras al cambiar de posición |
| prism-react-renderer | Resaltado del código y de la línea en ejecución |
| Vitest | Pruebas automáticas |

No hay backend ni base de datos: todo corre en el navegador.

## Idea central

El algoritmo no anima nada. Se ejecuta completo de inmediato y deja una **traza**: una lista de pasos inmutables. Un reproductor independiente recorre esa lista. Por eso retroceder, saltar a cualquier punto y cambiar la velocidad no cuestan nada: sólo cambia un índice.

```
algoritmo  ->  traza (lista de pasos)  ->  reproductor (índice)  ->  dibujo
```

Las dependencias van en un solo sentido. Un algoritmo no sabe que existe una pantalla, el reproductor no sabe qué algoritmo ejecutó, y el dibujo no sabe cómo se generó el paso que recibe.

## Estructura

```
src/
├── motor/                 Lógica sin interfaz
│   ├── traza.js           Grabador de pasos. Aquí se copia el arreglo en cada paso
│   ├── reproductor.js     Fábrica de stores de Zustand: índice, reproducir, pausar
│   ├── preferencias.js    Velocidad preferida, guardada con persist
│   └── entrada.js         Validación del arreglo que escribe el usuario
├── algoritmos/            Un archivo por algoritmo, más el registro
│   ├── registro.js
│   ├── insercion.js ...
│   └── algoritmos.test.js
├── datos/catalogo.js      Nombres, bloques, complejidades (sólo información)
├── componentes/
│   ├── ui/                Botón, deslizador, tabla, etiqueta
│   ├── visualizador/      Barras, controles, contadores, leyenda, código, editor
│   ├── ficha/Ficha.jsx    Plantilla común de todas las fichas
│   └── Layout.jsx         Menú lateral y estructura de página
├── fichas/                El contenido de cada ficha, en JSX
└── paginas/               Catálogo, ficha, tabla comparativa, conceptos
```

## Cómo agregar un algoritmo

1. **Escribe su módulo** en `src/algoritmos/`. Copia `burbuja.js` como punto de partida.
   - El código que se muestra va dentro de `marcarCodigo`. Las marcas `//@nombre` al final de una línea se quitan al mostrarlo y permiten decir `linea: L.nombre` en un paso, sin contar líneas a mano.
   - Registra cada momento interesante con `g.paso(arreglo, descripcion, detalle)`.
   - Cuenta el trabajo con `g.comparar()`, `g.escribir()` y `g.intercambiar()`.
2. **Regístralo** en `src/algoritmos/registro.js`.
3. **Activa sus datos** en `src/datos/catalogo.js`: pon `disponible: true` y completa complejidad, memoria y estabilidad.
4. **Escribe su ficha** en `src/fichas/` usando el componente `Ficha`, y agrégala a `src/fichas/index.js`.

El reproductor y el visualizador no se tocan. Al ejecutar `pnpm test`, el algoritmo nuevo queda cubierto automáticamente por las pruebas.

### Zonas auxiliares

Algunos algoritmos sacan elementos del arreglo: los reparten en cubetas, los pasan a un arreglo de salida o los insertan en un árbol. Para dibujarlos, cada paso puede llevar una zona extra en `detalle.auxiliar`:

| Tipo | Usado por | Contenido |
|---|---|---|
| `cubetas` | residuos, cubetas | Lista de cubetas, cada una con su etiqueta y sus elementos |
| `conteo` | conteo | Casillas con su valor y el arreglo de salida |
| `arbol` | árbol | Lista de nodos con sus hijos izquierdo y derecho, y la raíz |

Mientras un elemento está en la zona extra, su posición en el arreglo queda en `null` y se dibuja como un hueco. Los colores de los elementos de la zona se indican con `detalle.porId`, por identificador de elemento. Si un algoritmo sólo admite valores pequeños, declara `valorMax` y el editor lo respeta.

### Dos reglas al instrumentar

- **Cada paso debe contener los mismos elementos, sin repetidos**, contando el arreglo y la zona auxiliar. Los algoritmos que desplazan en lugar de intercambiar (inserción, Shell, mezcla) duplican un valor por un instante. Para dibujarlos, construyen una "vista" del arreglo en la que cada elemento aparece una sola vez. Las pruebas detectan si se olvida.
- **Nunca guardes el arreglo directamente.** Pásalo a `g.paso`, que es quien hace la copia.

## Qué verifican las pruebas

Para cada uno de los 19 algoritmos, con 46 entradas (casos límite más arreglos aleatorios con semilla fija):

- El resultado queda ordenado y conserva los elementos originales.
- La entrada no se modifica y el primer paso la muestra intacta.
- Ningún elemento se pierde ni se duplica al pasar entre el arreglo y una zona auxiliar.
- Ningún paso comparte arreglo con el anterior, y los contadores nunca disminuyen.
- Cada línea resaltada existe en el código mostrado.
- **El código que se muestra en la ficha se evalúa y se comprueba que ordena de verdad**, y que con valores repetidos deja los elementos en el mismo orden que la traza.

Para las búsquedas se comprueba además que encuentran los valores presentes y devuelven -1 con los ausentes.

## Publicación

El sitio es estático. `pnpm build` genera la carpeta `dist`, que se puede subir a cualquier servicio de hospedaje.

Como usa rutas del lado del cliente, el servidor debe responder con `index.html` ante cualquier dirección. Ya están incluidos los archivos para eso:

- **Vercel:** `vercel.json`
- **Netlify y Cloudflare Pages:** `public/_redirects`

En ambos casos basta con conectar el repositorio de GitHub; el comando de compilación es `pnpm build` y la carpeta de salida es `dist`.

## Pendiente

Los 19 algoritmos del catálogo tienen ficha. Quedan como ampliaciones posibles la comparación en paralelo de dos algoritmos sobre el mismo arreglo y los artículos de cierre: qué ordenamientos usan las bibliotecas estándar (Timsort, introsort) y cuándo conviene ordenar antes de buscar.
