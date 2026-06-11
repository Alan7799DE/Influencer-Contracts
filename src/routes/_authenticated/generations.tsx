import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  Check,
  CheckCircle2,
  Download,
  FileSpreadsheet,
  FileText,
  Info,
  Loader2,
  Upload,
  Wand2,
} from "lucide-react";
import { toast } from "sonner";

import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { normalizeVariableType, type VariableType } from "@/lib/docx-parser";
import {
  buildSheetFromRaw,
  formatValue,
  parseXLSXRaw,
  renderDocx,
  sanitizeFilename,
  type ParsedSheet,
} from "@/lib/template-data";

export const Route = createFileRoute("/_authenticated/generations")({
  component: GenerationsPage,
});


type TemplateRow = {
  id: string;
  name: string;
  storage_path: string;
  variables: Array<{ name: string; label: string; type: VariableType }>;
};

const STEPS = [
  { id: 1, title: "Template" },
  { id: 2, title: "Data" },
  { id: 3, title: "Mapping" },
  { id: 4, title: "Name" },
  { id: 5, title: "Generate" },
] as const;

function GenerationsPage() {
  const [step, setStep] = useState(1);
  const [template, setTemplate] = useState<TemplateRow | null>(null);
  const [sheet, setSheet] = useState<ParsedSheet | null>(null);
  const [fileName, setFileName] = useState<string>("");
  const [rawRows, setRawRows] = useState<string[][] | null>(null);
  const [headerRowIdx, setHeaderRowIdx] = useState<number>(0);
  const [mapping, setMapping] = useState<Record<string, string>>({});
  const [sources, setSources] = useState<Record<string, "column" | "fixed">>({});
  const [constants, setConstants] = useState<Record<string, string>>({});
  const [nameColumn, setNameColumn] = useState<string>("");
  const [generated, setGenerated] = useState(false);

  const allMapped =
    !!template &&
    template.variables.length > 0 &&
    template.variables.every((v) => {
      const src = sources[v.name] ?? "column";
      if (src === "fixed") return (constants[v.name] ?? "").trim() !== "";
      return !!mapping[v.name];
    });
  const canGenerate =
    !!template && !!sheet && sheet.rows.length > 0 && allMapped && !!nameColumn;

  function go(nextStep: number) {
    if (nextStep < 1 || nextStep > STEPS.length) return;
    setStep(nextStep);
  }

  function reset() {
    setStep(1);
    setGenerated(false);
    setTemplate(null);
    setSheet(null);
    setFileName("");
    setRawRows(null);
    setHeaderRowIdx(0);
    setMapping({});
    setSources({});
    setConstants({});
    setNameColumn("");
  }

  function applyHeader(raw: string[][], idx: number, name: string) {
    const s = buildSheetFromRaw(raw, idx);
    setSheet(s);
    setFileName(name);
    setHeaderRowIdx(idx);
    setRawRows(raw);
    if (template) {
      setMapping({});
      if (!nameColumn || !s.headers.includes(nameColumn)) {
        setNameColumn(s.headers[0] ?? "");
      }
    }
  }

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div>
        <h2 className="text-2xl font-semibold tracking-tight">
          Bulk generation
        </h2>
        <p className="text-sm text-muted-foreground mt-1">
          Generate dozens of contracts in minutes from a template and a spreadsheet.
        </p>
      </div>

      <Stepper current={step} completed={generated} />

      {step === 1 && (
        <StepTemplate
          selected={template}
          onSelect={(t) => {
            if (template?.id !== t.id) {
              // changing template: reset downstream state
              setMapping({});
              setSources({});
              setConstants({});
              setNameColumn("");
            }
            setTemplate(t);
          }}
        />
      )}

      {step === 2 && (
        <StepData
          sheet={sheet}
          fileName={fileName}
          rawRows={rawRows}
          headerRowIdx={headerRowIdx}
          onParsed={applyHeader}
        />
      )}

      {step === 3 && template && sheet && (
        <StepMapping
          template={template}
          sheet={sheet}
          mapping={mapping}
          sources={sources}
          constants={constants}
          onMappingChange={setMapping}
          onSourcesChange={setSources}
          onConstantsChange={setConstants}
        />
      )}

      {step === 4 && sheet && (
        <StepName
          sheet={sheet}
          nameColumn={nameColumn}
          onChange={setNameColumn}
        />
      )}

      {step === 5 && template && sheet && (
        <StepGenerate
          template={template}
          sheet={sheet}
          csvFilename={fileName}
          mapping={mapping}
          sources={sources}
          constants={constants}
          nameColumn={nameColumn}
          canGenerate={canGenerate}
          onDone={reset}
        />
      )}


      <div className="flex items-center justify-between gap-3 border-t pt-4">
        <Button
          variant="outline"
          onClick={() => go(step - 1)}
          disabled={step === 1}
        >
          <ArrowLeft className="size-4" />
          Back
        </Button>
        {step < STEPS.length ? (
          <Button
            onClick={() => go(step + 1)}
            disabled={!canAdvance(step, {
              template,
              sheet,
              allMapped,
              nameColumn,
            })}
          >
            Next
            <ArrowRight className="size-4" />
          </Button>
        ) : (
          <Button variant="ghost" onClick={reset}>
            Start over
          </Button>
        )}
      </div>
    </div>
  );
}

function canAdvance(
  step: number,
  s: {
    template: TemplateRow | null;
    sheet: ParsedSheet | null;
    allMapped: boolean;
    nameColumn: string;
  },
): boolean {
  if (step === 1) return !!s.template;
  if (step === 2) return !!s.sheet && s.sheet.rows.length > 0;
  if (step === 3) return s.allMapped;
  if (step === 4) return !!s.nameColumn;
  return true;
}

function Stepper({ current, completed }: { current: number; completed: boolean }) {
  return (
    <ol className="flex items-center gap-2">
      {STEPS.map((s, idx) => {
        const isDone = current > s.id || (completed && s.id === STEPS.length);
        const isCurrent = current === s.id && !isDone;
        return (
          <li key={s.id} className="flex items-center gap-2 flex-1">
            <div
              className={cn(
                "flex size-8 items-center justify-center rounded-full text-xs font-medium border transition-colors",
                isDone &&
                  "bg-primary text-primary-foreground border-primary",
                isCurrent &&
                  "border-primary text-primary",
                !isDone && !isCurrent && "text-muted-foreground",
              )}
            >
              {isDone ? <Check className="size-4" /> : s.id}
            </div>
            <span
              className={cn(
                "text-sm",
                isCurrent ? "font-medium" : "text-muted-foreground",
              )}
            >
              {s.title}
            </span>
            {idx < STEPS.length - 1 && (
              <div className="flex-1 h-px bg-border" />
            )}
          </li>
        );
      })}
    </ol>
  );
}

/* ============================== STEP 1 ============================== */

function StepTemplate({
  selected,
  onSelect,
}: {
  selected: TemplateRow | null;
  onSelect: (t: TemplateRow) => void;
}) {
  const { data, isLoading } = useQuery({
    queryKey: ["templates"],
    queryFn: async (): Promise<TemplateRow[]> => {
      const { data, error } = await supabase
        .from("templates")
        .select("id,name,storage_path,variables")
        .order("created_at", { ascending: false });
      if (error) throw error;
      // Normalize legacy variable types ("texto"/"fecha"/"moneda") to English.
      return ((data ?? []) as unknown as TemplateRow[]).map((t) => ({
        ...t,
        variables: t.variables.map((v) => ({
          ...v,
          type: normalizeVariableType(v.type),
        })),
      }));
    },
  });

  if (isLoading) {
    return (
      <div className="grid gap-3">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-20 w-full" />
        ))}
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-16 text-center">
          <div className="flex size-14 items-center justify-center rounded-full bg-accent text-accent-foreground">
            <FileText className="size-7" />
          </div>
          <h3 className="mt-4 text-lg font-medium">No templates yet</h3>
          <p className="mt-1 max-w-sm text-sm text-muted-foreground">
            Before generating contracts in bulk you need at least one template.
          </p>
          <Button asChild className="mt-6">
            <Link to="/templates/new">Create template</Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">1. Pick a template</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {data.map((t) => {
          const active = selected?.id === t.id;
          return (
            <button
              key={t.id}
              type="button"
              onClick={() => onSelect(t)}
              className={cn(
                "w-full text-left rounded-lg border p-4 transition-all",
                active
                  ? "border-primary bg-primary/10 ring-2 ring-primary shadow-sm"
                  : "hover:bg-muted/50",
              )}>
              <div className="flex items-center gap-3">
                <div className={cn(
                  "flex size-10 items-center justify-center rounded-lg",
                  active
                    ? "bg-primary text-primary-foreground"
                    : "bg-accent text-accent-foreground",
                )}>
                  <FileText className="size-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium truncate">{t.name}</div>
                  <div className="text-xs text-muted-foreground mt-0.5">
                    {t.variables.length} variables
                  </div>
                </div>
                {active && <Check className="size-5 text-primary" />}
              </div>
              {active && (
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {t.variables.map((v) => (
                    <Badge
                      key={v.name}
                      className="font-normal bg-primary/10 text-primary border-primary/20 hover:bg-primary/20">
                      {v.label}
                      <span className="ml-1 text-primary/70">
                        · {v.type}
                      </span>
                    </Badge>
                  ))}
                </div>
              )}
            </button>
          );
        })}
      </CardContent>
    </Card>
  );
}

/* ============================== STEP 2 ============================== */

function StepData({
  sheet,
  fileName,
  rawRows,
  headerRowIdx,
  onParsed,
}: {
  sheet: ParsedSheet | null;
  fileName: string;
  rawRows: string[][] | null;
  headerRowIdx: number;
  onParsed: (raw: string[][], headerRowIdx: number, fileName: string) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);

  async function handle(file: File | null) {
    if (!file) return;
    const lower = file.name.toLowerCase();
    setBusy(true);
    try {
      if (!lower.endsWith(".xlsx") && !lower.endsWith(".xls"))
        throw new Error("Upload an .xlsx file");
      const raw = await parseXLSXRaw(file);
      if (raw.length === 0) throw new Error("The file is empty");
      // Default header row = first non-empty row
      const firstNonEmpty = raw.findIndex((r) =>
        r.some((v) => String(v ?? "").trim() !== ""),
      );
      const initialHeader = firstNonEmpty >= 0 ? firstNonEmpty : 0;
      onParsed(raw, initialHeader, file.name);
      toast.success(`${raw.length} rows loaded`);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Error reading the file";
      toast.error(msg);
    } finally {
      setBusy(false);
    }
  }

  const previewRows = rawRows ? rawRows.slice(0, 15) : [];
  const maxCols = rawRows
    ? rawRows.reduce((m, r) => Math.max(m, r.length), 0)
    : 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">2. Upload your data</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <input
          ref={inputRef}
          type="file"
          accept=".xlsx,.xls"
          className="hidden"
          onChange={(e) => {
            handle(e.target.files?.[0] ?? null);
            if (inputRef.current) inputRef.current.value = "";
          }}
        />
        {!rawRows ? (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={busy}
            className="flex w-full flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-input bg-muted/30 px-4 py-12 text-sm transition-colors hover:bg-muted/60"
          >
            {busy ? (
              <Loader2 className="size-6 animate-spin text-muted-foreground" />
            ) : (
              <Upload className="size-6 text-muted-foreground" />
            )}
            <span className="font-medium">Upload Excel file (.xlsx)</span>
            <span className="text-xs text-muted-foreground">
              You'll choose which row contains the column names
            </span>
          </button>
        ) : (
          <>
            <div className="flex items-center gap-3 rounded-lg border bg-card px-3 py-2.5">
              <FileSpreadsheet className="size-5 text-primary shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium truncate">{fileName}</div>
                <div className="text-xs text-muted-foreground">
                  {sheet?.rows.length ?? 0} data rows · {sheet?.headers.length ?? 0} columns
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => inputRef.current?.click()}
              >
                Change
              </Button>
            </div>

            <div className="flex items-start gap-2.5 rounded-lg border border-primary/20 bg-primary/5 px-3 py-2.5">
              <Info className="size-4 text-primary shrink-0 mt-0.5" />
              <span className="text-sm font-medium text-foreground">
                Click the row that contains your column names. Rows above it will be ignored; rows below it become your data.
              </span>
            </div>

            <div className="rounded-lg border overflow-hidden">
              <div className="overflow-auto max-h-80">
                <table className="w-full text-xs">
                  <thead className="bg-muted/60 sticky top-0">
                    <tr>
                      <th className="px-2 py-2 text-left font-medium w-12">Row</th>
                      {Array.from({ length: maxCols }).map((_, c) => (
                        <th
                          key={c}
                          className="px-3 py-2 text-left font-medium whitespace-nowrap"
                        >
                          {colLetter(c)}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {previewRows.map((row, i) => {
                      const isHeader = i === headerRowIdx;
                      const isData = i > headerRowIdx;
                      return (
                        <tr
                          key={i}
                          onClick={() => rawRows && onParsed(rawRows, i, fileName)}
                          className={cn(
                            "border-t cursor-pointer transition-colors",
                            isHeader && "bg-primary/10 hover:bg-primary/15",
                            !isHeader && "hover:bg-muted/60",
                            !isHeader && !isData && "opacity-50",
                          )}
                        >
                          <td className="px-2 py-2 font-mono text-muted-foreground">
                            <div className="flex items-center gap-1.5">
                              {isHeader && (
                                <Check className="size-3 text-primary" />
                              )}
                              {i + 1}
                            </div>
                          </td>
                          {Array.from({ length: maxCols }).map((_, c) => (
                            <td
                              key={c}
                              className={cn(
                                "px-3 py-2 whitespace-nowrap",
                                isHeader
                                  ? "font-medium"
                                  : "text-muted-foreground",
                              )}
                            >
                              {row[c] || (isHeader ? "" : "—")}
                            </td>
                          ))}
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              {rawRows.length > previewRows.length && (
                <div className="border-t px-3 py-2 text-xs text-muted-foreground bg-muted/30">
                  Showing first {previewRows.length} of {rawRows.length} rows
                </div>
              )}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}

function colLetter(n: number): string {
  let s = "";
  let x = n;
  while (x >= 0) {
    s = String.fromCharCode((x % 26) + 65) + s;
    x = Math.floor(x / 26) - 1;
  }
  return s;
}

/* ============================== STEP 3 ============================== */

function StepMapping({
  template,
  sheet,
  mapping,
  sources,
  constants,
  onMappingChange,
  onSourcesChange,
  onConstantsChange,
}: {
  template: TemplateRow;
  sheet: ParsedSheet;
  mapping: Record<string, string>;
  sources: Record<string, "column" | "fixed">;
  constants: Record<string, string>;
  onMappingChange: (m: Record<string, string>) => void;
  onSourcesChange: (m: Record<string, "column" | "fixed">) => void;
  onConstantsChange: (m: Record<string, string>) => void;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">3. Map the variables</CardTitle>
        <div className="flex items-start gap-2.5 rounded-lg border border-primary/20 bg-primary/5 px-3 py-2.5 mt-2">
          <Info className="size-4 text-primary shrink-0 mt-0.5" />
          <p className="text-sm font-medium text-foreground">
            For each variable, pick a column from your file or set a fixed value
            that will be the same across every contract.
          </p>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {template.variables.map((v) => {
          const source = sources[v.name] ?? "column";
          const inputType =
            v.type === "date" ? "date" : v.type === "currency" ? "number" : "text";
          return (
            <div
              key={v.name}
              className="rounded-lg border p-3 space-y-3"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-1">
                  <div className="font-medium text-sm">{v.label}</div>
                  <div className="flex items-center gap-2">
                    <code className="rounded bg-muted px-1.5 py-0.5 text-xs font-mono text-primary">
                      {`{{${v.name}}}`}
                    </code>
                    <Badge variant="outline" className="font-normal">
                      {v.type}
                    </Badge>
                  </div>
                </div>
                <div className="inline-flex rounded-md border bg-muted/40 p-0.5 text-xs">
                  <button
                    type="button"
                    onClick={() =>
                      onSourcesChange({ ...sources, [v.name]: "column" })
                    }
                    className={cn(
                      "px-2.5 py-1 rounded transition-colors",
                      source === "column"
                        ? "bg-background shadow-sm font-medium"
                        : "text-muted-foreground hover:text-foreground",
                    )}
                  >
                    From column
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      onSourcesChange({ ...sources, [v.name]: "fixed" })
                    }
                    className={cn(
                      "px-2.5 py-1 rounded transition-colors",
                      source === "fixed"
                        ? "bg-background shadow-sm font-medium"
                        : "text-muted-foreground hover:text-foreground",
                    )}
                  >
                    Fixed value
                  </button>
                </div>
              </div>

              {source === "column" ? (
                <Select
                  value={mapping[v.name] ?? ""}
                  onValueChange={(val) =>
                    onMappingChange({ ...mapping, [v.name]: val })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Pick a column" />
                  </SelectTrigger>
                  <SelectContent>
                    {sheet.headers.map((h) => (
                      <SelectItem key={h} value={h}>
                        {h}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : (
                <div className="space-y-1.5">
                  <Input
                    type={inputType}
                    value={constants[v.name] ?? ""}
                    onChange={(e) =>
                      onConstantsChange({
                        ...constants,
                        [v.name]: e.target.value,
                      })
                    }
                    placeholder={
                      v.type === "currency"
                        ? "e.g. 5000"
                        : v.type === "date"
                          ? ""
                          : `e.g. ${v.label}`
                    }
                  />
                  {(constants[v.name] ?? "").trim() !== "" && (
                    <div className="text-xs text-muted-foreground">
                      Preview:{" "}
                      <span className="font-mono text-foreground">
                        {formatValue(constants[v.name] ?? "", v.type)}
                      </span>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}

/* ============================== STEP 4 ============================== */

function StepName({
  sheet,
  nameColumn,
  onChange,
}: {
  sheet: ParsedSheet;
  nameColumn: string;
  onChange: (col: string) => void;
}) {
  const sampleRowIdx = nameColumn
    ? sheet.rows.findIndex((r) => (r[nameColumn] ?? "").trim() !== "")
    : -1;
  const sampleRaw =
    sampleRowIdx >= 0 ? sheet.rows[sampleRowIdx][nameColumn] ?? "" : "";
  const sampleFile = sampleRaw
    ? `contract_${sanitizeFilename(sampleRaw)}.docx`
    : "";

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">4. File names</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label>Column used to name each contract</Label>
          <Select value={nameColumn} onValueChange={onChange}>
            <SelectTrigger>
              <SelectValue placeholder="Pick a column" />
            </SelectTrigger>
            <SelectContent>
              {sheet.headers.map((h) => (
                <SelectItem key={h} value={h}>
                  {h}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {nameColumn && sampleFile && (
          <div className="rounded-lg border bg-muted/30 p-4 space-y-1">
            <div className="text-xs text-muted-foreground">
              Example (row {sampleRowIdx + 2})
            </div>
            <div className="flex items-center gap-2">
              <FileText className="size-4 text-primary" />
              <code className="text-sm font-mono">{sampleFile}</code>
            </div>
          </div>
        )}
        {nameColumn && !sampleFile && (
          <div className="rounded-lg border border-amber-500/30 bg-amber-500/5 p-4 text-sm text-amber-700 dark:text-amber-400">
            No row has a value in column "{nameColumn}". Pick a different column.
          </div>
        )}
      </CardContent>
    </Card>
  );
}

/* ============================== STEP 5 ============================== */

function StepGenerate({
  template,
  sheet,
  csvFilename,
  mapping,
  sources,
  constants,
  nameColumn,
  canGenerate,
  onDone,
}: {
  template: TemplateRow;
  sheet: ParsedSheet;
  csvFilename: string;
  mapping: Record<string, string>;
  sources: Record<string, "column" | "fixed">;
  constants: Record<string, string>;
  nameColumn: string;
  canGenerate: boolean;
  onDone: () => void;
}) {
  const previewRef = useRef<HTMLDivElement>(null);
  const cancelRef = useRef(false);
  const [busy, setBusy] = useState(false);
  const [progress, setProgress] = useState<{ done: number; total: number } | null>(
    null,
  );
  const [templateBuffer, setTemplateBuffer] = useState<ArrayBuffer | null>(null);
  const [previewBlob, setPreviewBlob] = useState<Blob | null>(null);
  const [result, setResult] = useState<{
    total: number;
    success: number;
    errors: Array<{ row: number; reason: string }>;
    warnings: Array<{
      row: number;
      missingFields: string[];
      missingName: { column: string; fallbackFile: string } | null;
    }>;
    cancelled: boolean;
  } | null>(null);

  // Pick the first row where every variable resolves to a non-empty value
  // (fixed values count too). Fall back to row 0 if no row is fully complete.
  const previewRowIdx = useMemo<number>(() => {
    const idx = sheet.rows.findIndex((row) =>
      template.variables.every((v) => {
        const src = sources[v.name] ?? "column";
        const raw =
          src === "fixed"
            ? constants[v.name] ?? ""
            : mapping[v.name]
              ? row[mapping[v.name]] ?? ""
              : "";
        return raw.trim() !== "";
      }),
    );
    return idx >= 0 ? idx : 0;
  }, [sheet, template, mapping, sources, constants]);

  // Build data for the chosen preview row
  const firstRowData = useMemo<Record<string, string>>(() => {
    const row = sheet.rows[previewRowIdx] ?? {};
    const out: Record<string, string> = {};
    for (const v of template.variables) {
      const src = sources[v.name] ?? "column";
      const raw =
        src === "fixed"
          ? constants[v.name] ?? ""
          : (mapping[v.name] ? row[mapping[v.name]] ?? "" : "");
      out[v.name] = formatValue(raw, v.type);
    }
    return out;
  }, [sheet, template, mapping, sources, constants, previewRowIdx]);

  // Download template once
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const { data, error } = await supabase.storage
          .from("templates")
          .download(template.storage_path);
        if (error) throw error;
        const buf = await data.arrayBuffer();
        if (!cancelled) setTemplateBuffer(buf);
      } catch (err) {
        if (!cancelled) {
          const msg =
            err instanceof Error ? err.message : "Could not download the template";
          toast.error(msg);
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [template.storage_path]);

  // Build preview blob whenever data or template buffer changes
  useEffect(() => {
    if (!templateBuffer || !canGenerate || result) return;
    let cancelled = false;
    (async () => {
      try {
        const bytes = await renderDocx(templateBuffer, firstRowData);
        if (cancelled) return;
        const blob = new Blob([bytes as BlobPart], {
          type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        });
        setPreviewBlob(blob);
      } catch (err) {
        console.error(err);
        if (!cancelled) toast.error("Could not render the preview");
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [templateBuffer, firstRowData, canGenerate, result]);

  // Render preview into the DOM
  useEffect(() => {
    if (!previewBlob || !previewRef.current || result) return;
    let cancelled = false;
    const target = previewRef.current;
    (async () => {
      try {
        const { renderAsync } = await import("docx-preview");
        if (cancelled) return;
        target.innerHTML = "";
        await renderAsync(previewBlob, target, undefined, {
          inWrapper: true,
          breakPages: true,
          experimental: true,
          ignoreWidth: false,
          ignoreHeight: false,
        });
      } catch (err) {
        console.error("docx-preview failed:", err);
        if (!cancelled) {
          target.innerHTML =
            '<div style="padding:24px;color:#b45309;font-size:13px">Could not render the visual preview of the document. The values above show what will be inserted in each variable.</div>';
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [previewBlob, result]);


  async function handleGenerate() {
    if (!templateBuffer || !canGenerate) return;
    cancelRef.current = false;
    setBusy(true);
    setProgress({ done: 0, total: sheet.rows.length });

    const errors: Array<{ row: number; reason: string }> = [];
    const warnings: Array<{
      row: number;
      missingFields: string[];
      missingName: { column: string; fallbackFile: string } | null;
    }> = [];
    let successCount = 0;
    let cancelled = false;

    try {
      const [{ default: JSZip }, { saveAs }] = await Promise.all([
        import("jszip"),
        import("file-saver"),
      ]);
      const zip = new JSZip();
      const used = new Map<string, number>();

      for (let i = 0; i < sheet.rows.length; i++) {
        if (cancelRef.current) {
          cancelled = true;
          break;
        }
        const row = sheet.rows[i];
        const rowNumber = i + 2; // header is row 1, first data row = 2

        // Empty values are allowed — they render as blank — but we collect a
        // warning so the user knows which contracts came out incomplete.
        const missing: string[] = [];
        const data: Record<string, string> = {};
        for (const v of template.variables) {
          const src = sources[v.name] ?? "column";
          const raw =
            src === "fixed"
              ? (constants[v.name] ?? "").trim()
              : (mapping[v.name] ? (row[mapping[v.name]] ?? "").trim() : "");
          if (!raw) missing.push(v.label);
          data[v.name] = formatValue(raw, v.type);
        }

        // Filename: if the name column is empty/null, fall back to the row
        // number so the contract is still generated (with a generic name).
        let nameRaw = (row[nameColumn] ?? "").trim();
        let usedFallbackName = false;
        if (!nameRaw) {
          nameRaw = `row_${rowNumber}`;
          usedFallbackName = true;
        }

        try {
          const base = `contract_${sanitizeFilename(nameRaw)}`;
          const count = used.get(base) ?? 0;
          used.set(base, count + 1);
          const name = count === 0 ? `${base}.docx` : `${base}_${count + 1}.docx`;
          const bytes = await renderDocx(templateBuffer, data);
          zip.file(name, bytes);
          successCount++;

          const hasMissing = missing.length > 0 || usedFallbackName;
          if (hasMissing) {
            warnings.push({
              row: rowNumber,
              missingFields: missing,
              missingName: usedFallbackName
                ? { column: nameColumn, fallbackFile: name }
                : null,
            });
          }
        } catch (err) {
          errors.push({
            row: rowNumber,
            reason: err instanceof Error ? err.message : "Render error",
          });
        }

        setProgress({ done: i + 1, total: sheet.rows.length });
        // Yield so the UI can repaint (and a cancel click can register).
        if (i % 5 === 0) await new Promise((r) => setTimeout(r, 0));
      }

      if (successCount > 0) {
        const blob = await zip.generateAsync({ type: "blob" });
        const zipName = `${sanitizeFilename(template.name)}_${successCount}_contracts.zip`;
        saveAs(blob, zipName);
      }

      const status = cancelled
        ? "cancelled"
        : errors.length === 0
          ? "completed"
          : "completed_with_errors";

      // Save job metadata (best-effort). Errors and warnings are stored
      // together with a severity tag for a future history view.
      try {
        const { error: insertError } = await supabase.from("jobs").insert({
          template_id: template.id,
          csv_filename: csvFilename,
          column_mapping: mapping,
          filename_variable: nameColumn,
          total_rows: sheet.rows.length,
          success_count: successCount,
          error_count: errors.length,
          error_details: [
            ...errors.map((e) => ({ ...e, severity: "error" })),
            ...warnings.map((w) => ({ ...w, severity: "warning" })),
          ],
          status,
        });
        if (insertError) console.error("Error saving job:", insertError);
      } catch (err) {
        console.error("Error saving job:", err);
      }

      setResult({
        total: sheet.rows.length,
        success: successCount,
        errors,
        warnings,
        cancelled,
      });

      if (cancelled) {
        toast.warning(
          `Cancelled — ${successCount} contract${successCount === 1 ? "" : "s"} generated so far`,
        );
      } else if (errors.length === 0 && warnings.length === 0) {
        toast.success(`${successCount} contracts generated`);
      } else if (errors.length === 0) {
        toast.warning(
          `${successCount} generated, ${warnings.length} with warnings`,
        );
      } else if (successCount > 0) {
        toast.warning(`${successCount} generated, ${errors.length} failed`);
      } else {
        toast.error("No contracts could be generated");
      }
    } catch (err) {
      console.error(err);
      const msg = err instanceof Error ? err.message : "Error generating the ZIP";
      toast.error(msg);
    } finally {
      setBusy(false);
    }
  }

  // === Summary view ===
  if (result) {
    const hasErrors = result.errors.length > 0;
    const hasWarnings = result.warnings.length > 0;
    const clean = !hasErrors && !hasWarnings && !result.cancelled;

    const title = result.cancelled
      ? "Generation cancelled"
      : hasErrors
        ? "Generation finished with errors"
        : hasWarnings
          ? "Generation finished with warnings"
          : "Generation completed";

    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            {clean ? (
              <CheckCircle2 className="size-5 text-primary" />
            ) : (
              <AlertCircle className="size-5 text-amber-600" />
            )}
            <span>{title}</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <SummaryStat label="Total rows" value={result.total} />
            <SummaryStat
              label="Generated"
              value={result.success}
              tone="success"
            />
            <SummaryStat
              label="Warnings"
              value={result.warnings.length}
              tone={hasWarnings ? "warning" : undefined}
            />
            <SummaryStat
              label="Failed"
              value={result.errors.length}
              tone={hasErrors ? "error" : undefined}
            />
          </div>

          {result.cancelled && (
            <div className="rounded-lg border border-amber-500/30 bg-amber-500/5 px-4 py-3 text-sm text-amber-700 dark:text-amber-400">
              You cancelled the generation. The ZIP contains the{" "}
              {result.success} contract{result.success === 1 ? "" : "s"} created
              before stopping.
            </div>
          )}

          {hasErrors && (
            <IssueList
              title="Rows that failed (not in the ZIP)"
              items={result.errors}
              tone="error"
            />
          )}

          {hasWarnings && (
            <WarningList items={result.warnings} />
          )}

          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" onClick={onDone}>
              New generation
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  // === Preview + generate view ===
  const pct = progress
    ? Math.round((progress.done / Math.max(progress.total, 1)) * 100)
    : 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base flex items-center justify-between">
          <span>5. Preview and generation</span>
          <Badge variant="secondary" className="font-normal">
            {sheet.rows.length} contracts
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-xs text-muted-foreground">
          Preview of the contract with data from row {previewRowIdx + 2} (first row with all variables filled).
        </div>

        {/* Values table — shows exactly what each {{variable}} will receive */}
        <div className="rounded-lg border">
          <div className="px-3 py-2 text-xs font-medium bg-muted/40 border-b">
            Values for row {previewRowIdx + 2}
          </div>
          <div className="divide-y">
            {template.variables.map((v) => {
              const src = sources[v.name] ?? "column";
              const value = firstRowData[v.name] ?? "";
              const empty = value.trim() === "";
              return (
                <div
                  key={v.name}
                  className="grid grid-cols-12 gap-2 px-3 py-2 text-sm items-center"
                >
                  <div className="col-span-4 flex items-center gap-2 min-w-0">
                    <code className="text-xs font-mono bg-muted px-1.5 py-0.5 rounded truncate">
                      {`{{${v.name}}}`}
                    </code>
                  </div>
                  <div className="col-span-3 text-xs text-muted-foreground truncate">
                    {src === "fixed"
                      ? "Fixed value"
                      : mapping[v.name]
                        ? `Column: ${mapping[v.name]}`
                        : "— not mapped —"}
                  </div>
                  <div
                    className={cn(
                      "col-span-5 text-sm truncate",
                      empty
                        ? "italic text-amber-600 dark:text-amber-400"
                        : "font-medium",
                    )}
                  >
                    {empty ? "(empty — will render as blank)" : value}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="rounded-lg border bg-white text-black max-h-[60vh] overflow-auto p-4">
          {!templateBuffer ? (
            <div className="flex items-center gap-2 py-12 justify-center text-sm text-muted-foreground">
              <Loader2 className="size-4 animate-spin" />
              Loading template…
            </div>
          ) : (
            <div ref={previewRef} />
          )}
        </div>

        {busy && progress && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">
                Generating contracts…
              </span>
              <span className="font-medium">
                {progress.done} / {progress.total}
              </span>
            </div>
            <Progress value={pct} />
          </div>
        )}

        <div className="flex items-center justify-end gap-3 pt-2">
          {busy && (
            <Button
              variant="outline"
              size="lg"
              onClick={() => {
                cancelRef.current = true;
              }}
            >
              Cancel
            </Button>
          )}
          <Button
            onClick={handleGenerate}
            disabled={!canGenerate || !templateBuffer || busy}
            size="lg"
          >
            {busy ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <Download className="size-4" />
            )}
            Generate contracts
            <Wand2 className="size-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function SummaryStat({
  label,
  value,
  tone,
}: {
  label: string;
  value: number;
  tone?: "success" | "warning" | "error";
}) {
  return (
    <div
      className={cn(
        "rounded-lg border p-4 text-center",
        tone === "success" && "border-primary/30 bg-primary/5",
        tone === "warning" && "border-amber-500/30 bg-amber-500/5",
        tone === "error" && "border-destructive/30 bg-destructive/5",
      )}
    >
      <div className="text-2xl font-semibold tabular-nums">{value}</div>
      <div className="text-xs text-muted-foreground mt-1">{label}</div>
    </div>
  );
}

function IssueList({
  title,
  items,
  tone,
}: {
  title: string;
  items: Array<{ row: number; reason: string }>;
  tone: "warning" | "error";
}) {
  return (
    <div className="rounded-lg border bg-muted/30">
      <div className="px-4 py-2.5 border-b text-sm font-medium">{title}</div>
      <div className="max-h-64 overflow-auto divide-y">
        {items.map((e, i) => (
          <div key={i} className="px-4 py-2.5 text-sm flex items-start gap-3">
            <Badge
              variant="outline"
              className={cn(
                "font-mono shrink-0",
                tone === "error"
                  ? "border-destructive/40 text-destructive"
                  : "border-amber-500/40 text-amber-700 dark:text-amber-400",
              )}
            >
              Row {e.row}
            </Badge>
            <span className="text-muted-foreground">{e.reason}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function WarningList({
  items,
}: {
  items: Array<{
    row: number;
    missingFields: string[];
    missingName: { column: string; fallbackFile: string } | null;
  }>;
}) {
  return (
    <div className="rounded-lg border border-amber-500/30 bg-amber-500/5">
      <div className="px-4 py-3 border-b border-amber-500/20">
        <div className="text-sm font-medium text-amber-900 dark:text-amber-200">
          Contracts that need your attention
        </div>
        <div className="text-xs text-amber-800/80 dark:text-amber-300/80 mt-0.5">
          These contracts were created and are inside the ZIP, but some fields
          were left blank in your spreadsheet. Review them before sending.
        </div>
      </div>
      <div className="max-h-72 overflow-auto divide-y divide-amber-500/15">
        {items.map((w, i) => (
          <div key={i} className="px-4 py-3 text-sm space-y-2">
            <div className="flex items-center gap-2">
              <Badge
                variant="outline"
                className="shrink-0 border-amber-500/40 text-amber-700 dark:text-amber-300 bg-amber-500/10"
              >
                Row {w.row}
              </Badge>
              {w.missingName && (
                <span className="text-xs text-muted-foreground">
                  Saved as{" "}
                  <code className="font-mono text-foreground bg-muted px-1.5 py-0.5 rounded">
                    {w.missingName.fallbackFile}
                  </code>
                </span>
              )}
            </div>
            {w.missingFields.length > 0 && (
              <div className="text-sm text-foreground/80">
                Empty fields:{" "}
                <span className="inline-flex flex-wrap gap-1 align-middle">
                  {w.missingFields.map((f) => (
                    <Badge
                      key={f}
                      variant="secondary"
                      className="font-normal"
                    >
                      {f}
                    </Badge>
                  ))}
                </span>
              </div>
            )}
            {w.missingName && (
              <div className="text-sm text-foreground/80">
                The column{" "}
                <code className="font-mono text-foreground bg-muted px-1.5 py-0.5 rounded">
                  {w.missingName.column}
                </code>{" "}
                used to name the file was empty, so we used a generic name.
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}


