import { Building2, Calendar, MapPin, Phone, Plus } from 'lucide-react';
import { Link, useParams } from 'react-router';
import { ROUTES } from '@/shared/constants';
import {
  Badge,
  buttonVariants,
  Card,
  ErrorState,
  PageHeader,
  Skeleton,
} from '@/shared/ui';
import { useGetHospitalQuery } from '../api/hospitalsApi';

export function HospitalDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { data: hospital, isLoading, isError, refetch } = useGetHospitalQuery(id ?? '', {
    skip: !id,
  });

  if (isLoading) {
    return (
      <div className="flex flex-col gap-4 max-w-3xl mx-auto">
        <Skeleton className="w-1/2 h-8" />
        <Card className="p-6 flex flex-col gap-4">
          <Skeleton className="w-1/3 h-5" />
          <Skeleton className="w-full h-32" />
        </Card>
      </div>
    );
  }

  if (isError || !hospital) {
    return (
      <ErrorState
        message="Hospital could not be found or failed to load."
        onRetry={refetch}
      />
    );
  }

  return (
    <div className="flex flex-col gap-4 max-w-3xl mx-auto">
      <PageHeader
        title={hospital.name}
        description={`Registered facility · License ${hospital.licenseNumber}`}
        actions={
          <Link
            to={`${ROUTES.requestNew}?hospitalId=${hospital.id}`}
            className={buttonVariants({ variant: 'primary', size: 'md' })}
          >
            <Plus className="h-4 w-4 mr-1" />
            Post Blood Request
          </Link>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <Card className="p-4 md:col-span-2 flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <Building2 className="h-5 w-5 text-primary" />
            <h3 className="font-display font-semibold text-base text-fg">Facility Information</h3>
          </div>

          <div className="flex flex-wrap gap-2 pt-1 border-t border-border">
            <Badge tone="secondary" variant="soft">
              {hospital.type}
            </Badge>
            <Badge tone={hospital.status === 'verified' ? 'success' : 'warning'} variant="soft">
              Status: {hospital.status}
            </Badge>
            {hospital.bloodBank.hasBloodBank && (
              <Badge tone="neutral" variant="soft">
                Blood Bank Capacity: {hospital.bloodBank.storageUnitsCapacity ?? 0} Units
              </Badge>
            )}
          </div>

          <div className="flex flex-col gap-2 pt-2 text-xs">
            <div className="flex items-start gap-2 text-fg">
              <MapPin className="h-4 w-4 text-fg-subtle shrink-0 mt-0.5" />
              <span>
                {hospital.address.street}, {hospital.address.city}, {hospital.address.state} — {hospital.address.postalCode}
              </span>
            </div>
            <div className="text-fg-subtle text-[11px] pl-6 font-mono">
              Coordinates: {hospital.location.coordinates[1].toFixed(4)}°N, {hospital.location.coordinates[0].toFixed(4)}°E
            </div>
          </div>
        </Card>

        <Card className="p-4 flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <Phone className="h-5 w-5 text-secondary" />
            <h3 className="font-display font-semibold text-base text-fg">Emergency Contact</h3>
          </div>

          <div className="flex flex-col gap-2 text-xs pt-1 border-t border-border">
            <div>
              <span className="text-fg-subtle block">Hotline:</span>
              <a
                href={`tel:${hospital.contact.emergencyPhone ?? hospital.contact.phone}`}
                className="font-medium text-primary hover:underline"
              >
                {hospital.contact.emergencyPhone ?? hospital.contact.phone}
              </a>
            </div>
            <div>
              <span className="text-fg-subtle block">Email:</span>
              <a
                href={`mailto:${hospital.contact.email}`}
                className="font-medium text-fg hover:underline truncate block"
              >
                {hospital.contact.email}
              </a>
            </div>
            <div className="pt-2 text-[11px] text-fg-subtle flex items-center gap-1">
              <Calendar className="h-3.5 w-3.5" />
              <span>Joined {new Date(hospital.createdAt).toLocaleDateString()}</span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
