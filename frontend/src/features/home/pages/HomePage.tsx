import { Link } from 'react-router';
import { ROUTES } from '@/shared/constants';
import { buttonVariants, Card, EmptyState, PageHeader } from '@/shared/ui';

export function HomePage() {
  return (
    <>
      <PageHeader
        title="Blood requests"
        description="Open requests from your hospital appear here in real time."
      />
      <Card>
        <EmptyState
          className="py-2"
          title="No open requests"
          description="Posting requests arrives in Sprint 2. Check that the API is reachable in the meantime."
          action={
            <Link to={ROUTES.status} className={buttonVariants({ variant: 'outline' })}>
              Check system status
            </Link>
          }
        />
      </Card>
    </>
  );
}
