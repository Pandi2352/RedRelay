import { Plus, Search } from 'lucide-react';
import { useMemo, useState } from 'react';
import { Link } from 'react-router';
import { ROUTES } from '@/shared/constants';
import {
  buttonVariants,
  Card,
  EmptyState,
  ErrorState,
  PageHeader,
  Skeleton,
} from '@/shared/ui';
import { useGetHospitalsQuery } from '../api/hospitalsApi';
import { HospitalCard } from '../components/HospitalCard';

export function HospitalsListPage() {
  const { data, isLoading, isError, refetch } = useGetHospitalsQuery();
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    const hospitals = data?.data ?? [];
    if (!search.trim()) return hospitals;
    const query = search.toLowerCase();
    return hospitals.filter(
      (h) =>
        h.name.toLowerCase().includes(query) ||
        h.address.city.toLowerCase().includes(query) ||
        h.address.state.toLowerCase().includes(query),
    );
  }, [data, search]);

  return (
    <div className="flex flex-col gap-4">
      <PageHeader
        title="Verified Hospitals & Facilities"
        description="Healthcare institutions authorized to issue emergency blood dispatches."
        actions={
          <Link
            to={ROUTES.hospitalNew}
            className={buttonVariants({ variant: 'primary', size: 'md' })}
          >
            <Plus className="h-4 w-4 mr-1" />
            Register Hospital
          </Link>
        }
      />

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-2.5 h-4 w-4 text-fg-subtle pointer-events-none" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Filter by hospital or city..."
          className="w-full h-9 pl-9 pr-3 text-xs bg-surface text-fg placeholder:text-fg-subtle rounded-md border border-border focus:border-focus focus:outline-none"
        />
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i} className="p-4 flex flex-col gap-3">
              <Skeleton className="w-3/4 h-5" />
              <Skeleton className="w-1/2 h-4" />
              <Skeleton className="w-full h-12" />
            </Card>
          ))}
        </div>
      ) : isError ? (
        <ErrorState
          message="Failed to load hospitals from the network."
          onRetry={refetch}
        />
      ) : filtered.length === 0 ? (
        <EmptyState
          title="No hospitals found"
          description={
            search
              ? 'No facilities match your search criteria. Try a different city or name.'
              : 'No hospitals have been registered yet.'
          }
          action={
            <Link
              to={ROUTES.hospitalNew}
              className={buttonVariants({ variant: 'outline', size: 'sm' })}
            >
              Register First Hospital
            </Link>
          }
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {filtered.map((hospital) => (
            <HospitalCard key={hospital.id} hospital={hospital} />
          ))}
        </div>
      )}
    </div>
  );
}
