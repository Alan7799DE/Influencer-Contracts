import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import {
  FileText,
  Plus,
  Trash2,
  Loader2,
  Variable as VariableIcon,
} from "lucide-react";
import { toast } from "sonner";

import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

type TemplateRow = {
  id: string;
  name: string;
  storage_path: string;
  variables: Array<{ name: string; label: string; type: string }>;
  created_at: string;
};

export const Route = createFileRoute("/_authenticated/templates/")({
  component: TemplatesPage,
});

function TemplatesPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [toDelete, setToDelete] = useState<TemplateRow | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ["templates"],
    queryFn: async (): Promise<TemplateRow[]> => {
      const { data, error } = await supabase
        .from("templates")
        .select("id,name,storage_path,variables,created_at")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data ?? []) as unknown as TemplateRow[];
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (t: TemplateRow) => {
      const { error } = await supabase.from("templates").delete().eq("id", t.id);
      if (error) throw error;
      // Best-effort storage cleanup
      await supabase.storage.from("templates").remove([t.storage_path]);
    },
    onSuccess: () => {
      toast.success("Template eliminado");
      queryClient.invalidateQueries({ queryKey: ["templates"] });
      setToDelete(null);
    },
    onError: (err: Error) => toast.error(err.message),
  });

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight">Templates</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Modelos de contrato reutilizables con variables dinámicas.
          </p>
        </div>
        <Button onClick={() => navigate({ to: "/templates/new" })}>
          <Plus className="size-4" />
          Nuevo template
        </Button>
      </div>

      {isLoading ? (
        <div className="grid gap-3">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-20 w-full" />
          ))}
        </div>
      ) : !data || data.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <div className="flex size-14 items-center justify-center rounded-full bg-accent text-accent-foreground">
              <FileText className="size-7" />
            </div>
            <h3 className="mt-4 text-lg font-medium">Todavía no hay templates</h3>
            <p className="mt-1 max-w-sm text-sm text-muted-foreground">
              Subí tu primer .docx con placeholders{" "}
              <code className="rounded bg-muted px-1 py-0.5 text-xs">
                {"{{variable}}"}
              </code>{" "}
              para empezar.
            </p>
            <Button
              className="mt-6"
              onClick={() => navigate({ to: "/templates/new" })}
            >
              <Plus className="size-4" />
              Crear template
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-3">
          {data.map((t) => (
            <Card
              key={t.id}
              className="transition-shadow hover:shadow-md"
            >
              <CardContent className="flex items-center gap-4 py-4">
                <div className="flex size-11 items-center justify-center rounded-lg bg-accent text-accent-foreground shrink-0">
                  <FileText className="size-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium truncate">{t.name}</div>
                  <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
                    <span>
                      Creado el{" "}
                      {format(new Date(t.created_at), "d 'de' LLLL, yyyy", {
                        locale: es,
                      })}
                    </span>
                    <Badge variant="secondary" className="font-normal">
                      <VariableIcon className="size-3" />
                      {t.variables.length}{" "}
                      {t.variables.length === 1 ? "variable" : "variables"}
                    </Badge>
                  </div>
                </div>
                <Link
                  to="/templates/new"
                  // future: edit route. For now hide.
                  className="hidden"
                />
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setToDelete(t)}
                  aria-label="Eliminar template"
                >
                  <Trash2 className="size-4 text-destructive" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <AlertDialog open={!!toDelete} onOpenChange={(o) => !o && setToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Eliminar template?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. Se borrará el template{" "}
              <span className="font-medium text-foreground">
                {toDelete?.name}
              </span>{" "}
              y su archivo asociado.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleteMutation.isPending}>
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction
              disabled={deleteMutation.isPending}
              onClick={(e) => {
                e.preventDefault();
                if (toDelete) deleteMutation.mutate(toDelete);
              }}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleteMutation.isPending && (
                <Loader2 className="size-4 animate-spin" />
              )}
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
