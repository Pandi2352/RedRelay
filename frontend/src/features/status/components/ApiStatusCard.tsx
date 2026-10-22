import { getErrorMessage } from '@/shared/api';
import { Card, ErrorState, Skeleton } from '@/shared/ui';
import { useGetHealthQuery } from '../api/statusApi';

export function ApiStatusCard() {
  const { data, error, isLoading, isFetching, refetch } = useGetHealthQuery();

  if (isLoading) {
    return (
      <Card className="flex flex-col gap-2">
        <Skeleton className="h-5 w-32" />
        <Skeleton className="h-4 w-48" />
      </Card>
    );
  }

  if (error || !data) {
    return (
      <ErrorState message={getErrorMessage(error)} onRetry={() => void refetch()} retrying={isFetching} />
    );
  }

  const healthy = data.status === 'ok';
  return (
    <Card className="flex flex-col gap-1">
      <p className="flex items-center gap-2 font-medium">
        <span
          aria-hidden="true"
          className={healthy ? 'size-2 rounded-full bg-success' : 'size-2 rounded-full bg-warning'}
        />
        {healthy ? 'API is running' : 'API is running with problems'}
      </p>
      <p className="text-fg-muted">
        Database is {data.database}. Running for <span className="tabular-nums">{data.uptime}</span> seconds.
      </p>
    </Card>
  );
}
