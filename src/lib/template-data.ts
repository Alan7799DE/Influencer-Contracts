// Browser-only utilities for the bulk generation wizard.
import * as XLSX from "xlsx";
import { normalizeVariableType, type VariableType } from "@/lib/docx-parser";

export type ParsedSheet = {
  headers: string[];
  rows: Array<Record<string, string>>;
};

export async function parseXLSXRaw(file: File): Promise<string[][]> {
  const buf = await file.arrayBuffer();
  const wb = XLSX.read(buf, { type: "array", cellDates: false });
  const sheetName = wb.SheetNames[0];
  if (!sheetName) throw new Error("The Excel file has no sheets");
  const sheet = wb.Sheets[sheetName];
  const raw = XLSX.utils.sheet_to_json<Array<unknown>>(sheet, {
    header: 1,
    raw: true,
    defval: "",
  }) as unknown as Array<Array<unknown>>;
  const maxCols = raw.reduce((m, r) => Math.max(m, r?.length ?? 0), 0);
  return raw.map((row) => {
    const out: string[] = [];
    for (let i = 0; i < maxCols; i++) out.push(stringifyCell(row?.[i]));
    return out;
  });
}

export function buildSheetFromRaw(
  raw: string[][],
  headerRowIdx: number,
): ParsedSheet {
  if (raw.length === 0 || headerRowIdx < 0 || headerRowIdx >= raw.length) {
    return { headers: [], rows: [] };
  }
  const headerRow = raw[headerRowIdx];
  const headers: string[] = [];
  const seen = new Map<string, number>();
  headerRow.forEach((h, idx) => {
    let name = String(h ?? "").trim();
    if (!name) name = `Column ${idx + 1}`;
    const n = seen.get(name) ?? 0;
    seen.set(name, n + 1);
    headers.push(n === 0 ? name : `${name} (${n + 1})`);
  });
  const rows: Array<Record<string, string>> = [];
  for (let i = headerRowIdx + 1; i < raw.length; i++) {
    const row = raw[i];
    if (!row || row.every((v) => String(v ?? "").trim() === "")) continue;
    const obj: Record<string, string> = {};
    headers.forEach((h, idx) => {
      obj[h] = String(row[idx] ?? "").trim();
    });
    rows.push(obj);
  }
  return { headers, rows };
}

function stringifyCell(v: unknown): string {
  if (v == null) return "";
  if (v instanceof Date) return v.toISOString();
  return String(v).trim();
}

function normalizeName(s: string): string {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "");
}

/** For each variable, try to pick a header whose normalized name matches. */
export function autoMapColumns(
  variableNames: string[],
  headers: string[],
): Record<string, string> {
  const normHeaders = headers.map((h) => ({ raw: h, norm: normalizeName(h) }));
  const out: Record<string, string> = {};
  for (const v of variableNames) {
    const nv = normalizeName(v);
    const exact = normHeaders.find((h) => h.norm === nv);
    if (exact) {
      out[v] = exact.raw;
      continue;
    }
    const partial = normHeaders.find(
      (h) => h.norm.includes(nv) || nv.includes(h.norm),
    );
    if (partial) out[v] = partial.raw;
  }
  return out;
}

/** Format a value according to its declared variable type. */
export function formatValue(raw: string, type: VariableType): string {
  const value = (raw ?? "").trim();
  if (!value) return "";
  // Normalize defensively in case a legacy ("texto"/"fecha"/"moneda") value
  // reaches this function from older stored templates.
  const t = normalizeVariableType(type);
  if (t === "date") return formatDate(value);
  if (t === "currency") return formatCurrency(value);
  return value;
}

function pad2(n: number): string {
  return n < 10 ? `0${n}` : String(n);
}

function formatDate(input: string): string {
  // Try ISO first (YYYY-MM-DD or full ISO)
  const iso = /^(\d{4})-(\d{2})-(\d{2})(T.*)?$/.exec(input);
  if (iso) return `${iso[3]}/${iso[2]}/${iso[1]}`;

  // DD/MM/YYYY or DD-MM-YYYY (already in target shape, normalize separators)
  const dmy = /^(\d{1,2})[/\-.](\d{1,2})[/\-.](\d{2,4})$/.exec(input);
  if (dmy) {
    const d = pad2(parseInt(dmy[1], 10));
    const m = pad2(parseInt(dmy[2], 10));
    let y = parseInt(dmy[3], 10);
    if (y < 100) y += 2000;
    return `${d}/${m}/${y}`;
  }

  // Excel serial number (days since 1899-12-30)
  const num = Number(input);
  if (Number.isFinite(num) && num > 59 && num < 60000) {
    const epoch = new Date(Date.UTC(1899, 11, 30));
    const date = new Date(epoch.getTime() + num * 86400000);
    return `${pad2(date.getUTCDate())}/${pad2(date.getUTCMonth() + 1)}/${date.getUTCFullYear()}`;
  }

  // Fallback to Date parser
  const parsed = new Date(input);
  if (!Number.isNaN(parsed.getTime())) {
    return `${pad2(parsed.getDate())}/${pad2(parsed.getMonth() + 1)}/${parsed.getFullYear()}`;
  }
  return input;
}

function formatCurrency(input: string): string {
  // Strip currency symbols and whitespace, keep digits, comma, dot, minus.
  const cleaned = input.replace(/[^\d,.\-]/g, "");
  if (!cleaned) return input;

  // Decide decimal separator: assume comma is decimal if both present and comma is last
  let normalized = cleaned;
  const lastComma = cleaned.lastIndexOf(",");
  const lastDot = cleaned.lastIndexOf(".");
  if (lastComma > lastDot) {
    normalized = cleaned.replace(/\./g, "").replace(",", ".");
  } else {
    normalized = cleaned.replace(/,/g, "");
  }
  const n = Number(normalized);
  if (!Number.isFinite(n)) return input;

  const hasDecimals = Math.abs(n % 1) > 0.0001;
  const fmt = new Intl.NumberFormat("es-AR", {
    minimumFractionDigits: hasDecimals ? 2 : 0,
    maximumFractionDigits: hasDecimals ? 2 : 0,
  });
  return `$${fmt.format(n)}`;
}

export function sanitizeFilename(raw: string): string {
  const base = (raw ?? "").toString().trim();
  if (!base) return "contract";
  const cleaned = base
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9-_ ]+/g, "")
    .trim()
    .replace(/\s+/g, "_")
    .toLowerCase();
  return cleaned || "contract";
}

/** Render a single .docx using docxtemplater with {{var}} delimiters. */
export async function renderDocx(
  templateBuffer: ArrayBuffer,
  data: Record<string, string>,
): Promise<Uint8Array> {
  const [{ default: PizZip }, { default: Docxtemplater }] = await Promise.all([
    import("pizzip"),
    import("docxtemplater"),
  ]);
  const zip = new PizZip(templateBuffer);
  const doc = new Docxtemplater(zip, {
    delimiters: { start: "{{", end: "}}" },
    paragraphLoop: true,
    linebreaks: true,
    nullGetter: () => "",
    // Custom parser: trim + collapse internal whitespace on the tag name so
    // placeholders like `{{ nombre influencer }}` resolve to the data key
    // `nombre influencer`. Also supports names starting with a number.
    parser: (tag: string) => ({
      get: (scope: Record<string, unknown>) => {
        const key = tag.trim().replace(/\s+/g, " ");
        return scope?.[key] ?? "";
      },
    }),
  });
  try {
    doc.render(data);
  } catch (err) {
    throw new Error(formatDocxtemplaterError(err));
  }
  return doc.getZip().generate({ type: "uint8array" });
}

/**
 * docxtemplater aggregates template problems (unclosed tags, etc.) into
 * `error.properties.errors`. The top-level `.message` is just "Multi error",
 * so dig out the per-tag explanations to show something actionable.
 */
export function formatDocxtemplaterError(err: unknown): string {
  if (err && typeof err === "object" && "properties" in err) {
    const props = (err as { properties?: { errors?: unknown[] } }).properties;
    const inner = props?.errors;
    if (Array.isArray(inner) && inner.length > 0) {
      const messages = inner
        .map((e) => {
          if (e && typeof e === "object") {
            const ep = (e as { properties?: { explanation?: string } }).properties;
            if (ep?.explanation) return ep.explanation;
            const m = (e as { message?: string }).message;
            if (m) return m;
          }
          return String(e);
        })
        .filter(Boolean);
      if (messages.length > 0) {
        return `Template problem: ${[...new Set(messages)].join("; ")}`;
      }
    }
  }
  if (err instanceof Error) return err.message;
  return "Render error";
}

export type TemplateIssueKind =
  | "missing-close"
  | "missing-open"
  | "duplicate-open"
  | "duplicate-close"
  | "other";

export type TemplateIssue = {
  kind: TemplateIssueKind;
  /** Friendly description of what is likely wrong. */
  message: string;
  /** Snippet of the document text where the problem was detected. */
  near: string;
};

/**
 * Validate a template by attempting a dry-run compile/render with empty data.
 * docxtemplater catches malformed placeholders (a forgotten `{` or `}`) at
 * compile time and reports the offending text + a classification, so we can
 * tell the user whether an opening or closing brace is missing and where.
 *
 * Returns an empty array when the template is fine.
 */
export async function findTemplateIssues(
  templateBuffer: ArrayBuffer,
): Promise<TemplateIssue[]> {
  const [{ default: PizZip }, { default: Docxtemplater }] = await Promise.all([
    import("pizzip"),
    import("docxtemplater"),
  ]);
  try {
    const doc = new Docxtemplater(new PizZip(templateBuffer), {
      delimiters: { start: "{{", end: "}}" },
      paragraphLoop: true,
      linebreaks: true,
      nullGetter: () => "",
      parser: (tag: string) => ({
        get: (scope: Record<string, unknown>) => {
          const key = tag.trim().replace(/\s+/g, " ");
          return scope?.[key] ?? "";
        },
      }),
    });
    // Force a render so any tag problem surfaces even if compile is lazy.
    doc.render({});
  } catch (err) {
    // docxtemplater failed to compile — this is the authoritative diagnosis.
    return parseTemplateIssues(err);
  }
  // It compiled, but a malformed tag (e.g. `{{fee}`) can be silently absorbed
  // when it pairs with a stray `}}` elsewhere, producing a wrong tag instead
  // of an error. Scan the raw text for loose/odd braces to catch that case.
  return scanLooseBraces(new PizZip(templateBuffer));
}

function parseTemplateIssues(err: unknown): TemplateIssue[] {
  const inner =
    err && typeof err === "object" && "properties" in err
      ? (err as { properties?: { errors?: unknown[] } }).properties?.errors
      : undefined;

  if (!Array.isArray(inner) || inner.length === 0) {
    return [
      {
        kind: "other",
        message:
          "The variables in this document seem malformed. Make sure each one uses {{ and }}.",
        near: "",
      },
    ];
  }

  const seen = new Set<string>();
  const issues: TemplateIssue[] = [];
  for (const e of inner) {
    const p =
      e && typeof e === "object"
        ? (e as {
            properties?: { id?: string; context?: string; xtag?: string; explanation?: string };
          }).properties ?? {}
        : {};
    const id = p.id ?? "";
    const near = String(p.context ?? p.xtag ?? "").trim();

    let kind: TemplateIssueKind = "other";
    let message = "";
    switch (id) {
      case "unclosed_tag":
        kind = "missing-close";
        message =
          "A closing brace is missing. A variable opens with “{{” but is never closed with “}}”.";
        break;
      case "unopened_tag":
        kind = "missing-open";
        message =
          "An opening brace is missing. There is a “}}” without its matching “{{”.";
        break;
      case "duplicate_open_tag":
        kind = "duplicate-open";
        message = "There is an extra opening brace “{”.";
        break;
      case "duplicate_close_tag":
        kind = "duplicate-close";
        message = "There is an extra closing brace “}”.";
        break;
      default:
        message =
          p.explanation ?? "A variable in this document is malformed.";
    }

    const key = `${id}|${near}`;
    if (seen.has(key)) continue;
    seen.add(key);
    issues.push({ kind, message, near });
  }
  return issues;
}

type ZipLike = {
  file(pattern: RegExp): Array<{ asText(): string }>;
};

/**
 * Fallback check for templates that compile fine but still contain a stray
 * brace. Concatenates the document text and flags any run of braces that
 * isn't a clean `{{` or `}}` (i.e. a lone `{`/`}` or three-plus in a row).
 */
function scanLooseBraces(zip: ZipLike): TemplateIssue[] {
  const parts = zip.file(/word\/(document|header\d+|footer\d+)\.xml/) ?? [];
  let text = "";
  for (const f of parts) text += " " + f.asText().replace(/<[^>]+>/g, "");

  const issues: TemplateIssue[] = [];
  const seen = new Set<string>();
  const runRe = /\{+|\}+/g;
  let m: RegExpExecArray | null;
  while ((m = runRe.exec(text)) !== null) {
    const run = m[0];
    if (run.length === 2) continue; // a well-formed "{{" or "}}"
    const isOpen = run[0] === "{";

    let kind: TemplateIssueKind;
    let message: string;
    if (run.length === 1) {
      kind = isOpen ? "missing-open" : "missing-close";
      message = isOpen
        ? "A lone “{” was found. An opening brace looks incomplete — variables must open with “{{”."
        : "A lone “}” was found. A closing brace looks incomplete — variables must close with “}}”.";
    } else {
      kind = isOpen ? "duplicate-open" : "duplicate-close";
      message = isOpen
        ? "Too many opening braces in a row. A variable should open with exactly “{{”."
        : "Too many closing braces in a row. A variable should close with exactly “}}”.";
    }

    const start = Math.max(0, m.index - 18);
    const end = Math.min(text.length, m.index + run.length + 18);
    const near = text.slice(start, end).replace(/\s+/g, " ").trim();

    const key = `${kind}|${near}`;
    if (seen.has(key)) continue;
    seen.add(key);
    issues.push({ kind, message, near });
  }
  return issues;
}
