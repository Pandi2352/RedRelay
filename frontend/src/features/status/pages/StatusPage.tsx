import { PageHeader } from '@/shared/ui';
import { ApiStatusCard } from '../components/ApiStatusCard';

export function StatusPage() {
  return (
    <>
      <PageHeader title="System status" description="Whether the API and its database are reachable." />
      <ApiStatusCard />
    </>
  );
}
