// Client-only utilities to read a .docx file and extract {{variable}} placeholders.

export type VariableType = "text" | "date" | "currency";

export type DetectedVariable = {
  name: string;
  label: string;
  type: VariableType;
};

/**
 * Normalize a variable type read from the database. Older templates were
 * saved with Spanish values ("texto"/"fecha"/"moneda"); map them to the
 * current English values so legacy data keeps working.
 */
export function normalizeVariableType(value: unknown): VariableType {
  switch (value) {
    case "date":
    case "fecha":
      return "date";
    case "currency":
    case "moneda":
      return "currency";
    case "text":
    case "texto":
    default:
      return "text";
  }
}

// Allow any characters inside {{ }} except braces, so variable names can
// include spaces, numbers as first char, accents, etc. Surrounding and
// repeated internal whitespace is collapsed by `normalizeVariableName`.
const PLACEHOLDER_RE = /\{\{\s*([^{}]+?)\s*\}\}/g;

/** Collapse internal whitespace; preserve original characters otherwise. */
export function normalizeVariableName(raw: string): string {
  return raw.trim().replace(/\s+/g, " ");
}

/**
 * Extract all `{{variable_name}}` placeholders from a .docx file.
 * Concatenates all text nodes in word/document.xml first so we catch
 * placeholders that Word fragmented across multiple runs.
 */
export async function extractVariablesFromDocx(file: File): Promise<string[]> {
  const PizZipModule = await import("pizzip");
  const PizZip = PizZipModule.default;

  const arrayBuffer = await file.arrayBuffer();
  const zip = new PizZip(arrayBuffer);

  const candidateFiles = [
    "word/document.xml",
    "word/header1.xml",
    "word/header2.xml",
    "word/header3.xml",
    "word/footer1.xml",
    "word/footer2.xml",
    "word/footer3.xml",
  ];

  const found = new Set<string>();
  const ordered: string[] = [];

  for (const path of candidateFiles) {
    const entry = zip.file(path);
    if (!entry) continue;
    const xml = entry.asText();
    // Concatenate all <w:t> text nodes (handles runs Word splits)
    const textOnly = xml.replace(/<[^>]+>/g, "");
    let match: RegExpExecArray | null;
    PLACEHOLDER_RE.lastIndex = 0;
    while ((match = PLACEHOLDER_RE.exec(textOnly)) !== null) {
      const name = match[1];
      if (!found.has(name)) {
        found.add(name);
        ordered.push(name);
      }
    }
  }

  return ordered;
}

export function humanizeVariableName(name: string): string {
  const spaced = name.replace(/[_-]+/g, " ").trim();
  return spaced.charAt(0).toUpperCase() + spaced.slice(1);
}
