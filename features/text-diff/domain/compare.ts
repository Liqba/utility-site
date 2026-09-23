import { diffLines } from "diff";

export type DiffRow = {
  kind: "added" | "removed" | "context";
  oldLine: number | null;
  newLine: number | null;
  text: string;
};

export type DiffResult = {
  rows: DiffRow[];
  added: number;
  removed: number;
  identical: boolean;
};

function splitLines(value: string): string[] {
  if (!value) return [];
  const lines = value.split("\n");
  if (value.endsWith("\n")) lines.pop();
  return lines;
}

export function compareTexts(original: string, changed: string, ignoreWhitespace: boolean): DiffResult {
  const before = original.replace(/\r\n?/g, "\n");
  const after = changed.replace(/\r\n?/g, "\n");
  const rows: DiffRow[] = [];
  let oldLine = 0;
  let newLine = 0;
  let added = 0;
  let removed = 0;

  for (const part of diffLines(before, after, { ignoreWhitespace, ignoreNewlineAtEof: true })) {
    const kind = part.added ? "added" : part.removed ? "removed" : "context";
    for (const text of splitLines(part.value)) {
      const from = kind === "added" ? null : ++oldLine;
      const to = kind === "removed" ? null : ++newLine;
      rows.push({ kind, oldLine: from, newLine: to, text });
      if (kind === "added") added++;
      if (kind === "removed") removed++;
    }
  }

  return { rows, added, removed, identical: added === 0 && removed === 0 };
}
