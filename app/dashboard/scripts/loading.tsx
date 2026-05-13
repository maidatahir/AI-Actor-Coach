import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-2">
          <Skeleton className="h-8 w-48 bg-white/5" />
          <Skeleton className="h-4 w-64 bg-white/5" />
        </div>
        <Skeleton className="h-10 w-32 rounded-full bg-white/5" />
      </div>

      <div className="flex gap-2 p-1 rounded-xl bg-white/5 border border-white/10 w-fit">
        <Skeleton className="h-10 w-40 rounded-lg bg-white/5" />
        <Skeleton className="h-10 w-40 rounded-lg bg-white/5" />
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <Skeleton className="h-10 flex-1 max-w-md rounded-xl bg-white/5" />
        <div className="flex gap-2">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-10 w-16 rounded-full bg-white/5" />
          ))}
        </div>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
          <div key={i} className="p-6 rounded-2xl bg-white/5 border border-white/10 space-y-4">
            <div className="flex items-start justify-between">
              <Skeleton className="w-12 h-12 rounded-xl bg-white/10" />
              <Skeleton className="w-16 h-5 rounded-full bg-white/10" />
            </div>
            <Skeleton className="h-6 w-3/4 bg-white/10" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-1/2 bg-white/5" />
              <Skeleton className="h-4 w-1/3 bg-white/5" />
            </div>
            <div className="flex gap-2">
              <Skeleton className="h-10 flex-1 rounded-xl bg-white/10" />
              <Skeleton className="h-10 w-10 rounded-xl bg-white/10" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
