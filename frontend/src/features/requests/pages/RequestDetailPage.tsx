import { AlertTriangle, CheckCircle, Clock, HeartHandshake } from 'lucide-react';
import { useParams } from 'react-router';
import { useGetHospitalQuery } from '@/features/hospitals';
import {
  Badge,
  Button,
  Card,
  ErrorState,
  PageHeader,
  Skeleton,
} from '@/shared/ui';
import {
  useCancelRequestMutation,
  useFulfillRequestMutation,
  useGetRequestQuery,
} from '../api/requestsApi';
import { RequestStatusStrip } from '../components/RequestStatusStrip';
import { formatBloodType } from '../requests.helpers';

export function RequestDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { data: request, isLoading, isError, refetch } = useGetRequestQuery(id ?? '', {
    skip: !id,
  });

  const { data: hospital } = useGetHospitalQuery(request?.hospitalId ?? '', {
    skip: !request?.hospitalId,
  });

  const [cancelRequest, { isLoading: isCancelling }] = useCancelRequestMutation();
  const [fulfillRequest, { isLoading: isFulfilling }] = useFulfillRequestMutation();

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

  if (isError || !request) {
    return (
      <ErrorState
        message="Request could not be found or failed to load."
        onRetry={refetch}
      />
    );
  }

  const isClosed = request.status === 'fulfilled' || request.status === 'cancelled';

  return (
    <div className="flex flex-col gap-4 max-w-3xl mx-auto">
      <PageHeader
        title={`Emergency Blood Request — ${formatBloodType(request.bloodType)}`}
        description={`Request ID: ${request.id} · Posted ${new Date(request.createdAt).toLocaleString()}`}
        actions={
          !isClosed && (
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                loading={isCancelling}
                onClick={() => cancelRequest(request.id)}
              >
                Cancel Request
              </Button>
              <Button
                variant="primary"
                size="sm"
                loading={isFulfilling}
                onClick={() => fulfillRequest(request.id)}
              >
                <CheckCircle className="h-4 w-4 mr-1" />
                Mark Fulfilled
              </Button>
            </div>
          )
        }
      />

      <Card className="p-4 md:p-6 flex flex-col gap-4">
        <div className="flex items-center justify-between pb-3 border-b border-border">
          <div className="flex items-center gap-2">
            <HeartHandshake className="h-5 w-5 text-primary" />
            <h3 className="font-display font-semibold text-lg text-fg">Dispatch Progress</h3>
          </div>
          <Badge
            tone={request.urgency === 'critical' ? 'danger' : 'warning'}
            variant={request.urgency === 'critical' ? 'solid' : 'soft'}
          >
            {request.urgency.toUpperCase()}
          </Badge>
        </div>

        <RequestStatusStrip request={request} size="lg" />

        <div className="grid grid-cols-3 gap-3 pt-2 text-center">
          <div className="p-3 bg-surface-muted/50 rounded-md">
            <span className="text-[11px] text-fg-subtle uppercase block font-medium">Needed</span>
            <span className="text-xl font-display font-bold text-fg tabular-nums">
              {request.unitsNeeded}
            </span>
          </div>
          <div className="p-3 bg-primary-soft/50 rounded-md">
            <span className="text-[11px] text-primary-soft-fg uppercase block font-medium">Confirmed</span>
            <span className="text-xl font-display font-bold text-primary tabular-nums">
              {request.unitsConfirmed}
            </span>
          </div>
          <div className="p-3 bg-secondary-soft/50 rounded-md">
            <span className="text-[11px] text-secondary-soft-fg uppercase block font-medium">Fulfilled</span>
            <span className="text-xl font-display font-bold text-secondary tabular-nums">
              {request.unitsFulfilled}
            </span>
          </div>
        </div>

        {request.neededBy && (
          <div className="flex items-center gap-2 p-3 bg-warning-soft text-warning-soft-fg rounded-md text-xs">
            <Clock className="h-4 w-4 shrink-0" />
            <span>Target arrival deadline: {new Date(request.neededBy).toLocaleString()}</span>
          </div>
        )}

        {request.medicalNotes && (
          <div className="flex flex-col gap-1 p-3 bg-surface-muted/40 rounded-md text-xs">
            <span className="font-medium text-fg">Clinical Notes:</span>
            <p className="text-fg-muted">{request.medicalNotes}</p>
          </div>
        )}

        {request.patientName && (
          <div className="text-xs text-fg-muted">
            <span className="font-medium text-fg">Patient Reference:</span> {request.patientName}
          </div>
        )}

        {hospital && (
          <div className="pt-3 border-t border-border flex items-center justify-between text-xs">
            <div className="flex flex-col">
              <span className="text-fg-subtle">Requesting Hospital</span>
              <span className="font-medium text-fg">{hospital.name}</span>
            </div>
            <span className="text-fg-muted">
              {hospital.address.city}, {hospital.address.state}
            </span>
          </div>
        )}

        {isClosed && (
          <div className="flex items-center gap-2 p-3 rounded-md bg-surface-muted text-fg-muted text-xs">
            <AlertTriangle className="h-4 w-4 shrink-0" />
            <span>This request is closed ({request.status}). No more donor dispatches will occur.</span>
          </div>
        )}
      </Card>
    </div>
  );
}
