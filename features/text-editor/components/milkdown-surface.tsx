"use client";

import { useEffect, useRef } from "react";
import { Crepe } from "@milkdown/crepe";
import "@milkdown/crepe/theme/common/style.css";
import "@milkdown/crepe/theme/classic-dark.css";

export function MilkdownSurface({ onChange }: { onChange: (markdown: string) => void }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;

  useEffect(() => {
    if (!rootRef.current) return;
    const crepe = new Crepe({
      root: rootRef.current,
      defaultValue: "",
      featureConfigs: {
        [Crepe.Feature.Placeholder]: { text: "Start writing…", mode: "block" },
      },
    });
    let active = true;
    crepe.on((listener) => {
      listener.markdownUpdated((_ctx, markdown) => onChangeRef.current(markdown));
    });
    void crepe.create().catch(() => {
      if (active) onChangeRef.current("");
    });
    return () => {
      active = false;
      void crepe.destroy();
    };
  }, []);

  return <div ref={rootRef} className="milkdown-root" aria-label="Markdown text editor" />;
}
