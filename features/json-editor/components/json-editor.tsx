"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Check, Clipboard, Download, Eraser, FileJson2, ListTree, Minimize2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SiteHeader } from "@/components/site-header";
import { jsonStats, minifyJson, parseJson, sortJson, type JsonResult } from "../domain/json";

const sample = `{
  "project": "Utility Dock",
  "private": true,
  "features": ["format", "validate", "minify"],
  "meta": {
    "version": 1,
    "ready": true
  }
}`;

type Notice = { kind: "success" | "error" | "neutral"; message: string };

declare global {
  interface Document {
    modelContext?: {
      registerTool: (tool: {
        name: string;
        title?: string;
        description: string;
        inputSchema: object;
        annotations?: { readOnlyHint?: boolean; untrustedContentHint?: boolean };
        execute: (input: unknown) => unknown | Promise<unknown>;
      }, options?: { signal?: AbortSignal }) => void | Promise<void>;
    };
  }
}

export function JsonEditor() {
  const initial = parseJson(sample);
  const [input, setInput] = useState(sample);
  const [output, setOutput] = useState(initial.ok ? initial.value : "");
  const [notice, setNotice] = useState<Notice>({ kind: "success", message: "Valid JSON" });
  const [copied, setCopied] = useState(false);
  const stats = useMemo(() => jsonStats(input), [input]);

  const applyResult = useCallback((result: JsonResult, successMessage: string) => {
    if (result.ok) {
      setOutput(result.value);
      setNotice({ kind: "success", message: successMessage });
      return true;
    }
    setNotice({ kind: "error", message: result.error });
    return false;
  }, []);

  const format = useCallback(() => applyResult(parseJson(input), "Formatted · Valid JSON"), [applyResult, input]);
  const minify = useCallback(() => applyResult(minifyJson(input), "Minified · Valid JSON"), [applyResult, input]);
  const sort = useCallback(() => applyResult(sortJson(input), "Sorted · Valid JSON"), [applyResult, input]);

  useEffect(() => {
    const context = document.modelContext;
    if (!context?.registerTool) return;
    const lifecycle = new AbortController();
    const register = (name: string, title: string, transform: (value: string) => JsonResult) => {
      void Promise.resolve(context.registerTool({
        name,
        title,
        description: `${title} and display the result in the JSON editor.`,
        inputSchema: {
          type: "object",
          properties: { json: { type: "string", description: "JSON text to process" } },
          required: ["json"],
          additionalProperties: false,
        },
        annotations: { readOnlyHint: false, untrustedContentHint: true },
        execute(raw) {
          const value = (raw as { json?: unknown })?.json;
          if (typeof value !== "string") throw new Error("json must be a string");
          const result = transform(value);
          if (!result.ok) throw new Error(result.error);
          setInput(value);
          setOutput(result.value);
          setNotice({ kind: "success", message: `${title} · Valid JSON` });
          return { ok: true, result: result.value };
        },
      }, { signal: lifecycle.signal })).catch(() => undefined);
    };
    register("format_json", "Format JSON", parseJson);
    register("minify_json", "Minify JSON", minifyJson);
    return () => lifecycle.abort();
  }, []);

  async function copyOutput() {
    if (!output) return;
    await navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 1400);
  }

  function downloadOutput() {
    if (!output) return;
    const url = URL.createObjectURL(new Blob([output], { type: "application/json" }));
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "formatted.json";
    anchor.click();
    URL.revokeObjectURL(url);
  }

  function clear() {
    setInput("");
    setOutput("");
    setNotice({ kind: "neutral", message: "Ready for JSON" });
  }

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <SiteHeader compact />
      <main className="flex min-h-0 flex-1 flex-col px-3 pb-3 sm:px-5 sm:pb-5">
        <div className="mx-auto flex w-full max-w-[1600px] flex-wrap items-center justify-between gap-3 py-4">
          <div className="flex items-center gap-3">
            <span className="grid size-9 place-items-center rounded-lg border border-border bg-card text-cyan-300"><FileJson2 size={19} /></span>
            <div>
              <h1 className="font-semibold tracking-tight">JSON Editor</h1>
              <p className="text-xs text-muted-foreground">Runs locally in your browser</p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2" aria-label="Editor actions">
            <Button size="sm" onClick={format}><Sparkles />Format</Button>
            <Button size="sm" variant="outline" onClick={minify}><Minimize2 />Minify</Button>
            <Button size="sm" variant="outline" onClick={sort}><ListTree />Sort keys</Button>
            <Button size="sm" variant="ghost" onClick={clear}><Eraser />Clear</Button>
          </div>
        </div>

        <div className="editor-grid mx-auto min-h-0 w-full max-w-[1600px] flex-1">
          <section className="editor-pane" aria-labelledby="input-heading">
            <div className="pane-header">
              <div>
                <h2 id="input-heading">Input</h2>
                <span>{stats.lines} lines · {stats.bytes.toLocaleString()} bytes</span>
              </div>
              <span className={`status status-${notice.kind}`}><i />{notice.message}</span>
            </div>
            <label className="sr-only" htmlFor="json-input">JSON input</label>
            <textarea
              id="json-input"
              value={input}
              onChange={(event) => {
                setInput(event.target.value);
                setNotice({ kind: "neutral", message: "Changes not formatted" });
              }}
              spellCheck={false}
              autoCapitalize="off"
              autoCorrect="off"
              placeholder={'{\n  "paste": "json here"\n}'}
              className="code-area"
            />
          </section>

          <section className="editor-pane" aria-labelledby="output-heading">
            <div className="pane-header">
              <div>
                <h2 id="output-heading">Output</h2>
                <span>Ready to copy or download</span>
              </div>
              <div className="flex items-center gap-1">
                <Button size="icon-sm" variant="ghost" onClick={copyOutput} disabled={!output} aria-label="Copy output">
                  {copied ? <Check /> : <Clipboard />}
                </Button>
                <Button size="icon-sm" variant="ghost" onClick={downloadOutput} disabled={!output} aria-label="Download JSON">
                  <Download />
                </Button>
              </div>
            </div>
            <pre className="code-output" tabIndex={0}>{output || <span className="text-muted-foreground">Formatted JSON will appear here.</span>}</pre>
          </section>
        </div>
      </main>
    </div>
  );
}
