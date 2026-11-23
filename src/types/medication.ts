export type MedicationType = 'Controller / Maintenance' | 'Fast-Acting Rescue' | 'Oral / Pill' | 'Nebulizer Solution';

export type TimeOfDay = 'Morning' | 'Afternoon' | 'Evening' | 'Bedtime' | 'As Needed';

export interface Medication {
  id: string;
  name: string;
  genericName?: string;
  type: MedicationType;
  dosage: string; // e.g. "2 puffs", "1 capsule"
  schedule: TimeOfDay[];
  isInhaler: boolean;
  totalPuffs?: number;
  remainingPuffs?: number;
  refillReminderThreshold?: number; // e.g. warn when < 20 puffs remain
  notes?: string;
  color?: string;
}

export interface MedicationDoseLog {
  id: string;
  medicationId: string;
  medicationName: string;
  timeSlot: TimeOfDay;
  date: string; // YYYY-MM-DD
  takenAt: string; // ISO string
  status: 'taken' | 'skipped';
  isRescueDose?: boolean;
}
