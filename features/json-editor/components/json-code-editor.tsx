"use client";

import { useMemo, useRef, useState } from "react";
import { ChevronDown, ChevronUp, Replace, X } from "lucide-react";
import { Button } from "@/components/ui/button";

type JsonCodeEditorProps = {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
};

const tokenPattern = /("(?:\\u[a-fA-F0-9]{4}|\\[^u]|[^\\"])*"(?=\s*:))|("(?:\\u[a-fA-F0-9]{4}|\\[^u]|[^\\"])*")|\b(true|false)\b|\b(null)\b|(-?\d+(?:\.\d+)?(?:[eE][+-]?\d+)?)/g;

function highlightJson(value: string) {
  const nodes: React.ReactNode[] = [];
  let cursor = 0;
  let match: RegExpExecArray | null;
  tokenPattern.lastIndex = 0;
  while ((match = tokenPattern.exec(value)) !== null) {
    if (match.index > cursor) nodes.push(value.slice(cursor, match.index));
    const className = match[1] ? "json-key" : match[2] ? "json-string" : match[3] ? "json-boolean" : match[4] ? "json-null" : "json-number";
    nodes.push(<span className={className} key={`${match.index}-${match[0]}`}>{match[0]}</span>);
    cursor = match.index + match[0].length;
  }
  if (cursor < value.length) nodes.push(value.slice(cursor));
  return nodes;
}

export function JsonCodeEditor({ id, label, value, onChange, placeholder }: JsonCodeEditorProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const highlightRef = useRef<HTMLPreElement>(null);
  const findInputRef = useRef<HTMLInputElement>(null);
  const [findOpen, setFindOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [replacement, setReplacement] = useState("");
  const [activeMatch, setActiveMatch] = useState(-1);

  const matches = useMemo(() => {
    if (!query) return [];
    const positions: number[] = [];
    const haystack = value.toLocaleLowerCase();
    const needle = query.toLocaleLowerCase();
    let from = 0;
    while (from <= haystack.length) {
      const index = haystack.indexOf(needle, from);
      if (index === -1) break;
      positions.push(index);
      from = index + Math.max(needle.length, 1);
    }
    return positions;
  }, [query, value]);

  function syncScroll() {
    if (!textareaRef.current || !highlightRef.current) return;
    highlightRef.current.scrollTop = textareaRef.current.scrollTop;
    highlightRef.current.scrollLeft = textareaRef.current.scrollLeft;
  }

  function revealMatch(direction: 1 | -1) {
    if (!matches.length) return;
    const next = activeMatch < 0
      ? direction === 1 ? 0 : matches.length - 1
      : (activeMatch + direction + matches.length) % matches.length;
    const start = matches[next];
    setActiveMatch(next);
    requestAnimationFrame(() => {
      textareaRef.current?.focus();
      textareaRef.current?.setSelectionRange(start, start + query.length);
    });
  }

  function openFind() {
    setFindOpen(true);
    requestAnimationFrame(() => {
      findInputRef.current?.focus();
      findInputRef.current?.select();
    });
  }

  function replaceCurrent() {
    if (!matches.length) return;
    const index = activeMatch >= 0 ? activeMatch : 0;
    const start = matches[index];
    onChange(value.slice(0, start) + replacement + value.slice(start + query.length));
    setActiveMatch(-1);
    requestAnimationFrame(() => textareaRef.current?.focus());
  }

  function replaceAll() {
    if (!query) return;
    onChange(value.replace(new RegExp(query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "gi"), replacement));
    setActiveMatch(-1);
  }

  return (
    <div className="code-editor">
      {findOpen && (
        <div className="find-panel" role="search" aria-label={`Find and replace in ${label}`}>
          <div className="find-row">
            <input
              ref={findInputRef}
              value={query}
              onChange={(event) => { setQuery(event.target.value); setActiveMatch(-1); }}
              onKeyDown={(event) => {
                if (event.key === "Enter") { event.preventDefault(); revealMatch(event.shiftKey ? -1 : 1); }
                if (event.key === "Escape") { setFindOpen(false); textareaRef.current?.focus(); }
              }}
              placeholder="Find"
              aria-label={`Find in ${label}`}
            />
            <span className="match-count">{query ? `${activeMatch >= 0 ? activeMatch + 1 : 0}/${matches.length}` : "0/0"}</span>
            <Button size="icon-sm" variant="ghost" onClick={() => revealMatch(-1)} disabled={!matches.length} aria-label="Previous match"><ChevronUp /></Button>
            <Button size="icon-sm" variant="ghost" onClick={() => revealMatch(1)} disabled={!matches.length} aria-label="Next match"><ChevronDown /></Button>
            <Button size="icon-sm" variant="ghost" onClick={() => { setFindOpen(false); textareaRef.current?.focus(); }} aria-label="Close find"><X /></Button>
          </div>
          <div className="find-row">
            <input
              value={replacement}
              onChange={(event) => setReplacement(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") { event.preventDefault(); replaceCurrent(); }
                if (event.key === "Escape") { setFindOpen(false); textareaRef.current?.focus(); }
              }}
              placeholder="Replace"
              aria-label={`Replace in ${label}`}
            />
            <Button size="sm" variant="ghost" onClick={replaceCurrent} disabled={!matches.length}><Replace />Replace</Button>
            <Button size="sm" variant="ghost" onClick={replaceAll} disabled={!matches.length}>All</Button>
          </div>
        </div>
      )}
      <pre ref={highlightRef} className="code-highlight" aria-hidden="true">
        {value ? highlightJson(value) : <span className="editor-placeholder">{placeholder}</span>}
        {"\n"}
      </pre>
      <textarea
        ref={textareaRef}
        id={id}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        onScroll={syncScroll}
        onKeyDown={(event) => {
          if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "f") {
            event.preventDefault();
            openFind();
          }
        }}
        spellCheck={false}
        autoCapitalize="off"
        autoCorrect="off"
        aria-label={label}
        className="code-textarea"
      />
    </div>
  );
}
