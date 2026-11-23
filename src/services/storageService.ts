import { SymptomLogEntry, CATQuestion } from '../types/copd';
import { DoctorAppointment, Pulmonologist } from '../types/doctor';
import { Medication, MedicationDoseLog } from '../types/medication';
import { BreathingSessionLog } from '../types/breathing';

const STORAGE_KEYS = {
  CAT_QUESTIONS: 'shwaas_cat_questions',
  SYMPTOM_LOGS: 'shwaas_symptom_logs',
  PATIENT_NAME: 'shwaas_patient_name',
  DOCTOR_APPOINTMENTS: 'shwaas_doctor_appointments',
  SAVED_PULMONOLOGISTS: 'shwaas_saved_pulmonologists',
  MEDICATIONS: 'shwaas_medications',
  MEDICATION_LOGS: 'shwaas_medication_logs',
  BREATHING_LOGS: 'shwaas_breathing_logs',
  SEEDED_FLAG: 'shwaas_indian_seeded_v2',
};

// Official COPD Assessment Test™ (CAT) Questions from user document
export const OFFICIAL_CAT_QUESTIONS: CATQuestion[] = [
  {
    id: 'cat-1-cough',
    leftAnchor: 'I never cough',
    rightAnchor: 'I cough all the time',
    min: 0,
    max: 5,
  },
  {
    id: 'cat-2-phlegm',
    leftAnchor: 'I have no phlegm (mucus) on my chest at all',
    rightAnchor: 'My chest is full of phlegm (mucus)',
    min: 0,
    max: 5,
  },
  {
    id: 'cat-3-tightness',
    leftAnchor: 'My chest does not feel tight at all',
    rightAnchor: 'My chest feels very tight',
    min: 0,
    max: 5,
  },
  {
    id: 'cat-4-breathlessness',
    leftAnchor: 'When I walk up a hill or a flight of stairs I am not out of breath',
    rightAnchor: 'When I walk up a hill or a flight of stairs I am completely out of breath',
    min: 0,
    max: 5,
  },
  {
    id: 'cat-5-activities',
    leftAnchor: 'I am not limited to doing any activities at home',
    rightAnchor: 'I am completely limited to doing all activities at home',
    min: 0,
    max: 5,
  },
  {
    id: 'cat-6-confidence',
    leftAnchor: 'I am confident leaving my home despite my lung condition',
    rightAnchor: 'I am not confident leaving my home at all because of my lung condition',
    min: 0,
    max: 5,
  },
  {
    id: 'cat-7-sleep',
    leftAnchor: 'I sleep soundly',
    rightAnchor: 'I do not sleep soundly because of my lung condition',
    min: 0,
    max: 5,
  },
  {
    id: 'cat-8-energy',
    leftAnchor: 'I have lots of energy',
    rightAnchor: 'I have no energy at all',
    min: 0,
    max: 5,
  },
];

// Rich Indian dummy data for Doctor Appointments & Follow-ups in Mumbai (Near 400022)
export const DUMMY_APPOINTMENTS: DoctorAppointment[] = [
  {
    id: 'appt-mumbai-1',
    doctorName: 'Dr. Zarir Udwadia, MD, FRCP, FCCP',
    clinicName: 'P.D. Hinduja National Hospital & Medical Research Centre (Mahim West)',
    phone: '+91 22 2445 1515',
    dateTime: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000 + 2 * 60 * 60 * 1000).toISOString(), // 5 days from now at 10:30 AM
    visitType: 'Routine 3-Month Checkup',
    status: 'Scheduled',
    questionsForDoctor: [
      'Should I continue using the Cipla Zerostat VT spacer with my Foracort inhaler?',
      'My morning cough produces light yellow phlegm—do we need antibiotics or just hydration and steam?',
      'Is my resting blood oxygen (SpO2 94%) safe during light evening walks in Shivaji Park / Sion Fort garden?',
      'Am I due for an updated Pneumococcal (Prevnar 20) and annual influenza booster vaccine?'
    ],
    doctorAdviceNotes: 'Please carry your past CAT survey score sheet and both inhalers (Foracort & Asthalin) to demonstrate inhalation technique.',
  },
  {
    id: 'appt-mumbai-2',
    doctorName: 'Dr. Sanjeev Mehta, MD (Chest & Respiratory Diseases)',
    clinicName: 'S.L. Raheja Hospital - Fortis Associate (Mahim/Sion Link Rd)',
    phone: '+91 22 6652 9999',
    dateTime: new Date(Date.now() + 18 * 24 * 60 * 60 * 1000 + 4 * 60 * 60 * 1000).toISOString(), // 18 days from now
    visitType: 'Spirometry Test',
    status: 'Scheduled',
    questionsForDoctor: [
      'Will this spirometry test determine whether my FEV1 has improved since starting Tiova Rotacaps?',
      'Can we evaluate post-bronchodilator reversibility?'
    ],
  },
  {
    id: 'appt-mumbai-3',
    doctorName: 'Department of Pulmonary Medicine (OPD)',
    clinicName: 'Lokmanya Tilak Municipal General Hospital (Sion Hospital, Mumbai 400022)',
    phone: '+91 22 2407 6381',
    dateTime: new Date(Date.now() - 32 * 24 * 60 * 60 * 1000).toISOString(), // 32 days ago
    visitType: 'Medication Review',
    status: 'Completed',
    questionsForDoctor: [
      'Rinsing mouth after steroid inhaler to prevent oral thrush',
      'Handling high particulate matter (PM2.5) during Mumbai winter smog'
    ],
    spirometry: {
      fev1Percent: 57,
      fev1FvcRatio: 0.62,
      spo2Percent: 94,
    },
    doctorAdviceNotes: 'Bilateral vesicular breath sounds with mild basal rhonchi. Advised daily Pursed-Lip and Diaphragmatic breathing (Shwaas exercises 1.1 & 2.1). Maintained Foracort 200 twice daily with Zerostat spacer. Carry Asthalin rescue inhaler at all times.',
    prescribedChanges: 'Maintained Foracort 200 (Formoterol + Budesonide) 2 puffs BID. Asthalin 100mcg PRN for acute breathlessness.',
    nextFollowupDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'appt-mumbai-4',
    doctorName: 'K.J. Somaiya Medical College & Hospital (Chest Dept)',
    clinicName: 'Somaiya Ayurvihar Complex (Sion East, Mumbai 400022)',
    phone: '+91 22 5095 4700',
    dateTime: new Date(Date.now() - 105 * 24 * 60 * 60 * 1000).toISOString(), // 105 days ago
    visitType: 'Symptom Flare-up / Exacerbation',
    status: 'Completed',
    questionsForDoctor: [
      'Acute wheezing following sudden climate change in Mumbai monsoon',
      'Need for nebulization or oral corticosteroids'
    ],
    spirometry: {
      fev1Percent: 51,
      spo2Percent: 92,
    },
    doctorAdviceNotes: 'Mild COPD exacerbation secondary to viral bronchial infection. Responded well to 5-day oral Deflazacort 6mg course and Duolin nebulization. Patient counselled on avoiding damp monsoon environments and early warning signs.',
  }
];

// Rich Indian dummy CAT symptom logs
export const DUMMY_SYMPTOM_LOGS: SymptomLogEntry[] = [
  {
    id: 'cat-log-1',
    patientName: 'Ramesh Sharma',
    date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    answers: {
      'cat-1-cough': 2,
      'cat-2-phlegm': 1,
      'cat-3-tightness': 1,
      'cat-4-breathlessness': 3,
      'cat-5-activities': 2,
      'cat-6-confidence': 2,
      'cat-7-sleep': 1,
      'cat-8-energy': 2,
    },
    totalScore: 14,
    maxPossibleScore: 40,
    severityLevel: 'Medium Impact',
    clinicalAdvice: 'COPD is having a moderate impact. Breathlessness is noticeable when climbing Sion station foot-over-bridge. Good adherence to Foracort inhaler and morning pursed-lip breathing.',
    notes: 'Climbing stairs at Sion station caused mild breathlessness. Settled within 3 minutes using forward-leaning posture.',
    rescuePuffsUsedToday: 1,
  },
  {
    id: 'cat-log-2',
    patientName: 'Ramesh Sharma',
    date: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
    answers: {
      'cat-1-cough': 3,
      'cat-2-phlegm': 3,
      'cat-3-tightness': 2,
      'cat-4-breathlessness': 4,
      'cat-5-activities': 3,
      'cat-6-confidence': 3,
      'cat-7-sleep': 2,
      'cat-8-energy': 3,
    },
    totalScore: 23,
    maxPossibleScore: 40,
    severityLevel: 'High Impact',
    clinicalAdvice: 'High impact score. High PM2.5 levels along Eastern Express Highway triggered persistent coughing. Avoid morning outdoor walks on smoggy days; wear an N95 mask.',
    notes: 'Heavy vehicle dust along Sion-Bandra link road. Chest tightness in evening; took 2 puffs of Asthalin rescue inhaler.',
    rescuePuffsUsedToday: 2,
  },
  {
    id: 'cat-log-3',
    patientName: 'Ramesh Sharma',
    date: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
    answers: {
      'cat-1-cough': 1,
      'cat-2-phlegm': 1,
      'cat-3-tightness': 1,
      'cat-4-breathlessness': 2,
      'cat-5-activities': 1,
      'cat-6-confidence': 1,
      'cat-7-sleep': 1,
      'cat-8-energy': 1,
    },
    totalScore: 9,
    maxPossibleScore: 40,
    severityLevel: 'Low Impact',
    clinicalAdvice: 'Excellent control today! Clean sea breeze and low air pollution index. Continue regular maintenance inhalers.',
    notes: 'Pleasant morning air. Completed 10 minutes of diaphragmatic breathing without any shortness of breath.',
    rescuePuffsUsedToday: 0,
  },
  {
    id: 'cat-log-4',
    patientName: 'Ramesh Sharma',
    date: new Date(Date.now() - 19 * 24 * 60 * 60 * 1000).toISOString(),
    answers: {
      'cat-1-cough': 4,
      'cat-2-phlegm': 4,
      'cat-3-tightness': 3,
      'cat-4-breathlessness': 5,
      'cat-5-activities': 4,
      'cat-6-confidence': 4,
      'cat-7-sleep': 3,
      'cat-8-energy': 4,
    },
    totalScore: 31,
    maxPossibleScore: 40,
    severityLevel: 'Very High Impact',
    clinicalAdvice: 'Acute symptom spike. Yellow-zone flare-up. Contacted Dr. Udwadia’s Hinduja clinic triage and took prescribed rescue doses.',
    notes: 'Exacerbation episode. Persistent wheezing and thick yellow phlegm. Stayed indoors with air purifier.',
    rescuePuffsUsedToday: 4,
  }
];

// Top Saved Pulmonologists in Mumbai around PIN 400022
export const DUMMY_SAVED_PULMONOLOGISTS: Pulmonologist[] = [
  {
    id: 'doc-sion-1',
    name: 'Department of Pulmonary Medicine - Sion Hospital (LTMMC)',
    clinicName: 'Lokmanya Tilak Municipal General Hospital & Medical College',
    address: 'Sulochana Shetty Marg, Sion West, Mumbai, Maharashtra 400022',
    phone: '+91 22 2407 6381',
    distanceKm: 0.5,
    rating: 4.8,
    notes: 'Primary Government Tertiary Hospital in PIN 400022. Dedicated OPD 14 (Chest Medicine), 24/7 ICU & subsidized pulmonary rehab.',
    isSaved: true,
  },
  {
    id: 'doc-sion-3',
    name: 'Dr. Zarir Udwadia, MD, FRCP, FCCP',
    clinicName: 'P.D. Hinduja National Hospital & Medical Research Centre',
    address: 'Veer Savarkar Marg, Mahim West, Mumbai 400016 (3.2 km from Sion Circle)',
    phone: '+91 22 2445 1515',
    distanceKm: 3.2,
    rating: 5.0,
    notes: 'Senior Consultant Chest Physician. Global pioneer in severe COPD, asthma, and complex pulmonary disorders.',
    isSaved: true,
  },
  {
    id: 'doc-sion-2',
    name: 'K.J. Somaiya Hospital & Research Centre (Chest Dept)',
    clinicName: 'Somaiya Ayurvihar Complex',
    address: 'Eastern Express Highway, Near Everard Nagar, Sion East, Mumbai, Maharashtra 400022',
    phone: '+91 22 5095 4700',
    distanceKm: 0.9,
    rating: 4.7,
    notes: 'Full Spirometry (PFT) suite, broncho-alveolar lavage, and multi-specialty respiratory emergency care in Sion East 400022.',
    isSaved: true,
  }
];

// Standard Indian Respiratory Medications (Cipla, Sun Pharma, Lupin)
export const DEFAULT_MEDICATIONS: Medication[] = [
  {
    id: 'med-in-1',
    name: 'Foracort 200 Inhaler (Cipla)',
    genericName: 'Formoterol Fumarate (6mcg) + Budesonide (200mcg)',
    type: 'Controller / Maintenance',
    dosage: '2 puffs twice daily with Zerostat Spacer',
    schedule: ['Morning', 'Evening'],
    isInhaler: true,
    totalPuffs: 120,
    remainingPuffs: 86,
    refillReminderThreshold: 20,
    notes: 'Daily maintenance controller. Always rinse mouth with water & spit after use.',
    color: '#0d9488',
  },
  {
    id: 'med-in-2',
    name: 'Asthalin Inhaler (Cipla)',
    genericName: 'Salbutamol / Albuterol (100mcg)',
    type: 'Fast-Acting Rescue',
    dosage: '1 to 2 puffs immediately during acute breathlessness or wheezing',
    schedule: ['As Needed'],
    isInhaler: true,
    totalPuffs: 200,
    remainingPuffs: 164,
    refillReminderThreshold: 25,
    notes: 'Always carry in pocket/bag. Wait 1 min between consecutive puffs.',
    color: '#ef4444',
  },
  {
    id: 'med-in-3',
    name: 'Tiova Inhaler / Rotacaps (Cipla)',
    genericName: 'Tiotropium Bromide (9mcg / 18mcg)',
    type: 'Controller / Maintenance',
    dosage: '2 puffs once daily in the morning',
    schedule: ['Morning'],
    isInhaler: true,
    totalPuffs: 60,
    remainingPuffs: 42,
    refillReminderThreshold: 10,
    notes: 'Long-Acting Muscarinic Antagonist (LAMA). Relaxes airway smooth muscles for 24 hours.',
    color: '#3b82f6',
  },
];

// Indian today dose logs
const todayDateStr = new Date().toISOString().split('T')[0];
export const DUMMY_MEDICATION_LOGS: MedicationDoseLog[] = [
  {
    id: 'dose-log-1',
    medicationId: 'med-in-1',
    medicationName: 'Foracort 200 Inhaler (Cipla)',
    timeSlot: 'Morning',
    date: todayDateStr,
    takenAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
    status: 'taken',
  },
  {
    id: 'dose-log-2',
    medicationId: 'med-in-3',
    medicationName: 'Tiova Inhaler (Cipla)',
    timeSlot: 'Morning',
    date: todayDateStr,
    takenAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
    status: 'taken',
  },
];

export const DUMMY_BREATHING_LOGS: BreathingSessionLog[] = [
  {
    id: 'breath-log-1',
    techniqueId: 'pursed-lip',
    techniqueName: 'Pursed-Lip Breathing (Shwaas 2.1)',
    durationSeconds: 300,
    completedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'breath-log-2',
    techniqueId: 'diaphragmatic',
    techniqueName: 'Diaphragmatic Breathing (Shwaas 1.1)',
    durationSeconds: 480,
    completedAt: new Date(Date.now() - 26 * 60 * 60 * 1000).toISOString(),
  },
];

export const storage = {
  // Ensure Indian dummy data is auto-seeded when the app opens
  ensureIndianDataSeeded: () => {
    try {
      const seeded = localStorage.getItem(STORAGE_KEYS.SEEDED_FLAG);
      if (!seeded) {
        storage.reloadAllDummyData();
        localStorage.setItem(STORAGE_KEYS.SEEDED_FLAG, 'true');
      }
    } catch {
      // ignore
    }
  },

  // Patient Name
  getPatientName: (): string => {
    try {
      return localStorage.getItem(STORAGE_KEYS.PATIENT_NAME) || 'Ramesh Sharma';
    } catch {
      return 'Ramesh Sharma';
    }
  },
  setPatientName: (name: string) => {
    localStorage.setItem(STORAGE_KEYS.PATIENT_NAME, name);
  },

  // CAT Questions
  getCATQuestions: (): CATQuestion[] => {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.CAT_QUESTIONS);
      return data ? JSON.parse(data) : OFFICIAL_CAT_QUESTIONS;
    } catch {
      return OFFICIAL_CAT_QUESTIONS;
    }
  },
  setCATQuestions: (questions: CATQuestion[]) => {
    localStorage.setItem(STORAGE_KEYS.CAT_QUESTIONS, JSON.stringify(questions));
  },

  // Symptom Logs
  getSymptomLogs: (): SymptomLogEntry[] => {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.SYMPTOM_LOGS);
      if (data) {
        const parsed = JSON.parse(data);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
      localStorage.setItem(STORAGE_KEYS.SYMPTOM_LOGS, JSON.stringify(DUMMY_SYMPTOM_LOGS));
      return DUMMY_SYMPTOM_LOGS;
    } catch {
      return DUMMY_SYMPTOM_LOGS;
    }
  },
  saveSymptomLog: (entry: SymptomLogEntry) => {
    const logs = storage.getSymptomLogs();
    const updated = [entry, ...logs.filter(l => l.id !== entry.id)];
    localStorage.setItem(STORAGE_KEYS.SYMPTOM_LOGS, JSON.stringify(updated));
    return updated;
  },
  deleteSymptomLog: (id: string) => {
    const logs = storage.getSymptomLogs().filter(l => l.id !== id);
    localStorage.setItem(STORAGE_KEYS.SYMPTOM_LOGS, JSON.stringify(logs));
    return logs;
  },

  // Doctor Appointments
  getDoctorAppointments: (): DoctorAppointment[] => {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.DOCTOR_APPOINTMENTS);
      if (data) {
        const parsed = JSON.parse(data);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
      localStorage.setItem(STORAGE_KEYS.DOCTOR_APPOINTMENTS, JSON.stringify(DUMMY_APPOINTMENTS));
      return DUMMY_APPOINTMENTS;
    } catch {
      return DUMMY_APPOINTMENTS;
    }
  },
  saveDoctorAppointment: (appt: DoctorAppointment) => {
    const appts = storage.getDoctorAppointments();
    const existingIndex = appts.findIndex(a => a.id === appt.id);
    let updated: DoctorAppointment[];
    if (existingIndex >= 0) {
      updated = [...appts];
      updated[existingIndex] = appt;
    } else {
      updated = [appt, ...appts];
    }
    updated.sort((a, b) => new Date(b.dateTime).getTime() - new Date(a.dateTime).getTime());
    localStorage.setItem(STORAGE_KEYS.DOCTOR_APPOINTMENTS, JSON.stringify(updated));
    return updated;
  },
  deleteDoctorAppointment: (id: string) => {
    const appts = storage.getDoctorAppointments().filter(a => a.id !== id);
    localStorage.setItem(STORAGE_KEYS.DOCTOR_APPOINTMENTS, JSON.stringify(appts));
    return appts;
  },

  // Pulmonologists
  getSavedPulmonologists: (): Pulmonologist[] => {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.SAVED_PULMONOLOGISTS);
      if (data) {
        const parsed = JSON.parse(data);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
      localStorage.setItem(STORAGE_KEYS.SAVED_PULMONOLOGISTS, JSON.stringify(DUMMY_SAVED_PULMONOLOGISTS));
      return DUMMY_SAVED_PULMONOLOGISTS;
    } catch {
      return DUMMY_SAVED_PULMONOLOGISTS;
    }
  },
  savePulmonologist: (doc: Pulmonologist) => {
    const docs = storage.getSavedPulmonologists();
    const updated = [doc, ...docs.filter(d => d.id !== doc.id)];
    localStorage.setItem(STORAGE_KEYS.SAVED_PULMONOLOGISTS, JSON.stringify(updated));
    return updated;
  },
  removeSavedPulmonologist: (id: string) => {
    const docs = storage.getSavedPulmonologists().filter(d => d.id !== id);
    localStorage.setItem(STORAGE_KEYS.SAVED_PULMONOLOGISTS, JSON.stringify(docs));
    return docs;
  },

  // Medications
  getMedications: (): Medication[] => {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.MEDICATIONS);
      if (data) {
        const parsed = JSON.parse(data);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
      localStorage.setItem(STORAGE_KEYS.MEDICATIONS, JSON.stringify(DEFAULT_MEDICATIONS));
      return DEFAULT_MEDICATIONS;
    } catch {
      return DEFAULT_MEDICATIONS;
    }
  },
  saveMedication: (med: Medication) => {
    const meds = storage.getMedications();
    const idx = meds.findIndex(m => m.id === med.id);
    let updated: Medication[];
    if (idx >= 0) {
      updated = [...meds];
      updated[idx] = med;
    } else {
      updated = [...meds, med];
    }
    localStorage.setItem(STORAGE_KEYS.MEDICATIONS, JSON.stringify(updated));
    return updated;
  },
  deleteMedication: (id: string) => {
    const meds = storage.getMedications().filter(m => m.id !== id);
    localStorage.setItem(STORAGE_KEYS.MEDICATIONS, JSON.stringify(meds));
    return meds;
  },
  decrementInhalerPuff: (medicationId: string, puffs: number = 1): Medication[] => {
    const meds = storage.getMedications().map(med => {
      if (med.id === medicationId && med.remainingPuffs !== undefined) {
        return {
          ...med,
          remainingPuffs: Math.max(0, med.remainingPuffs - puffs),
        };
      }
      return med;
    });
    localStorage.setItem(STORAGE_KEYS.MEDICATIONS, JSON.stringify(meds));
    return meds;
  },
  refillInhaler: (medicationId: string): Medication[] => {
    const meds = storage.getMedications().map(med => {
      if (med.id === medicationId && med.totalPuffs) {
        return {
          ...med,
          remainingPuffs: med.totalPuffs,
        };
      }
      return med;
    });
    localStorage.setItem(STORAGE_KEYS.MEDICATIONS, JSON.stringify(meds));
    return meds;
  },

  // Medication Logs
  getMedicationLogs: (): MedicationDoseLog[] => {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.MEDICATION_LOGS);
      if (data) {
        const parsed = JSON.parse(data);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
      localStorage.setItem(STORAGE_KEYS.MEDICATION_LOGS, JSON.stringify(DUMMY_MEDICATION_LOGS));
      return DUMMY_MEDICATION_LOGS;
    } catch {
      return DUMMY_MEDICATION_LOGS;
    }
  },
  logMedicationDose: (log: MedicationDoseLog) => {
    const logs = storage.getMedicationLogs();
    const updated = [log, ...logs];
    localStorage.setItem(STORAGE_KEYS.MEDICATION_LOGS, JSON.stringify(updated));
    return updated;
  },

  // Breathing logs
  getBreathingLogs: (): BreathingSessionLog[] => {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.BREATHING_LOGS);
      if (data) {
        const parsed = JSON.parse(data);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
      localStorage.setItem(STORAGE_KEYS.BREATHING_LOGS, JSON.stringify(DUMMY_BREATHING_LOGS));
      return DUMMY_BREATHING_LOGS;
    } catch {
      return DUMMY_BREATHING_LOGS;
    }
  },
  logBreathingSession: (session: BreathingSessionLog) => {
    const sessions = storage.getBreathingLogs();
    const updated = [session, ...sessions];
    localStorage.setItem(STORAGE_KEYS.BREATHING_LOGS, JSON.stringify(updated));
    return updated;
  },

  // Reset / Reload all dummy data helper
  reloadAllDummyData: () => {
    localStorage.setItem(STORAGE_KEYS.PATIENT_NAME, 'Ramesh Sharma');
    localStorage.setItem(STORAGE_KEYS.DOCTOR_APPOINTMENTS, JSON.stringify(DUMMY_APPOINTMENTS));
    localStorage.setItem(STORAGE_KEYS.SYMPTOM_LOGS, JSON.stringify(DUMMY_SYMPTOM_LOGS));
    localStorage.setItem(STORAGE_KEYS.SAVED_PULMONOLOGISTS, JSON.stringify(DUMMY_SAVED_PULMONOLOGISTS));
    localStorage.setItem(STORAGE_KEYS.MEDICATIONS, JSON.stringify(DEFAULT_MEDICATIONS));
    localStorage.setItem(STORAGE_KEYS.MEDICATION_LOGS, JSON.stringify(DUMMY_MEDICATION_LOGS));
    localStorage.setItem(STORAGE_KEYS.BREATHING_LOGS, JSON.stringify(DUMMY_BREATHING_LOGS));
    localStorage.setItem(STORAGE_KEYS.SEEDED_FLAG, 'true');
  }
};

// Seed on startup
storage.ensureIndianDataSeeded();
