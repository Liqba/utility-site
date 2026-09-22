import Link from "next/link";
import { Braces, Grid2X2 } from "lucide-react";

export function SiteHeader({ compact = false }: { compact?: boolean }) {
  return (
    <header className="border-b border-border/80 bg-background/90 backdrop-blur-xl">
      <div className={`mx-auto flex w-full items-center justify-between px-5 sm:px-8 ${compact ? "h-14 max-w-none" : "h-16 max-w-6xl"}`}>
        <Link href="/" className="flex items-center gap-2.5 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
          <span className="grid size-8 place-items-center rounded-lg border border-cyan-300/25 bg-cyan-300/10 text-cyan-300"><Braces size={18} /></span>
          <span className="font-semibold tracking-[-0.02em]">Utility Dock</span>
        </Link>
        {compact ? (
          <Link href="/" className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-foreground">
            <Grid2X2 size={16} /> <span className="hidden sm:inline">All utilities</span>
          </Link>
        ) : (
          <span className="hidden text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground sm:block">Browser utilities</span>
        )}
      </div>
    </header>
  );
}
