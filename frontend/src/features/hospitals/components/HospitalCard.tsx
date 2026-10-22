import { Building2, MapPin, Phone } from 'lucide-react';
import { Link } from 'react-router';
import { ROUTES } from '@/shared/constants';
import { Badge, Card } from '@/shared/ui';
import type { Hospital, HospitalStatus, HospitalType } from '../types';

interface HospitalCardProps {
  hospital: Hospital;
}

function getStatusTone(status: HospitalStatus): 'success' | 'warning' | 'danger' {
  switch (status) {
    case 'verified':
      return 'success';
    case 'pending':
      return 'warning';
    case 'suspended':
      return 'danger';
  }
}

function getTypeTone(type: HospitalType): 'primary' | 'secondary' | 'neutral' {
  switch (type) {
    case 'government':
      return 'primary';
    case 'private':
      return 'secondary';
    default:
      return 'neutral';
  }
}

export function HospitalCard({ hospital }: HospitalCardProps) {
  return (
    <Card className="p-4 flex flex-col justify-between gap-3 transition-colors hover:border-border-strong">
      <div className="flex flex-col gap-2">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <Building2 className="h-4 w-4 text-fg-subtle shrink-0" />
            <h3 className="font-display font-semibold text-base text-fg truncate">
              {hospital.name}
            </h3>
          </div>
          <Badge tone={getStatusTone(hospital.status)} variant="soft">
            {hospital.status}
          </Badge>
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          <Badge tone={getTypeTone(hospital.type)} variant="soft">
            {hospital.type}
          </Badge>
          {hospital.bloodBank.hasBloodBank && (
            <Badge tone="neutral" variant="soft">
              Blood Bank ({hospital.bloodBank.storageUnitsCapacity ?? 0} units)
            </Badge>
          )}
        </div>

        <div className="flex items-center gap-1.5 text-xs text-fg-muted mt-1">
          <MapPin className="h-3.5 w-3.5 shrink-0 text-fg-subtle" />
          <span className="truncate">
            {hospital.address.city}, {hospital.address.state}
          </span>
        </div>

        <div className="flex items-center gap-1.5 text-xs text-fg-muted">
          <Phone className="h-3.5 w-3.5 shrink-0 text-fg-subtle" />
          <span>{hospital.contact.emergencyPhone ?? hospital.contact.phone}</span>
        </div>
      </div>

      <div className="pt-2 border-t border-border flex items-center justify-between text-xs">
        <span className="text-fg-subtle font-mono">Lic: {hospital.licenseNumber}</span>
        <Link
          to={ROUTES.hospitalDetail(hospital.id)}
          className="font-medium text-primary hover:underline cursor-pointer"
        >
          View details &rarr;
        </Link>
      </div>
    </Card>
  );
}
