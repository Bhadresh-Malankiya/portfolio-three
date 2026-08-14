import Reveal from "@/components/Reveal";
import Eyebrow from "@/components/Eyebrow";

export default function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
}: {
  eyebrow: string;
  title: string;
  description?: string;
  align?: "left" | "center";
}) {
  return (
    <Reveal className={align === "center" ? "mx-auto max-w-2xl text-center" : "max-w-2xl"}>
      <Eyebrow as="p">{eyebrow}</Eyebrow>
      <h2 className="mt-4 text-balance font-display text-3xl leading-tight text-fg sm:text-4xl">{title}</h2>
      {description && <p className="mt-4 text-pretty leading-relaxed text-muted">{description}</p>}
    </Reveal>
  );
}
