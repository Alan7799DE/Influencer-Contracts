# Diseño: Homepage indexable (`/`)

**Fecha:** 2026-06-28
**Estado:** aprobado (diseño) — pendiente de plan de implementación
**Relacionado:** `SEO-AUDIT.md` (issue Critical de homepage), PR #12 (quick wins SEO)

---

## Problema

Hoy la ruta `/` ([src/routes/index.tsx](../../../src/routes/index.tsx)) es **solo un redirect**: `ssr: false` + `beforeLoad` que manda al usuario logueado a `/templates` y al deslogueado a `/auth`. No hay contenido indexable en la raíz del dominio.

La auditoría (`SEO-AUDIT.md`) lo marcó como issue **Critical**: la homepage reclama la keyword "bulk contract generator" en el `<title>` del root pero, al ser un muro de redirect/login, **no puede rankear**. Es además la URL que la gente linkea y la que Google trata como home.

## Objetivo

Convertir `/` en una **landing pública server-rendered** que rankee por términos transaccionales amplios de generación masiva de contratos, **preservando** el comportamiento de app para usuarios logueados.

## Decisiones tomadas (brainstorming)

1. **Ángulo: híbrido.** Hero amplio ("bulk contract generator", Word + Excel → ZIP) con **influencers como caso de uso destacado** y link interno a `/influencer-contract-templates`.
2. **Usuarios logueados:** redirect automático a `/templates` (client-side).
3. **Alcance: completo (~700-900 palabras)** — hero + stats + how-it-works + casos de uso + beneficios extendidos + mini-FAQ con schema + CTA.
4. **Enfoque técnico A:** SSR del contenido + redirect de logueados en el cliente (`useEffect`). Asume el flash marginal para el caso raro de un logueado que tipea `/` a mano.

---

## Arquitectura del route (`src/routes/index.tsx`)

Reescritura completa:

- **Quitar** `ssr: false` y el `beforeLoad` con `redirect`.
- **`head()`** con meta propios de la home (sobrescriben al root):
  - `title`: ángulo bulk (ej. *"Bulk Contract Generator · Word + Excel to ZIP | Easy Contracts"*, objetivo ≤ 60 chars).
  - `description`: ≤ 160 chars, con CTA.
  - `og:title`, `og:description`, `og:url` (`https://easycontracts.site/`), `og:type=website`, `twitter:card=summary_large_image` + title/description.
  - `links: [{ rel: "canonical", href: "https://easycontracts.site/" }]`.
  - `scripts`: **FAQPage** JSON-LD (solo si la FAQ on-page existe y coincide 1:1 — ver Optimizaciones).
- **Componente** `HomePage` que renderiza la landing (SSR).
- **`useEffect`** client-side: `supabase.auth.getSession()` → si hay sesión, `navigate({ to: "/templates" })`.
- **Sub-componentes self-contained** (`Step`, `Stat`, `Faq`) replicando el estilo de [influencer-contract-templates.tsx](../../../src/routes/influencer-contract-templates.tsx) — mismos design tokens, coherencia visual.
- Limpiar imports que dejan de usarse (`redirect`).

## Estructura de contenido (ángulo híbrido, ~700-900 palabras)

| Sección | Contenido | Notas SEO |
|---------|-----------|-----------|
| Hero | H1 amplio + subhead + CTA "Start free" (→`/auth`) + "See how it works" (ancla) | H1 con keyword primaria bulk |
| Stats band | 3 métricas (horas ahorradas, contratos por upload, template intacto) | Reutiliza patrón de la página de influencers |
| How it works (H2) | 4 pasos: subir template → subir Excel → mapear columnas → descargar ZIP | Cubre intención "how to" |
| Who it's for (H2) | Casos de uso amplios (agencias, marketing, freelance/HR…) + **influencers destacado con link interno** a `/influencer-contract-templates` (ancla "influencer contract templates") | **Internal linking** (audit lo marcó Fail) |
| Why bulk beats manual (H2) | Beneficios vs. copy-paste y vs. mail merge | Bloque extendido |
| FAQ (H2) | 3 preguntas **de producto** + schema FAQPage | Distintas de la página de influencers |
| CTA final + footer | "Create your free account" → `/auth` | — |

### FAQ de la home (distinta de la de influencers, anti-canibalización)
1. *What file formats do I need?* (.docx template + .xlsx/.csv)
2. *How many contracts can I generate at once?*
3. *Do I need to change my existing contract template?*

(La página de influencers ya cubre "what is an influencer contract template / send to many / legally binding / store data". No se repiten.)

## Data flow del auth (enfoque A)

```
Request a "/"
  │
  ├─ Servidor: no ve sesión (vive en localStorage) → SSR de la landing  → bots / deslogueados ✔
  │
  └─ Cliente hidrata → useEffect → supabase.auth.getSession()
         ├─ con sesión   → navigate("/templates")   (flash marginal)
         └─ sin sesión   → permanece en la landing; CTAs → /auth
```

## Sitemap + structured data ([src/routes/sitemap[.]xml.ts](../../../src/routes/sitemap[.]xml.ts))

- **Re-agregar `/`** con `priority 1.0`, `changefreq weekly`, `lastmod`. ⚠️ Esto **revierte** un cambio del PR #12, donde sacamos `/` del sitemap por ser "redirect-only". Ahora `/` es contenido real indexable, así que vuelve a corresponder. El comentario del archivo debe actualizarse.
- **Bajar** `/influencer-contract-templates` a `priority 0.9` (la home pasa a ser la 1.0).
- `/auth` sigue **fuera** del sitemap y con `noindex` (sin cambios).
- **FAQPage** schema en la home; **Organization + SoftwareApplication** ya están site-wide en el root → **no se duplican**.

---

## Consistencia con la auditoría SEO (`SEO-AUDIT.md`)

| Hallazgo del audit | Cómo lo aborda este diseño |
|--------------------|----------------------------|
| **Critical:** homepage login-gated, no puede rankear "bulk contract generator" | La home pasa a ser landing pública SSR con ese ángulo ✔ |
| **High:** homepage sin canonical | Se agrega canonical self-referencing ✔ |
| **High/Fail:** internal linking en cero | Link interno home → página de influencers ✔ |
| **Estrategia:** no atacar el head term "influencer contract template" en la home (lo dominan PandaDoc/Juro/LawDepot) | El híbrido lidera con "bulk", deja influencers como caso de uso, no como head term de la home ✔ |
| **Wedge competitivo:** "bulk + influencer-specific" | La home lidera con bulk y conecta al nicho ✔ |
| **Lección del audit:** el FAQ schema de la página de influencers tenía 3 Qs pero la página mostraba 4 (mismatch) | **Requisito:** el FAQPage de la home debe coincidir 1:1 con la FAQ visible (mismas 3 preguntas) ✔ |
| **Pendiente NO resuelto acá:** og:image branded (lo inyecta el build de Lovable, necesita asset propio) | Fuera de alcance de este diseño; queda como quick win aparte ✔ |

## Optimizaciones técnicas

1. **Mantener el JS de cliente mínimo en la ruta home.** No importar libs pesadas (`docxtemplater`, `xlsx`, `jspdf`, etc.) en `index.tsx`. La home solo necesita el chequeo de sesión. Evita inflar el bundle de la primera vista (mejor LCP/INP).
2. **`getSession()` es lectura local (no red).** Lee de localStorage, así que el chequeo del `useEffect` no agrega latencia de red ni para deslogueados. Sin impacto de performance.
3. **Usar `<Link>` de TanStack Router para navegación interna** (prefetch on-intent) → navegación más rápida y mejor rastreo. Los CTAs a `/auth` y el link a la página de influencers van con `<Link>`, no `<a>`.
4. **FAQPage schema == FAQ visible (1:1).** Aprendizaje directo del mismatch detectado en el audit. La fuente de verdad de las 3 preguntas debe ser única para evitar drift schema/HTML.
5. **Un solo H1, jerarquía H2/H3 limpia.** Semántica correcta para crawler y accesibilidad.
6. **Canonical + `og:url` absolutos y consistentes** (`https://easycontracts.site/`) para evitar ambigüedad de indexación.
7. **Sin imágenes en v1** (no hay asset branded todavía). Cuando se agregue el screenshot del flujo, usar `width/height` explícitos + `loading="lazy"` para evitar CLS. Anotado para el futuro, fuera de alcance ahora.
8. **Mitigación opcional del flash (no recomendada para v1):** se podría disparar el redirect en `useLayoutEffect`, pero `getSession()` es async → la ganancia es marginal y agrega complejidad. Se acepta el flash (decisión del enfoque A).

## Testing / verificación

Limitación honesta: el repo **no tiene toolchain local** (`node_modules`/`bun` ausentes) ni **test runner configurado** (no hay script de tests en `package.json`). No se escriben tests unitarios — no hay dónde correrlos y la lógica nueva es trivial (un redirect condicional). Verificación:

1. **Revisión de código** contra los patrones existentes (la página de influencers es la referencia).
2. **Preview build de Lovable** — gate real de compilación.
3. **Chequeo post-deploy con `curl`**: confirmar que `GET /` devuelve HTML server-rendered con el H1, la FAQ, el canonical y el JSON-LD (mismo método usado en la auditoría).
4. **Validación manual:** logueado en `/` → redirige a `/templates`; deslogueado → ve la landing y los CTAs van a `/auth`.

## Fuera de alcance

- og:image branded (quick win aparte, necesita asset).
- Screenshot/diagrama del producto.
- Nuevas páginas del topic cluster ("for agencies", guía "generate from Excel").
- Cualquier cambio en la capa de auth (enfoque B descartado).

## Archivos a tocar

- `src/routes/index.tsx` — reescritura (landing SSR + redirect client-side).
- `src/routes/sitemap[.]xml.ts` — re-agregar `/`, ajustar prioridades y comentario.
