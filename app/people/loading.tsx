import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="mx-auto max-w-5xl space-y-6 p-6">
      {/* Header */}
      <div className="space-y-2">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-4 w-80" />
      </div>

      {/* Search Bar */}
      <Skeleton className="h-10 w-full rounded-lg" />

      {/* Tabs */}
      <div className="grid grid-cols-4 gap-2">
        <Skeleton className="h-10 rounded-md" />
        <Skeleton className="h-10 rounded-md" />
        <Skeleton className="h-10 rounded-md" />
        <Skeleton className="h-10 rounded-md" />
      </div>

      {/* User Cards */}
      <div className="space-y-4">
        {Array.from({ length: 5 }).map((_, index) => (
          <div
            key={index}
            className="flex items-center justify-between rounded-xl border p-4"
          >
            <div className="flex items-center gap-4">
              <Skeleton className="h-14 w-14 rounded-full" />

              <div className="space-y-2">
                <Skeleton className="h-4 w-36" />
                <Skeleton className="h-3 w-24" />
                <Skeleton className="h-3 w-52" />
              </div>
            </div>

            <Skeleton className="h-10 w-28 rounded-md" />
          </div>
        ))}
      </div>
    </div>
  );
}