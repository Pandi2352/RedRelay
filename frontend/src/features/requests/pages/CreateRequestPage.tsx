import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router';
import { useGetHospitalsQuery } from '@/features/hospitals';
import { ROUTES } from '@/shared/constants';
import {
  Button,
  Card,
  DatePicker,
  Field,
  Input,
  PageHeader,
  Select,
  Textarea,
  TimePicker,
  type SelectOption,
} from '@/shared/ui';
import { useCreateRequestMutation } from '../api/requestsApi';
import type { BloodType, RequestUrgency } from '../types';

const bloodTypeOptions: SelectOption[] = [
  { value: 'O_NEG', label: 'O Negative (Universal Donor)', description: 'Emergency transfusions when type is unknown' },
  { value: 'O_POS', label: 'O Positive', description: 'Compatible with all positive blood groups' },
  { value: 'A_NEG', label: 'A Negative', description: 'Can donate to A+, A-, AB+, AB-' },
  { value: 'A_POS', label: 'A Positive', description: 'Can donate to A+ and AB+' },
  { value: 'B_NEG', label: 'B Negative', description: 'Can donate to B+, B-, AB+, AB-' },
  { value: 'B_POS', label: 'B Positive', description: 'Can donate to B+ and AB+' },
  { value: 'AB_NEG', label: 'AB Negative', description: 'Can donate to AB+ and AB-' },
  { value: 'AB_POS', label: 'AB Positive (Universal Recipient)', description: 'Can donate to AB+ only' },
];

const urgencyOptions: SelectOption[] = [
  { value: 'critical', label: 'Critical — Immediate Dispatch', description: 'Trauma, massive hemorrhage, active surgery (waves fire instantly)' },
  { value: 'urgent', label: 'Urgent — Needed Within 4 Hours', description: 'Scheduled ICU transfusions, rapid platelet need' },
  { value: 'standard', label: 'Standard — Needed Within 24 Hours', description: 'Pre-op reserve or scheduled replacement' },
];

export function CreateRequestPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const initialHospitalId = searchParams.get('hospitalId') ?? '';

  const { data: hospitalsData, isLoading: hospitalsLoading } = useGetHospitalsQuery();
  const [createRequest, { isLoading, error: apiError }] = useCreateRequestMutation();

  const [hospitalId, setHospitalId] = useState(initialHospitalId);
  const [bloodType, setBloodType] = useState<BloodType>('O_NEG');
  const [urgency, setUrgency] = useState<RequestUrgency>('critical');
  const [unitsNeeded, setUnitsNeeded] = useState('2');
  const [patientName, setPatientName] = useState('');
  const [neededDate, setNeededDate] = useState('');
  const [neededTime, setNeededTime] = useState('');
  const [medicalNotes, setMedicalNotes] = useState('');

  const [errors, setErrors] = useState<Record<string, string>>({});

  const hospitalOptions: SelectOption[] = (hospitalsData?.data ?? []).map((h) => ({
    value: h.id,
    label: h.name,
    description: `${h.address.city}, ${h.address.state} (${h.type})`,
  }));

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!hospitalId) errs.hospitalId = 'Please select the requesting hospital';
    const units = parseInt(unitsNeeded, 10);
    if (isNaN(units) || units < 1 || units > 20) {
      errs.unitsNeeded = 'Units needed must be between 1 and 20';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    let neededByIso: string | undefined;
    if (neededDate) {
      const timePart = neededTime ? neededTime.replace(/\s*[AP]M/i, '').trim() : '12:00';
      neededByIso = new Date(`${neededDate}T${timePart.padStart(5, '0')}:00`).toISOString();
    }

    try {
      const res = await createRequest({
        hospitalId,
        bloodType,
        urgency,
        unitsNeeded: parseInt(unitsNeeded, 10),
        patientName: patientName.trim() || undefined,
        medicalNotes: medicalNotes.trim() || undefined,
        neededBy: neededByIso,
      }).unwrap();

      navigate(ROUTES.requestDetail(res.id));
    } catch {
      // API error handled below
    }
  };

  return (
    <div className="flex flex-col gap-4 max-w-2xl mx-auto">
      <PageHeader
        title="Post Emergency Blood Request"
        description="Trigger real-time dispatch alerts to nearby eligible donors."
      />

      <Card className="p-4 md:p-6">
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <Field label="Requesting Hospital / Facility" required error={errors.hospitalId}>
            <Select
              options={hospitalOptions}
              value={hospitalId}
              onChange={setHospitalId}
              placeholder={hospitalsLoading ? 'Loading facilities...' : 'Select a hospital...'}
              disabled={hospitalsLoading}
              invalid={Boolean(errors.hospitalId)}
            />
          </Field>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <Field label="Blood Group Required" required>
              <Select
                options={bloodTypeOptions}
                value={bloodType}
                onChange={(v) => setBloodType(v as BloodType)}
              />
            </Field>

            <Field label="Units Needed" htmlFor="units-needed" required error={errors.unitsNeeded}>
              <Input
                id="units-needed"
                type="number"
                min={1}
                max={20}
                value={unitsNeeded}
                onChange={(e) => setUnitsNeeded(e.target.value)}
                invalid={Boolean(errors.unitsNeeded)}
              />
            </Field>
          </div>

          <Field label="Urgency Level" required>
            <Select
              options={urgencyOptions}
              value={urgency}
              onChange={(v) => setUrgency(v as RequestUrgency)}
            />
          </Field>

          <div className="pt-2 border-t border-border">
            <h4 className="text-xs font-semibold text-fg uppercase mb-2">Schedule & Time Constraint</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <Field label="Required By Date" hint="Optional deadline for donor arrival">
                <DatePicker
                  value={neededDate}
                  onChange={setNeededDate}
                  placeholder="Select deadline date..."
                />
              </Field>

              <Field label="Required By Time" hint="Specific hour for transfusion">
                <TimePicker
                  value={neededTime}
                  onChange={setNeededTime}
                  format="12h"
                  placeholder="Select deadline time..."
                />
              </Field>
            </div>
          </div>

          <div className="pt-2 border-t border-border">
            <h4 className="text-xs font-semibold text-fg uppercase mb-2">Patient & Clinical Context</h4>
            <div className="flex flex-col gap-3">
              <Field label="Patient Identifier / Case ID" htmlFor="patient-id" hint="Never expose private medical records">
                <Input
                  id="patient-id"
                  value={patientName}
                  onChange={(e) => setPatientName(e.target.value)}
                  placeholder="e.g. Case #TR-4091 or ICU Bed 4"
                />
              </Field>

              <Field label="Medical Notes & Instructions" htmlFor="med-notes" hint="Seen by responding staff and verified donors">
                <Textarea
                  id="med-notes"
                  value={medicalNotes}
                  onChange={(e) => setMedicalNotes(e.target.value)}
                  placeholder="e.g. Blood required for urgent coronary bypass. Report directly to Level 2 Blood Bank."
                />
              </Field>
            </div>
          </div>

          {apiError && (
            <p className="text-xs text-danger">Failed to post blood request. Please check fields and retry.</p>
          )}

          <div className="pt-3 border-t border-border flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => navigate(ROUTES.requests)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" variant="primary" loading={isLoading}>
              Broadcast Dispatch Alert
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
