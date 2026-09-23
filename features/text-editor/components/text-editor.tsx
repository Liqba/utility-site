"use client";

import { useMemo, useState } from "react";
import { Check, Copy, Download, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SiteHeader } from "@/components/site-header";
import { MilkdownSurface } from "./milkdown-surface";

export function TextEditor() {
  const [markdown, setMarkdown] = useState("");
  const [copied, setCopied] = useState(false);
  const stats = useMemo(() => {
    const plainText = markdown.replace(/[#*_~`>\[\]()-]/g, " ").trim();
    return {
      words: plainText ? plainText.split(/\s+/).length : 0,
      characters: markdown.length,
    };
  }, [markdown]);

  async function copyMarkdown() {
    try {
      await navigator.clipboard.writeText(markdown);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
  }

  function downloadMarkdown() {
    const url = URL.createObjectURL(new Blob([markdown], { type: "text/markdown;charset=utf-8" }));
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "untitled.md";
    anchor.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <SiteHeader compact />
      <main className="flex min-h-0 flex-1 flex-col px-3 pb-3 sm:px-5 sm:pb-5">
        <div className="mx-auto flex w-full max-w-[1200px] flex-wrap items-center justify-between gap-3 py-4">
          <div className="flex items-center gap-3">
            <span className="grid size-9 place-items-center rounded-lg border border-border bg-card text-cyan-300"><FileText size={19} /></span>
            <div>
              <h1 className="font-semibold tracking-tight">Text Editor</h1>
              <p className="text-xs text-muted-foreground">Markdown · stays in your browser</p>
            </div>
          </div>
          <div className="flex items-center gap-2" aria-label="Document actions">
            <Button size="sm" variant="outline" onClick={copyMarkdown} disabled={!markdown}>
              {copied ? <Check /> : <Copy />}{copied ? "Copied" : "Copy Markdown"}
            </Button>
            <Button size="sm" onClick={downloadMarkdown} disabled={!markdown}><Download />Download</Button>
          </div>
        </div>
        <section className="text-editor-pane mx-auto flex min-h-[65vh] w-full max-w-[1200px] flex-1 flex-col overflow-hidden rounded-xl border border-border bg-[#0b0f15] shadow-[0_18px_60px_rgba(0,0,0,.18)]" aria-label="Document">
          <MilkdownSurface onChange={setMarkdown} />
          <footer className="flex min-h-11 items-center justify-end gap-4 border-t border-border px-4 text-xs text-muted-foreground">
            <span>{stats.words} {stats.words === 1 ? "word" : "words"}</span>
            <span>{stats.characters} characters</span>
          </footer>
        </section>
      </main>
    </div>
  );
}
