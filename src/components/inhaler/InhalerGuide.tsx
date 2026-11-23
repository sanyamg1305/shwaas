import React, { useState, useEffect, useRef } from 'react';
import { 
  Info, 
  ChevronRight, 
  ChevronLeft, 
  Timer, 
  Play, 
  RotateCcw, 
  AlertTriangle, 
  CheckCircle2, 
  Sparkles, 
  Wind, 
  ShieldCheck, 
  Activity,
  Droplets
} from 'lucide-react';
import { INHALER_GUIDES } from '../../data/inhalerData';
import { InhalerGuideData, InhalerType } from '../../types/inhaler';
import { soundFx } from '../../utils/audio';

export const InhalerGuide: React.FC = () => {
  const [selectedInhalerId, setSelectedInhalerId] = useState<InhalerType>('MDI_SPACER');
  const [activeStepIndex, setActiveStepIndex] = useState<number>(0);
  
  // 10-Second Breath-Hold Timer state
  const [timerSeconds, setTimerSeconds] = useState<number>(10);
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(false);
  const [timerFinished, setTimerFinished] = useState<boolean>(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const guide: InhalerGuideData = INHALER_GUIDES.find(g => g.id === selectedInhalerId) || INHALER_GUIDES[0];
  const currentStep = guide.steps[activeStepIndex] || guide.steps[0];

  const handleSelectInhaler = (id: InhalerType) => {
    setSelectedInhalerId(id);
    setActiveStepIndex(0);
    resetTimer();
  };

  const resetTimer = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    setIsTimerRunning(false);
    setTimerSeconds(10);
    setTimerFinished(false);
  };

  const handleStartTimer = () => {
    if (isTimerRunning) return;
    setIsTimerRunning(true);
    setTimerFinished(false);
    soundFx.playHold();

    timerRef.current = setInterval(() => {
      setTimerSeconds((prev) => {
        if (prev <= 1) {
          if (timerRef.current) clearInterval(timerRef.current);
          setIsTimerRunning(false);
          setTimerFinished(true);
          soundFx.playSuccessChime();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  // When step changes, reset timer
  useEffect(() => {
    resetTimer();
  }, [activeStepIndex, selectedInhalerId]);

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-50 text-teal-800 text-xs font-semibold mb-2 border border-teal-200">
            <Info className="w-3.5 h-3.5 text-teal-600" />
            <span>Interactive Device Tutorials</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">
            How to Use Your Inhaler Properly
          </h1>
          <p className="text-slate-600 text-sm mt-1 max-w-2xl leading-relaxed">
            Studies show up to <strong>75% of COPD patients</strong> make errors using their inhaler, causing most medicine to hit the tongue or throat instead of reaching the lungs. Follow these step-by-step instructions.
          </p>
        </div>
      </div>

      {/* Inhaler Category Tabs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {INHALER_GUIDES.map((item) => {
          const isSelected = selectedInhalerId === item.id;
          return (
            <button
              key={item.id}
              onClick={() => handleSelectInhaler(item.id)}
              className={`p-4 rounded-2xl text-left border transition-all ${
                isSelected
                  ? 'bg-white border-teal-500 shadow-md ring-2 ring-teal-500/20'
                  : 'bg-slate-50 hover:bg-white border-slate-200 text-slate-700'
              }`}
            >
              <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full inline-block mb-1.5 ${
                isSelected ? 'bg-teal-100 text-teal-800' : 'bg-slate-200 text-slate-600'
              }`}>
                {item.id.replace('_', ' + ')}
              </span>
              <h3 className="font-extrabold text-slate-900 text-sm">{item.name}</h3>
              <p className="text-[11px] text-slate-500 mt-1 line-clamp-1">
                {item.commonBrands.slice(0, 2).join(', ')}
              </p>
            </button>
          );
        })}
      </div>

      {/* Main Interactive Guide Arena */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Step-by-Step Card */}
        <div className="lg:col-span-8 bg-white rounded-3xl p-6 md:p-8 border border-slate-200 shadow-sm flex flex-col justify-between space-y-6">
          
          {/* Step Header & Progress */}
          <div>
            <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
              <span className="font-bold text-teal-700 uppercase tracking-wider">
                Step {activeStepIndex + 1} of {guide.steps.length}
              </span>
              <span>{guide.name}</span>
            </div>

            {/* Visual Step Progress Bar */}
            <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden flex gap-1">
              {guide.steps.map((_, i) => (
                <div
                  key={i}
                  className={`h-full flex-1 transition-all rounded-full ${
                    i <= activeStepIndex ? 'bg-teal-600' : 'bg-slate-200'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Current Step Content */}
          <div className="space-y-4 py-2">
            <div className="flex items-center gap-3">
              <span className="w-10 h-10 rounded-2xl bg-teal-100 text-teal-800 font-black text-lg flex items-center justify-center shrink-0">
                {currentStep.stepNumber}
              </span>
              <h2 className="text-xl md:text-2xl font-black text-slate-900">
                {currentStep.title}
              </h2>
            </div>

            <p className="text-base font-semibold text-slate-800 leading-relaxed bg-teal-50/40 p-4 rounded-2xl border border-teal-100">
              {currentStep.instruction}
            </p>

            <div className="text-xs text-slate-600 leading-relaxed pl-2 border-l-2 border-slate-200">
              <strong>Clinical Rationale:</strong> {currentStep.detail}
            </div>

            {/* Special Interactive 10-Second Breath-Holding Timer Widget */}
            {currentStep.hasTimer && (
              <div className="mt-6 p-6 rounded-2xl bg-gradient-to-r from-teal-50 to-cyan-50 border border-teal-200 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-16 h-16 rounded-full bg-white border-4 border-teal-500 flex items-center justify-center text-teal-700 font-black text-2xl shadow-inner shrink-0">
                    {timerSeconds}s
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">
                      10-Second Breath-Hold Countdown
                    </h4>
                    <p className="text-xs text-slate-600">
                      {timerFinished 
                        ? 'Done! Now breathe out slowly and gently.' 
                        : isTimerRunning 
                        ? 'Keep holding your breath calmly...' 
                        : 'Click Start when your lips close after inhaling.'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleStartTimer}
                    disabled={isTimerRunning}
                    className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl font-bold text-xs text-white shadow-sm transition-all ${
                      isTimerRunning ? 'bg-teal-400 cursor-not-allowed' : 'bg-teal-600 hover:bg-teal-700'
                    }`}
                  >
                    <Play className="w-4 h-4" />
                    <span>{isTimerRunning ? 'Holding...' : 'Start 10s Timer'}</span>
                  </button>
                  <button
                    onClick={resetTimer}
                    className="p-2.5 rounded-xl bg-white hover:bg-slate-100 border border-slate-200 text-slate-600"
                    title="Reset countdown"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Navigation Controls */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-100">
            <button
              onClick={() => setActiveStepIndex(Math.max(0, activeStepIndex - 1))}
              disabled={activeStepIndex === 0}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-colors ${
                activeStepIndex === 0
                  ? 'text-slate-300 cursor-not-allowed'
                  : 'text-slate-700 hover:bg-slate-100 bg-slate-50 border border-slate-200'
              }`}
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Previous Step</span>
            </button>

            {/* Quick Step Indicators */}
            <div className="hidden sm:flex items-center gap-1.5">
              {guide.steps.map((s, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveStepIndex(idx)}
                  className={`w-7 h-7 rounded-lg text-xs font-bold transition-all ${
                    idx === activeStepIndex
                      ? 'bg-teal-600 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {idx + 1}
                </button>
              ))}
            </div>

            <button
              onClick={() => setActiveStepIndex(Math.min(guide.steps.length - 1, activeStepIndex + 1))}
              disabled={activeStepIndex === guide.steps.length - 1}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-colors ${
                activeStepIndex === guide.steps.length - 1
                  ? 'text-slate-300 cursor-not-allowed'
                  : 'text-white bg-teal-600 hover:bg-teal-700 shadow-sm'
              }`}
            >
              <span>Next Step</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Right Info: Common Mistakes & Cleaning Guidelines */}
        <div className="lg:col-span-4 space-y-5">
          {/* Key Rule Card */}
          <div className="bg-gradient-to-r from-teal-700 to-cyan-800 text-white p-5 rounded-3xl shadow-sm">
            <span className="text-[10px] uppercase font-bold tracking-wider text-teal-200 block mb-1">
              Golden Rule for {guide.id}
            </span>
            <p className="text-sm font-bold leading-snug">
              "{guide.keyRule}"
            </p>
          </div>

          {/* Common Mistakes */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-3">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-500" />
              <h3 className="font-extrabold text-slate-900 text-sm">
                Common Mistakes to Avoid
              </h3>
            </div>
            <ul className="space-y-2 text-xs text-slate-600">
              {guide.commonMistakes.map((mistake, i) => (
                <li key={i} className="flex items-start gap-2 bg-amber-50/50 p-2.5 rounded-xl border border-amber-100">
                  <span className="text-amber-600 font-bold shrink-0">✕</span>
                  <span>{mistake}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Cleaning & Maintenance */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-2.5">
            <div className="flex items-center gap-2">
              <Droplets className="w-4 h-4 text-teal-600" />
              <h3 className="font-extrabold text-slate-900 text-sm">
                Cleaning & Care Instructions
              </h3>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-100">
              {guide.cleaningAdvice}
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};
