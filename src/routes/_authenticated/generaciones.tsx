import { createFileRoute } from "@tanstack/react-router";
import { FolderArchive } from "lucide-react";

export const Route = createFileRoute("/_authenticated/generaciones")({
  component: GeneracionesPage,
});

function GeneracionesPage() {
  return (
    <div className="mx-auto max-w-3xl">
      <div className="flex flex-col items-center justify-center rounded-xl border border-dashed bg-card py-20 px-6 text-center">
        <div className="flex size-14 items-center justify-center rounded-full bg-accent text-accent-foreground">
          <FolderArchive className="size-7" />
        </div>
        <h2 className="mt-6 text-xl font-semibold">Próximamente</h2>
        <p className="mt-2 max-w-md text-sm text-muted-foreground">
          Acá vas a ver el historial de generaciones masivas. Vas a poder subir
          un CSV con tus influencers, mapear las columnas a las variables del
          template y descargar un ZIP con todos los contratos en un click.
        </p>
      </div>
    </div>
  );
}
