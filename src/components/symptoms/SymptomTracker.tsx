import React, { useState, useEffect } from 'react';
import { 
  ClipboardCheck, 
  Calendar, 
  Printer, 
  Save, 
  RotateCcw, 
  Check, 
  Trash2, 
  Info, 
  User, 
  FileText, 
  AlertCircle,
  TrendingUp,
  Activity
} from 'lucide-react';
import { CATQuestion, SymptomLogEntry } from '../../types/copd';
import { storage, OFFICIAL_CAT_QUESTIONS } from '../../services/storageService';

export const SymptomTracker: React.FC = () => {
  const [patientName, setPatientName] = useState<string>('');
  const [todayDate, setTodayDate] = useState<string>('');
  const [questions, setQuestions] = useState<CATQuestion[]>(OFFICIAL_CAT_QUESTIONS);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [rescuePuffs, setRescuePuffs] = useState<number>(0);
  const [notes, setNotes] = useState<string>('');
  const [logs, setLogs] = useState<SymptomLogEntry[]>([]);
  const [saveSuccess, setSaveSuccess] = useState<boolean>(false);
  const [activeView, setActiveView] = useState<'form' | 'history'>('form');

  useEffect(() => {
    const savedName = storage.getPatientName();
    if (savedName && savedName !== 'Ramesh Sharma') {
      setPatientName(savedName);
    } else {
      setPatientName('');
      storage.setPatientName('');
    }

    const now = new Date();
    setTodayDate(now.toLocaleDateString([], {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }));

    const loadedLogs = storage.getSymptomLogs();
    setLogs(loadedLogs);

    // Initialize answers to 0
    const initial: Record<string, number> = {};
    OFFICIAL_CAT_QUESTIONS.forEach((q) => {
      initial[q.id] = 0;
    });
    setAnswers(initial);
  }, []);

  const handleSelectScore = (questionId: string, score: number) => {
    setAnswers(prev => ({ ...prev, [questionId]: score }));
  };

  const handleNameChange = (val: string) => {
    setPatientName(val);
    storage.setPatientName(val);
  };

  // Calculate total score (0 to 40)
  const totalScore = Object.values(answers).reduce((sum, val) => sum + (val || 0), 0);

  // Official GOLD / CAT Impact Interpretation
  const getImpactLevel = (score: number) => {
    if (score < 10) {
      return {
        level: 'Low Impact' as const,
        badgeBg: 'bg-emerald-100 text-emerald-800 border-emerald-300',
        summaryBg: 'bg-emerald-50 border-emerald-200',
        textColor: 'text-emerald-900',
        clinicalAdvice: 'COPD has a low impact on your daily life. Most days are good. Continue your regular maintenance inhalers and stay physically active.',
      };
    } else if (score <= 20) {
      return {
        level: 'Medium Impact' as const,
        badgeBg: 'bg-amber-100 text-amber-800 border-amber-300',
        summaryBg: 'bg-amber-50 border-amber-200',
        textColor: 'text-amber-900',
        clinicalAdvice: 'COPD is one of the main health issues you face. Breathlessness affects some activities. Review adherence to maintenance therapy and practice daily pursed-lip breathing.',
      };
    } else if (score <= 30) {
      return {
        level: 'High Impact' as const,
        badgeBg: 'bg-orange-100 text-orange-800 border-orange-300',
        summaryBg: 'bg-orange-50 border-orange-200',
        textColor: 'text-orange-900',
        clinicalAdvice: 'COPD stops you from doing many things you want to do. Frequent cough and phlegm. Discuss potential treatment adjustment or pulmonary rehabilitation with your pulmonologist.',
      };
    } else {
      return {
        level: 'Very High Impact' as const,
        badgeBg: 'bg-rose-100 text-rose-800 border-rose-300',
        summaryBg: 'bg-rose-50 border-rose-300',
        textColor: 'text-rose-900',
        clinicalAdvice: 'COPD severely restricts your life. Very high risk of flare-ups (exacerbations). Consult your pulmonary doctor promptly to evaluate your medication regimen and action plan.',
      };
    }
  };

  const impact = getImpactLevel(totalScore);

  const handleSaveAssessment = () => {
    const entry: SymptomLogEntry = {
      id: `cat-${Date.now()}`,
      patientName: patientName.trim() || undefined,
      date: new Date().toISOString(),
      answers,
      totalScore,
      maxPossibleScore: 40,
      severityLevel: impact.level,
      clinicalAdvice: impact.clinicalAdvice,
      notes: notes.trim() || undefined,
      rescuePuffsUsedToday: rescuePuffs,
    };

    const updated = storage.saveSymptomLog(entry);
    setLogs(updated);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 4000);
  };

  const handleResetForm = () => {
    const initial: Record<string, number> = {};
    OFFICIAL_CAT_QUESTIONS.forEach((q) => {
      initial[q.id] = 0;
    });
    setAnswers(initial);
    setRescuePuffs(0);
    setNotes('');
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Top Header & View Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-teal-600 text-white flex items-center justify-center font-black text-xl shadow-md">
            CAT
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              COPD Assessment Test™ (CAT)
            </h1>
            <p className="text-xs text-slate-500">
              Official 8-Item Clinical Questionnaire (Score Range: 0 – 40)
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex bg-slate-100 p-1 rounded-2xl border border-slate-200 text-xs font-bold">
            <button
              onClick={() => setActiveView('form')}
              className={`px-4 py-2 rounded-xl transition-all ${
                activeView === 'form' ? 'bg-white text-teal-800 shadow-xs' : 'text-slate-600'
              }`}
            >
              Take Test
            </button>
            <button
              onClick={() => setActiveView('history')}
              className={`px-4 py-2 rounded-xl transition-all ${
                activeView === 'history' ? 'bg-white text-teal-800 shadow-xs' : 'text-slate-600'
              }`}
            >
              Saved Records ({logs.length})
            </button>
          </div>

          <button
            onClick={() => {
              storage.reloadAllDummyData();
              setLogs(storage.getSymptomLogs());
              setPatientName(storage.getPatientName());
            }}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold border border-slate-200 transition-colors shadow-2xs"
            title="Populate sample assessments"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Sample Data</span>
          </button>

          <button
            onClick={() => window.print()}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white hover:bg-slate-100 text-slate-700 text-xs font-bold border border-slate-200 transition-colors shadow-2xs"
            title="Print assessment form"
          >
            <Printer className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Print / PDF</span>
          </button>
        </div>
      </div>

      {activeView === 'form' ? (
        <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200 shadow-sm space-y-6">
          
          {/* Official Document Banner Header */}
          <div className="border-b border-slate-200 pb-5 space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex-1">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Your Name:
                </label>
                <input
                  type="text"
                  value={patientName}
                  onChange={(e) => handleNameChange(e.target.value)}
                  placeholder="Enter your name (optional)..."
                  className="w-full max-w-md px-3.5 py-2 text-sm rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-semibold focus:outline-none focus:ring-2 focus:ring-teal-400"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                  Today's Date:
                </label>
                <div className="px-3.5 py-2 text-sm rounded-xl bg-slate-100 text-slate-700 font-medium">
                  {todayDate}
                </div>
              </div>
            </div>

            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 text-xs text-slate-700 leading-relaxed space-y-1.5">
              <p className="font-bold text-slate-900 text-sm">
                How is your COPD? Take the COPD Assessment Test™ (CAT)
              </p>
              <p>
                This questionnaire will help you and your healthcare professional to measure the impact that COPD (Chronic Obstructive Pulmonary Disease) is having on your wellbeing and daily life. Your answers and test score can be used by you and your healthcare professional to help improve the management of your COPD and gain the greatest benefit from the treatment.
              </p>
              <p className="font-semibold text-teal-800 pt-1">
                For each item below, select the box (0 – 5) that best describes your current situation.
              </p>
            </div>
          </div>

          {/* Table Header */}
          <div className="hidden lg:grid grid-cols-12 gap-3 text-xs font-extrabold uppercase tracking-wider text-slate-400 pb-2 border-b border-slate-100 px-3">
            <div className="col-span-4">Better / No Symptoms (0)</div>
            <div className="col-span-4 text-center">Score Scale (0 to 5)</div>
            <div className="col-span-3 text-right">Severe Symptoms (5)</div>
            <div className="col-span-1 text-right">Score</div>
          </div>

          {/* 8 CAT Questions (Replicating exact layout from the provided document) */}
          <div className="space-y-3">
            {questions.map((q, index) => {
              const currentScore = answers[q.id] ?? 0;
              const isEven = index % 2 === 0;

              return (
                <div
                  key={q.id}
                  className={`p-4 sm:p-5 rounded-2xl border transition-all ${
                    isEven ? 'bg-slate-50/70 border-slate-200' : 'bg-white border-slate-200'
                  } hover:border-teal-300`}
                >
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-center">
                    
                    {/* Left Anchor (0) */}
                    <div className="lg:col-span-4 flex items-start gap-2.5">
                      <span className="w-5 h-5 rounded-full bg-slate-200 text-slate-700 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                        {index + 1}
                      </span>
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 block lg:hidden">
                          Score 0 (Better):
                        </span>
                        <p className="text-xs sm:text-sm font-semibold text-slate-800 leading-snug">
                          {q.leftAnchor}
                        </p>
                      </div>
                    </div>

                    {/* Middle Score Blocks (0 1 2 3 4 5) */}
                    <div className="lg:col-span-4 flex items-center justify-center py-1 lg:py-0">
                      <div className="grid grid-cols-6 gap-1.5 sm:gap-2 w-full max-w-xs">
                        {[0, 1, 2, 3, 4, 5].map((score) => {
                          const isSelected = currentScore === score;
                          return (
                            <button
                              key={score}
                              type="button"
                              onClick={() => handleSelectScore(q.id, score)}
                              className={`h-10 sm:h-11 rounded-xl font-black text-sm transition-all border flex items-center justify-center active:scale-95 ${
                                isSelected
                                  ? 'bg-teal-600 text-white border-teal-600 shadow-md ring-2 ring-teal-300 scale-105'
                                  : 'bg-white hover:bg-slate-100 text-slate-700 border-slate-300'
                              }`}
                            >
                              {score}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Right Anchor (5) */}
                    <div className="lg:col-span-3 text-left lg:text-right">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-rose-700 block lg:hidden">
                        Score 5 (Worst):
                      </span>
                      <p className="text-xs sm:text-sm font-semibold text-slate-800 leading-snug">
                        {q.rightAnchor}
                      </p>
                    </div>

                    {/* Row Score Badge */}
                    <div className="lg:col-span-1 flex items-center justify-between lg:justify-end">
                      <span className="text-xs text-slate-400 font-bold lg:hidden">Selected Score:</span>
                      <span className="w-9 h-9 rounded-xl bg-teal-50 border border-teal-200 text-teal-800 font-black text-sm flex items-center justify-center">
                        {currentScore}
                      </span>
                    </div>

                  </div>
                </div>
              );
            })}
          </div>

          {/* Additional Daily Factors */}
          <div className="pt-4 border-t border-slate-200 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Fast-Acting Rescue Inhaler Puffs Today:
              </label>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setRescuePuffs(Math.max(0, rescuePuffs - 1))}
                  className="w-9 h-9 rounded-xl bg-white border border-slate-200 text-slate-700 font-bold hover:bg-slate-100 text-lg"
                >
                  -
                </button>
                <span className="w-16 py-1.5 bg-white rounded-xl border border-slate-200 text-center font-black text-base text-slate-800">
                  {rescuePuffs}
                </span>
                <button
                  type="button"
                  onClick={() => setRescuePuffs(rescuePuffs + 1)}
                  className="w-9 h-9 rounded-xl bg-teal-100 border border-teal-200 text-teal-800 font-bold hover:bg-teal-200 text-lg"
                >
                  +
                </button>
              </div>
            </div>

            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Optional Notes for Doctor:
              </label>
              <input
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="e.g. Flare-up triggered by cold morning air, fatigue..."
                className="w-full px-3 py-2 text-xs rounded-xl bg-white border border-slate-200 text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-400"
              />
            </div>
          </div>

          {/* Total Score & Clinical Impact Section */}
          <div className="pt-6 border-t-2 border-slate-200">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
              
              {/* Big Score Block */}
              <div className="lg:col-span-4 p-6 rounded-3xl bg-gradient-to-tr from-slate-900 to-slate-800 text-white shadow-lg text-center">
                <span className="text-[10px] uppercase font-bold tracking-widest text-teal-400 block mb-1">
                  TOTAL CAT SCORE
                </span>
                <div className="text-5xl font-black tracking-tight my-1">
                  {totalScore} <span className="text-xl font-normal text-slate-400">/ 40</span>
                </div>
                <div className={`mt-3 inline-block px-3.5 py-1 rounded-full text-xs font-extrabold border ${impact.badgeBg}`}>
                  {impact.level}
                </div>
              </div>

              {/* Clinical Interpretation & Guidelines */}
              <div className="lg:col-span-8 space-y-3">
                <div className={`p-4 sm:p-5 rounded-2xl border ${impact.summaryBg}`}>
                  <h4 className={`text-sm font-extrabold mb-1 ${impact.textColor}`}>
                    GOLD Guidelines Interpretation ({impact.level}):
                  </h4>
                  <p className={`text-xs sm:text-sm leading-relaxed ${impact.textColor}`}>
                    {impact.clinicalAdvice}
                  </p>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] text-center">
                  <div className={`p-2 rounded-xl border ${totalScore < 10 ? 'bg-emerald-100 border-emerald-400 font-bold' : 'bg-slate-50 border-slate-200 text-slate-500'}`}>
                    &lt; 10: Low Impact
                  </div>
                  <div className={`p-2 rounded-xl border ${totalScore >= 10 && totalScore <= 20 ? 'bg-amber-100 border-amber-400 font-bold' : 'bg-slate-50 border-slate-200 text-slate-500'}`}>
                    10–20: Medium
                  </div>
                  <div className={`p-2 rounded-xl border ${totalScore >= 21 && totalScore <= 30 ? 'bg-orange-100 border-orange-400 font-bold' : 'bg-slate-50 border-slate-200 text-slate-500'}`}>
                    21–30: High
                  </div>
                  <div className={`p-2 rounded-xl border ${totalScore > 30 ? 'bg-rose-100 border-rose-400 font-bold' : 'bg-slate-50 border-slate-200 text-slate-500'}`}>
                    &gt; 30: Very High
                  </div>
                </div>
              </div>

            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
            <button
              onClick={handleResetForm}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Answers to 0</span>
            </button>

            <button
              onClick={handleSaveAssessment}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-3 rounded-2xl bg-teal-600 hover:bg-teal-700 text-white font-extrabold text-sm shadow-md transition-all active:scale-95"
            >
              <Save className="w-4 h-4" />
              <span>Save & Record Assessment</span>
            </button>
          </div>

          {saveSuccess && (
            <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold text-center animate-in fade-in">
              ✓ CAT Score ({totalScore}/40) successfully recorded for {patientName || 'Patient'} on {todayDate}!
            </div>
          )}

        </div>
      ) : (
        /* Historical Log Records */
        <div className="space-y-4">
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex items-center justify-between">
            <div>
              <h2 className="text-base font-extrabold text-slate-900">Recorded CAT Assessments</h2>
              <p className="text-xs text-slate-500">Track how your COPD severity changes over time</p>
            </div>
            {logs.length > 0 && (
              <button
                onClick={() => window.print()}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print All for Pulmonologist</span>
              </button>
            )}
          </div>

          {logs.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 text-slate-500">
              <ClipboardCheck className="w-12 h-12 mx-auto text-slate-300 mb-2" />
              <p className="text-sm font-bold text-slate-700">No assessments recorded yet.</p>
              <p className="text-xs mt-1">Take the 8-question CAT survey in the tab above!</p>
            </div>
          ) : (
            <div className="space-y-3">
              {logs.map((log) => {
                const dateStr = new Date(log.date).toLocaleDateString([], {
                  weekday: 'short',
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                });

                return (
                  <div
                    key={log.id}
                    className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4"
                  >
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <Calendar className="w-4 h-4 text-teal-600" />
                        <span className="font-extrabold text-slate-800 text-sm">{dateStr}</span>
                        {log.patientName && (
                          <span className="text-xs text-slate-500 font-medium">({log.patientName})</span>
                        )}
                        <span className="text-xs px-2.5 py-0.5 rounded-full font-bold bg-slate-100 text-slate-700 border border-slate-200">
                          {log.severityLevel}
                        </span>
                      </div>

                      {log.notes && (
                        <p className="text-xs text-slate-600 mt-1 italic">
                          "{log.notes}"
                        </p>
                      )}

                      {log.rescuePuffsUsedToday !== undefined && log.rescuePuffsUsedToday > 0 && (
                        <span className="text-[11px] font-semibold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-md inline-block mt-1">
                          {log.rescuePuffsUsedToday} rescue puffs recorded
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-4 shrink-0">
                      <div className="text-right">
                        <span className="text-[10px] uppercase font-bold text-slate-400 block">CAT Score</span>
                        <span className="text-2xl font-black text-teal-700">
                          {log.totalScore} <span className="text-xs font-normal text-slate-400">/ 40</span>
                        </span>
                      </div>

                      <button
                        onClick={() => {
                          const updated = storage.deleteSymptomLog(log.id);
                          setLogs(updated);
                        }}
                        className="p-2 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors"
                        title="Delete log"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
