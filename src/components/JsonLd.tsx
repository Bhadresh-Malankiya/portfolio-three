/**
 * Renders a JSON-LD structured-data script tag. `data` is trusted, static,
 * build-time content only (schema.org objects from our own data files) —
 * never render user-supplied input through this component.
 */
export default function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />
  );
}
