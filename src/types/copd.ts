export interface CATQuestion {
  id: string;
  leftAnchor: string;
  rightAnchor: string;
  min: number;
  max: number;
}

// Backward compatible with custom questions if needed
export interface SymptomQuestion {
  id: string;
  leftAnchor: string;
  rightAnchor: string;
  min: number;
  max: number;
}

export interface SymptomLogEntry {
  id: string;
  patientName?: string;
  date: string; // ISO string
  answers: Record<string, number>; // questionId -> value (0 to 5)
  totalScore: number; // 0 to 40
  maxPossibleScore: number;
  severityLevel: 'Low Impact' | 'Medium Impact' | 'High Impact' | 'Very High Impact';
  clinicalAdvice: string;
  notes?: string;
  rescuePuffsUsedToday?: number;
}
