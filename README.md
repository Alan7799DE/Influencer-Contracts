# Easy Contracts

App para generar **contratos de influencers en lote**: subís una plantilla en Word con variables (`{{Name}}`, `{{Campaign}}`, etc.), cargás un Excel o CSV con los datos de cada creador, y la app genera un `.docx` (o PDF) personalizado por fila, listo para descargar en un ZIP.

🔗 **Usala en:** [easycontracts.site](https://easycontracts.site/auth)

> Primera iteración generada con Lovable. El desarrollo posterior (lógica de negocio, wizard de generación, parseo de templates y refinamiento de UX) se hizo iterando directamente sobre el código con Claude Code.

## ¿Qué hace?

- **Plantillas reutilizables**: subís un `.docx` con variables tipo `{{variable}}` y la app las detecta automáticamente, infiriendo tipo (texto, fecha, moneda) a partir del nombre.
- **Generación masiva**: wizard de 5 pasos — elegir template, subir datos (Excel/CSV), mapear columnas a variables (con auto-mapeo por nombre), elegir cómo nombrar cada archivo, previsualizar y generar.
- **Conversión a PDF en el navegador**: además del `.docx`, se puede exportar a PDF renderizando el documento y "fotografiándolo" en un canvas (sin depender de un conversor en el servidor).
- **Edición de templates**: renombrar variables, cambiar su tipo o reemplazar el archivo Word sin perder la configuración.
- **Historial de generaciones**: cada corrida en lote queda registrada (template usado, cantidad de filas, errores).
- **Autenticación de usuarios** con confirmación de email.

## Cómo está construido

**Frontend / Full-stack**
- [TanStack Start](https://tanstack.com/start) (React 19 con SSR) + TanStack Router
- Tailwind CSS + shadcn/ui (Radix UI primitives)
- React Hook Form + Zod
- Bun como runtime/gestor de paquetes

**Generación de documentos (100% client-side)**
- `docxtemplater` + `pizzip` para reemplazar variables dentro del `.docx`
- `xlsx` (SheetJS) y parsing de CSV para leer los datos de entrada
- `docx-preview` + `html2canvas` + `jsPDF` para la conversión a PDF en el navegador
- `jszip` + `file-saver` para empaquetar y descargar los contratos generados en lote

**Backend**
- **Supabase**: autenticación, base de datos (Postgres) y Storage para guardar las plantillas `.docx` de cada usuario

## Por qué es interesante técnicamente

- Todo el pipeline de generación de documentos —parseo de variables, formateo por tipo de dato, mapeo de columnas, render de `.docx` y conversión a PDF— corre **en el navegador**, sin backend de procesamiento de archivos.
- El flujo está diseñado para casos reales de gestión de campañas de influencers: deadlines, aprobaciones, deliverables y datos de campaña que cambian por cada creador.
