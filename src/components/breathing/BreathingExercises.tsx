import React, { useState, useEffect, useRef } from 'react';
import { 
  Activity, 
  Play, 
  Pause, 
  RotateCcw, 
  Volume2, 
  VolumeX, 
  Sparkles, 
  CheckCircle2, 
  Heart, 
  ExternalLink,
  Clock,
  Video,
  ListOrdered
} from 'lucide-react';
import { SHWAAS_BREATHING_EXERCISES } from '../../data/breathingData';
import { BreathingTechnique, BreathingCategory } from '../../types/breathing';
import { soundFx } from '../../utils/audio';
import { storage } from '../../services/storageService';

export const BreathingExercises: React.FC = () => {
  const [selectedTechnique, setSelectedTechnique] = useState<BreathingTechnique>(SHWAAS_BREATHING_EXERCISES[0]);
  const [selectedCategory, setSelectedCategory] = useState<BreathingCategory | 'All'>('All');
  const [isActive, setIsActive] = useState<boolean>(false);
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [secondsRemainingInStep, setSecondsRemainingInStep] = useState<number>(selectedTechnique.patternSteps[0]?.duration || 3);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [totalSessionSeconds, setTotalSessionSeconds] = useState<number>(0);
  const [completedCycles, setCompletedCycles] = useState<number>(0);
  const [sessionSuccess, setSessionSuccess] = useState<boolean>(false);

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const currentPattern = selectedTechnique.patternSteps[currentStepIndex] || selectedTechnique.patternSteps[0];

  const handleSelectTechnique = (tech: BreathingTechnique) => {
    setIsActive(false);
    setSelectedTechnique(tech);
    setCurrentStepIndex(0);
    setSecondsRemainingInStep(tech.patternSteps[0]?.duration || 3);
    setTotalSessionSeconds(0);
    setCompletedCycles(0);
    setSessionSuccess(false);
  };

  useEffect(() => {
    if (!isActive) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    timerRef.current = setInterval(() => {
      setTotalSessionSeconds(prev => prev + 1);

      setSecondsRemainingInStep((prevSec) => {
        if (prevSec <= 1) {
          const nextIndex = (currentStepIndex + 1) % selectedTechnique.patternSteps.length;
          
          if (nextIndex === 0) {
            setCompletedCycles(c => c + 1);
          }

          const nextStep = selectedTechnique.patternSteps[nextIndex];
          setCurrentStepIndex(nextIndex);

          if (soundEnabled && nextStep) {
            if (nextStep.phase === 'Inhale') soundFx.playInhale();
            else if (nextStep.phase === 'Exhale') soundFx.playExhale();
            else if (nextStep.phase === 'Hold') soundFx.playHold();
            else soundFx.playTone(392, 0.2);
          }

          return nextStep ? nextStep.duration : 3;
        }
        return prevSec - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isActive, currentStepIndex, selectedTechnique, soundEnabled]);

  const handleToggleActive = () => {
    if (!isActive) {
      if (soundEnabled) {
        if (currentPattern.phase === 'Inhale') soundFx.playInhale();
        else soundFx.playExhale();
      }
    }
    setIsActive(!isActive);
  };

  const handleReset = () => {
    setIsActive(false);
    setCurrentStepIndex(0);
    setSecondsRemainingInStep(selectedTechnique.patternSteps[0]?.duration || 3);
    setTotalSessionSeconds(0);
    setCompletedCycles(0);
  };

  const handleCompleteSession = () => {
    setIsActive(false);
    if (totalSessionSeconds > 10) {
      storage.logBreathingSession({
        id: `breath-${Date.now()}`,
        techniqueId: selectedTechnique.id,
        techniqueName: selectedTechnique.name,
        durationSeconds: totalSessionSeconds,
        completedAt: new Date().toISOString(),
      });
      if (soundEnabled) soundFx.playSuccessChime();
      setSessionSuccess(true);
      setTimeout(() => setSessionSuccess(false), 5000);
    }
  };

  const filteredExercises = selectedCategory === 'All' 
    ? SHWAAS_BREATHING_EXERCISES 
    : SHWAAS_BREATHING_EXERCISES.filter(e => e.category === selectedCategory);

  const getCircleStyles = () => {
    const phase = currentPattern.phase;
    if (phase === 'Inhale') {
      return {
        scale: 'scale-125 duration-1000',
        bg: 'bg-gradient-to-tr from-teal-500 to-cyan-400',
        ring: 'ring-teal-200 ring-8',
        label: 'Inhale through nose',
      };
    } else if (phase === 'Exhale') {
      return {
        scale: 'scale-90 duration-1000',
        bg: 'bg-gradient-to-tr from-cyan-600 to-teal-700',
        ring: 'ring-cyan-200 ring-8',
        label: 'Exhale through pursed lips',
      };
    } else if (phase === 'Hold') {
      return {
        scale: 'scale-120 duration-300',
        bg: 'bg-gradient-to-tr from-amber-500 to-yellow-400',
        ring: 'ring-amber-200 ring-8',
        label: 'Pause gently',
      };
    } else {
      return {
        scale: 'scale-95 duration-500',
        bg: 'bg-gradient-to-tr from-slate-400 to-slate-500',
        ring: 'ring-slate-200 ring-8',
        label: 'Rest & Recover',
      };
    }
  };

  const circleStyle = getCircleStyles();

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-50 text-teal-800 text-xs font-bold mb-2 border border-teal-200">
            <Activity className="w-3.5 h-3.5 text-teal-600" />
            <span>Shwaas Pulmonary Rehabilitation Program</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">
            Breathing Exercises
          </h1>
          <p className="text-slate-600 text-sm mt-1 max-w-2xl leading-relaxed">
            Inspiratory, Expiratory, and Breathlessness Management exercises designed to strengthen respiratory control, open collapsed airways, clear mucus, and ease breathlessness.
          </p>
        </div>

        {/* Audio Toggle */}
        <button
          onClick={() => setSoundEnabled(!soundEnabled)}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all border shrink-0 ${
            soundEnabled
              ? 'bg-teal-50 text-teal-800 border-teal-200 hover:bg-teal-100'
              : 'bg-slate-100 text-slate-500 border-slate-200 hover:bg-slate-200'
          }`}
        >
          {soundEnabled ? <Volume2 className="w-4 h-4 text-teal-600" /> : <VolumeX className="w-4 h-4" />}
          <span>Audio Pacing: {soundEnabled ? 'ON' : 'OFF'}</span>
        </button>
      </div>

      {/* Category Filter Pills */}
      <div className="flex bg-slate-100 p-1 rounded-2xl border border-slate-200 text-xs font-bold w-fit overflow-x-auto">
        {(['All', 'Inspiratory', 'Expiratory', 'Breathlessness Management'] as const).map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 rounded-xl transition-all whitespace-nowrap ${
              selectedCategory === cat ? 'bg-white text-teal-800 shadow-xs' : 'text-slate-600'
            }`}
          >
            {cat === 'All' ? 'All Exercises (5)' : cat}
          </button>
        ))}
      </div>

      {/* Exercise Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {filteredExercises.map((tech) => {
          const isSelected = selectedTechnique.id === tech.id;
          return (
            <button
              key={tech.id}
              onClick={() => handleSelectTechnique(tech)}
              className={`text-left p-4 rounded-2xl border transition-all flex flex-col justify-between ${
                isSelected
                  ? 'bg-white border-teal-500 shadow-md ring-2 ring-teal-500/20'
                  : 'bg-slate-50 hover:bg-white border-slate-200 text-slate-700'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full ${
                    isSelected ? 'bg-teal-100 text-teal-800' : 'bg-slate-200 text-slate-600'
                  }`}>
                    {tech.categoryNumber} • {tech.category}
                  </span>
                  <span className="text-[10px] font-semibold text-slate-400">
                    {tech.durationText.split(',')[0]}
                  </span>
                </div>
                <h3 className="font-extrabold text-slate-900 text-sm leading-snug">{tech.name}</h3>
                <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                  {tech.purpose}
                </p>
              </div>

              <div className="mt-3 pt-2 border-t border-slate-200/50 flex items-center justify-between text-[11px] font-bold text-teal-700">
                <span>Select to Practice</span>
                <span>→</span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Active Exercise Detail & Interactive Visual Arena */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Arena: Live Animated Breathing Visualizer */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 md:p-8 border border-slate-200 shadow-sm flex flex-col items-center justify-between min-h-[460px] relative overflow-hidden">
          
          {/* Top Status */}
          <div className="w-full flex items-center justify-between text-xs font-semibold text-slate-500">
            <span className="flex items-center gap-1.5 font-bold text-slate-700">
              <Clock className="w-4 h-4 text-teal-600" />
              <span>Time: {Math.floor(totalSessionSeconds / 60)}:{(totalSessionSeconds % 60).toString().padStart(2, '0')}</span>
            </span>
            <span className="bg-slate-100 px-3 py-1 rounded-full text-slate-700 font-bold">
              Completed Reps: {completedCycles}
            </span>
          </div>

          {/* Central Animated Breathing Circle */}
          <div className="my-auto py-8 flex flex-col items-center justify-center">
            <div className="relative flex items-center justify-center">
              <div 
                className={`w-56 h-56 sm:w-64 sm:h-64 rounded-full flex flex-col items-center justify-center text-white text-center shadow-2xl transition-all ease-in-out ${circleStyle.ring} ${circleStyle.bg} ${circleStyle.scale}`}
              >
                <span className="text-xs font-bold uppercase tracking-widest text-white/90">
                  {currentPattern.phase}
                </span>
                <span className="text-6xl font-black tracking-tight my-1 drop-shadow-sm">
                  {secondsRemainingInStep}s
                </span>
                <span className="text-xs font-medium max-w-[160px] text-white/95 px-2">
                  {circleStyle.label}
                </span>
              </div>
            </div>

            {/* Instruction Banner */}
            <p className="mt-8 text-center text-sm font-semibold text-slate-700 max-w-md px-4 leading-relaxed">
              "{currentPattern.instruction}"
            </p>
          </div>

          {/* Bottom Controls */}
          <div className="w-full pt-4 border-t border-slate-100 flex items-center justify-center gap-3">
            <button
              onClick={handleToggleActive}
              className={`flex items-center justify-center gap-2 px-8 py-3.5 rounded-2xl font-bold text-sm text-white shadow-lg transition-all active:scale-95 ${
                isActive
                  ? 'bg-amber-600 hover:bg-amber-700 shadow-amber-600/20'
                  : 'bg-teal-600 hover:bg-teal-700 shadow-teal-600/25'
              }`}
            >
              {isActive ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
              <span>{isActive ? 'Pause Exercise' : 'Start Paced Exercise'}</span>
            </button>

            <button
              onClick={handleReset}
              className="p-3.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
              title="Reset timer"
            >
              <RotateCcw className="w-5 h-5" />
            </button>

            {totalSessionSeconds >= 30 && (
              <button
                onClick={handleCompleteSession}
                className="flex items-center gap-1.5 px-4 py-3.5 rounded-2xl bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-200 font-bold text-xs"
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Save Session</span>
              </button>
            )}
          </div>

          {sessionSuccess && (
            <div className="absolute inset-x-4 top-4 p-3 rounded-2xl bg-emerald-500 text-white font-bold text-xs text-center shadow-lg animate-in fade-in">
              🎉 Great job! Breathing session logged in your health history.
            </div>
          )}
        </div>

        {/* Right Info: Shwaas Clinical Steps & Official Video Link */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
            <div>
              <span className="text-[10px] uppercase font-bold tracking-wider text-teal-700 bg-teal-50 px-2.5 py-0.5 rounded-full border border-teal-200">
                Exercise {selectedTechnique.categoryNumber} • {selectedTechnique.category}
              </span>
              <h3 className="font-black text-slate-900 text-lg mt-1">
                {selectedTechnique.name}
              </h3>
            </div>

            {/* Purpose */}
            <div className="text-xs text-slate-700 bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
              <span className="font-bold text-slate-900 block mb-0.5">Purpose:</span>
              <p>{selectedTechnique.purpose}</p>
            </div>

            {/* Steps Checklist */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <ListOrdered className="w-4 h-4 text-teal-600" />
                Steps from Shwaas Guide:
              </span>
              <ol className="space-y-1.5 text-xs text-slate-600">
                {selectedTechnique.steps.map((st, i) => (
                  <li key={i} className="flex items-start gap-2 bg-slate-50/60 p-2 rounded-xl border border-slate-100">
                    <span className="w-4 h-4 rounded-full bg-teal-100 text-teal-800 font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                      {i + 1}
                    </span>
                    <span>{st}</span>
                  </li>
                ))}
              </ol>
            </div>

            {/* Recommended Duration */}
            <div className="text-xs text-slate-600 bg-teal-50/60 p-3 rounded-xl border border-teal-100">
              <strong className="text-teal-900">Recommended Duration:</strong> {selectedTechnique.durationText}
            </div>

            {/* Official Video Demonstration Link */}
            {selectedTechnique.videoLink && (
              <a
                href={selectedTechnique.videoLink}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-md transition-colors"
              >
                <Video className="w-4 h-4 text-rose-400" />
                <span>Watch Shwaas Video Demonstration</span>
                <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
              </a>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
