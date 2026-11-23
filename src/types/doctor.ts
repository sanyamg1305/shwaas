export interface Pulmonologist {
  id: string;
  name: string;
  clinicName: string;
  address: string;
  phone?: string;
  distanceKm?: number;
  latitude?: number;
  longitude?: number;
  rating?: number;
  isSaved?: boolean;
  notes?: string;
}

export interface DoctorAppointment {
  id: string;
  doctorName: string;
  clinicName: string;
  phone?: string;
  dateTime: string; // ISO date string
  visitType: 'Routine 3-Month Checkup' | 'Symptom Flare-up / Exacerbation' | 'Spirometry Test' | 'Medication Review' | 'Other';
  status: 'Scheduled' | 'Completed' | 'Cancelled';
  questionsForDoctor: string[];
  spirometry?: {
    fev1Percent?: number;
    fev1FvcRatio?: number;
    spo2Percent?: number;
  };
  doctorAdviceNotes?: string;
  prescribedChanges?: string;
  nextFollowupDate?: string;
}
