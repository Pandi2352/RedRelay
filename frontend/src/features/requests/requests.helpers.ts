import type { BloodType } from './types';

export function formatBloodType(bt: BloodType): string {
  const map: Record<BloodType, string> = {
    A_POS: 'A+',
    A_NEG: 'A-',
    B_POS: 'B+',
    B_NEG: 'B-',
    AB_POS: 'AB+',
    AB_NEG: 'AB-',
    O_POS: 'O+',
    O_NEG: 'O-',
  };
  return map[bt] ?? bt;
}

export function calculateElapsedMinutes(isoDate: string, nowMs = Date.now()): number {
  const diff = Math.floor((nowMs - new Date(isoDate).getTime()) / 60000);
  return Math.max(0, diff);
}
