# Traza

Catálogo interactivo de algoritmos de ordenamiento y búsqueda. Cada ficha explica un algoritmo y permite ejecutarlo paso a paso con datos propios: avanzar, retroceder, cambiar la velocidad y seguir en el código la línea que se está ejecutando.

Sin cuenta se pueden abrir cinco fichas. Con una cuenta gratuita se abren las diecinueve.

El proyecto tiene dos partes: el **frontend** en React y una **API** propia en Fastify, que consulta una base de datos PostgreSQL alojada en Supabase.

Proyecto de la materia Aplicaciones Web (UABC, FIAD).

## Cómo ejecutarlo

Requiere Node 20.19 o superior, pnpm y un proyecto de Supabase configurado (ver la sección siguiente). Se usan dos terminales.

**Terminal 1, la API:**

```bash
cd servidor
npm install
npm run dev     # API en http://localhost:3000
npm test        # pruebas de la API
```

**Terminal 2, el frontend:**

```bash
pnpm install
pnpm dev        # sitio en http://localhost:5173; las peticiones a /api van a la terminal 1
pnpm test       # pruebas del reproductor, la entrada y los formularios
pnpm build      # versión de producción en la carpeta dist
pnpm preview    # sirve la carpeta dist para revisarla
```

## Arquitectura

Cliente-servidor en tres partes, cada una publicada por separado:

```
Navegador (React, en Vercel)
   │  fetch /api/...  +  token de sesión
   ▼
API propia (Fastify, en Render)        servidor/
   │  ejecuta los algoritmos y devuelve sus trazas
   │  SQL con la cadena de conexión (DATABASE_URL)
   ▼
PostgreSQL (en Supabase)               supabase/01-esquema.sql, 02-datos.sql

Supabase Auth: registro, inicio de sesión y tokens (el navegador y la API lo consultan)
```

### La API (`servidor/`)

| Ruta | Acceso | Respuesta |
|---|---|---|
| `GET /api/salud` | Público | Estado del servidor y de la base de datos |
| `GET /api/algoritmos` | Público | El catálogo completo |
| `GET /api/fichas/:id` | Público si el algoritmo es público; si no, requiere sesión | La ficha, o `401` con el código `requiere_cuenta` |
| `POST /api/algoritmos/:id/ejecucion` | Igual que la ficha: público o con sesión | Ejecuta el algoritmo con la entrada enviada y devuelve su código y su traza |
| `GET /api/perfil` | Requiere sesión | Nombre y correo del usuario |

Ejemplo de ejecución:

```
POST /api/algoritmos/insercion/ejecucion
{ "entrada": [5, 2, 9, 1] }

200 { "algoritmo": { "codigo": "function insercion(arr) {…", … },
      "entrada": [5, 2, 9, 1], "resultado": [1, 2, 5, 9],
      "pasos": [ { "elementos": […], "estados": […], "descripcion": "…", "linea": 4, … }, … ] }
```

Sin `entrada`, usa los datos de ejemplo del algoritmo. En las búsquedas se manda también `objetivo`.

| Archivo | Qué hace |
|---|---|
| `src/index.js` | Punto de entrada: lee la configuración, crea la conexión y enciende el servidor |
| `src/config.js` | Lee las variables de entorno |
| `src/db.js` | **Conexión a PostgreSQL** con la cadena `DATABASE_URL` (pool de conexiones) |
| `src/consultas.js` | Todas las consultas SQL, con parámetros para evitar inyección |
| `src/auth.js` | Verifica con Supabase Auth el token que manda el navegador |
| `src/app.js` | Arma la aplicación: CORS, límite de peticiones, manejo de errores y rutas |
| `src/esquemas.js` | Esquemas JSON con los que Fastify valida la entrada y filtra la salida |
| `src/rutas/` | Un archivo por grupo de rutas; `ejecucion.js` ejecuta los algoritmos |
| `src/algoritmos/` | Los 19 algoritmos instrumentados y su registro |
| `src/motor/traza.js` | Grabador de pasos que usan todos los algoritmos |
| `test/` | Pruebas de los algoritmos, de las rutas y de las consultas |

La cadena de conexión incluye la contraseña de la base de datos, por eso sólo existe en el servidor (`servidor/.env` en tu computadora, variables de entorno en Render) y nunca llega al navegador.

**Seguridad de la API:**

- La regla "los algoritmos privados sólo con sesión" se aplica en el servidor, tanto al leer la ficha como al ejecutar el algoritmo. Como el código de los algoritmos vive en el servidor, el de los privados no viaja al navegador de quien no tiene cuenta.
- La entrada de cada ejecución se valida en el servidor aunque el navegador ya la haya validado: de 2 a 16 enteros entre 1 y 99, o el máximo propio del algoritmo (15 en conteo).
- El `id` de la URL se valida con un esquema (sólo minúsculas y guiones) y las consultas usan parámetros.
- CORS sólo acepta los orígenes de `ORIGENES_PERMITIDOS`.
- Límite de 120 peticiones por minuto por dirección IP.
- Los errores internos responden un mensaje genérico; el detalle sólo queda en el registro del servidor.
- Las respuestas se comprimen con gzip o brotli. Una traza de 16 elementos pasa de unos 220 KB a menos de 10 KB.

### Supabase: base de datos y cuentas

#### Configuración inicial (una sola vez)

1. Crea un proyecto en [supabase.com](https://supabase.com) y guarda la contraseña de la base de datos.
2. En **Authentication, Sign In / Providers, User Signups**, desactiva **Confirm email** mientras desarrollas.
3. En el **SQL Editor**, ejecuta en orden `supabase/01-esquema.sql` y `supabase/02-datos.sql`.
4. **Frontend:** copia `.env.example` como `.env.local` y pon la **Project URL** y la **publishable key** del botón **Connect**.
5. **API:** copia `servidor/.env.example` como `servidor/.env`. Además de los dos valores anteriores, pon la cadena de conexión: en **Connect**, la opción **Session pooler**, reemplazando `[YOUR-PASSWORD]` por la contraseña de la base de datos.

#### Tablas

| Tabla | Contenido |
|---|---|
| `algoritmos` | Nombre, familia, bloque, complejidades y la columna `publico` |
| `fichas` | Textos de cada ficha en Markdown sencillo, una fila por algoritmo |
| `perfiles` | Nombre de cada usuario. Se crea solo al registrarse, con un disparador |

Las cuentas y las contraseñas las administra Supabase Auth en su propia tabla (`auth.users`); el proyecto nunca guarda contraseñas.

Para cambiar qué fichas son públicas, edita la columna `publico` en el **Table Editor** de Supabase. No hace falta tocar el código.

#### Reglas de acceso en la base de datos (RLS)

`01-esquema.sql` también activa reglas RLS: sin sesión sólo se leen las fichas públicas, cada usuario sólo ve su perfil y nadie puede modificar algoritmos ni fichas con la clave publicable. La API se conecta con un usuario con permisos completos y aplica sus propias reglas, así que RLS funciona como una segunda barrera si alguien intenta consultar Supabase directamente con la clave pública del sitio.

### Cómo consulta el frontend

Los componentes leen de stores de Zustand, y los stores piden los datos a `src/servicios/api.js`, que hace `fetch` a la API, igual que un sitio que consume una API externa:

```
componente  ->  store (useCatalogo, useFichas, useSesion)  ->  servicios/api.js  ->  fetch /api/...
```

Para el registro y el inicio de sesión, `api.js` usa el cliente de Supabase Auth (`src/lib/supabase.js`).

## Herramientas

| Herramienta | Uso en el proyecto |
|---|---|
| React + Vite | Interfaz y entorno de desarrollo |
| React Router | Una dirección por ficha (`/algoritmos/quicksort`) |
| Tailwind CSS + componentes estilo shadcn (Base UI) | Estilos, botones, deslizadores, tablas |
| Zustand | Estado del reproductor, del catálogo, de las fichas y de la sesión |
| Fastify | API propia: rutas, validación con esquemas, CORS y límite de peticiones |
| node-postgres (`pg`) | Conexión de la API a PostgreSQL |
| Supabase | Base de datos PostgreSQL y cuentas de usuario |
| Motion | Animación de las barras al cambiar de posición |
| prism-react-renderer | Resaltado del código y de la línea en ejecución |
| Vitest | Pruebas automáticas |

## Idea central

El algoritmo no anima nada. Se ejecuta completo de inmediato y deja una **traza**: una lista de pasos inmutables. Un reproductor independiente recorre esa lista. Por eso retroceder, saltar a cualquier punto y cambiar la velocidad no cuestan nada: sólo cambia un índice.

```
algoritmo (servidor)  ->  traza en JSON (HTTP)  ->  reproductor (navegador)  ->  dibujo
```

Las dependencias van en un solo sentido. Un algoritmo no sabe que existe una pantalla, el reproductor no sabe qué algoritmo ejecutó, y el dibujo no sabe cómo se generó el paso que recibe. Esa separación es lo que permitió mover los algoritmos al servidor sin tocar el dibujo: la traza simplemente viaja por la red.

## Estructura

```
src/
├── motor/                 Lógica sin interfaz
│   ├── reproductor.js     Pide la traza a la API y la recorre: índice, reproducir, pausar
│   ├── preferencias.js    Velocidad preferida, guardada con persist
│   └── entrada.js         Validación del arreglo que escribe el usuario
├── servicios/api.js       Todas las peticiones a la API y a Supabase Auth
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
servidor/                  API con Fastify (ver la sección Arquitectura)
├── src/algoritmos/        Un archivo por algoritmo, más el registro
└── src/motor/traza.js     Grabador de pasos. Aquí se copia el arreglo en cada paso
supabase/
├── 01-esquema.sql         Tablas, reglas de acceso y perfiles
└── 02-datos.sql           Algoritmos y contenido de las fichas
```

## Cómo agregar un algoritmo

1. **Escribe su módulo** en `servidor/src/algoritmos/`. Copia `burbuja.js` como punto de partida.
   - El código que se muestra va dentro de `marcarCodigo`. Las marcas `//@nombre` al final de una línea se quitan al mostrarlo y permiten decir `linea: L.nombre` en un paso, sin contar líneas a mano.
   - Registra cada momento interesante con `g.paso(arreglo, descripcion, detalle)`.
   - Cuenta el trabajo con `g.comparar()`, `g.escribir()` y `g.intercambiar()`.
2. **Regístralo** en `servidor/src/algoritmos/registro.js`.
3. **Agrega su fila** en la tabla `algoritmos` de Supabase, con el mismo `id` que usaste en el módulo.
4. **Escribe su ficha** como una fila de la tabla `fichas`. Los textos admiten párrafos separados por una línea en blanco, listas (`1.` o `-`), `` `código` ``, `**negritas**` y enlaces `[texto](/algoritmos/id)`.

El reproductor y el visualizador no se tocan. Al ejecutar `npm test` dentro de `servidor`, el algoritmo nuevo queda cubierto automáticamente por las pruebas.

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

**En la API** (`cd servidor && npm test`), para cada uno de los 19 algoritmos, con 46 entradas (casos límite más arreglos aleatorios con semilla fija):

- El resultado queda ordenado y conserva los elementos originales.
- La entrada no se modifica y el primer paso la muestra intacta.
- Ningún elemento se pierde ni se duplica al pasar entre el arreglo y una zona auxiliar.
- Ningún paso comparte arreglo con el anterior, y los contadores nunca disminuyen.
- Cada línea resaltada existe en el código mostrado.
- **El código que se muestra en la ficha se evalúa y se comprueba que ordena de verdad**, y que con valores repetidos deja los elementos en el mismo orden que la traza.

Para las búsquedas se comprueba además que encuentran los valores presentes y devuelven -1 con los ausentes.

También se prueba cada ruta: fichas y ejecuciones públicas y privadas, con y sin sesión, tokens falsos, entradas inválidas, ids inválidos, CORS, compresión, el límite de peticiones y que un error de la base de datos no revele detalles. Si se define `DATABASE_URL_PRUEBA` con una base de datos que tenga los scripts de `supabase/`, también se prueban las consultas reales.

**En el frontend** (`pnpm test`) se prueban el reproductor con un servidor simulado (carga, bloqueo, errores y respuestas que llegan en desorden), la validación de la entrada, el lector de Markdown (incluido que no acepte enlaces peligrosos ni HTML) y la validación de los formularios de cuenta.

## Publicación

Se publican dos cosas: la API en Render y el frontend en Vercel. La base de datos ya está en línea en Supabase.

### 1. La API en Render

1. Sube el repositorio a GitHub.
2. En [render.com](https://render.com), crea un **Web Service** a partir del repositorio con:
   - **Root Directory:** `servidor`
   - **Build Command:** `npm ci`
   - **Start Command:** `npm start`
   - **Instance Type:** Free
3. En **Environment**, agrega `DATABASE_URL`, `SUPABASE_URL`, `SUPABASE_PUBLISHABLE_KEY` y `ORIGENES_PERMITIDOS` (por ahora, `http://localhost:5173`).
4. Cuando termine, abre `https://tu-api.onrender.com/api/salud`. Debe responder `{"estado":"ok","baseDeDatos":"ok"}`.

También se puede crear con **New, Blueprint**, que lee la configuración de `render.yaml`.

En el plan gratuito, el servicio se duerme tras unos minutos sin uso y la primera petición tarda alrededor de un minuto en despertarlo. Antes de una presentación, abre `/api/salud` para despertarlo.

### 2. El frontend en Vercel

1. En [vercel.com](https://vercel.com), importa el mismo repositorio. Vercel detecta Vite y pnpm.
2. Agrega las variables `VITE_SUPABASE_URL`, `VITE_SUPABASE_PUBLISHABLE_KEY` y `VITE_API_URL` (la dirección de Render, sin `/` al final).
3. Publica.

`vercel.json` ya hace que cualquier ruta del sitio responda con `index.html`.

### 3. Conectar ambos

- En Render, cambia `ORIGENES_PERMITIDOS` para incluir la dirección de Vercel, por ejemplo `https://traza.vercel.app,http://localhost:5173`.
- En Supabase, en **Authentication, URL Configuration**, pon la dirección de Vercel como **Site URL**.

El plan gratuito de Supabase pausa el proyecto tras una semana sin uso. Antes de una presentación, conviene entrar al panel y comprobar que esté activo.

## Pendiente

Los 19 algoritmos del catálogo tienen ficha. Quedan como ampliaciones posibles la comparación en paralelo de dos algoritmos sobre el mismo arreglo y los artículos de cierre: qué ordenamientos usan las bibliotecas estándar (Timsort, introsort) y cuándo conviene ordenar antes de buscar.
