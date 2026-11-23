import React, { useState } from 'react';
import { Navbar, ActiveTab } from './components/common/Navbar';
import { EmergencyModal } from './components/common/EmergencyModal';
import { AQISection } from './components/aqi/AQISection';
import { SymptomTracker } from './components/symptoms/SymptomTracker';
import { BreathingExercises } from './components/breathing/BreathingExercises';
import { PulmonologistFinder } from './components/pulmonologist/PulmonologistFinder';
import { DoctorFollowups } from './components/followups/DoctorFollowups';
import { InhalerGuide } from './components/inhaler/InhalerGuide';
import { MedicationTracker } from './components/medication/MedicationTracker';
import { HeartPulse, ShieldAlert, Sparkles, Wind } from 'lucide-react';

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<ActiveTab>('aqi');
  const [emergencyModalOpen, setEmergencyModalOpen] = useState<boolean>(false);

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
      </main>

      {/* Emergency Action Plan Modal */}
      <EmergencyModal
        isOpen={emergencyModalOpen}
        onClose={() => setEmergencyModalOpen(false)}
      />

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 mt-12 py-8 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-teal-600 text-white flex items-center justify-center font-black text-xs">
              <HeartPulse className="w-3.5 h-3.5" />
            </div>
            <span className="font-extrabold text-slate-800 text-sm">Shwaas COPD Companion</span>
            <span>— Empowering Respiratory Health</span>
          </div>

          <p className="text-center md:text-right max-w-md text-[11px] text-slate-400 leading-normal">
            <strong>Medical Notice:</strong> Shwaas provides self-monitoring tools and educational guides. It does not substitute professional medical diagnosis or emergency treatment. In acute distress, consult a physician or call emergency services immediately.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default App;
