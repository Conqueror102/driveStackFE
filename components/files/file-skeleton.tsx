import { Skeleton } from '@/components/ui/skeleton';

export function FileSkeleton({ viewMode }: { viewMode: 'list' | 'grid' }) {
  if (viewMode === 'list') {
    return (
      <div className="border border-border rounded-lg bg-white overflow-hidden">
        <div className="grid grid-cols-[1fr_120px_80px_100px_48px] gap-4 px-4 py-3 bg-surface border-b border-border">
          <Skeleton className="h-4 w-12 bg-border" />
          <Skeleton className="h-4 w-16 bg-border" />
          <Skeleton className="h-4 w-10 bg-border" />
          <Skeleton className="h-4 w-16 bg-border" />
          <Skeleton className="h-4 w-4 bg-border" />
        </div>
        <div className="divide-y divide-border">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="grid grid-cols-[1fr_120px_80px_100px_48px] gap-4 px-4 py-3 items-center">
              <div className="flex items-center gap-3">
                <Skeleton className="w-4 h-4 rounded-sm shrink-0" style={{ animationDelay: `${i * 60}ms` }} />
                <Skeleton className="h-4 w-48 max-w-full" style={{ animationDelay: `${i * 60}ms` }} />
              </div>
              <div><Skeleton className="h-5 w-20 rounded-full" style={{ animationDelay: `${i * 60}ms` }} /></div>
              <div><Skeleton className="h-4 w-12" style={{ animationDelay: `${i * 60}ms` }} /></div>
              <div><Skeleton className="h-4 w-16" style={{ animationDelay: `${i * 60}ms` }} /></div>
              <div className="flex justify-end"><Skeleton className="h-5 w-5 rounded-md" style={{ animationDelay: `${i * 60}ms` }} /></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {Array.from({ length: 12 }).map((_, i) => (
        <div key={i} className="border border-border rounded-lg bg-white overflow-hidden">
          <Skeleton className="aspect-[4/3] w-full rounded-none bg-surface" />
          <div className="p-3">
            <Skeleton className="h-4 w-full mb-4 bg-surface" />
            <div className="flex justify-between items-center">
              <Skeleton className="h-5 w-5 rounded-full bg-surface" />
              <Skeleton className="h-3 w-8 bg-surface" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
