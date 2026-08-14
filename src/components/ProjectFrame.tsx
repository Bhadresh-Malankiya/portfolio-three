import ProjectMotif from "@/components/ProjectMotif";
import type { Motif } from "@/data/projects";

/**
 * A stylized "browser chrome" placeholder — since there are no real product
 * screenshots to show, this frames the abstract per-project motif animation
 * as a window rather than pretending to be an actual screenshot.
 */
export default function ProjectFrame({
  motif,
  accent = "text-gold",
  url,
  className = "",
  mediaClassName,
  big = false,
  bare = false,
}: {
  motif: Motif;
  accent?: string;
  url?: string;
  className?: string;
  /** Overrides the height/aspect-ratio classes on the motif box itself (the
   * default `className` only styles the outer frame — border, radius, etc). */
  mediaClassName?: string;
  big?: boolean;
  bare?: boolean;
}) {
  const shell = bare ? "bg-ink-3/70" : "overflow-hidden rounded-lg border border-line-strong bg-ink-3/70";
  const mediaSize = mediaClassName ?? (big ? "h-80 sm:h-[30rem]" : "h-48 sm:h-56");
  return (
    <div className={`${shell} ${className}`}>
      <div className="flex items-center gap-3 border-b border-line bg-ink-2/80 px-3 py-2">
        <div className="flex gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-white/10" />
          <span className="h-2.5 w-2.5 rounded-full bg-white/10" />
          <span className="h-2.5 w-2.5 rounded-full bg-white/10" />
        </div>
        {url && (
          <div className="flex-1 truncate rounded-full bg-ink px-3 py-1 text-center font-mono text-[10px] text-muted">
            {url.replace("https://", "")}
          </div>
        )}
      </div>
      <div className={`relative ${mediaSize} ${accent}`}>
        <div className="absolute inset-0 bg-blueprint opacity-[0.15]" />
        <ProjectMotif motif={motif} accent={accent} className="relative h-full w-full" />
      </div>
    </div>
  );
}
