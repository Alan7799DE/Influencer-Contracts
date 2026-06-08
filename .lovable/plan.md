# Plan: Generador de Contratos de Influencers — Etapa 1

App SaaS en español para subir templates `.docx` con placeholders `{{variable}}`, detectarlos automáticamente y prepararlos para generación masiva. Esta etapa cubre auth + gestión de templates. La generación real del ZIP (a partir de CSV) queda para la próxima etapa, pero dejamos la sección "Generaciones" navegable con un placeholder.

## Stack

- TanStack Start (React 19 + Vite) — el template del proyecto. UI con Tailwind v4 + shadcn/ui ya instalados.
- Lovable Cloud (Supabase) para Auth, Postgres y Storage.
- Librerías nuevas: `pizzip` (leer .docx y extraer placeholders), `docx-preview` (renderizado fiel del .docx).

## Backend (Lovable Cloud)

### Tablas

`templates`
- `id uuid pk default gen_random_uuid()`
- `user_id uuid not null default auth.uid() references auth.users(id) on delete cascade`
- `name text not null`
- `storage_path text not null`
- `variables jsonb not null default '[]'::jsonb` — `[{name,label,type}]`, type ∈ `texto|fecha|moneda`
- `created_at timestamptz not null default now()`

`jobs`
- campos según spec del usuario, FK a `templates`, `user_id default auth.uid()`.

RLS habilitada en ambas. Policies: `SELECT/INSERT/UPDATE/DELETE` donde `user_id = auth.uid()`. GRANTs a `authenticated` y `service_role`.

### Storage

Bucket privado `templates`. Archivos guardados como `{user_id}/{template_id}.docx`. Policies RLS sobre `storage.objects` filtrando por `(storage.foldername(name))[1] = auth.uid()::text` para SELECT/INSERT/UPDATE/DELETE.

## Auth

- Email + contraseña con Supabase Auth (sin verificación de email para acelerar pruebas; se puede activar luego).
- Página pública `/auth` con tabs Login / Registro.
- Subtree protegida bajo `_authenticated/` usando el layout administrado por la integración (`ssr: false`, redirige a `/auth`).
- Sign out limpio (cancel queries, clear cache, navigate replace).

## Rutas

- `/` → landing simple que redirige a `/auth` o al dashboard según sesión.
- `/auth` → login/registro.
- `/_authenticated/templates` → lista de templates.
- `/_authenticated/templates/new` → flujo de creación.
- `/_authenticated/generaciones` → placeholder "Próximamente" con explicación.
- Layout interno con sidebar/topbar mostrando navegación entre "Templates" y "Generaciones", email del usuario y botón cerrar sesión.

## Flujo "Nuevo template"

1. Input para `name` + dropzone `.docx`.
2. Al seleccionar el archivo:
   - Leer en el navegador con `pizzip`: descomprimir, extraer `word/document.xml`, hacer match de `\{\{\s*([a-zA-Z0-9_]+)\s*\}\}` (dedupe, preservando orden) — y también recombinar runs partidos por Word (concatenar todo el texto plano del XML antes del regex para no perder placeholders fragmentados).
   - Renderizar vista previa fiel con `docx-preview` (`renderAsync`) en un contenedor scrolleable, solo lectura.
3. Mostrar tabla editable de variables detectadas: columnas `nombre` (read-only), `label` (input), `tipo` (select: texto/fecha/moneda, default texto).
4. Botón "Guardar template":
   - Generar `template_id` (uuid client-side) para nombrar el archivo.
   - Subir el `.docx` al bucket `templates` en `{user_id}/{template_id}.docx`.
   - Insertar fila en `templates` con `variables` finales.
   - Redirigir a la lista.
5. Estados de carga claros (parseo, subida, guardado) y manejo de errores (archivo inválido, sin placeholders, fallo de upload con rollback del storage si la inserción DB falla).

## Pantalla "Templates"

Tabla/cards con: nombre, fecha de creación (formato es-AR), cantidad de variables. Acciones: eliminar (confirm dialog → borra fila y archivo de Storage). Botón "Nuevo template" arriba a la derecha. Empty state ilustrado cuando no hay templates.

## Diseño

SaaS limpio y profesional, en español. Tipografía sans moderna (Inter), paleta neutra con un acento (azul/índigo), buen uso de espacios, skeletons durante cargas, toasts con `sonner` para feedback. Sidebar fija en desktop, drawer en mobile.

## Detalles técnicos clave

- `pizzip` y `docx-preview` se importan dinámicamente solo en el cliente (evitar SSR de módulos que tocan DOM).
- Subida a Storage desde el cliente con el `supabase` browser client (RLS aplica como el usuario).
- Listado/inserción/borrado de `templates` desde el cliente con el browser client (es lo más simple y respeta RLS; no requiere serverFn).
- Borrado de archivo en Storage al eliminar template (best-effort, log si falla).
- Validación con `zod` en formularios.

## Fuera de alcance (siguiente etapa)

- Subir CSV/Excel, mapeo de columnas, generación del ZIP con `docxtemplater` + `jszip`, persistencia de `jobs`. Se deja la tabla `jobs` creada y la ruta `/generaciones` con placeholder.

## Pasos de implementación

1. Habilitar Lovable Cloud.
2. Migración SQL: tablas `templates` y `jobs` + GRANTs + RLS + policies.
3. Crear bucket `templates` (privado) + policies en `storage.objects`.
4. Instalar deps: `pizzip`, `docx-preview`, `zod` (si falta), `react-hook-form` (si falta), `date-fns`.
5. Página `/auth` con login y registro.
6. Layout `_authenticated` interno (sidebar + topbar) — sin tocar `_authenticated/route.tsx` administrado.
7. Página `/templates` (lista + delete).
8. Página `/templates/new` (upload + parseo + preview + tabla de variables + guardar).
9. Página `/generaciones` placeholder.
10. Polish visual, estados de carga, toasts, empty states.
