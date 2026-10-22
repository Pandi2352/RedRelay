import { Plus } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router';
import { ROUTES } from '@/shared/constants';
import {
  buttonVariants,
  Card,
  EmptyState,
  ErrorState,
  PageHeader,
  Select,
  Skeleton,
  type SelectOption,
} from '@/shared/ui';
import { useGetRequestsQuery } from '../api/requestsApi';
import { RequestCard } from '../components/RequestCard';
import type { BloodType, RequestStatus, RequestUrgency } from '../types';

const urgencyOptions: SelectOption[] = [
  { value: '', label: 'All Urgencies' },
  { value: 'critical', label: 'Critical (Immediate)' },
  { value: 'urgent', label: 'Urgent (< 4 Hours)' },
  { value: 'standard', label: 'Standard (< 24 Hours)' },
];

const bloodTypeOptions: SelectOption[] = [
  { value: '', label: 'All Blood Groups' },
  { value: 'O_NEG', label: 'O Negative (Universal)' },
  { value: 'O_POS', label: 'O Positive' },
  { value: 'A_NEG', label: 'A Negative' },
  { value: 'A_POS', label: 'A Positive' },
  { value: 'B_NEG', label: 'B Negative' },
  { value: 'B_POS', label: 'B Positive' },
  { value: 'AB_NEG', label: 'AB Negative' },
  { value: 'AB_POS', label: 'AB Positive' },
];

const statusOptions: SelectOption[] = [
  { value: '', label: 'All Statuses' },
  { value: 'open', label: 'Open' },
  { value: 'partially_matched', label: 'Partially Matched' },
  { value: 'fully_matched', label: 'Fully Matched' },
  { value: 'fulfilled', label: 'Fulfilled' },
  { value: 'cancelled', label: 'Cancelled' },
];

export function RequestsListPage() {
  const [urgency, setUrgency] = useState<string>('');
  const [bloodType, setBloodType] = useState<string>('');
  const [status, setStatus] = useState<string>('');

  const { data, isLoading, isError, refetch } = useGetRequestsQuery({
    urgency: (urgency as RequestUrgency) || undefined,
    bloodType: (bloodType as BloodType) || undefined,
    status: (status as RequestStatus) || undefined,
  });

  const requests = data?.data ?? [];

  return (
    <div className="flex flex-col gap-4">
      <PageHeader
        title="Live Blood Requests Board"
        description="Urgent dispatches across verified hospitals. Track matching, acceptance, and fulfillment."
        actions={
          <Link
            to={ROUTES.requestNew}
            className={buttonVariants({ variant: 'primary', size: 'md' })}
          >
            <Plus className="h-4 w-4 mr-1" />
            Post Blood Request
          </Link>
        }
      />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 max-w-2xl">
        <Select
          options={urgencyOptions}
          value={urgency}
          onChange={setUrgency}
          placeholder="Filter by urgency..."
          size="sm"
        />
        <Select
          options={bloodTypeOptions}
          value={bloodType}
          onChange={setBloodType}
          placeholder="Filter by blood type..."
          size="sm"
        />
        <Select
          options={statusOptions}
          value={status}
          onChange={setStatus}
          placeholder="Filter by status..."
          size="sm"
        />
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i} className="p-4 flex flex-col gap-3">
              <Skeleton className="w-1/3 h-5" />
              <Skeleton className="w-full h-8" />
              <Skeleton className="w-full h-12" />
            </Card>
          ))}
        </div>
      ) : isError ? (
        <ErrorState
          message="Failed to load requests from the dispatch network."
          onRetry={refetch}
        />
      ) : requests.length === 0 ? (
        <EmptyState
          title="No blood requests found"
          description={
            urgency || bloodType || status
              ? 'No requests match your current filters. Try resetting the filters.'
              : 'There are currently no active blood requests in the system.'
          }
          action={
            <Link
              to={ROUTES.requestNew}
              className={buttonVariants({ variant: 'outline', size: 'sm' })}
            >
              Post First Blood Request
            </Link>
          }
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {requests.map((request) => (
            <RequestCard key={request.id} request={request} />
          ))}
        </div>
      )}
    </div>
  );
}
