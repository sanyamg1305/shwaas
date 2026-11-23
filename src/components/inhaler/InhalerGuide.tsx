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
  Droplets,
  Video,
  ExternalLink,
  BookOpen
} from 'lucide-react';
import { INHALER_GUIDES } from '../../data/inhalerData';
import { InhalerGuideData, InhalerType } from '../../types/inhaler';
import { soundFx } from '../../utils/audio';

export const InhalerGuide: React.FC = () => {
  const [selectedInhalerId, setSelectedInhalerId] = useState<InhalerType>('MDI');
  const [activeStepIndex, setActiveStepIndex] = useState<number>(0);
  const [viewMode, setViewMode] = useState<'steps' | 'video'>('steps');
  
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

  useEffect(() => {
    resetTimer();
  }, [activeStepIndex, selectedInhalerId]);

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="bg-white rounded-3xl p-5 sm:p-8 border border-slate-200/90 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-5">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-50 text-teal-800 text-xs font-bold mb-2 border border-teal-200/70">
            <Info className="w-3.5 h-3.5 text-teal-600" />
            <span>Interactive Device Tutorials & Video Demos</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            How to Use Your Inhaler Properly
          </h1>
          <p className="text-slate-600 text-xs sm:text-sm mt-1 max-w-2xl leading-relaxed">
            Medical studies show that up to <strong>75% of COPD patients make critical inhaler errors</strong>, depositing medicine on the tongue instead of the bronchial tree. Follow the official step-by-step technique and video guide.
          </p>
        </div>

        {/* View mode toggle on desktop */}
        {guide.youtubeId && (
          <div className="flex bg-slate-100 p-1.5 rounded-2xl border border-slate-200 text-xs font-bold shrink-0 self-start md:self-auto">
            <button
              onClick={() => setViewMode('steps')}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl transition-all ${
                viewMode === 'steps' ? 'bg-white text-teal-800 shadow-xs' : 'text-slate-600'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Step Walkthrough</span>
            </button>
            <button
              onClick={() => setViewMode('video')}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl transition-all ${
                viewMode === 'video' ? 'bg-white text-teal-800 shadow-xs' : 'text-slate-600'
              }`}
            >
              <Video className="w-3.5 h-3.5 text-rose-500" />
              <span>Video Tutorial</span>
            </button>
          </div>
        )}
      </div>

      {/* Inhaler Category Tabs (Horizontal Scroll on Mobile) */}
      <div className="flex md:grid md:grid-cols-4 gap-3 overflow-x-auto no-scrollbar pb-1">
        {INHALER_GUIDES.map((item) => {
          const isSelected = selectedInhalerId === item.id;
          return (
            <button
              key={item.id}
              onClick={() => handleSelectInhaler(item.id)}
              className={`min-w-[200px] md:min-w-0 p-4 rounded-2xl text-left border transition-all shrink-0 md:shrink ${
                isSelected
                  ? 'bg-white border-teal-500 shadow-md ring-2 ring-teal-500/20'
                  : 'bg-slate-50 hover:bg-white border-slate-200 text-slate-700'
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full ${
                  isSelected ? 'bg-teal-100 text-teal-800' : 'bg-slate-200 text-slate-600'
                }`}>
                  {item.id.replace('_', ' + ')}
                </span>
                {item.youtubeId && (
                  <span className="flex items-center gap-1 text-[10px] font-bold text-rose-600 bg-rose-50 px-1.5 py-0.5 rounded">
                    <Video className="w-3 h-3" />
                    Video
                  </span>
                )}
              </div>
              <h3 className="font-extrabold text-slate-900 text-sm leading-snug">{item.name}</h3>
              <p className="text-[11px] text-slate-500 mt-1 line-clamp-1">
                {item.commonBrands.slice(0, 2).join(', ')}
              </p>
            </button>
          );
        })}
      </div>

      {/* Main Interactive Guide Arena */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Arena: Steps OR Embedded YouTube Video */}
        <div className="lg:col-span-8 bg-white rounded-3xl p-5 sm:p-8 border border-slate-200 shadow-sm flex flex-col justify-between space-y-6">
          
          {/* Step Header & Progress */}
          <div>
            <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
              <span className="font-bold text-teal-700 uppercase tracking-wider">
                Step {activeStepIndex + 1} of {guide.steps.length}
              </span>
              <span className="font-semibold text-slate-700">{guide.name}</span>
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

          {/* Conditional View: Steps Walkthrough or Video */}
          {viewMode === 'video' && guide.youtubeId ? (
            /* Embedded YouTube Video Player */
            <div className="space-y-4 py-2">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
                    <Video className="w-5 h-5 text-rose-600" />
                    Demonstration: How to Use Inhaler Without a Spacer
                  </h3>
                  <p className="text-xs text-slate-500">Official clinical inhaler technique video</p>
                </div>
                {guide.videoUrl && (
                  <a
                    href={guide.videoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold"
                  >
                    <span>Open in YouTube</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>

              {/* 16:9 Responsive Video Iframe */}
              <div className="relative w-full aspect-video rounded-2xl overflow-hidden shadow-lg border border-slate-200 bg-black">
                <iframe
                  className="absolute top-0 left-0 w-full h-full"
                  src={`https://www.youtube-nocookie.com/embed/${guide.youtubeId}?rel=0&modestbranding=1`}
                  title="How to use an inhaler without a spacer"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>

              <div className="p-3.5 rounded-2xl bg-teal-50 border border-teal-200 text-xs text-teal-900 flex items-center justify-between">
                <span>Watch the video above, then click <strong>Step Walkthrough</strong> to practice with the interactive breath-hold timer.</span>
                <button
                  onClick={() => setViewMode('steps')}
                  className="font-bold text-teal-700 underline shrink-0 ml-2"
                >
                  Go to Steps →
                </button>
              </div>
            </div>
          ) : (
            /* Current Step Content */
            <div className="space-y-4 py-2">
              <div className="flex items-center gap-3">
                <span className="w-10 h-10 rounded-2xl bg-teal-100 text-teal-800 font-black text-lg flex items-center justify-center shrink-0">
                  {currentStep.stepNumber}
                </span>
                <h2 className="text-xl sm:text-2xl font-black text-slate-900">
                  {currentStep.title}
                </h2>
              </div>

              <p className="text-sm sm:text-base font-semibold text-slate-800 leading-relaxed bg-teal-50/40 p-4 rounded-2xl border border-teal-100">
                {currentStep.instruction}
              </p>

              <div className="text-xs text-slate-600 leading-relaxed pl-2 border-l-2 border-slate-200">
                <strong>Clinical Rationale:</strong> {currentStep.detail}
              </div>

              {/* Special Interactive 10-Second Breath-Holding Timer Widget */}
              {currentStep.hasTimer && (
                <div className="mt-4 p-5 sm:p-6 rounded-2xl bg-gradient-to-r from-teal-50 to-cyan-50 border border-teal-200 flex flex-col sm:flex-row items-center justify-between gap-4">
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
                          : 'Click Start as soon as your lips seal around the mouthpiece.'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    <button
                      onClick={handleStartTimer}
                      disabled={isTimerRunning}
                      className={`flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-5 py-3 rounded-xl font-bold text-xs text-white shadow-sm transition-all ${
                        isTimerRunning ? 'bg-teal-400 cursor-not-allowed' : 'bg-teal-600 hover:bg-teal-700'
                      }`}
                    >
                      <Play className="w-4 h-4" />
                      <span>{isTimerRunning ? 'Holding Breath...' : 'Start 10s Timer'}</span>
                    </button>
                    <button
                      onClick={resetTimer}
                      className="p-3 rounded-xl bg-white hover:bg-slate-100 border border-slate-200 text-slate-600"
                      title="Reset countdown"
                    >
                      <RotateCcw className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* Embedded video preview banner if available */}
              {guide.youtubeId && (
                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-xs text-slate-500 font-medium">Want to see this performed live?</span>
                  <button
                    onClick={() => setViewMode('video')}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-rose-600 hover:text-rose-700 bg-rose-50 px-3 py-1.5 rounded-xl border border-rose-100"
                  >
                    <Video className="w-3.5 h-3.5" />
                    <span>Watch Embedded Video</span>
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Navigation Controls */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-100">
            <button
              onClick={() => {
                setViewMode('steps');
                setActiveStepIndex(Math.max(0, activeStepIndex - 1));
              }}
              disabled={activeStepIndex === 0}
              className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold transition-colors ${
                activeStepIndex === 0
                  ? 'text-slate-300 cursor-not-allowed'
                  : 'text-slate-700 hover:bg-slate-100 bg-slate-50 border border-slate-200'
              }`}
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Previous</span>
            </button>

            {/* Quick Step Indicators */}
            <div className="hidden sm:flex items-center gap-1.5">
              {guide.steps.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setViewMode('steps');
                    setActiveStepIndex(idx);
                  }}
                  className={`w-7 h-7 rounded-lg text-xs font-bold transition-all ${
                    idx === activeStepIndex && viewMode === 'steps'
                      ? 'bg-teal-600 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {idx + 1}
                </button>
              ))}
            </div>

            <button
              onClick={() => {
                setViewMode('steps');
                setActiveStepIndex(Math.min(guide.steps.length - 1, activeStepIndex + 1));
              }}
              disabled={activeStepIndex === guide.steps.length - 1}
              className={`flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-xs font-bold transition-colors ${
                activeStepIndex === guide.steps.length - 1
                  ? 'text-slate-300 cursor-not-allowed'
                  : 'text-white bg-teal-600 hover:bg-teal-700 shadow-sm'
              }`}
            >
              <span>Next</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Right Column: Key Rule, Mistakes & Cleaning Guidelines */}
        <div className="lg:col-span-4 space-y-4">
          
          {/* Key Rule Card */}
          <div className="bg-gradient-to-r from-teal-700 to-cyan-800 text-white p-5 rounded-3xl shadow-sm">
            <span className="text-[10px] uppercase font-bold tracking-wider text-teal-200 block mb-1">
              Golden Rule for {guide.name}
            </span>
            <p className="text-sm font-bold leading-snug">
              "{guide.keyRule}"
            </p>
          </div>

          {/* Embedded Video Direct Player Card if not in video mode */}
          {guide.youtubeId && viewMode === 'steps' && (
            <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                  <Video className="w-4 h-4 text-rose-500" />
                  Video Demonstration
                </span>
                <span className="text-[10px] font-semibold text-slate-400">YouTube</span>
              </div>
              <div className="relative w-full aspect-video rounded-xl overflow-hidden shadow-inner border border-slate-200 bg-black">
                <iframe
                  className="absolute top-0 left-0 w-full h-full"
                  src={`https://www.youtube-nocookie.com/embed/${guide.youtubeId}?rel=0`}
                  title="How to use an inhaler without a spacer"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            </div>
          )}

          {/* Common Mistakes */}
          <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200 shadow-sm space-y-3">
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
          <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200 shadow-sm space-y-2">
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
