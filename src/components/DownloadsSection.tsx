import { BookOpen, Download, FileText } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import Reveal from "@/components/Reveal";
import ChapterCover from "@/components/ChapterCover";
import { downloads } from "@/data/downloads";

type DownloadItem = (typeof downloads)[keyof typeof downloads];

function DownloadCard({
  item,
  icon: Icon,
  coverSeed,
  delay,
}: {
  item: DownloadItem;
  icon: LucideIcon;
  /** Passing a seed renders the same generative cover art used on `/journey`;
   * omitting it falls back to a plain ink band — the résumé isn't a "chapter". */
  coverSeed?: string;
  delay: number;
}) {
  return (
    <Reveal delay={delay} y={26} className="h-full">
      <article className="group relative flex h-full flex-col overflow-hidden rounded-xl border border-line-strong bg-paper text-paper-ink transition-transform duration-500 hover:-translate-y-1">
        <div className="relative h-24 sm:h-28">
          {coverSeed ? (
            <ChapterCover seed={coverSeed} className="absolute inset-0 h-full w-full" />
          ) : (
            <div className="absolute inset-0 bg-ink-3">
              <div className="absolute inset-0 bg-blueprint opacity-[0.12]" />
            </div>
          )}
          <div className="absolute -bottom-6 left-6 flex h-12 w-12 items-center justify-center rounded-full border border-paper-ink/10 bg-paper shadow-md sm:left-9">
            <Icon size={20} className="text-paper-ink/70" strokeWidth={1.6} />
          </div>
        </div>

        <div className="flex flex-1 flex-col px-6 pb-8 pt-10 sm:px-9 sm:pb-9">
          <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-paper-ink/50">{item.kicker}</p>
          <h3 className="mt-2 font-display text-2xl leading-tight sm:text-[1.75rem]">{item.title}</h3>
          <p className="mt-2 max-w-sm text-pretty text-sm italic leading-relaxed text-paper-ink/70">
            {item.subtitle}
          </p>

          <div className="mt-5 flex flex-wrap gap-x-4 gap-y-1 border-t border-paper-ink/10 pt-4 font-mono text-[11px] text-paper-ink/55">
            {item.stats.map((s) => (
              <span key={s}>{s}</span>
            ))}
          </div>

          <a
            href={item.file}
            download={item.filename}
            className="group/btn mt-6 inline-flex w-fit items-center gap-2 rounded-full bg-paper-ink px-5 py-2.5 font-mono text-xs uppercase tracking-[0.14em] text-paper transition-colors hover:bg-gold hover:text-ink"
          >
            <Download size={14} className="transition-transform group-hover/btn:translate-y-0.5" />
            {item.cta}
            <span className="text-paper/50 group-hover/btn:text-ink/60">{item.sizeLabel}</span>
          </a>
        </div>
      </article>
    </Reveal>
  );
}

export default function DownloadsSection() {
  return (
    <div className="grid gap-5 sm:grid-cols-2">
      <DownloadCard item={downloads.ebook} icon={BookOpen} coverSeed="the-weekend-builder-cover" delay={0} />
      <DownloadCard item={downloads.resume} icon={FileText} delay={0.08} />
    </div>
  );
}
