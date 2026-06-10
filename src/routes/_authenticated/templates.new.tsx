import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { ArrowLeft, Loader2, Save, Upload, FileText } from "lucide-react";
import { toast } from "sonner";

import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
  type DetectedVariable,
  type VariableType,
} from "@/lib/docx-parser";

export const Route = createFileRoute("/_authenticated/templates/new")({
  component: NewTemplatePage,
});

function NewTemplatePage() {
  const navigate = useNavigate();
  const { user } = Route.useRouteContext();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const previewRef = useRef<HTMLDivElement>(null);

  const [name, setName] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [variables, setVariables] = useState<DetectedVariable[]>([]);
  const [parsing, setParsing] = useState(false);
  const [saving, setSaving] = useState(false);

  // Render preview whenever file changes
  useEffect(() => {
    if (!file || !previewRef.current) return;
    let cancelled = false;
    (async () => {
      try {
        const { renderAsync } = await import("docx-preview");
        if (cancelled || !previewRef.current) return;
        previewRef.current.innerHTML = "";
        await renderAsync(file, previewRef.current, undefined, {
          className: "docx",
          inWrapper: true,
          ignoreWidth: false,
          ignoreHeight: false,
          breakPages: true,
          experimental: true,
        });
      } catch (err) {
        console.error(err);
        if (previewRef.current) {
          previewRef.current.innerHTML =
            '<p class="text-sm text-destructive p-4">Could not preview this file.</p>';
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [file]);

  async function handleFile(selected: File | null) {
    if (!selected) return;
    if (!selected.name.toLowerCase().endsWith(".docx")) {
      toast.error("File must be a .docx");
      return;
    }
    setParsing(true);
    setFile(selected);
    setVariables([]);
    try {
      const names = await extractVariablesFromDocx(selected);
      if (names.length === 0) {
        toast.warning(
          "No variables detected. Make sure to use {{variable_name}} in the document.",
        );
      }
      setVariables(
        names.map((n) => ({
          name: n,
          label: humanizeVariableName(n),
          type: "text" as VariableType,
        })),
      );
    } catch (err) {
      console.error(err);
      toast.error("Could not read the .docx");
      setFile(null);
    } finally {
      setParsing(false);
    }
  }

  function updateVariable(idx: number, patch: Partial<DetectedVariable>) {
    setVariables((vs) => vs.map((v, i) => (i === idx ? { ...v, ...patch } : v)));
  }

  async function handleSave() {
    if (!name.trim()) {
      toast.error("Give the template a name");
      return;
    }
    if (!file) {
      toast.error("Upload a .docx file");
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
    const templateId = crypto.randomUUID();
    const storagePath = `${user.id}/${templateId}.docx`;

    try {
      const { error: uploadError } = await supabase.storage
        .from("templates")
        .upload(storagePath, file, {
          contentType:
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
          upsert: false,
        });
      if (uploadError) throw uploadError;

      const { error: insertError } = await supabase.from("templates").insert({
        id: templateId,
        name: name.trim(),
        storage_path: storagePath,
        variables: variables as unknown as never,
      });

      if (insertError) {
        // rollback
        await supabase.storage.from("templates").remove([storagePath]);
        throw insertError;
      }

      toast.success("Template saved");
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
            New template
          </h2>
          <p className="text-sm text-muted-foreground">
            Upload a .docx with{" "}
            <code className="rounded bg-muted px-1 py-0.5 text-xs">
              {"{{variable}}"}
            </code>{" "}
            placeholders and define each variable.
          </p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_420px]">
        <Card className="overflow-hidden lg:order-1 order-2">
          <CardHeader>
            <CardTitle className="text-base">Preview</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="bg-muted/40 border-t max-h-[calc(100vh-260px)] overflow-auto p-4">
              {!file ? (
                <div className="flex flex-col items-center justify-center gap-2 py-24 text-center text-sm text-muted-foreground">
                  <FileText className="size-8 opacity-40" />
                  The preview will appear here once you upload the file.
                </div>
              ) : (
                <div ref={previewRef} />
              )}
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
                  placeholder="E.g. Standard influencer contract"
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
                  onChange={(e) => handleFile(e.target.files?.[0] ?? null)}
                />
                {!file ? (
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="flex w-full flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-input bg-muted/30 px-4 py-8 text-sm transition-colors hover:bg-muted/60"
                  >
                    <Upload className="size-6 text-muted-foreground" />
                    <span className="font-medium">Upload .docx</span>
                    <span className="text-xs text-muted-foreground">
                      Exported from Word or Google Docs
                    </span>
                  </button>
                ) : (
                  <div className="flex items-center gap-3 rounded-lg border bg-card px-3 py-2.5">
                    <FileText className="size-5 text-primary shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium truncate">
                        {file.name}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {(file.size / 1024).toFixed(1)} KB
                      </div>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      Change
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center justify-between">
                <span>2. Variables</span>
                {variables.length > 0 && (
                  <Badge variant="secondary">{variables.length} detected</Badge>
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
                  Upload a .docx to see the detected variables.
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
                              <SelectItem value="currency">Currency</SelectItem>
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
              disabled={saving || parsing || !file || variables.length === 0}
            >
              {saving ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <Save className="size-4" />
              )}
              Save template
            </Button>
          </div>
        </div>

      </div>
    </div>
  );
}
