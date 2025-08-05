'use client';

import { Loading } from '@/components/molecules/loading';

export function DataTableLoading() {
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-background/60 backdrop-blur-sm">
      <Loading />
    </div>
  );
}
