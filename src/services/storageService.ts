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

// Rich clinical dummy data for Doctor Appointments & Follow-ups
export const DUMMY_APPOINTMENTS: DoctorAppointment[] = [
  {
    id: 'appt-1',
    doctorName: 'Dr. Sarah Jenkins, MD, FCCP',
    clinicName: 'Metro Pulmonary & Sleep Specialists, Suite 400',
    phone: '+1 (555) 234-5678',
    dateTime: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000 + 2 * 60 * 60 * 1000).toISOString(), // 4 days from now
    visitType: 'Routine 3-Month Checkup',
    status: 'Scheduled',
    questionsForDoctor: [
      'Should I continue using a spacer with my morning Spiriva inhaler?',
      'My morning cough produces light yellow phlegm—do we need antibiotics or just hydration?',
      'Is my resting blood oxygen (SpO2 93-94%) safe during light walking exercises?',
      'Am I due for an updated pneumonia or influenza vaccination booster?'
    ],
    doctorAdviceNotes: 'Please bring your daily CAT symptom log and remaining inhaler puff counts.',
  },
  {
    id: 'appt-2',
    doctorName: 'Dr. Michael Chen, MD',
    clinicName: 'Chest Diagnostic & Pulmonary Rehabilitation Institute',
    phone: '+1 (555) 876-5432',
    dateTime: new Date(Date.now() + 16 * 24 * 60 * 60 * 1000 + 4 * 60 * 60 * 1000).toISOString(), // 16 days from now
    visitType: 'Spirometry Test',
    status: 'Scheduled',
    questionsForDoctor: [
      'Will this spirometry test determine if my FEV1 has stabilized since starting dual bronchodilator therapy?',
      'Can we test post-bronchodilator reversibility?'
    ],
  },
  {
    id: 'appt-3',
    doctorName: 'Dr. Sarah Jenkins, MD, FCCP',
    clinicName: 'Metro Pulmonary & Sleep Specialists',
    phone: '+1 (555) 234-5678',
    dateTime: new Date(Date.now() - 32 * 24 * 60 * 60 * 1000).toISOString(), // 32 days ago
    visitType: 'Medication Review',
    status: 'Completed',
    questionsForDoctor: [
      'Adjusting daily controller inhaler schedule',
      'Proper mouth rinsing technique to prevent hoarseness'
    ],
    spirometry: {
      fev1Percent: 58,
      fev1FvcRatio: 0.63,
      spo2Percent: 94,
    },
    doctorAdviceNotes: 'Lungs clear bilaterally with mild expiratory wheezing at bases. Good response to LAMA/LABA dual therapy. Emphasized daily pursed-lip breathing exercises and avoiding cold air exposure.',
    prescribedChanges: 'Maintained Tiotropium (Spiriva) 2 puffs in morning. Albuterol as rescue.',
    nextFollowupDate: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'appt-4',
    doctorName: 'Dr. Sarah Jenkins, MD, FCCP',
    clinicName: 'Metro Pulmonary & Sleep Specialists',
    phone: '+1 (555) 234-5678',
    dateTime: new Date(Date.now() - 110 * 24 * 60 * 60 * 1000).toISOString(), // 110 days ago
    visitType: 'Symptom Flare-up / Exacerbation',
    status: 'Completed',
    questionsForDoctor: [
      'Increased breathlessness following viral chest cold',
      'Need for short oral steroid course'
    ],
    spirometry: {
      fev1Percent: 52,
      spo2Percent: 91,
    },
    doctorAdviceNotes: 'Acute mild COPD exacerbation post-viral URI. Prescribed 5-day course oral prednisolone and increased rescue albuterol nebulization every 6 hours. Follow-up showed complete resolution within 10 days.',
  }
];

// Rich dummy CAT symptom logs
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
    clinicalAdvice: 'COPD is one of the main health issues you face. Breathlessness affects some activities. Review adherence to maintenance therapy and practice daily pursed-lip breathing.',
    notes: 'Morning breathlessness on stairs, but felt better after pursed-lip breathing and morning inhaler.',
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
    clinicalAdvice: 'COPD stops you from doing many things you want to do. Frequent cough and phlegm. Discuss potential treatment adjustment or pulmonary rehabilitation with your pulmonologist.',
    notes: 'High dust & smog in the city triggered persistent coughing and chest tightness. Took 3 rescue puffs.',
    rescuePuffsUsedToday: 3,
  },
  {
    id: 'cat-log-3',
    patientName: 'Ramesh Sharma',
    date: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000).toISOString(),
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
    clinicalAdvice: 'COPD has a low impact on your daily life. Most days are good. Continue your regular maintenance inhalers and stay physically active.',
    notes: 'Very clear day. Completed 15 minutes of diaphragmatic breathing and walked around garden comfortably.',
    rescuePuffsUsedToday: 0,
  },
  {
    id: 'cat-log-4',
    patientName: 'Ramesh Sharma',
    date: new Date(Date.now() - 18 * 24 * 60 * 60 * 1000).toISOString(),
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
    clinicalAdvice: 'COPD severely restricts your life. Very high risk of flare-ups (exacerbations). Consult your pulmonary doctor promptly to evaluate your medication regimen and action plan.',
    notes: 'Acute flare-up episode. High wheezing and fatigue. Contacted Dr. Jenkins clinic triage line.',
    rescuePuffsUsedToday: 5,
  }
];

// Rich dummy saved pulmonologists
export const DUMMY_SAVED_PULMONOLOGISTS: Pulmonologist[] = [
  {
    id: 'saved-doc-1',
    name: 'Dr. Sarah Jenkins, MD, FCCP',
    clinicName: 'Metro Pulmonary & Sleep Specialists',
    address: 'Suite 400, 1250 Health Sciences Parkway',
    phone: '+1 (555) 234-5678',
    distanceKm: 2.4,
    rating: 4.9,
    isSaved: true,
    notes: 'Primary Pulmonologist. Clinic hours Mon-Fri 8:30 AM - 4:30 PM. Available on emergency triage ext 3.',
  },
  {
    id: 'saved-doc-2',
    name: 'Dr. Michael Chen, MD',
    clinicName: 'Metropolitan Chest & Lung Institute',
    address: 'Medical Pavilion B, 880 University Boulevard',
    phone: '+1 (555) 876-5432',
    distanceKm: 4.8,
    rating: 4.8,
    isSaved: true,
    notes: 'Spirometry and Pulmonary Function Testing specialist. Next spirometry scheduled in 2 weeks.',
  },
  {
    id: 'saved-doc-3',
    name: 'St. Jude Comprehensive Respiratory Care Center',
    clinicName: '24/7 Pulmonary Emergency & Oxygen Care',
    address: '500 Memorial Hospital Plaza, Emergency Wing',
    phone: '+1 (555) 990-1122',
    distanceKm: 8.5,
    rating: 4.9,
    isSaved: true,
    notes: 'Nearest 24/7 ER with specialized acute respiratory care and medical oxygen reserves.',
  }
];

// Dummy medications
export const DEFAULT_MEDICATIONS: Medication[] = [
  {
    id: 'med-1',
    name: 'Tiotropium (Spiriva Respimat)',
    genericName: 'Long-Acting Muscarinic Antagonist (LAMA)',
    type: 'Controller / Maintenance',
    dosage: '2 inhalations once daily',
    schedule: ['Morning'],
    isInhaler: true,
    totalPuffs: 60,
    remainingPuffs: 48,
    refillReminderThreshold: 10,
    notes: 'Daily maintenance; prevents flare-ups.',
    color: '#0d9488',
  },
  {
    id: 'med-2',
    name: 'Albuterol (ProAir / Ventolin)',
    genericName: 'Short-Acting Beta-2 Agonist (SABA)',
    type: 'Fast-Acting Rescue',
    dosage: '1 to 2 puffs as needed for sudden shortness of breath',
    schedule: ['As Needed'],
    isInhaler: true,
    totalPuffs: 200,
    remainingPuffs: 142,
    refillReminderThreshold: 20,
    notes: 'Always carry with you. Wait 1 min between puffs.',
    color: '#ef4444',
  },
  {
    id: 'med-3',
    name: 'Fluticasone / Salmeterol (Advair Diskus)',
    genericName: 'Inhaled Corticosteroid + LABA',
    type: 'Controller / Maintenance',
    dosage: '1 inhalation twice daily',
    schedule: ['Morning', 'Evening'],
    isInhaler: true,
    totalPuffs: 60,
    remainingPuffs: 34,
    refillReminderThreshold: 10,
    notes: 'Rinse mouth with water and spit out after use.',
    color: '#3b82f6',
  },
];

// Dummy today dose logs
const todayDateStr = new Date().toISOString().split('T')[0];
export const DUMMY_MEDICATION_LOGS: MedicationDoseLog[] = [
  {
    id: 'dose-log-1',
    medicationId: 'med-1',
    medicationName: 'Tiotropium (Spiriva Respimat)',
    timeSlot: 'Morning',
    date: todayDateStr,
    takenAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
    status: 'taken',
  },
  {
    id: 'dose-log-2',
    medicationId: 'med-3',
    medicationName: 'Fluticasone / Salmeterol (Advair Diskus)',
    timeSlot: 'Morning',
    date: todayDateStr,
    takenAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
    status: 'taken',
  },
];

export const DUMMY_BREATHING_LOGS: BreathingSessionLog[] = [
  {
    id: 'breath-log-1',
    techniqueId: 'pursed-lip',
    techniqueName: 'Pursed-Lip Breathing',
    durationSeconds: 300,
    completedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'breath-log-2',
    techniqueId: 'diaphragmatic',
    techniqueName: 'Diaphragmatic Breathing',
    durationSeconds: 480,
    completedAt: new Date(Date.now() - 26 * 60 * 60 * 1000).toISOString(),
  },
];

export const storage = {
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

  // Symptom Logs (populates dummy logs if empty)
  getSymptomLogs: (): SymptomLogEntry[] => {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.SYMPTOM_LOGS);
      if (data) {
        const parsed = JSON.parse(data);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
      // Populate and return dummy
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

  // Doctor Appointments (populates dummy appointments if empty)
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

  // Pulmonologists (populates dummy saved docs if empty)
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
  }
};
