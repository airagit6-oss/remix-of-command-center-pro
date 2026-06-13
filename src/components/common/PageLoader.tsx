import React from 'react';
import { Loader2 } from 'lucide-react';

interface PageLoaderProps {
  isLoading: boolean;
  error?: string | null;
  children: React.ReactNode;
  skeletonComponent?: React.ReactNode;
  errorComponent?: (error: string) => React.ReactNode;
}

/**
 * PageLoader wraps async content with loading and error states
 * Usage:
 * <PageLoader isLoading={loading} error={error} skeletonComponent={<PageSkeleton />}>
 *   <YourContent />
 * </PageLoader>
 */
export function PageLoader({
  isLoading,
  error,
  children,
  skeletonComponent,
  errorComponent,
}: PageLoaderProps) {
  if (error) {
    return (
      errorComponent?.(error) || (
        <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4">
          <p className="text-sm text-destructive font-medium">Error loading content</p>
          <p className="text-xs text-destructive/70 mt-1">{error}</p>
        </div>
      )
    );
  }

  if (isLoading) {
    return (
      skeletonComponent || (
        <div className="flex items-center justify-center py-12">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span className="text-sm">Loading...</span>
          </div>
        </div>
      )
    );
  }

  return <>{children}</>;
}

export default PageLoader;
