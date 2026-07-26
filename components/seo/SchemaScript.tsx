/** Рендерит JSON-LD (ТЗ §4). Один или несколько объектов Schema.org. */
export function SchemaScript({ data }: { data: object | object[] }) {
  const arr = Array.isArray(data) ? data : [data];
  return (
    <>
      {arr.map((d, i) => {
        const type = (d as { "@type"?: string })["@type"] ?? "schema";
        return (
          <script
            key={`${type}-${i}`}
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(d) }}
          />
        );
      })}
    </>
  );
}
