import { useState } from 'react';
import { useNavigate } from 'react-router';
import { ROUTES } from '@/shared/constants';
import {
  Button,
  Card,
  Field,
  Input,
  PageHeader,
  Select,
  type SelectOption,
} from '@/shared/ui';
import { useCreateHospitalMutation } from '../api/hospitalsApi';
import type { HospitalType } from '../types';

const hospitalTypeOptions: SelectOption[] = [
  { value: 'government', label: 'Government / Public Hospital', description: 'State or municipal medical center' },
  { value: 'private', label: 'Private Healthcare Facility', description: 'Private hospital, trust, or nursing home' },
  { value: 'military', label: 'Military Hospital', description: 'Defense medical facility' },
  { value: 'clinic', label: 'Clinic / Trauma Center', description: 'Emergency outpatient trauma clinic' },
];

export function CreateHospitalPage() {
  const navigate = useNavigate();
  const [createHospital, { isLoading, error: apiError }] = useCreateHospitalMutation();

  const [name, setName] = useState('');
  const [licenseNumber, setLicenseNumber] = useState('');
  const [type, setType] = useState<HospitalType>('private');
  const [street, setStreet] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [phone, setPhone] = useState('');
  const [emergencyPhone, setEmergencyPhone] = useState('');
  const [email, setEmail] = useState('');
  const [lat, setLat] = useState('13.0827');
  const [lng, setLng] = useState('80.2707');
  const [hasBloodBank, setHasBloodBank] = useState(false);
  const [capacity, setCapacity] = useState('50');

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!name.trim()) errs.name = 'Hospital name is required';
    if (!licenseNumber.trim()) errs.licenseNumber = 'License number is required';
    if (!street.trim()) errs.street = 'Street address is required';
    if (!city.trim()) errs.city = 'City is required';
    if (!state.trim()) errs.state = 'State is required';
    if (!phone.trim()) errs.phone = 'Contact phone is required';
    if (!email.trim() || !email.includes('@')) errs.email = 'Valid email is required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      const res = await createHospital({
        name,
        licenseNumber,
        type,
        address: {
          street,
          city,
          state,
          postalCode: postalCode || '600001',
          country: 'India',
        },
        location: {
          type: 'Point',
          coordinates: [parseFloat(lng) || 80.2707, parseFloat(lat) || 13.0827],
        },
        contact: {
          phone,
          emergencyPhone: emergencyPhone || phone,
          email,
        },
        bloodBank: {
          hasBloodBank,
          storageUnitsCapacity: hasBloodBank ? parseInt(capacity, 10) || 50 : undefined,
        },
      }).unwrap();

      navigate(ROUTES.hospitalDetail(res.id));
    } catch {
      // Handled via apiError
    }
  };

  return (
    <div className="flex flex-col gap-4 max-w-2xl mx-auto">
      <PageHeader
        title="Register New Hospital"
        description="Add a verified medical center to the RedRelay emergency dispatch network."
      />

      <Card className="p-4 md:p-6">
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <Field label="Hospital Name" htmlFor="h-name" required error={errors.name}>
              <Input
                id="h-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Apollo Speciality Hospital"
                invalid={Boolean(errors.name)}
              />
            </Field>

            <Field label="License Number" htmlFor="h-lic" required error={errors.licenseNumber}>
              <Input
                id="h-lic"
                value={licenseNumber}
                onChange={(e) => setLicenseNumber(e.target.value)}
                placeholder="e.g. TN-MED-2026-9812"
                invalid={Boolean(errors.licenseNumber)}
              />
            </Field>
          </div>

          <Field label="Hospital Classification">
            <Select
              options={hospitalTypeOptions}
              value={type}
              onChange={(val) => setType(val as HospitalType)}
            />
          </Field>

          <div className="pt-2 border-t border-border">
            <h4 className="text-xs font-semibold text-fg uppercase mb-2">Location & Address</h4>
            <div className="flex flex-col gap-3">
              <Field label="Street Address" htmlFor="h-street" required error={errors.street}>
                <Input
                  id="h-street"
                  value={street}
                  onChange={(e) => setStreet(e.target.value)}
                  placeholder="e.g. 21 Greams Lane, Thousand Lights"
                  invalid={Boolean(errors.street)}
                />
              </Field>

              <div className="grid grid-cols-3 gap-2">
                <Field label="City" htmlFor="h-city" required error={errors.city}>
                  <Input
                    id="h-city"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="Chennai"
                    invalid={Boolean(errors.city)}
                  />
                </Field>
                <Field label="State" htmlFor="h-state" required error={errors.state}>
                  <Input
                    id="h-state"
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    placeholder="Tamil Nadu"
                    invalid={Boolean(errors.state)}
                  />
                </Field>
                <Field label="Postal Code" htmlFor="h-pin">
                  <Input
                    id="h-pin"
                    value={postalCode}
                    onChange={(e) => setPostalCode(e.target.value)}
                    placeholder="600006"
                  />
                </Field>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <Field label="Latitude" htmlFor="h-lat" hint="Used for nearest donor dispatch">
                  <Input id="h-lat" value={lat} onChange={(e) => setLat(e.target.value)} />
                </Field>
                <Field label="Longitude" htmlFor="h-lng" hint="GeoJSON coordinates">
                  <Input id="h-lng" value={lng} onChange={(e) => setLng(e.target.value)} />
                </Field>
              </div>
            </div>
          </div>

          <div className="pt-2 border-t border-border">
            <h4 className="text-xs font-semibold text-fg uppercase mb-2">Contact & Emergency</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <Field label="Contact Phone" htmlFor="h-phone" required error={errors.phone}>
                <Input
                  id="h-phone"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 44 2829 0200"
                  invalid={Boolean(errors.phone)}
                />
              </Field>
              <Field label="Emergency Hotline" htmlFor="h-ephone">
                <Input
                  id="h-ephone"
                  value={emergencyPhone}
                  onChange={(e) => setEmergencyPhone(e.target.value)}
                  placeholder="+91 44 2829 9999"
                />
              </Field>
              <Field label="Official Email" htmlFor="h-email" required error={errors.email}>
                <Input
                  id="h-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="bloodbank@hospital.org"
                  invalid={Boolean(errors.email)}
                />
              </Field>
              <div className="flex flex-col gap-2 pt-2">
                <div className="flex items-center gap-2">
                  <input
                    id="h-bloodbank"
                    type="checkbox"
                    checked={hasBloodBank}
                    onChange={(e) => setHasBloodBank(e.target.checked)}
                    className="h-4 w-4 rounded-sm border-border-strong text-primary focus:ring-primary cursor-pointer"
                  />
                  <label htmlFor="h-bloodbank" className="text-xs text-fg cursor-pointer select-none">
                    Facility operates an on-site Blood Bank
                  </label>
                </div>
                {hasBloodBank && (
                  <Field label="Storage Units Capacity" htmlFor="h-cap">
                    <Input
                      id="h-cap"
                      type="number"
                      min={1}
                      value={capacity}
                      onChange={(e) => setCapacity(e.target.value)}
                      placeholder="e.g. 50"
                    />
                  </Field>
                )}
              </div>
            </div>
          </div>

          {apiError && (
            <p className="text-xs text-danger">Failed to register hospital. Check fields and try again.</p>
          )}

          <div className="pt-3 border-t border-border flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => navigate(ROUTES.hospitals)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" variant="primary" loading={isLoading}>
              Complete Registration
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
