## Cambio de layout en `/templates/new`

Invertir el orden de las columnas en la página de creación de templates:

- **Izquierda (ancho flexible):** Vista previa del documento .docx.
- **Derecha (ancho fijo ~420px):** Nombre del template, selector de archivo .docx, lista de variables detectadas y botones de acción (Cancelar / Guardar).

### Cambio técnico
En `src/routes/_authenticated/templates.new.tsx`, ajustar el grid:
- Cambiar `lg:grid-cols-[420px_1fr]` a `lg:grid-cols-[1fr_420px]`.
- Reordenar los hijos del grid para que la vista previa vaya primero (izquierda) y el panel de controles segundo (derecha).

No hay cambios de lógica ni de backend — solo reordenamiento de la UI.