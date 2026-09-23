"use client";

import { useMemo, useState } from "react";
import { ArrowLeftRight, Eraser, GitCompareArrows } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SiteHeader } from "@/components/site-header";
import { compareTexts } from "../domain/compare";

export function TextDiff() {
  const [original, setOriginal] = useState("");
  const [changed, setChanged] = useState("");
  const [ignoreWhitespace, setIgnoreWhitespace] = useState(false);
  const result = useMemo(() => compareTexts(original, changed, ignoreWhitespace), [original, changed, ignoreWhitespace]);
  const hasText = original.length > 0 || changed.length > 0;

  function swap() {
    setOriginal(changed);
    setChanged(original);
  }

  function clear() {
    setOriginal("");
    setChanged("");
  }

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <SiteHeader compact />
      <main className="mx-auto flex w-full max-w-[1500px] flex-1 flex-col px-3 pb-6 sm:px-5">
        <div className="flex flex-wrap items-center justify-between gap-3 py-4">
          <div className="flex items-center gap-3">
            <span className="grid size-9 place-items-center rounded-lg border border-border bg-card text-cyan-300"><GitCompareArrows size={19} /></span>
            <div>
              <h1 className="font-semibold tracking-tight">Text Diff</h1>
              <p className="text-xs text-muted-foreground">Changes update as you type · stays in your browser</p>
            </div>
          </div>
          <div className="flex items-center gap-2" aria-label="Text actions">
            <Button size="sm" variant="outline" onClick={swap} disabled={!hasText}><ArrowLeftRight />Swap</Button>
            <Button size="sm" variant="ghost" onClick={clear} disabled={!hasText}><Eraser />Clear</Button>
          </div>
        </div>

        <div className="diff-input-grid">
          <section className="editor-pane" aria-labelledby="original-heading">
            <div className="pane-header"><h2 id="original-heading">Original text</h2><span>{original.length.toLocaleString()} characters</span></div>
            <textarea className="diff-textarea" aria-label="Original text" placeholder="Paste or type the original text here" spellCheck={false} value={original} onChange={(event) => setOriginal(event.target.value)} />
          </section>
          <section className="editor-pane" aria-labelledby="changed-heading">
            <div className="pane-header"><h2 id="changed-heading">Changed text</h2><span>{changed.length.toLocaleString()} characters</span></div>
            <textarea className="diff-textarea" aria-label="Changed text" placeholder="Paste or type the changed text here" spellCheck={false} value={changed} onChange={(event) => setChanged(event.target.value)} />
          </section>
        </div>

        <section className="diff-result editor-pane mt-3" aria-labelledby="diff-heading">
          <div className="pane-header flex-wrap">
            <div>
              <h2 id="diff-heading">Differences</h2>
              <span aria-live="polite">{!hasText ? "Ready to compare" : result.identical ? "No differences" : `${result.added} added · ${result.removed} removed`}</span>
            </div>
            <label className="inline-flex cursor-pointer items-center gap-2 text-xs text-muted-foreground">
              <input type="checkbox" className="accent-teal-300" checked={ignoreWhitespace} onChange={(event) => setIgnoreWhitespace(event.target.checked)} />
              Ignore leading/trailing whitespace
            </label>
          </div>
          {!hasText ? (
            <div className="diff-empty">Enter text above to see the differences.</div>
          ) : result.identical ? (
            <div className="diff-empty">The two texts match{ignoreWhitespace ? " when leading/trailing whitespace is ignored" : ""}.</div>
          ) : (
            <div className="diff-lines" role="list" aria-label="Changed lines">
              {result.rows.map((row, index) => (
                <div key={index} role="listitem" className={`diff-line diff-line-${row.kind}`}>
                  <span className="sr-only">{row.kind === "added" ? "Added" : row.kind === "removed" ? "Removed" : "Unchanged"} line: </span>
                  <span className="diff-line-number" aria-hidden="true">{row.oldLine ?? ""}</span>
                  <span className="diff-line-number" aria-hidden="true">{row.newLine ?? ""}</span>
                  <span className="diff-line-sign" aria-hidden="true">{row.kind === "added" ? "+" : row.kind === "removed" ? "−" : ""}</span>
                  <pre>{row.text || " "}</pre>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
