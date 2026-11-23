export type InhalerType = 'MDI' | 'MDI_SPACER' | 'DPI' | 'SMI';

export interface InhalerStep {
  stepNumber: number;
  title: string;
  instruction: string;
  detail: string;
  hasTimer?: boolean;
  timerDurationSeconds?: number;
  timerPrompt?: string;
  iconName: string;
  tip?: string;
}

export interface InhalerGuideData {
  id: InhalerType;
  name: string;
  fullName: string;
  commonBrands: string[];
  description: string;
  recommendedFor: string;
  keyRule: string;
  steps: InhalerStep[];
  commonMistakes: string[];
  cleaningAdvice: string;
}
