# Plan de migración — Lovable → Supabase propio + Vercel

> **Objetivo:** sacar `easycontracts.site` de la gestión de Lovable hacia infraestructura propia:
> base de datos en un proyecto **Supabase propio** y hosting/SSR en **Vercel**, manteniendo
> el código de la app (TanStack Start + React) intacto.
>
> **Estado:** plan. No se ha tocado código de producción todavía.
> **Fecha:** 2026-06-28.

---

## 0. Arquitectura: de dónde a dónde

| Capa | Hoy (Lovable) | Destino (propio) |
|------|---------------|------------------|
| Base de datos / Auth / Storage | Supabase **gestionado por Lovable Cloud** (ref `ivxoluaazsbndmcbqcro`) | Supabase **propio** (proyecto nuevo en tu cuenta) |
| Build tooling | `@lovable.dev/vite-tanstack-config` (wrapper) | TanStack Start + nitro estándar |
| Runtime / SSR | Lovable edge sobre **Cloudflare** (`fetch(req, env, ctx)` estilo Worker) | **Vercel** (preset nitro `vercel`, runtime Node) |
| Analytics / error reporting | `~flock.js`, `__l5e/events.js`, `lovable-error-reporting` (inyectados por Lovable) | Eliminados (o reemplazados por algo propio si se quiere) |
| Dominio | DNS apuntando a Lovable/Cloudflare | DNS apuntando a Vercel |

La app en sí (rutas, componentes, lógica de generación de contratos con docxtemplater) es **estándar y portable**. El lock-in real son solo dos cosas: el paquete de build de Lovable y el hosting.

### Schema a migrar (de las migraciones actuales)

- **`public.templates`** — `id`, `user_id` (FK `auth.users`), `name`, `storage_path`, `variables` (jsonb), `created_at`. RLS por usuario. Índice en `user_id`.
- **`public.jobs`** — `id`, `user_id` (FK), `template_id` (FK `templates`), `csv_filename`, `column_mapping` (jsonb), `filename_variable`, `total_rows`, `success_count`, `error_count`, `error_details` (jsonb), `status`, `created_at`. RLS por usuario. Índices en `user_id` y `template_id`.
- **Storage bucket `templates`** — archivos `.docx` organizados por carpeta `{{user_id}}/...`. Policies de RLS por carpeta de usuario (en `storage.objects`). **El bucket no está en las migraciones** — hay que crearlo a mano en el proyecto nuevo.
- **`auth.users`** — los usuarios registrados (email + password). Migración delicada, ver Track A §3.

---

## ⚠️ Bloqueante #0 — Acceso a los datos de origen

Como el Supabase es **Lovable Cloud**, lo PRIMERO es confirmar que podés exportar los datos. Sin esto, no hay migración de datos posible.

- [ ] **¿Tenés acceso al dashboard del proyecto Supabase de origen?** Entrar a [supabase.com/dashboard](https://supabase.com/dashboard) y ver si aparece el proyecto `ivxoluaazsbndmcbqcro`.
- [ ] **¿Lovable ofrece "eject" / exportar / transferir el proyecto Supabase?** Revisar en Lovable la opción de desconectar/exportar Supabase (a veces permiten transferir la ownership del proyecto a tu org de Supabase — sería el camino ideal y evitaría migrar datos).
- [ ] **¿Tenés la `connection string` / `service_role key` del proyecto de origen?** Con acceso directo a la DB podés hacer `pg_dump`. Sin eso, dependés de lo que exponga Lovable.

**Tres escenarios según el acceso:**

1. **Lovable permite transferir la ownership del proyecto Supabase a tu cuenta** → ideal. Saltás casi toda la migración de datos (Track A §2–§5); solo reapuntás env vars y seguís con Track B.
2. **Tenés acceso de lectura (dashboard o connection string)** → migración estándar con `pg_dump` / CLI (Track A completo).
3. **No tenés ningún acceso** → hay que pedirle a Lovable el export, o reconstruir: schema sí (lo tenés en `supabase/migrations/`), pero **datos y usuarios se pierden** salvo que Lovable los entregue. Resolver esto ANTES de avanzar.

---

## Track A — Migrar Supabase (Lovable Cloud → proyecto propio)

### 1. Crear el proyecto destino
- [ ] Crear un proyecto nuevo en [supabase.com](https://supabase.com/dashboard) (elegir región cercana a los usuarios; anotar nuevo `project ref`, `URL`, `anon/publishable key`, `service_role key`).
- [ ] Instalar/loguear el **Supabase CLI** (`supabase login`) y linkear: `supabase link --project-ref <NUEVO_REF>`.

### 2. Migrar el schema
- [ ] Aplicar las migraciones existentes al proyecto nuevo: `supabase db push` (usa los archivos de `supabase/migrations/`).
- [ ] Verificar que quedaron creadas las tablas `templates` y `jobs` con sus RLS, policies e índices.

### 3. Migrar usuarios de auth (lo más delicado)
Los usuarios viven en `auth.users` con sus **password hashes**. Opciones según el acceso del Bloqueante #0:
- [ ] **Con dump de la DB de origen:** exportar e importar el schema `auth` (tabla `auth.users`, `auth.identities`). Los hashes (bcrypt) se conservan → los usuarios siguen entrando con su contraseña actual. Requiere acceso directo a la DB de origen (connection string).
- [ ] **Sin acceso al hash:** crear los usuarios vía Admin API en el proyecto nuevo y **forzar reset de contraseña** (email de "set your password"). Comunicar a los usuarios.
- [ ] Confirmar que los `user_id` (UUID) se **preservan idénticos** — son FK de `templates.user_id` y `jobs.user_id`, y son la carpeta del storage. Si cambian los UUID, se rompe todo. **Preservar UUIDs es requisito.**

### 4. Migrar datos de las tablas
- [ ] Exportar `public.templates` y `public.jobs` del origen (`pg_dump --data-only --table=public.templates --table=public.jobs`, o CSV).
- [ ] Importar al destino respetando el orden de FKs (primero `auth.users`, luego `templates`, luego `jobs`).

### 5. Migrar el storage
- [ ] Crear el **bucket `templates`** en el proyecto nuevo (privado).
- [ ] Reaplicar las policies de `storage.objects` (ya están en `supabase/migrations/20260608041318_*.sql`).
- [ ] Copiar los archivos `.docx` del bucket de origen al destino **manteniendo el path `{{user_id}}/archivo.docx`** (script con el SDK de storage: list + download + upload, origen→destino). El `storage_path` guardado en `templates` debe seguir siendo válido.

### 6. Regenerar tipos
- [ ] `supabase gen types typescript --project-id <NUEVO_REF> > src/integrations/supabase/types.ts` (a partir de acá ya podés editar estos archivos, se va la restricción de Lovable).

### 7. Validar
- [ ] Test de humo: registrar usuario, subir template, generar un ZIP, ver el job en "Generaciones".
- [ ] Verificar RLS: un usuario NO debe ver templates/jobs/archivos de otro.

---

## Track B — Migrar hosting a Vercel

> Se puede hacer en paralelo a Track A apuntando primero a un Supabase de staging.

### 1. Reemplazar el build tooling
- [ ] Sacar `@lovable.dev/vite-tanstack-config` de `package.json`.
- [ ] Reescribir `vite.config.ts` con el stack estándar que ese wrapper incluía (según su propio comentario):
  - `@tanstack/react-start/plugin/vite` (tanstackStart)
  - `@vitejs/plugin-react`
  - `@tailwindcss/vite`
  - `vite-tsconfig-paths`
  - alias `@` → `src`, dedupe de React/TanStack
  - inyección de envs `VITE_*` (Vite ya lo hace nativo)
  - **preset de nitro = `vercel`** (en vez del default `cloudflare`)
- [ ] Quitar el `componentTagger` (solo dev de Lovable).

### 2. Adaptar el server entry
- [ ] `src/server.ts` usa la firma Worker `fetch(request, env, ctx)`. En Vercel/Node los envs salen de `process.env`. Confirmar que el wrapper de error sigue funcionando bajo el preset Node de nitro (probablemente simplificable — ver el comentario sobre Cloudflare request-time binding en `src/lib/config.server.ts`, que en Node deja de aplicar).

### 3. Quitar el resto de lo Lovable-only
- [ ] Borrar `src/lib/lovable-error-reporting.ts` y su uso en `src/routes/__root.tsx` (el `ErrorComponent` llama a `reportLovableError`). Reemplazar por un `console.error` o un Sentry propio si se quiere telemetría.
- [ ] Los scripts `~flock.js` y `__l5e/events.js`, el `og:image` de preview y el rewrite del favicon **desaparecen solos** al no servir desde Lovable (no están en el código fuente).
- [ ] **Favicon:** hoy sale de `src/assets/favicon.png.asset.json` (pipeline de assets de Lovable). Pasar a un `public/favicon.png` estático y ajustar el `link rel="icon"` en `__root.tsx`.
- [ ] Limpiar `.lovable/` y referencias a Lovable Cloud en los mensajes de error de `client.ts` / `client.server.ts`.

### 4. Configurar Vercel
- [ ] Conectar el repo `Alan7799DE/Influencer-Contracts` a un proyecto de Vercel.
- [ ] Setear env vars en Vercel (con los valores del **Supabase NUEVO**):
  - `SUPABASE_URL`, `SUPABASE_PUBLISHABLE_KEY`, `SUPABASE_SERVICE_ROLE_KEY`
  - `VITE_SUPABASE_URL`, `VITE_SUPABASE_PUBLISHABLE_KEY`, `VITE_SUPABASE_PROJECT_ID`
  - ⚠️ `SUPABASE_SERVICE_ROLE_KEY` es secreto — solo en server, nunca con prefijo `VITE_`.
- [ ] Build command `vite build`, output el que genere nitro para Vercel.
- [ ] Deploy de preview y test de humo sobre la URL `*.vercel.app`.

### 5. Auth redirect URLs
- [ ] En el Supabase nuevo, agregar a **Auth → URL Configuration** las redirect URLs de Vercel (preview + producción) y del dominio final. El código usa `emailRedirectTo: ${window.location.origin}/templates`.

---

## Cutover (orden recomendado)

1. Resolver Bloqueante #0 (acceso a datos de origen).
2. Track A completo apuntando al Supabase nuevo; validar con datos reales.
3. Track B sobre Vercel apuntando ya al Supabase nuevo; validar en `*.vercel.app`.
4. **Freeze**: avisar que no se generen contratos durante la ventana; re-sincronizar el delta de datos si hubo cambios desde el dump.
5. Mover el DNS de `easycontracts.site` a Vercel; configurar el dominio en Vercel y las redirect URLs de auth con el dominio final.
6. Verificar producción (registro, login, generación, RLS) end-to-end.
7. Desconectar el proyecto en Lovable.

## Rollback
- Mientras el DNS no se mueva, el sitio sigue en Lovable. El rollback del paso de hosting es volver el DNS.
- Mantener el proyecto Supabase de Lovable Cloud **activo y sin borrar** hasta confirmar varios días de operación estable en el nuevo.

## Riesgos / incógnitas abiertas
- **Acceso a usuarios de auth de origen** — si Lovable no expone los hashes, los usuarios deberán resetear contraseña.
- **Preservar UUIDs de usuarios** — requisito duro (FKs + paths de storage).
- `nitro 3.0.260429-beta` pineado — confirmar soporte del preset `vercel` en esa versión (quizá haya que actualizar nitro).
- Reconstruir 1:1 el `vite.config` del wrapper de Lovable puede necesitar un par de iteraciones de build.
- `xlsx` está pineado a un tarball de CDN (`cdn.sheetjs.com`) — confirmar que el build de Vercel puede resolverlo.

## Costos
- Hoy Lovable Cloud bundlea Supabase. Al migrar pasás a pagar por separado: **Supabase** (free tier alcanza para empezar) + **Vercel** (Hobby gratis para proyectos personales; Pro si hace falta).

---

## Checklist resumida

- [ ] #0 Confirmar acceso/export de datos de origen (¿transferencia de ownership posible?)
- [ ] A1 Crear proyecto Supabase propio + CLI link
- [ ] A2 `db push` del schema
- [ ] A3 Migrar `auth.users` preservando UUIDs
- [ ] A4 Migrar datos de `templates` y `jobs`
- [ ] A5 Crear bucket `templates` + policies + copiar archivos
- [ ] A6 Regenerar `types.ts`
- [ ] A7 Validar RLS + flujo completo
- [ ] B1 Reescribir `vite.config.ts` (preset Vercel, sin wrapper Lovable)
- [ ] B2 Adaptar `src/server.ts`
- [ ] B3 Quitar `lovable-error-reporting`, favicon estático, limpiar `.lovable/`
- [ ] B4 Proyecto Vercel + env vars + preview
- [ ] B5 Redirect URLs de auth
- [ ] Cutover: freeze → DNS → verificación → desconectar Lovable
