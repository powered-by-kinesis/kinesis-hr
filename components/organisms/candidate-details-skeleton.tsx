import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

/**
 * Renders a skeleton loader that mimics the layout of the Candidate Details page.
 * This provides a better loading experience by showing a placeholder of the
 * page content before the data is available.
 */
export function CandidateDetailsSkeleton() {
  return (
    <div className="px-4 lg:px-6 animate-pulse">
      {/* Header Skeleton */}
      <div className="mb-6">
        <Skeleton className="h-9 w-28 mb-4 rounded-md" />
        <Skeleton className="h-10 w-1/3 rounded-lg" />
      </div>

      {/* Tabs Skeleton */}
      <div className="space-y-4">
        <div className="grid h-10 w-full grid-cols-3 rounded-md border p-1">
          <Skeleton className="h-full w-full rounded-sm" />
          <div className="h-full w-full rounded-sm bg-muted"></div>
          <div className="h-full w-full rounded-sm bg-muted"></div>
        </div>
      </div>

      {/* Content Skeleton */}
      <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Card Skeleton */}
        <Card className="lg:col-span-1">
          <CardContent className="p-6 text-center space-y-4">
            <Skeleton className="h-8 w-1/2 mx-auto rounded-lg" />
            <Skeleton className="h-5 w-2/3 mx-auto rounded-lg" />
            <Skeleton className="h-5 w-1/2 mx-auto rounded-lg" />
            <Skeleton className="h-10 w-full mt-2 rounded-md" />
          </CardContent>
        </Card>

        {/* Right Card Skeleton */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <Skeleton className="h-7 w-32 rounded-lg" />
          </CardHeader>
          <CardContent>
            <Skeleton className="aspect-[8.5/11] w-full rounded-lg" />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
