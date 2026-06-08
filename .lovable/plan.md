## Wizard de generación de contratos en "Generaciones"

Construir un wizard de 5 pasos en `src/routes/_authenticated/generaciones.tsx` para generar contratos en lote desde un template. Estado en memoria (no se persiste hasta generar).

### Pasos del wizard

1. **Seleccionar template** — Lista los templates del usuario (consulta a `templates`). Al seleccionar uno, muestra sus variables (nombre, label, tipo).
2. **Subir datos** — Drag/drop o file picker. Acepta `.csv` y `.xlsx`. Parseo en navegador con **papaparse** (CSV) y **xlsx** (Excel). Primera fila = headers. Muestra cantidad de filas detectadas y preview de las primeras 3.
3. **Mapeo de columnas** — Por cada variable del template, dropdown con las columnas del archivo. Auto-mapeo cuando nombres coinciden (comparación case-insensitive normalizando guiones/espacios/acentos).
4. **Nombre de archivos** — Dropdown para elegir qué columna se usa como nombre de archivo. Sanitización: minúsculas, espacios → `_`, removiendo caracteres inválidos, prefijo `contrato_` y sufijo `.docx`. Vista previa con la primera fila.
5. **Preview + Generar** — Renderiza un contrato con datos de la primera fila usando `docx-preview`. Botón "Generar contratos" descarga un ZIP con todos los .docx.

### Formateo por tipo
- `texto`: valor tal cual.
- `fecha`: parseo flexible (ISO, DD/MM/YYYY, MM/DD/YYYY, números seriales de Excel) → output `DD/MM/YYYY`.
- `moneda`: número → `$5.000` (separador de miles `.`, sin decimales por defecto, símbolo `$` ARS).

### Generación de contratos
- Descarga el .docx del template desde Supabase Storage (`templates` bucket).
- Usa **docxtemplater** + **pizzip** para reemplazar `{{variable}}` con los valores formateados.
- Empaqueta todo en un ZIP con **jszip** y dispara descarga con **file-saver**.
- Nombres únicos: si hay colisión, agrega `_2`, `_3`, etc.

### Componentes / archivos nuevos
- `src/lib/template-data.ts` — utilidades: parseCSV, parseXLSX, autoMapColumns, formatValue (por tipo), sanitizeFilename, renderTemplate (docxtemplater).
- `src/routes/_authenticated/generaciones.tsx` — refactor completo a wizard con stepper visual, estado local (`useState`) por paso, navegación adelante/atrás.

### Dependencias a instalar
- `papaparse` + `@types/papaparse`
- `xlsx`
- `docxtemplater`
- `jszip`
- `file-saver` + `@types/file-saver`
- (pizzip ya está instalado)

### Habilitación del botón final
"Generar contratos" se habilita solo cuando: template elegido + archivo parseado con ≥1 fila + todas las variables mapeadas a una columna + columna de nombre de archivo elegida.

### Detalles técnicos
- Toda la lógica corre en el browser, no hay backend nuevo.
- El wizard mantiene estado entre pasos en un único `useState` con un objeto `WizardState`.
- Stepper visual arriba (`1 → 2 → 3 → 4 → 5`) marca paso actual y permite volver a pasos completados.
- Validaciones inline antes de habilitar "Siguiente".
- Toasts (`sonner`) para errores de parseo, archivos inválidos, etc.