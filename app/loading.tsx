export default function Loading() {
  return (
    <div className="grid min-h-[60vh] place-items-center" aria-busy="true" aria-label="Загрузка">
      <div className="flex flex-col items-center gap-4">
        <span className="h-10 w-10 animate-spin rounded-full border-2 border-sand-divider border-t-clinker" />
        <span className="text-sm text-stone">Загрузка…</span>
      </div>
    </div>
  );
}
