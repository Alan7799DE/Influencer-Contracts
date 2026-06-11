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
