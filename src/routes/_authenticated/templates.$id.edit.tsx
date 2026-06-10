import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, Loader2, Save, Upload, FileText } from "lucide-react";
import { toast } from "sonner";

import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  extractVariablesFromDocx,
  humanizeVariableName,
  normalizeVariableType,
  type DetectedVariable,
  type VariableType,
} from "@/lib/docx-parser";

export const Route = createFileRoute("/_authenticated/templates/$id/edit")({
  component: EditTemplatePage,
});

type TemplateRow = {
  id: string;
  name: string;
  storage_path: string;
  variables: Array<{ name: string; label: string; type: VariableType }>;
};

function EditTemplatePage() {
  const navigate = useNavigate();
  const { id } = Route.useParams();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const previewRef = useRef<HTMLDivElement>(null);

  const [name, setName] = useState("");
  const [variables, setVariables] = useState<DetectedVariable[]>([]);
  // newFile is set only if the user replaces the .docx
  const [newFile, setNewFile] = useState<File | null>(null);
  const [parsing, setParsing] = useState(false);
  const [saving, setSaving] = useState(false);

  const { data: template, isLoading } = useQuery({
    queryKey: ["template", id],
    queryFn: async (): Promise<TemplateRow> => {
      const { data, error } = await supabase
        .from("templates")
        .select("id,name,storage_path,variables")
        .eq("id", id)
        .single();
      if (error) throw error;
      const row = data as unknown as TemplateRow;
      return {
        ...row,
        variables: row.variables.map((v) => ({
          ...v,
          type: normalizeVariableType(v.type),
        })),
      };
    },
  });

  // Seed local state once the template loads
  useEffect(() => {
    if (!template) return;
    setName(template.name);
    setVariables(template.variables);
  }, [template]);

  // Preview: the new file if replaced, otherwise the current stored .docx
  useEffect(() => {
    if (!template || !previewRef.current) return;
    let cancelled = false;
    const target = previewRef.current;
    (async () => {
      try {
        let source: Blob | File | null = newFile;
        if (!source) {
          const { data, error } = await supabase.storage
            .from("templates")
            .download(template.storage_path);
          if (error) throw error;
          source = data;
        }
        const { renderAsync } = await import("docx-preview");
        if (cancelled || !target) return;
        target.innerHTML = "";
        await renderAsync(source, target, undefined, {
          className: "docx",
          inWrapper: true,
          ignoreWidth: false,
          ignoreHeight: false,
          breakPages: true,
          experimental: true,
        });
      } catch (err) {
        console.error(err);
        if (target) {
          target.innerHTML =
            '<p class="text-sm text-destructive p-4">Could not preview this file.</p>';
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [template, newFile]);

  async function handleReplaceFile(selected: File | null) {
    if (!selected) return;
    if (!selected.name.toLowerCase().endsWith(".docx")) {
      toast.error("File must be a .docx");
      return;
    }
    setParsing(true);
    try {
      const names = await extractVariablesFromDocx(selected);
      if (names.length === 0) {
        toast.warning(
          "No variables detected. Make sure to use {{variable_name}} in the document.",
        );
      }
      // Keep label/type for variables that still exist; default the new ones.
      setVariables((prev) =>
        names.map((n) => {
          const existing = prev.find((v) => v.name === n);
          return (
            existing ?? {
              name: n,
              label: humanizeVariableName(n),
              type: "text" as VariableType,
            }
          );
        }),
      );
      setNewFile(selected);
    } catch (err) {
      console.error(err);
      toast.error("Could not read the .docx");
    } finally {
      setParsing(false);
    }
  }

  function updateVariable(idx: number, patch: Partial<DetectedVariable>) {
    setVariables((vs) => vs.map((v, i) => (i === idx ? { ...v, ...patch } : v)));
  }

  async function handleSave() {
    if (!template) return;
    if (!name.trim()) {
      toast.error("Give the template a name");
      return;
    }
    if (variables.length === 0) {
      toast.error("The template has no variables");
      return;
    }
    if (variables.some((v) => !v.label.trim())) {
      toast.error("All variables need a label");
      return;
    }

    setSaving(true);
    try {
      // If the file was replaced, overwrite the stored .docx in place.
      if (newFile) {
        const { error: uploadError } = await supabase.storage
          .from("templates")
          .upload(template.storage_path, newFile, {
            contentType:
              "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
            upsert: true,
          });
        if (uploadError) throw uploadError;
      }

      const { error: updateError } = await supabase
        .from("templates")
        .update({
          name: name.trim(),
          variables: variables as unknown as never,
        })
        .eq("id", template.id);
      if (updateError) throw updateError;

      toast.success("Template updated");
      navigate({ to: "/templates" });
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Save error";
      toast.error(msg);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" asChild>
          <Link to="/templates">
            <ArrowLeft className="size-4" />
          </Link>
        </Button>
        <div>
          <h2 className="text-2xl font-semibold tracking-tight">
            Edit template
          </h2>
          <p className="text-sm text-muted-foreground">
            Update the name, the variables, or replace the .docx file.
          </p>
        </div>
      </div>

      {isLoading ? (
        <div className="grid gap-6 lg:grid-cols-[1fr_420px]">
          <Skeleton className="h-[60vh] w-full" />
          <div className="space-y-6">
            <Skeleton className="h-40 w-full" />
            <Skeleton className="h-64 w-full" />
          </div>
        </div>
      ) : !template ? (
        <Card>
          <CardContent className="py-16 text-center text-sm text-muted-foreground">
            Template not found.
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 lg:grid-cols-[1fr_420px]">
          <Card className="overflow-hidden lg:order-1 order-2">
            <CardHeader>
              <CardTitle className="text-base">Preview</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="bg-muted/40 border-t max-h-[calc(100vh-260px)] overflow-auto p-4">
                <div ref={previewRef} />
              </div>
            </CardContent>
          </Card>

          <div className="space-y-6 lg:order-2 order-1">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">1. Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Template name</Label>
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    maxLength={120}
                  />
                </div>
                <div className="space-y-2">
                  <Label>.docx file</Label>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".docx,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                    className="hidden"
                    onChange={(e) =>
                      handleReplaceFile(e.target.files?.[0] ?? null)
                    }
                  />
                  <div className="flex items-center gap-3 rounded-lg border bg-card px-3 py-2.5">
                    <FileText className="size-5 text-primary shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium truncate">
                        {newFile ? newFile.name : "Current file"}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {newFile
                          ? "Will replace the stored document on save"
                          : "Keeping the existing document"}
                      </div>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <Upload className="size-4" />
                      Replace
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center justify-between">
                  <span>2. Variables</span>
                  {variables.length > 0 && (
                    <Badge variant="secondary">{variables.length}</Badge>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {parsing ? (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground py-4">
                    <Loader2 className="size-4 animate-spin" />
                    Detecting variables…
                  </div>
                ) : variables.length === 0 ? (
                  <p className="text-sm text-muted-foreground py-4">
                    This template has no variables.
                  </p>
                ) : (
                  <div className="space-y-3">
                    {variables.map((v, idx) => (
                      <div
                        key={v.name}
                        className="rounded-lg border bg-muted/30 p-3 space-y-2"
                      >
                        <div className="flex items-center gap-2">
                          <code className="rounded bg-background px-1.5 py-0.5 text-xs font-mono text-primary">
                            {`{{${v.name}}}`}
                          </code>
                        </div>
                        <div className="grid grid-cols-[1fr_140px] gap-2">
                          <div className="space-y-1">
                            <Label
                              htmlFor={`label-${idx}`}
                              className="text-xs text-muted-foreground"
                            >
                              Label
                            </Label>
                            <Input
                              id={`label-${idx}`}
                              value={v.label}
                              onChange={(e) =>
                                updateVariable(idx, { label: e.target.value })
                              }
                              className="h-8"
                            />
                          </div>
                          <div className="space-y-1">
                            <Label className="text-xs text-muted-foreground">
                              Type
                            </Label>
                            <Select
                              value={v.type}
                              onValueChange={(val) =>
                                updateVariable(idx, {
                                  type: val as VariableType,
                                })
                              }
                            >
                              <SelectTrigger className="h-8">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="text">Text</SelectItem>
                                <SelectItem value="date">Date</SelectItem>
                                <SelectItem value="currency">
                                  Currency
                                </SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            <div className="flex gap-2">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => navigate({ to: "/templates" })}
                disabled={saving}
              >
                Cancel
              </Button>
              <Button
                className="flex-1"
                onClick={handleSave}
                disabled={saving || parsing || variables.length === 0}
              >
                {saving ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : (
                  <Save className="size-4" />
                )}
                Save changes
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
