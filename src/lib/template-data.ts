// Browser-only utilities for the bulk generation wizard.
import Papa from "papaparse";
import * as XLSX from "xlsx";
import type { VariableType } from "@/lib/docx-parser";

export type ParsedSheet = {
  headers: string[];
  rows: Array<Record<string, string>>;
};

export async function parseCSV(file: File): Promise<ParsedSheet> {
  const text = await file.text();
  const result = Papa.parse<Record<string, string>>(text, {
    header: true,
    skipEmptyLines: true,
    transformHeader: (h) => h.trim(),
  });
  if (result.errors.length > 0 && result.data.length === 0) {
    throw new Error(result.errors[0]?.message ?? "Could not read the CSV");
  }
  const headers = result.meta.fields?.map((f) => f.trim()) ?? [];
  const rows = result.data
    .filter((r) => Object.values(r).some((v) => String(v ?? "").trim() !== ""))
    .map((r) => {
      const norm: Record<string, string> = {};
      for (const h of headers) norm[h] = String(r[h] ?? "").trim();
      return norm;
    });
  return { headers, rows };
}

export async function parseXLSX(file: File): Promise<ParsedSheet> {
  const buf = await file.arrayBuffer();
  const wb = XLSX.read(buf, { type: "array", cellDates: false });
  const sheetName = wb.SheetNames[0];
  if (!sheetName) throw new Error("The Excel file has no sheets");
  const sheet = wb.Sheets[sheetName];
  const raw = XLSX.utils.sheet_to_json<Record<string, unknown>>(sheet, {
    header: 1,
    raw: true,
    defval: "",
  }) as unknown as Array<Array<unknown>>;
  if (raw.length === 0) return { headers: [], rows: [] };
  const headers = (raw[0] ?? []).map((h) => String(h ?? "").trim()).filter(Boolean);
  const rows: Array<Record<string, string>> = [];
  for (let i = 1; i < raw.length; i++) {
    const row = raw[i];
    if (!row || row.every((v) => String(v ?? "").trim() === "")) continue;
    const obj: Record<string, string> = {};
    headers.forEach((h, idx) => {
      obj[h] = stringifyCell(row[idx]);
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
  if (type === "fecha") return formatDate(value);
  if (type === "moneda") return formatCurrency(value);
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
  });
  doc.render(data);
  return doc.getZip().generate({ type: "uint8array" });
}
