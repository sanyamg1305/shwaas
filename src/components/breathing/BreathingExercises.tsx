import React, { useState, useEffect, useRef } from 'react';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Volume2, 
  VolumeX, 
  CheckCircle2, 
  Video, 
  ExternalLink, 
  ChevronDown, 
  ChevronUp,
  Clock,
  Sparkles,
  Info,
  ListOrdered
} from 'lucide-react';
import { SHWAAS_BREATHING_EXERCISES } from '../../data/breathingData';
import { BreathingTechnique } from '../../types/breathing';
import { soundFx } from '../../utils/audio';
import { storage } from '../../services/storageService';

export const BreathingExercises: React.FC = () => {
  // Default to Pursed-Lip Breathing (exercise 2.1) as it is the most critical for COPD relief
  const [selectedTechnique, setSelectedTechnique] = useState<BreathingTechnique>(
    SHWAAS_BREATHING_EXERCISES.find(e => e.id === 'pursed-lip') || SHWAAS_BREATHING_EXERCISES[0]
  );
  const [isActive, setIsActive] = useState<boolean>(false);
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [secondsRemainingInStep, setSecondsRemainingInStep] = useState<number>(
    selectedTechnique.patternSteps[0]?.duration || 3
  );
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [totalSessionSeconds, setTotalSessionSeconds] = useState<number>(0);
  const [completedCycles, setCompletedCycles] = useState<number>(0);
  const [sessionSuccess, setSessionSuccess] = useState<boolean>(false);
  const [showInstructions, setShowInstructions] = useState<boolean>(false);
  const [showVideoEmbed, setShowVideoEmbed] = useState<boolean>(false);

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
    setShowVideoEmbed(false);
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
    if (!isActive && soundEnabled) {
      if (currentPattern.phase === 'Inhale') soundFx.playInhale();
      else soundFx.playExhale();
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
    if (totalSessionSeconds >= 20) {
      storage.logBreathingSession({
        id: `breath-${Date.now()}`,
        techniqueId: selectedTechnique.id,
        techniqueName: selectedTechnique.name,
        durationSeconds: totalSessionSeconds,
        completedAt: new Date().toISOString(),
      });
      if (soundEnabled) soundFx.playSuccessChime();
      setSessionSuccess(true);
      setTimeout(() => setSessionSuccess(false), 4500);
    }
  };

  // Visual breathing animation styles
  const getCircleStyles = () => {
    const phase = currentPattern.phase;
    if (phase === 'Inhale') {
      return {
        scale: 'scale-115 sm:scale-125 duration-1000',
        bg: 'bg-gradient-to-tr from-teal-500 to-cyan-400',
        ring: 'ring-teal-200/80 ring-8 shadow-teal-500/30',
        label: 'Inhale through nose',
      };
    } else if (phase === 'Exhale') {
      return {
        scale: 'scale-90 sm:scale-95 duration-1000',
        bg: 'bg-gradient-to-tr from-cyan-600 to-teal-800',
        ring: 'ring-cyan-200/60 ring-8 shadow-cyan-600/30',
        label: 'Exhale through pursed lips',
      };
    } else if (phase === 'Hold') {
      return {
        scale: 'scale-110 sm:scale-120 duration-300',
        bg: 'bg-gradient-to-tr from-amber-500 to-yellow-400',
        ring: 'ring-amber-200/80 ring-8 shadow-amber-500/30',
        label: 'Hold gently',
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

  // Helper to extract clean youtube embed URL
  const getEmbedUrl = (link: string) => {
    if (!link) return '';
    if (link.includes('youtu.be/')) {
      const idPart = link.split('youtu.be/')[1].split('?')[0];
      return `https://www.youtube-nocookie.com/embed/${idPart}?rel=0`;
    }
    return link;
  };

  return (
    <div className="space-y-4 max-w-3xl mx-auto">
      
      {/* Exercise Selector Horizontal Pills (Top Bar) */}
      <div className="overflow-x-auto no-scrollbar pb-1 -mx-2 px-2 sm:mx-0 sm:px-0">
        <div className="flex gap-2 min-w-max">
          {SHWAAS_BREATHING_EXERCISES.map((tech) => {
            const isSelected = selectedTechnique.id === tech.id;
            return (
              <button
                key={tech.id}
                onClick={() => handleSelectTechnique(tech)}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-2xl text-xs font-bold transition-all border ${
                  isSelected
                    ? 'bg-teal-700 text-white border-teal-700 shadow-sm scale-102 ring-2 ring-teal-300/40'
                    : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200'
                }`}
              >
                <span className={`w-5 h-5 rounded-md text-[10px] font-black flex items-center justify-center ${
                  isSelected ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'
                }`}>
                  {tech.categoryNumber}
                </span>
                <span>{tech.name.split('(')[0].trim()}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Breathing Visualizer Arena (Above the fold!) */}
      <div className="bg-white rounded-3xl p-5 sm:p-7 border border-slate-200/90 shadow-sm flex flex-col items-center justify-between min-h-[380px] sm:min-h-[440px] relative overflow-hidden">
        
        {/* Top Arena Bar: Exercise Info & Audio Toggle */}
        <div className="w-full flex items-center justify-between text-xs pb-2 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] font-black uppercase tracking-wider text-teal-700 bg-teal-50 px-2 py-0.5 rounded-md border border-teal-200/60">
                {selectedTechnique.categoryNumber} • {selectedTechnique.category}
              </span>
              <span className="text-[11px] font-semibold text-slate-400 hidden sm:inline">
                {selectedTechnique.durationText.split(',')[0]}
              </span>
            </div>
            <h2 className="font-black text-slate-900 text-base sm:text-lg mt-0.5 leading-snug">
              {selectedTechnique.name}
            </h2>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className={`p-2 rounded-xl transition-all border ${
                soundEnabled 
                  ? 'bg-teal-50 text-teal-700 border-teal-200' 
                  : 'bg-slate-100 text-slate-400 border-slate-200'
              }`}
              title={soundEnabled ? 'Audio Pacing ON' : 'Audio Pacing OFF'}
            >
              {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>
            <span className="bg-slate-100 px-2.5 py-1 rounded-xl text-slate-600 font-bold text-[11px]">
              Reps: {completedCycles}
            </span>
          </div>
        </div>

        {/* Central Animated Breathing Circle */}
        <div className="my-auto py-5 sm:py-7 flex flex-col items-center justify-center">
          <div className="relative flex items-center justify-center">
            <div 
              className={`w-44 h-44 sm:w-56 sm:h-56 rounded-full flex flex-col items-center justify-center text-white text-center shadow-2xl transition-all ease-in-out ${circleStyle.ring} ${circleStyle.bg} ${circleStyle.scale}`}
            >
              <span className="text-[11px] font-black uppercase tracking-widest text-white/90">
                {currentPattern.phase}
              </span>
              <span className="text-5xl sm:text-6xl font-black tracking-tight my-0.5 drop-shadow-sm">
                {secondsRemainingInStep}s
              </span>
              <span className="text-[11px] font-semibold max-w-[140px] sm:max-w-[160px] text-white/95 px-2 leading-tight">
                {circleStyle.label}
              </span>
            </div>
          </div>

          {/* Active Phase Instruction */}
          <p className="mt-5 text-center text-xs sm:text-sm font-semibold text-slate-700 max-w-sm px-4 leading-relaxed">
            "{currentPattern.instruction}"
          </p>
        </div>

        {/* Bottom Pacing Controls */}
        <div className="w-full pt-3 border-t border-slate-100 flex items-center justify-center gap-3">
          <button
            onClick={handleToggleActive}
            className={`flex items-center justify-center gap-2 px-8 py-3.5 rounded-2xl font-black text-sm text-white shadow-lg transition-all active:scale-95 ${
              isActive
                ? 'bg-amber-600 hover:bg-amber-700 shadow-amber-600/25'
                : 'bg-teal-700 hover:bg-teal-800 shadow-teal-700/25'
            }`}
          >
            {isActive ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
            <span>{isActive ? 'Pause Pacing' : 'Start Exercise'}</span>
          </button>

          <button
            onClick={handleReset}
            className="p-3.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
            title="Reset exercise timer"
          >
            <RotateCcw className="w-5 h-5" />
          </button>

          {totalSessionSeconds >= 20 && (
            <button
              onClick={handleCompleteSession}
              className="flex items-center gap-1.5 px-4 py-3 rounded-2xl bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-200 font-bold text-xs"
            >
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Save</span>
            </button>
          )}
        </div>

        {sessionSuccess && (
          <div className="absolute inset-x-4 top-4 p-3 rounded-2xl bg-emerald-600 text-white font-bold text-xs text-center shadow-lg animate-in fade-in">
            🎉 Great work! Session saved to your Shwaas health log.
          </div>
        )}
      </div>

      {/* Accordion 1: Technique Instructions & Purpose */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <button
          onClick={() => setShowInstructions(!showInstructions)}
          className="w-full flex items-center justify-between p-4 text-left font-bold text-xs sm:text-sm text-slate-900 hover:bg-slate-50 transition-colors"
        >
          <div className="flex items-center gap-2">
            <ListOrdered className="w-4 h-4 text-teal-600" />
            <span>How to do {selectedTechnique.name} (Steps & Purpose)</span>
          </div>
          {showInstructions ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
        </button>

        {showInstructions && (
          <div className="px-4 pb-4 pt-1 space-y-3 text-xs text-slate-600 border-t border-slate-100 animate-in fade-in duration-150">
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
              <strong className="text-slate-900 block mb-0.5">Clinical Purpose:</strong>
              {selectedTechnique.purpose}
            </div>

            <div>
              <strong className="text-slate-900 block mb-1.5">Steps from Shwaas Program:</strong>
              <ol className="space-y-1.5">
                {selectedTechnique.steps.map((st, i) => (
                  <li key={i} className="flex items-start gap-2 bg-slate-50/70 p-2 rounded-lg">
                    <span className="w-4 h-4 rounded-full bg-teal-100 text-teal-800 font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                      {i + 1}
                    </span>
                    <span>{st}</span>
                  </li>
                ))}
              </ol>
            </div>

            <div className="text-[11px] text-teal-900 bg-teal-50/80 p-2.5 rounded-xl border border-teal-100">
              <strong>Recommended Frequency:</strong> {selectedTechnique.durationText}
            </div>
          </div>
        )}
      </div>

      {/* Accordion 2: Watch Shwaas Video Demonstration */}
      {selectedTechnique.videoLink && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <button
            onClick={() => setShowVideoEmbed(!showVideoEmbed)}
            className="w-full flex items-center justify-between p-4 text-left font-bold text-xs sm:text-sm text-slate-900 hover:bg-slate-50 transition-colors"
          >
            <div className="flex items-center gap-2 text-rose-700">
              <Video className="w-4 h-4 text-rose-600" />
              <span>Watch Video Demonstration ({selectedTechnique.name})</span>
            </div>
            {showVideoEmbed ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
          </button>

          {showVideoEmbed && (
            <div className="p-4 pt-1 border-t border-slate-100 space-y-3 animate-in fade-in duration-150">
              <div className="relative w-full aspect-video rounded-xl overflow-hidden shadow-md border border-slate-200 bg-black">
                <iframe
                  className="absolute top-0 left-0 w-full h-full"
                  src={getEmbedUrl(selectedTechnique.videoLink)}
                  title={selectedTechnique.name}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>

              <div className="flex justify-end">
                <a
                  href={selectedTechnique.videoLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-slate-900"
                >
                  <span>Open in YouTube</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          )}
        </div>
      )}

    </div>
  );
};
