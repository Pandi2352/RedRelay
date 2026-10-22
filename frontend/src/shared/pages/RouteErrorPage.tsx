import { isRouteErrorResponse, useRouteError } from 'react-router';
import { ErrorState } from '../ui';

/** Router errorElement: shows what failed and lets the user reload. */
export function RouteErrorPage() {
  const error = useRouteError();
  const message = isRouteErrorResponse(error)
    ? `${error.status} ${error.statusText}`
    : 'This page failed to load. Reload to try again.';

  return (
    <div className="mx-auto w-full max-w-3xl p-4">
      <ErrorState message={message} onRetry={() => window.location.reload()} />
    </div>
  );
}
