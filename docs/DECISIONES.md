# Diario de decisiones

Registro de las decisiones importantes del proyecto Traza: qué se decidió, qué otras opciones había y por qué se eligió cada una. Cada entrada sigue el formato de un ADR (Architecture Decision Record).

Las fechas son aproximadas. Salen de la propuesta del proyecto y de la fecha de los archivos que introdujo cada decisión.

Para agregar una decisión nueva, copia la plantilla del final, dale el siguiente número y no borres las anteriores. Si una decisión cambia, márcala como **Reemplazada** y apunta a la nueva.

## Índice

| # | Decisión | Fecha | Estado |
|---|---|---|---|
| 1 | Catálogo de fichas con visualizador integrado | 2026-08-28 | Aceptada |
| 2 | 14 algoritmos de ordenamiento y 5 de búsqueda | 2026-08-28 | Aceptada |
| 3 | React, Vite, shadcn y Zustand | 2026-11-13 | Aceptada |
| 4 | Visualización basada en trazas | 2026-11-13 | Aceptada |
| 5 | Implementaciones sólo en JavaScript, probadas | 2026-11-13 | Aceptada |
| 6 | Cuentas y datos en Supabase | 2026-11-17 | Aceptada |
| 7 | Contenido de las fichas en la base de datos | 2026-11-17 | Aceptada (reemplaza las fichas en JSX) |
| 8 | API propia con Fastify | 2026-11-17 | Aceptada |
| 9 | Los algoritmos se ejecutan en el servidor | 2026-11-21 | Aceptada |
| 10 | Manejo de claves y datos sensibles | 2026-11-17 | Aceptada |
| 11 | Publicación en Vercel, Render y Supabase | 2026-11-22 | Aceptada |
| 12 | Workspace de pnpm | 2026-11-22 | Aceptada (reemplaza npm en el servidor) |
| 13 | Estrategia de pruebas | 2026-11-13 | Aceptada |
| 14 | Diseño visual: triángulos que se fragmentan | 2026-11-22 | Aceptada (reemplaza el primer tema oscuro) |
| 15 | Enlaces, botones y accesibilidad | 2026-11-22 | Aceptada |
| 16 | Un reproductor independiente por visualizador | 2026-11-13 | Aceptada |
| 17 | Dependencias con antigüedad mínima | 2026-11-13 | Aceptada |

---

## 1. Catálogo de fichas con visualizador integrado

- **Fecha:** 2026-08-28 (propuesta entregada)
- **Estado:** Aceptada

**Contexto.** El proyecto de Aplicaciones Web necesitaba una página con contenido real y algo interactivo. La primera idea era sólo un visualizador de ordenamiento paso a paso.

**Decisión.** Hacer un catálogo al estilo de Refactoring Guru: una ficha por algoritmo, todas con la misma estructura (intención, analogía, cómo funciona, visualizador, requisitos previos, complejidad, cuándo usarlo, implementación y relación con otros algoritmos).

**Alternativas.**
- Un visualizador suelto, sin explicación alrededor.
- Un blog con un artículo por algoritmo, sin interacción.

**Motivo.** La estructura fija hace que comparar algoritmos sea fácil y que cada ficha nueva sea predecible de escribir. El visualizador le da sentido a la explicación, y la explicación le da sentido al visualizador.

**Consecuencias.** Cada algoritmo necesita texto, código y una traza visual. Agregar uno cuesta más que en un visualizador suelto.

---

## 2. 14 algoritmos de ordenamiento y 5 de búsqueda

- **Fecha:** 2026-08-28
- **Estado:** Aceptada

**Contexto.** La propuesta empezó sólo con ordenamiento. Después se pidió agregar búsqueda y ampliar el ordenamiento a 12 o 14.

**Decisión.** 19 algoritmos en total, agrupados en bloques:
- **Ordenamiento cuadrático:** inserción, inserción binaria, burbuja, coctelera, selección.
- **Ordenamiento con mejoras por intervalos:** Shell, peine.
- **Ordenamiento eficiente:** mezcla, quicksort, montículos, árbol.
- **Ordenamiento sin comparaciones:** conteo, residuos, cubetas.
- **Búsqueda:** lineal, binaria, por saltos, por interpolación, exponencial.

La primera construcción se hizo con un núcleo de 9 y luego se completaron los demás.

**Motivo.** Cubre las familias que se ven en un curso de estructuras de datos y deja ver contrastes claros: estable contra no estable, en el sitio contra con memoria extra, comparaciones contra conteo.

**Consecuencias.** Algunos algoritmos necesitan zonas auxiliares en el visualizador (cubetas, tabla de conteo, árbol), no sólo barras.

---

## 3. React, Vite, shadcn y Zustand

- **Fecha:** 2026-11-13
- **Estado:** Aceptada

**Contexto.** El plan original era una página estática ejecutada con Live Server. En clase se hizo un demo (Pokédex) con React, Vite, shadcn y Zustand.

**Decisión.** Usar ese mismo conjunto: React con Vite, componentes estilo shadcn sobre Base UI, Tailwind para estilos, Zustand para el estado y React Router para tener una dirección por ficha. Para las animaciones se agregó Motion, y para resaltar el código, prism-react-renderer.

**Alternativas.**
- HTML, CSS y JavaScript sin framework, con Live Server.
- Next.js.

**Motivo.** Es lo visto en clase, así que el proyecto demuestra lo aprendido. Con 19 visualizadores que comparten controles, los componentes evitan repetir código. shadcn no anima cambios de posición, por eso se agregó Motion.

**Consecuencias.** Hace falta un paso de compilación (`pnpm build`) antes de publicar.

---

## 4. Visualización basada en trazas

- **Fecha:** 2026-11-13
- **Estado:** Aceptada

**Contexto.** El visualizador debe avanzar, retroceder, saltar a cualquier paso y cambiar de velocidad.

**Decisión.** El algoritmo se ejecuta completo de una vez y deja una **traza**: una lista de pasos inmutables. Cada paso guarda los elementos, el estado de cada uno, la línea de código y una descripción. Un reproductor independiente sólo mueve un índice sobre esa lista. Cada elemento se representa como `{ id, valor }`, y el `id` permite animar los cambios de lugar y mostrar la estabilidad.

**Alternativas.** Pausar el algoritmo mientras se ejecuta (con generadores o `await`) y dibujar cada paso en vivo.

**Motivo.** Con la traza, retroceder no cuesta nada: es sólo bajar el índice. Además, el algoritmo, el reproductor y el dibujo no dependen entre sí, y cada uno se puede probar por separado. Esa separación es la que permitió después mover los algoritmos al servidor sin tocar el dibujo (decisión 9).

**Consecuencias.** La traza ocupa memoria: unos 226 KB sin comprimir y 6.6 KB comprimida para 16 elementos. Por eso la entrada se limita a 16 valores.

---

## 5. Implementaciones sólo en JavaScript, probadas

- **Fecha:** 2026-11-13
- **Estado:** Aceptada

**Decisión.** Cada ficha muestra el algoritmo sólo en JavaScript. Las líneas importantes llevan una marca `//@marca` que el visualizador usa para resaltar la línea en ejecución, y el código que se muestra se ejecuta en las pruebas.

**Alternativas.** Pestañas con varios lenguajes (Python, Java, C++).

**Motivo.** Un solo lenguaje se puede probar automáticamente. Así se garantiza que el código que lee el usuario ordena de verdad y coincide con la animación.

---

## 6. Cuentas y datos en Supabase

- **Fecha:** 2026-11-17
- **Estado:** Aceptada

**Contexto.** El profesor pidió backend: registro e inicio de sesión. Sin cuenta sólo se ven algunos algoritmos; con cuenta se ven todos.

**Decisión.** Usar Supabase: PostgreSQL para los datos y Supabase Auth para las cuentas. Las reglas RLS limitan qué puede leer cada quien. Son públicas las cinco fichas básicas: inserción, burbuja, selección, búsqueda lineal y búsqueda binaria.

**Alternativas.**
- Firebase.
- Base de datos propia con contraseñas manejadas por nosotros.

**Motivo.** Tiene plan gratuito, PostgreSQL es SQL estándar y la autenticación viene resuelta: contraseñas cifradas, sesiones y tokens. Manejar contraseñas a mano es un riesgo de seguridad innecesario en un proyecto escolar.

**Consecuencias.** El plan gratuito pausa el proyecto tras una semana sin uso, así que hay que revisarlo antes de cada presentación.

---

## 7. Contenido de las fichas en la base de datos

- **Fecha:** 2026-11-17
- **Estado:** Aceptada. Reemplaza las fichas escritas en JSX.

**Decisión.** El texto de las fichas vive en las tablas `algoritmos` y `fichas`, escrito en Markdown sencillo: negritas, código, enlaces y listas. Un lector propio (`src/lib/markdown.js`) lo convierte en componentes. No acepta HTML ni enlaces peligrosos como `javascript:`.

**Alternativas.** Mantener las fichas en JSX dentro del frontend.

**Motivo.** Si las fichas privadas estuvieran en el código del sitio, cualquiera podría leerlas sin cuenta. En la base de datos, el acceso se controla por usuario. Además, el texto se corrige sin volver a publicar el sitio.

---

## 8. API propia con Fastify

- **Fecha:** 2026-11-17
- **Estado:** Aceptada

**Contexto.** Al principio React consultaba Supabase directamente, igual que la Pokédex consultaba la PokeAPI. Se quería un backend propio.

**Decisión.** Una API en Node con Fastify (carpeta `servidor/`) entre el sitio y la base de datos. Sus rutas son:
- `GET /api/salud`
- `GET /api/algoritmos`
- `GET /api/fichas/:id`
- `POST /api/algoritmos/:id/ejecucion`
- `GET /api/perfil`

La API valida cada petición con esquemas JSON, limita las peticiones por IP y sólo acepta los orígenes configurados (CORS). Se conecta a PostgreSQL con `pg` y verifica los tokens con Supabase.

**Alternativas.**
- Sin API, con React hablando directo con Supabase.
- Express.
- Next.js, que habría obligado a reescribir el frontend.

**Motivo.** Una arquitectura cliente-servidor con un backend propio que se puede mostrar y explicar. Fastify trae validación con esquemas, es rápido y permite probar las rutas sin abrir un puerto (`app.inject`).

**Consecuencias.** Son dos servicios que publicar y mantener, en lugar de uno.

---

## 9. Los algoritmos se ejecutan en el servidor

- **Fecha:** 2026-11-21
- **Estado:** Aceptada

**Decisión.** Los 19 algoritmos se movieron a `servidor/src/algoritmos`. El navegador envía la entrada a `POST /api/algoritmos/:id/ejecucion` y recibe el código y la traza. El reproductor ya no ejecuta nada; sólo pide la traza y la recorre.

**Alternativas.** Seguir ejecutando los algoritmos en el navegador y usar la API sólo para el texto.

**Motivo.**
- Los algoritmos se consultan en el backend, como se pidió.
- El código de las fichas privadas ya no viaja dentro del sitio.
- El servidor aplica las mismas reglas de acceso que a las fichas.

**Consecuencias.** Cada ejecución hace una petición. Para que no pese, la respuesta va comprimida, la entrada se limita a 16 valores y el reproductor descarta las respuestas viejas si el usuario cambia la entrada rápido.

---

## 10. Manejo de claves y datos sensibles

- **Fecha:** 2026-11-17
- **Estado:** Aceptada

**Decisión.**
- En el navegador sólo va la **clave publicable** de Supabase (`sb_publishable_...`). Esa clave puede ser pública porque RLS protege los datos.
- La cadena de conexión (`DATABASE_URL`, que incluye la contraseña) existe **sólo en el servidor**: en `servidor/.env` en la computadora y en las variables de entorno de Render.
- La clave secreta (`service_role` o `sb_secret`) no se usa en ninguna parte.
- `.env` y `.env.local` están en `.gitignore`.

- Antes de hacer público el repositorio se revisó el historial en busca de secretos, y se cambió la semilla de las pruebas, que era la matrícula del alumno.

**Motivo.** Todo lo que llega al navegador lo puede leer cualquiera. Si la contraseña de la base de datos se filtrara, habría que cambiarla de inmediato en Supabase.

---

## 11. Publicación en Vercel, Render y Supabase

- **Fecha:** 2026-11-22
- **Estado:** Aceptada

**Decisión.**
- **Sitio:** en Vercel (traza-pi.vercel.app). Vite lo compila y se publica la carpeta `dist`.
- **API:** en Render, plan gratuito.
- **Base de datos:** en Supabase. La API se conecta por el *Session pooler*, porque Render gratis sólo tiene IPv4 y la conexión directa de Supabase usa IPv6.
- Cada `git push` vuelve a publicar los dos servicios.

**Alternativas.**
- GitHub Pages, que sólo sirve archivos estáticos y no puede correr la API.
- Todo en un solo servicio.

**Motivo.** Cada parte va en el servicio gratuito hecho para ella, y la publicación queda automática.

**Consecuencias.** Render gratis se duerme tras unos minutos sin uso, y la primera petición tarda cerca de un minuto. Antes de presentar, conviene abrir `/api/salud`.

---

## 12. Workspace de pnpm

- **Fecha:** 2026-11-22
- **Estado:** Aceptada. Reemplaza el uso de npm en `servidor/`.

**Decisión.** El repositorio es un workspace de pnpm con dos paquetes: el sitio (la raíz) y la API (`servidor/`). Tiene un solo `pnpm-lock.yaml`. `pnpm dev` levanta los dos y `pnpm test` corre todas las pruebas.

**Alternativas.** API con npm y su propio `package-lock.json`, en una segunda terminal.

**Motivo.** Un solo gestor de paquetes y un solo comando para trabajar.

**Consecuencias.** Render se construye desde la raíz (Root Directory vacío), porque no puede leer archivos fuera de su carpeta raíz y el lockfile está en la raíz del repositorio.

---

## 13. Estrategia de pruebas

- **Fecha:** 2026-11-13 (creció con cada etapa)
- **Estado:** Aceptada

**Decisión.**
- **API (`node:test`, 103 pruebas):**
  - Cada algoritmo se prueba con 46 entradas, entre casos límite y arreglos aleatorios con semilla fija. Se comprueba que ordena, que conserva los elementos, que no modifica la entrada, que la traza está bien formada y que el código mostrado coincide con la traza.
  - Se prueban todas las rutas, incluidos los accesos sin cuenta, los datos inválidos, CORS y el límite de peticiones.
- **Sitio (Vitest, 23 pruebas):** el reproductor con un servidor simulado, la lectura de la entrada, el lector de Markdown y los formularios.
- **Integración contra PostgreSQL real:** corre sólo si se define `DATABASE_URL_PRUEBA`.

**Motivo.** `crearApp` recibe la base de datos y el verificador de sesiones como parámetros, así que las pruebas usan versiones falsas sin necesitar Supabase ni internet.

---

## 14. Diseño visual: triángulos que se fragmentan

- **Fecha:** 2026-11-22
- **Estado:** Aceptada. Reemplaza el primer tema oscuro con barras.

**Decisión.**
- **Paleta base:** `#05183c`, `#06296b`, `#1a3c7d`, `#101217` y `#0c0d0d`.
- **Tonos derivados:** dos más claros de `#1a3c7d`, para botones (`--primary`) y enlaces (`--enlace`). Los azules de la paleta no tienen suficiente contraste como texto sobre negro.
- **Motivo visual:** triángulos que se fragmentan.
  - Un estallido de fragmentos desde las orillas en el inicio.
  - Un logotipo de triángulo partido por grietas.
  - Esquinas cortadas en los paneles.
  - Una grieta como separador.
- **Arte generativo:** los fragmentos se generan con código a partir de una semilla, así que siempre salen iguales.
- **Movimiento reducido:** si el sistema lo pide, la animación no corre y las piezas aparecen ya en su lugar.

**Alternativas.** El primer diseño usaba un fondo azul oscuro con barras como logotipo, y después una columna de facetas. Se cambió para seguir las referencias de triángulos rotos.

**Motivo.** Una identidad propia y reconocible, en lugar de una plantilla genérica.

---

## 15. Enlaces, botones y accesibilidad

- **Fecha:** 2026-11-22
- **Estado:** Aceptada

**Decisión.**
- **Lo que lleva a otra página es un enlace**, aunque se vea como botón. Lo que hace una acción (reproducir, copiar, reintentar, cerrar sesión) es un `<button>`.
- **Nombres de algoritmos y enlaces sueltos:** se ven como botones.
- **Enlaces dentro de una oración:** van subrayados (clase `.enlace`), para no depender sólo del color.
- **Íconos con significado:** el candado tiene un texto para lectores de pantalla, "(requiere cuenta)".
- **Filas del catálogo:** se anuncian sólo con el nombre del algoritmo, y la descripción se lee aparte (`aria-describedby`).
- **Enlaces externos:** abren otra pestaña con `rel="noopener noreferrer"`, muestran un ícono y avisan que abren otra pestaña.
- **"Ver el catálogo":** mueve el foco del teclado, no sólo la vista.

**Motivo.** Que el sitio se pueda usar con teclado, con lector de pantalla y sin distinguir colores, y que cada control se comporte como el usuario espera.

---

## 16. Un reproductor independiente por visualizador

- **Fecha:** 2026-11-13
- **Estado:** Aceptada

**Contexto.** Zustand suele usarse con un solo store global para toda la aplicación, como en el demo de la Pokédex.

**Decisión.** El estado del reproductor (pasos, índice, reproducción, estado de carga) se crea con una fábrica, `crearReproductor(algoritmoId)`, y cada visualizador tiene el suyo. Las preferencias que sí son globales, como la velocidad, van en un store aparte que se guarda en `localStorage`.

**Alternativas.** Un store global con un solo reproductor.

**Motivo.** En una misma página puede haber más de un visualizador (la demo del inicio y, en el futuro, la comparación en paralelo de dos algoritmos). Con un store global, avanzar en uno movería al otro.

**Consecuencias.** Cada visualizador recibe su reproductor por parámetro. Una prueba verifica que dos reproductores no se afectan entre sí.

---

## 17. Dependencias con antigüedad mínima

- **Fecha:** 2026-11-13
- **Estado:** Aceptada

**Contexto.** El pnpm del alumno tiene activada una protección (`minimumReleaseAge`) que rechaza paquetes publicados hace menos de un día. La primera instalación falló porque el lockfile traía versiones recién publicadas.

**Decisión.** El `pnpm-lock.yaml` se genera sólo con versiones que tienen al menos tres días de publicadas. Los rangos de `package.json` se dejaron amplios (por ejemplo `^14.0.0`) para que pnpm pueda elegir una versión anterior.

**Alternativas.** Desactivar la protección en la computadora del alumno.

**Motivo.** La protección evita instalar una versión comprometida en las primeras horas después de publicarse, que es cuando suelen detectarse. Es mejor adaptar el lockfile que quitar una medida de seguridad.

**Consecuencias.** El proyecto no usa siempre la versión más nueva de cada paquete, sino una de hace unos días.

---

## Plantilla

```markdown
## N. Título corto de la decisión

- **Fecha:** AAAA-MM-DD
- **Estado:** Propuesta | Aceptada | Reemplazada por la N

**Contexto.** Qué problema o requisito llevó a decidir.

**Decisión.** Qué se eligió, en concreto.

**Alternativas.** Qué otras opciones había.

**Motivo.** Por qué se eligió esta.

**Consecuencias.** Qué cuesta o qué cambia a partir de ahora.
```
