export default function Eyebrow({
  children,
  className = "",
  as: Tag = "span",
}: {
  children: React.ReactNode;
  className?: string;
  as?: "span" | "p";
}) {
  return (
    <Tag
      className={`inline-flex items-center gap-1.5 rounded-full border border-gold/30 bg-gold/10 px-3 py-1 font-mono text-[11px] uppercase tracking-[0.16em] text-gold ${className}`}
    >
      {children}
    </Tag>
  );
}
