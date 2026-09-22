import Link from "next/link";
import { ArrowUpRight, Braces, Check, ShieldCheck, Zap } from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { tools } from "@/features/tools/catalog";

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader />
      <main className="mx-auto w-full max-w-6xl px-5 pb-16 pt-14 sm:px-8 sm:pt-20">
        <section className="max-w-3xl">
          <p className="eyebrow">FAST · PRIVATE · LOCAL</p>
          <h1 className="mt-4 max-w-2xl text-balance text-4xl font-semibold leading-[1.08] tracking-[-0.04em] sm:text-6xl">
            Small tools. No friction.
          </h1>
          <p className="mt-5 max-w-xl text-base leading-7 text-muted-foreground sm:text-lg">
            Open a utility and get the job done. Your data stays in your browser.
          </p>
        </section>

        <section className="mt-12" aria-labelledby="tools-heading">
          <div className="mb-5 flex items-end justify-between gap-4">
            <div>
              <h2 id="tools-heading" className="text-lg font-semibold tracking-tight">Utilities</h2>
              <p className="mt-1 text-sm text-muted-foreground">One available now. More can be added without changing the core.</p>
            </div>
            <span className="hidden text-sm text-muted-foreground sm:block">01 tool</span>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {tools.map((tool) => (
              <Link key={tool.slug} href={tool.href} className="tool-card group">
                <div className="flex items-start justify-between gap-6">
                  <span className="tool-icon" aria-hidden="true"><Braces size={22} strokeWidth={1.8} /></span>
                  <ArrowUpRight className="text-muted-foreground transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-foreground" size={20} />
                </div>
                <div className="mt-10">
                  <h3 className="text-xl font-semibold tracking-tight">{tool.name}</h3>
                  <p className="mt-2 max-w-md text-sm leading-6 text-muted-foreground">{tool.description}</p>
                  <div className="mt-6 flex flex-wrap gap-2">
                    {tool.capabilities.map((capability) => (
                      <span key={capability} className="chip"><Check size={13} />{capability}</span>
                    ))}
                  </div>
                </div>
              </Link>
            ))}

            <div className="coming-card" aria-label="More utilities coming soon">
              <div className="flex h-full flex-col justify-between gap-12">
                <div className="flex gap-3 text-muted-foreground">
                  <Zap size={18} />
                  <ShieldCheck size={18} />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">Built to grow</p>
                  <p className="mt-2 max-w-sm text-sm leading-6 text-muted-foreground">New utilities plug into the same fast, privacy-first shell.</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
