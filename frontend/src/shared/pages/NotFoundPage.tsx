import { Link } from 'react-router';
import { ROUTES } from '../constants';
import { buttonVariants, EmptyState } from '../ui';

export function NotFoundPage() {
  return (
    <EmptyState
      title="Page not found"
      description="The link may be old or mistyped."
      action={
        <Link to={ROUTES.home} className={buttonVariants({ variant: 'outline' })}>
          Go to home
        </Link>
      }
    />
  );
}
