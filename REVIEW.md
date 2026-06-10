# Reporte de revisión — template-genie-app

> ## ✅ Changelog (correcciones aplicadas)
> Solo código de app — no se tocó Supabase ni archivos generados de integración.
> - **#2** Nombre de archivo unificado a `contract_` (preview = generado).
> - **#3** Signup detecta falta de sesión (confirmación de email): avisa "Check your email" y no rebota.
> - **#6** `xlsx` cambiado al build oficial del CDN de SheetJS (`0.20.3`) — sin CVEs; `papaparse` (no usado) eliminado.
> - **#7** Borrado código muerto (`parseCSV`/`parseXLSX`); copy "CSV" → "Excel".
> - **#8** Todo a inglés: tipos de variable `text/date/currency` (con normalizador para datos legacy `texto/fecha/moneda`), ruta `/generaciones` → `/generations`.
> - **#9** Edición de templates: nueva ruta `/templates/$id/edit` (editar nombre, labels, tipos y reemplazar el .docx) + botón ✏️ en la lista.
> - **#10** El contrato siempre se genera aunque falten campos; se reporta como *warning* (no se descarta). Columna de nombre vacía → fallback `contract_row_N` + warning.
> - **#11** Columnas con nombre duplicado: ya se desambiguan (`Name`, `Name (2)`…), verificado correcto.
> - **#12** Errores de docxtemplater legibles (lee `error.properties.errors`).
> - **Extra** Botón **Cancel** durante la generación de un lote.

---


App de generación masiva de contratos (.docx) a partir de un template con `{{variables}}` y un Excel.
Stack: TanStack Start (SSR) + React 19 + Supabase + Bun. Generación 100% client-side con docxtemplater.

Severidad: 🔴 Alta · 🟠 Media · 🟡 Baja / mejora

> **Restricción del proyecto:** se sigue gestionando con **Lovable** (administra Supabase / Lovable Cloud).
> NO se editan a mano los archivos autogenerados (`src/integrations/supabase/*`) ni las migraciones en `supabase/migrations/`,
> ni se cambia el esquema/RLS/Storage por SQL manual. Esos cambios se hacen **desde Lovable**.
> Los arreglos desde el repo se limitan a **código de app** (rutas, componentes, `src/lib/*`, UI) y `package.json`.

---

## 🔴 Bugs / problemas serios

### 1. ~~El bucket de Storage `templates` no está en las migraciones~~ — RESUELTO EN EL REMOTO
Las políticas RLS sobre `storage.objects` para el bucket `templates` existen, pero ninguna migración crea el bucket.
En la práctica **el bucket ya existe en el proyecto remoto** (lo creó Lovable), por eso la app funciona. Era solo un
gap de *reproducibilidad del repo* (importaría si se clonara fuera de Lovable). **No se toca** — cualquier cambio de
Storage se hace desde Lovable, no por migración manual.

### 2. El nombre de archivo del preview NO coincide con el generado
- `StepName` muestra de ejemplo `contract_<x>.docx` (generaciones.tsx:729)
- La generación real usa `contrato_<x>.docx` (generaciones.tsx:953)

El usuario ve un nombre y descarga otro. Unificar el prefijo (y idealmente hacerlo configurable).

### 3. Signup navega a `/templates` aunque falte confirmar el email
En `auth.tsx`, tras `signUp` se muestra "Account created. Welcome!" y se hace `navigate({ to: "/templates" })`. Si Supabase tiene **confirmación de email activada**, `signUp` no devuelve sesión → el guard de `_authenticated` (`getUser`) rebota a `/auth`. Resultado: mensaje de éxito + pantalla de login otra vez, sin explicación. Hay que detectar `data.session === null` y mostrar "Revisá tu email para confirmar".

### 4. El historial de "Generations" (jobs) se guarda pero nunca se muestra
Cada generación inserta un registro en la tabla `jobs` (con mapping, conteos, errores), pero **no existe ninguna vista que liste los jobs**. El item "Generations" del sidebar va directo al wizard. Es data muerta + una feature a medio hacer. O se construye la pantalla de historial, o sobra la tabla.

---

## 🟠 Calidad / arquitectura / performance

### 5. ~~Generación client-side en el main thread~~ — FUERA DE ALCANCE
La generación corre toda en el hilo principal (`handleGenerate`, generaciones.tsx:897). Sería un problema (UI congelada / OOM) solo con lotes muy grandes. **Decisión de producto: no se generan >100 contratos por ZIP**, así que con ese volumen el approach actual (+ el `setTimeout(0)` cada 5 filas) es suficiente. No se implementa Web Worker.

### 6. Versión de `xlsx` (SheetJS 0.18.5) con vulnerabilidades conocidas
`xlsx@0.18.5` de npm tiene CVEs de **prototype pollution** y **ReDoS** (CVE-2023-30533, etc.). El fix solo está en el CDN oficial de SheetJS, no en npm. Como se parsean archivos subidos por el usuario, conviene migrar al paquete del CDN (`https://cdn.sheetjs.com/...`) o a una alternativa (ej. `exceljs`).

### 7. `parseCSV` / `parseXLSX` muertos + copy que miente
- `template-data.ts` exporta `parseCSV` y `parseXLSX`, pero el wizard **solo** usa `parseXLSXRaw`. Código muerto (`papaparse` queda como dependencia sin uso real).
- La UI/marketing habla de **CSV** ("load a CSV with your influencers" en auth.tsx; "Generations" copy), pero solo se aceptan `.xlsx/.xls`. O se soporta CSV de verdad, o se corrige el copy.

### 8. Mezcla de idiomas e inconsistencias
- Ruta `/generaciones`, tipos `texto/fecha/moneda`, default SQL `status = 'completado'`… pero el código inserta `status = 'completed' / 'completed_with_errors'` (inglés). El default de la DB nunca se usa y queda en otro idioma.
- UI toda en inglés, prefijos de archivo en español (`contrato_`). Definir un idioma y normalizar.

### 9. No se puede editar un template
Solo crear y borrar. Hay un `<Link className="hidden" />` placeholder en `templates.index.tsx` con comentario "future: edit route". Si cambia una variable hay que recrear todo. Feature gap.

### 10. Validación "todo o nada" por fila
En `handleGenerate`, si **cualquier** variable queda vacía, se descarta la fila entera como error. No hay concepto de variable opcional. Para muchos casos reales (un campo opcional vacío) esto tira contratos válidos. Considerar permitir variables opcionales (y aprovechar el `nullGetter: () => ""` que ya está en `renderDocx`).

### 11. `autoMapColumns` puede mapear la columna equivocada en silencio
Usa match por inclusión (`norm.includes(nv) || nv.includes(norm)`): la variable `nombre` puede engancharse a la columna `nombre_empresa`. Es editable por el usuario, pero el auto-map silencioso puede pasar desapercibido. Priorizar match exacto y marcar los auto-mapeos "dudosos".

### 12. Manejo pobre de errores de docxtemplater
docxtemplater lanza errores agregados en `error.properties.errors` (tags mal cerrados, etc.). El `catch` solo usa `err.message`, que para multi-error da algo genérico/inútil. Si el template tiene un `{{` sin cerrar, el usuario no se entera de qué pasó. Parsear `error.properties.errors`.

---

## 🟡 Menores / higiene

- **`.env` commiteado al repo** (no está en `.gitignore`). Las keys son *publishable* (anon) y con RLS no es un agujero, pero igual no debería versionarse. Agregar `.env` al `.gitignore` y dejar un `.env.example`.
- **Sin límite de tamaño** en la subida de `.docx`/`.xlsx`. Un archivo enorme puede colgar/OOM el navegador (tanto en parse como en `docx-preview`). Validar tamaño antes de procesar.
- **Mensaje de error vs. extensión aceptada**: StepData acepta `.xls` pero el error dice "Upload an .xlsx file".
- **`variables as unknown as never`** en el insert (templates.new.tsx) — hack de tipos por el `jsonb` mal tipado en `types.ts`. Funciona pero esconde el tipo real; mejor tipar el `Json` correctamente.
- **Sin botón de cancelar** durante la generación de un lote largo.
- **Colisión de nombres por lowercase**: `sanitizeFilename` baja a minúsculas, así "Juan Perez" y "JUAN PEREZ" colisionan (se resuelve con sufijo `_2`, pero puede confundir).
- **`getClaims`/middleware de auth** (`auth-middleware.ts`) está implementado pero **no se usa** (solo el `example.functions.ts` de ejemplo). Es scaffolding de Lovable; si no se van a usar server functions, es ruido.

---

## ✅ Lo que está bien

- **RLS bien planteado**: políticas por `user_id` en `templates` y `jobs`, y storage scopeado por carpeta `auth.uid()/...`. El modelo de seguridad es sólido.
- **Rollback en upload**: si falla el insert del template, se borra el archivo de storage (templates.new.tsx).
- Extracción de variables robusta: concatena runs de Word y revisa headers/footers (`docx-parser.ts`).
- Buen manejo de fechas/moneda con heurísticas (serial de Excel, separadores), y normalización de headers duplicados.
- Manejo de errores SSR cuidado (`server.ts` desenvuelve los 500 que h3 se traga).
- UX del wizard (stepper, selección de fila de header, preview en vivo) está bien lograda.

---

## Prioridad sugerida (todo solo código de app — no rompe Lovable)
1. Arreglar prefijo de archivo preview vs real (#2) y flujo de signup con confirmación (#3).
2. Mitigar `xlsx` (#6) — cambio de dependencia en `package.json`.
3. Limpiar código muerto y decidir CSV sí/no (#7); errores de docxtemplater (#12).
4. Variables opcionales (#10) y auto-map más estricto (#11).
5. Historial de jobs (#4): la tabla ya existe en la DB; solo falta la pantalla que la lea (lectura vía RLS, no toca esquema).

> Fuera de alcance / requieren Lovable: #1 (bucket ya existe), y cualquier cambio de esquema o RLS.
> #5 (Web Worker) descartado por decisión de producto (lotes ≤100).
