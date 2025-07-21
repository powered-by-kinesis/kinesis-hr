import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

/**
 * Renders a skeleton loader that mimics the layout of the Hiring Dashboard.
 * This component is used as a fallback for Suspense to provide a better
 * loading experience by showing a content placeholder.
 */
export function HiringDashboardSkeleton() {
  return (
    <div className={cn('flex flex-col gap-4 py-4 md:gap-6 md:py-6 animate-pulse')}>
      <div className="px-4 lg:px-6">
        {/* Header Skeleton */}
        <div className="mb-6">
          <Skeleton className="h-8 w-1/3 rounded-lg" />
          <Skeleton className="mt-2 h-4 w-1/2 rounded-lg" />
        </div>

        {/* Tabs and Toolbar Skeleton */}
        <div className="space-y-4">
          <div className="grid h-10 w-full grid-cols-2 rounded-md border p-1">
            <Skeleton className="h-full w-full rounded-sm" />
            <div className="h-full w-full rounded-sm bg-muted"></div>
          </div>
          <div className="flex justify-between">
            <Skeleton className="h-10 w-1/3 rounded-md" />
            <Skeleton className="h-10 w-32 rounded-md" />
          </div>
        </div>

        {/* Table Skeleton */}
        <div className="mt-6 rounded-lg border">
          {/* Table Header */}
          <div className="grid grid-cols-5 gap-4 p-4 border-b">
            <Skeleton className="h-5 w-full rounded" />
            <Skeleton className="h-5 w-full rounded" />
            <Skeleton className="h-5 w-full rounded" />
            <Skeleton className="h-5 w-full rounded" />
            <Skeleton className="h-5 w-full rounded" />
          </div>

          {/* Table Body: 10 placeholder rows */}
          <div className="space-y-6 p-4">
            {Array.from({ length: 10 }).map((_, i) => (
              <div key={i} className="grid grid-cols-5 gap-4">
                <Skeleton className="h-5 w-full rounded" />
                <Skeleton className="h-5 w-full rounded" />
                <Skeleton className="h-5 w-full rounded" />
                <Skeleton className="h-5 w-full rounded" />
                <Skeleton className="h-5 w-full rounded" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
