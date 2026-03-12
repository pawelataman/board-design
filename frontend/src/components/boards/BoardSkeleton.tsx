export default function BoardSkeleton() {
  return (
    <div className="panel flex flex-col overflow-hidden">
      <div className="aspect-[4/3] w-full animate-pulse bg-[var(--surface-2)]" />
      <div className="flex flex-col gap-2 p-4">
        <div className="h-4 w-3/4 animate-pulse rounded bg-[var(--surface-2)]" />
        <div className="h-3 w-1/2 animate-pulse rounded bg-[var(--surface-2)]" />
      </div>
    </div>
  );
}
