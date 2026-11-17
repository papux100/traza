# Traza

Catálogo interactivo de algoritmos de ordenamiento y búsqueda. Cada ficha explica un algoritmo y permite ejecutarlo paso a paso con datos propios: avanzar, retroceder, cambiar la velocidad y seguir en el código la línea que se está ejecutando.

Sin cuenta se pueden abrir cinco fichas. Con una cuenta gratuita se abren las diecinueve. Las cuentas y el contenido de las fichas viven en una base de datos de Supabase.

Proyecto de la materia Aplicaciones Web (UABC, FIAD).

## Cómo ejecutarlo

Requiere Node 20 o superior, pnpm y un proyecto de Supabase configurado (ver la sección siguiente).

```bash
pnpm install
pnpm dev        # servidor de desarrollo en http://localhost:5173
pnpm test       # pruebas del motor y de los algoritmos
pnpm build      # versión de producción en la carpeta dist
pnpm preview    # sirve la carpeta dist para revisarla
```

## Backend con Supabase

Supabase cumple el papel de backend: base de datos PostgreSQL, registro e inicio de sesión, y reglas de acceso.

### Configuración inicial (una sola vez)

1. Crea un proyecto en [supabase.com](https://supabase.com).
2. En **Authentication, Sign In / Providers, User Signups**, desactiva **Confirm email** mientras desarrollas.
3. En el **SQL Editor**, ejecuta en orden:
   - `supabase/01-esquema.sql`: tablas, reglas de acceso y perfiles.
   - `supabase/02-datos.sql`: los 19 algoritmos y el contenido de sus fichas.
4. Copia `.env.example` como `.env.local` y pon la **Project URL** y la **publishable key** que aparecen en el botón **Connect** del proyecto.
5. Reinicia `pnpm dev`.

### Tablas

| Tabla | Contenido |
|---|---|
| `algoritmos` | Nombre, familia, bloque, complejidades y la columna `publico` |
| `fichas` | Textos de cada ficha en Markdown sencillo, una fila por algoritmo |
| `perfiles` | Nombre de cada usuario. Se crea solo al registrarse, con un disparador |

Las cuentas y las contraseñas las administra Supabase Auth en su propia tabla (`auth.users`); el proyecto nunca guarda contraseñas.

### Quién ve qué

Las reglas de acceso (RLS) están en `supabase/01-esquema.sql` y se aplican en el servidor:

| | Sin cuenta | Con cuenta |
|---|---|---|
| Catálogo (`algoritmos`) | Todo | Todo |
| Fichas | Sólo las de algoritmos con `publico = true` | Todas |
| Perfiles | Ninguno | Sólo el propio |
| Modificar algoritmos o fichas | No | No |

Como la regla vive en la base de datos, una ficha privada no llega al navegador aunque alguien modifique el código del sitio. Lo que sí es público es el código de los algoritmos y del visualizador, porque se ejecuta en el navegador.

Para cambiar qué fichas son públicas, edita la columna `publico` en el **Table Editor** de Supabase. No hace falta tocar el código.

### Cómo se consulta

Igual que en un sitio que consume una API: los componentes leen de stores de Zustand, y los stores piden los datos a `src/servicios/api.js`, el único archivo que habla con Supabase.

```
componente  ->  store (useCatalogo, useFichas, useSesion)  ->  servicios/api.js  ->  Supabase
```

## Herramientas

| Herramienta | Uso en el proyecto |
|---|---|
| React + Vite | Interfaz y entorno de desarrollo |
| React Router | Una dirección por ficha (`/algoritmos/quicksort`) |
| Tailwind CSS + componentes estilo shadcn (Base UI) | Estilos, botones, deslizadores, tablas |
| Zustand | Estado del reproductor, del catálogo, de las fichas y de la sesión |
| Supabase | Base de datos, cuentas de usuario y reglas de acceso |
| Motion | Animación de las barras al cambiar de posición |
| prism-react-renderer | Resaltado del código y de la línea en ejecución |
| Vitest | Pruebas automáticas |

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
├── servicios/api.js       Todas las consultas a Supabase
├── stores/                Catálogo, fichas y sesión (Zustand)
├── lib/
│   ├── supabase.js        Cliente de Supabase
│   └── markdown.js        Lector del Markdown de las fichas (no admite HTML)
├── datos/catalogo.js      Familias y bloques del catálogo
├── componentes/
│   ├── ui/                Botón, deslizador, tabla, etiqueta
│   ├── visualizador/      Barras, controles, contadores, leyenda, código, editor
│   ├── ficha/Ficha.jsx    Plantilla común de todas las fichas
│   ├── Markdown.jsx       Dibuja el texto de las fichas
│   └── Layout.jsx         Menú lateral, cuenta y estructura de página
└── paginas/               Catálogo, ficha, comparativa, conceptos, registro, inicio de sesión
supabase/
├── 01-esquema.sql         Tablas, reglas de acceso y perfiles
└── 02-datos.sql           Algoritmos y contenido de las fichas
```

## Cómo agregar un algoritmo

1. **Escribe su módulo** en `src/algoritmos/`. Copia `burbuja.js` como punto de partida.
   - El código que se muestra va dentro de `marcarCodigo`. Las marcas `//@nombre` al final de una línea se quitan al mostrarlo y permiten decir `linea: L.nombre` en un paso, sin contar líneas a mano.
   - Registra cada momento interesante con `g.paso(arreglo, descripcion, detalle)`.
   - Cuenta el trabajo con `g.comparar()`, `g.escribir()` y `g.intercambiar()`.
2. **Regístralo** en `src/algoritmos/registro.js`.
3. **Agrega su fila** en la tabla `algoritmos` de Supabase, con el mismo `id` que usaste en el módulo.
4. **Escribe su ficha** como una fila de la tabla `fichas`. Los textos admiten párrafos separados por una línea en blanco, listas (`1.` o `-`), `` `código` ``, `**negritas**` y enlaces `[texto](/algoritmos/id)`.

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

También se prueban el lector de Markdown (incluido que no acepte enlaces peligrosos ni HTML) y la validación de los formularios de cuenta.

## Publicación

El sitio es estático. `pnpm build` genera la carpeta `dist`, que se puede subir a cualquier servicio de hospedaje.

Como usa rutas del lado del cliente, el servidor debe responder con `index.html` ante cualquier dirección. Ya están incluidos los archivos para eso:

- **Vercel:** `vercel.json`
- **Netlify y Cloudflare Pages:** `public/_redirects`

En ambos casos basta con conectar el repositorio de GitHub; el comando de compilación es `pnpm build` y la carpeta de salida es `dist`.

En el hospedaje hay que agregar las mismas dos variables de `.env.local` (`VITE_SUPABASE_URL` y `VITE_SUPABASE_PUBLISHABLE_KEY`) en su configuración de variables de entorno. Sin ellas, el sitio muestra un aviso de que falta configurar Supabase.

El plan gratuito de Supabase pausa el proyecto tras una semana sin uso. Antes de una presentación, conviene entrar al panel y comprobar que esté activo.

## Pendiente

Los 19 algoritmos del catálogo tienen ficha. Quedan como ampliaciones posibles la comparación en paralelo de dos algoritmos sobre el mismo arreglo y los artículos de cierre: qué ordenamientos usan las bibliotecas estándar (Timsort, introsort) y cuándo conviene ordenar antes de buscar.
