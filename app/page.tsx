import Link from "next/link";
import { ArrowRight, Braces } from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { tools } from "@/features/tools/catalog";

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader />
      <main className="mx-auto w-full max-w-6xl px-5 pb-16 pt-12 sm:px-8 sm:pt-16">
        <section aria-labelledby="tools-heading">
          <h1 id="tools-heading" className="text-3xl font-semibold tracking-[-0.035em] sm:text-4xl">Utilities</h1>
          <div className="mt-7 grid gap-4 md:grid-cols-2">
            {tools.map((tool) => (
              <article key={tool.slug} className="tool-card">
                <div className="flex items-start justify-between gap-6">
                  <span className="tool-icon" aria-hidden="true"><Braces size={22} strokeWidth={1.8} /></span>
                  <span className="text-xs text-muted-foreground">JSON</span>
                </div>
                <div className="mt-8">
                  <h3 className="text-xl font-semibold tracking-tight">{tool.name}</h3>
                  <Link href={tool.href} className="open-tool-button">
                    Open editor <ArrowRight size={16} />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
