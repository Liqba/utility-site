export type JsonResult = { ok: true; value: string; data: unknown } | { ok: false; error: string };

function describeError(error: unknown) {
  if (!(error instanceof SyntaxError)) return "Unable to parse this JSON.";
  return error.message.replace(/^JSON\.parse:\s*/i, "");
}

export function parseJson(source: string): JsonResult {
  if (!source.trim()) return { ok: false, error: "Paste or type JSON to begin." };
  try {
    const data = JSON.parse(source) as unknown;
    return { ok: true, value: JSON.stringify(data, null, 2), data };
  } catch (error) {
    return { ok: false, error: describeError(error) };
  }
}

export function minifyJson(source: string): JsonResult {
  const parsed = parseJson(source);
  return parsed.ok ? { ...parsed, value: JSON.stringify(parsed.data) } : parsed;
}

function sortRecursively(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(sortRecursively);
  if (value && typeof value === "object") {
    return Object.keys(value as Record<string, unknown>)
      .sort((a, b) => a.localeCompare(b))
      .reduce<Record<string, unknown>>((result, key) => {
        result[key] = sortRecursively((value as Record<string, unknown>)[key]);
        return result;
      }, {});
  }
  return value;
}

export function sortJson(source: string): JsonResult {
  const parsed = parseJson(source);
  return parsed.ok ? { ...parsed, value: JSON.stringify(sortRecursively(parsed.data), null, 2) } : parsed;
}

export function jsonStats(source: string) {
  const lines = source ? source.split("\n").length : 0;
  const bytes = new TextEncoder().encode(source).length;
  return { lines, bytes };
}
