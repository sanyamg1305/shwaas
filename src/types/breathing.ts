export type BreathingCategory = 'Inspiratory' | 'Expiratory' | 'Breathlessness Management';

export type BreathingPhase = 'Inhale' | 'Hold' | 'Exhale' | 'Rest' | 'Recover';

export interface BreathingPatternStep {
  phase: BreathingPhase;
  duration: number; // in seconds
  instruction: string;
}

export interface BreathingTechnique {
  id: string;
  category: BreathingCategory;
  categoryNumber: string; // "1.1", "1.2", "2.1", "2.2", "3.1"
  name: string;
  subtitle: string;
  purpose: string;
  steps: string[]; // text steps from guide
  patternSteps: BreathingPatternStep[]; // for the live animated visual pacing
  cycleDuration: number;
  durationText: string;
  videoLink: string;
  postureAdvice?: string;
  isPositionOnly?: boolean; // e.g. Forward-leaning position
}

export interface BreathingSessionLog {
  id: string;
  techniqueId: string;
  techniqueName: string;
  durationSeconds: number;
  completedAt: string;
}
