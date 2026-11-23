import React, { useState, useEffect } from 'react';
import { Navbar, ActiveTab } from './components/common/Navbar';
import { EmergencyModal } from './components/common/EmergencyModal';
import { AQISection } from './components/aqi/AQISection';
import { SymptomTracker } from './components/symptoms/SymptomTracker';
import { BreathingExercises } from './components/breathing/BreathingExercises';
import { PulmonologistFinder } from './components/pulmonologist/PulmonologistFinder';
import { DoctorFollowups } from './components/followups/DoctorFollowups';
import { InhalerGuide } from './components/inhaler/InhalerGuide';
import { MedicationTracker } from './components/medication/MedicationTracker';
import { PrivacyPolicy } from './components/legal/PrivacyPolicy';
import { detectUserLocation } from './services/locationService';
import { HeartPulse, ShieldAlert, Sparkles, Wind, ShieldCheck } from 'lucide-react';

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<ActiveTab>('aqi');
  const [emergencyModalOpen, setEmergencyModalOpen] = useState<boolean>(false);

  useEffect(() => {
    // Proactively detect user location on startup
    detectUserLocation(false).catch(() => {});
  }, []);

  const navigateToTab = (tab: ActiveTab) => {
    setActiveTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800">
      {/* Top Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenEmergency={() => setEmergencyModalOpen(true)}
      />

      {/* Main Content Area (With bottom padding on mobile for sticky navigation bar) */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-5 sm:py-8 pb-28 sm:pb-12">
        {activeTab === 'aqi' && <AQISection />}
        {activeTab === 'symptoms' && <SymptomTracker />}
        {activeTab === 'breathing' && <BreathingExercises />}
        {activeTab === 'inhaler' && <InhalerGuide />}
        {activeTab === 'medication' && <MedicationTracker />}
        {activeTab === 'followups' && <DoctorFollowups />}
        {activeTab === 'pulmonologist' && <PulmonologistFinder />}
        {activeTab === 'privacy' && <PrivacyPolicy onBack={() => navigateToTab('breathing')} />}
      </main>

      {/* Emergency Action Plan Modal */}
      <EmergencyModal
        isOpen={emergencyModalOpen}
        onClose={() => setEmergencyModalOpen(false)}
      />

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 mt-12 py-8 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col gap-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg overflow-hidden border border-slate-200 shadow-2xs">
                <img src="/logo.jpeg" alt="Shwaas Logo" className="w-full h-full object-cover" />
              </div>
              <div>
                <span className="font-extrabold text-slate-900 text-sm block">Shwaas COPD Companion</span>
                <span className="text-[11px] text-slate-400">100% Private, On-Device Respiratory Health</span>
              </div>
            </div>

            {/* Quick Navigation & Legal Links */}
            <div className="flex flex-wrap items-center justify-center gap-4 text-xs font-semibold text-slate-600">
              <button 
                onClick={() => navigateToTab('breathing')}
                className="hover:text-teal-700 transition-colors"
              >
                Breathing Exercises
              </button>
              <span>•</span>
              <button 
                onClick={() => navigateToTab('inhaler')}
                className="hover:text-teal-700 transition-colors"
              >
                Inhaler Guide
              </button>
              <span>•</span>
              <button 
                onClick={() => navigateToTab('pulmonologist')}
                className="hover:text-teal-700 transition-colors"
              >
                Find Doctors
              </button>
              <span>•</span>
              <button 
                onClick={() => navigateToTab('privacy')}
                className="flex items-center gap-1 text-teal-700 hover:text-teal-900 font-bold underline underline-offset-2 transition-colors"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Privacy Policy</span>
              </button>
              <span>•</span>
              <button 
                onClick={() => setEmergencyModalOpen(true)}
                className="text-rose-600 hover:text-rose-800 font-extrabold transition-colors"
              >
                108 SOS Help
              </button>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
            <p className="text-[11px] text-slate-400">
              © {new Date().getFullYear()} Shwaas. All health assessments and personal records are stored strictly on your local device.
            </p>
            <p className="max-w-md text-[10px] text-slate-400 leading-normal">
              <strong>Medical Notice:</strong> Educational companion only; does not replace physician advice. In respiratory distress, call emergency services (108/112).
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
