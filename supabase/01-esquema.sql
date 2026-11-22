-- Esquema de Traza: tablas, reglas de acceso y perfiles de usuario.
-- Ejecútalo una sola vez en el SQL Editor de Supabase, antes de 02-datos.sql.

-- ---------------------------------------------------------------------------
-- Tablas
-- ---------------------------------------------------------------------------

-- Datos generales de cada algoritmo: lo que se ve en el menú, la portada y la
-- tabla comparativa. La columna `publico` decide si su ficha se puede leer sin
-- iniciar sesión.
create table public.algoritmos (
  id text primary key,
  nombre text not null,
  nombre_corto text not null,
  familia text not null check (familia in ('ordenamiento', 'busqueda')),
  bloque text not null,
  orden integer not null unique,
  intencion text not null,
  complejidad_mejor text not null,
  complejidad_promedio text not null,
  complejidad_peor text not null,
  espacio text not null,
  estable boolean,
  en_sitio boolean,
  requisito text,
  publico boolean not null default false
);

-- Contenido de cada ficha. Los textos están en Markdown sencillo:
-- párrafos, listas, `código`, **negritas** y [enlaces](/algoritmos/id).
create table public.fichas (
  algoritmo_id text primary key references public.algoritmos (id) on delete cascade,
  analogia text not null,
  como_funciona text not null,
  requisitos text not null,
  complejidad text not null,
  usarlo text[] not null,
  evitarlo text[] not null,
  implementacion text[] not null,
  relaciones jsonb not null default '[]'
);

-- Un perfil por cada cuenta. Las cuentas y las contraseñas las guarda
-- Supabase Auth en auth.users; aquí sólo va el nombre que se muestra.
create table public.perfiles (
  id uuid primary key references auth.users (id) on delete cascade,
  nombre text not null check (char_length(nombre) between 1 and 60),
  creado timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- Reglas de acceso (Row Level Security)
--
-- Con RLS activo, nadie puede leer ni escribir una fila salvo que una política
-- lo permita. Estas reglas se aplican en el servidor: aunque alguien modifique
-- el código del navegador, Supabase no le entrega lo que no le corresponde.
-- ---------------------------------------------------------------------------

alter table public.algoritmos enable row level security;
alter table public.fichas enable row level security;
alter table public.perfiles enable row level security;

-- El catálogo es público: cualquiera ve qué algoritmos existen.
create policy "Cualquiera ve el catálogo"
  on public.algoritmos for select
  to anon, authenticated
  using (true);

-- Sin sesión, sólo se pueden leer las fichas de los algoritmos públicos.
create policy "Sin cuenta: sólo fichas públicas"
  on public.fichas for select
  to anon
  using (
    exists (
      select 1 from public.algoritmos a
      where a.id = fichas.algoritmo_id and a.publico
    )
  );

-- Con sesión iniciada, se leen todas.
create policy "Con cuenta: todas las fichas"
  on public.fichas for select
  to authenticated
  using (true);

-- Cada usuario ve y edita sólo su propio perfil.
create policy "Cada quien ve su perfil"
  on public.perfiles for select
  to authenticated
  using ((select auth.uid()) = id);

create policy "Cada quien edita su perfil"
  on public.perfiles for update
  to authenticated
  using ((select auth.uid()) = id)
  with check ((select auth.uid()) = id);

-- Ninguna política permite insertar, modificar o borrar algoritmos y fichas
-- desde el sitio. El contenido se administra desde el panel de Supabase.

grant select on public.algoritmos, public.fichas to anon, authenticated;
grant select, update (nombre) on public.perfiles to authenticated;

-- ---------------------------------------------------------------------------
-- Perfil automático al registrarse
--
-- Cuando Supabase Auth crea una cuenta, este disparador crea su perfil con el
-- nombre que el usuario escribió en el formulario de registro.
-- ---------------------------------------------------------------------------

create function public.crear_perfil()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.perfiles (id, nombre)
  values (
    new.id,
    left(
      coalesce(
        nullif(trim(new.raw_user_meta_data ->> 'nombre'), ''),
        split_part(new.email, '@', 1)
      ),
      60
    )
  );
  return new;
end;
$$;

create trigger al_crear_usuario
  after insert on auth.users
  for each row execute function public.crear_perfil();
