import { AlertCircle, Clock } from 'lucide-react';
import { Link } from 'react-router';
import { ROUTES } from '@/shared/constants';
import { Badge, Card } from '@/shared/ui';
import type { BloodRequest, RequestStatus, RequestUrgency } from '../types';
import { RequestStatusStrip } from './RequestStatusStrip';

interface RequestCardProps {
  request: BloodRequest;
  hospitalName?: string;
}

function getUrgencyBadge(urgency: RequestUrgency) {
  switch (urgency) {
    case 'critical':
      return (
        <Badge tone="danger" variant="solid" className="gap-1 animate-pulse">
          <AlertCircle className="h-3 w-3" />
          Critical &bull; Immediate
        </Badge>
      );
    case 'urgent':
      return (
        <Badge tone="warning" variant="soft">
          Urgent &bull; 4h
        </Badge>
      );
    case 'standard':
      return (
        <Badge tone="secondary" variant="soft">
          Standard
        </Badge>
      );
  }
}

function getStatusTone(status: RequestStatus): 'primary' | 'secondary' | 'success' | 'danger' | 'neutral' {
  switch (status) {
    case 'open':
      return 'primary';
    case 'partially_matched':
    case 'fully_matched':
      return 'secondary';
    case 'fulfilled':
      return 'success';
    case 'cancelled':
    case 'expired':
      return 'danger';
    default:
      return 'neutral';
  }
}

export function RequestCard({ request, hospitalName }: RequestCardProps) {
  return (
    <Card className="p-4 flex flex-col justify-between gap-3 transition-colors hover:border-border-strong">
      <div className="flex flex-col gap-2.5">
        <div className="flex items-center justify-between gap-2">
          {getUrgencyBadge(request.urgency)}
          <Badge tone={getStatusTone(request.status)} variant="soft">
            {request.status.replace('_', ' ')}
          </Badge>
        </div>

        <RequestStatusStrip request={request} />

        {hospitalName && (
          <span className="text-xs font-medium text-fg truncate">
            {hospitalName}
          </span>
        )}

        {request.neededBy && (
          <div className="flex items-center gap-1.5 text-xs text-fg-muted">
            <Clock className="h-3.5 w-3.5 text-fg-subtle shrink-0" />
            <span>Needed by: {new Date(request.neededBy).toLocaleDateString()}</span>
          </div>
        )}

        {request.medicalNotes && (
          <p className="text-xs text-fg-muted line-clamp-2 bg-surface-muted/40 p-2 rounded-md">
            {request.medicalNotes}
          </p>
        )}
      </div>

      <div className="pt-2 border-t border-border flex items-center justify-between text-xs">
        <span className="text-fg-subtle font-mono text-[11px]">ID: {request.id.slice(0, 8)}</span>
        <Link
          to={ROUTES.requestDetail(request.id)}
          className="font-medium text-primary hover:underline cursor-pointer"
        >
          Dispatch details &rarr;
        </Link>
      </div>
    </Card>
  );
}
