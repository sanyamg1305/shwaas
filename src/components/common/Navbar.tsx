import React, { useState } from 'react';
import { 
  Wind, 
  ClipboardCheck, 
  Activity, 
  MapPin, 
  Calendar, 
  Pill, 
  Info, 
  AlertTriangle, 
  Menu, 
  X,
  HeartPulse,
  User,
  Stethoscope,
  ChevronRight
} from 'lucide-react';
import { storage } from '../../services/storageService';

export type ActiveTab = 'aqi' | 'symptoms' | 'breathing' | 'inhaler' | 'medication' | 'followups' | 'pulmonologist';

interface NavbarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  onOpenEmergency: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ activeTab, setActiveTab, onOpenEmergency }) => {
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const patientName = storage.getPatientName();

  const navItems: { id: ActiveTab; label: string; shortLabel: string; icon: React.ReactNode; category: string }[] = [
    { id: 'aqi', label: 'Air Quality (AQI)', shortLabel: 'Air (AQI)', icon: <Wind className="w-4 h-4" />, category: 'Environment' },
    { id: 'symptoms', label: 'CAT Symptom Test', shortLabel: 'CAT Test', icon: <ClipboardCheck className="w-4 h-4" />, category: 'Assessment' },
    { id: 'breathing', label: 'Breathing Exercises', shortLabel: 'Breathing', icon: <Activity className="w-4 h-4" />, category: 'Rehabilitation' },
    { id: 'inhaler', label: 'Inhaler Guide', shortLabel: 'Inhaler', icon: <Info className="w-4 h-4" />, category: 'Education' },
    { id: 'medication', label: 'Medications & Inhalers', shortLabel: 'Meds', icon: <Pill className="w-4 h-4" />, category: 'Tracker' },
    { id: 'followups', label: 'Doctor Follow-Ups', shortLabel: 'Follow-Ups', icon: <Calendar className="w-4 h-4" />, category: 'Care' },
    { id: 'pulmonologist', label: 'Sion 400022 Doctors', shortLabel: 'Doctors', icon: <MapPin className="w-4 h-4" />, category: 'Directory' },
  ];

  // Mobile bottom bar primary items
  const mobileBottomItems: { id: ActiveTab; label: string; icon: React.ReactNode }[] = [
    { id: 'aqi', label: 'Air AQI', icon: <Wind className="w-5 h-5" /> },
    { id: 'symptoms', label: 'CAT Test', icon: <ClipboardCheck className="w-5 h-5" /> },
    { id: 'breathing', label: 'Breath', icon: <Activity className="w-5 h-5" /> },
    { id: 'medication', label: 'Meds', icon: <Pill className="w-5 h-5" /> },
    { id: 'followups', label: 'Doctors', icon: <Stethoscope className="w-5 h-5" /> },
  ];

  const handleSelectTab = (tab: ActiveTab) => {
    setActiveTab(tab);
    setMobileDrawerOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      {/* Top Main Header */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200/80 shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-18">
            
            {/* Brand Logo & Locality */}
            <div 
              onClick={() => handleSelectTab('aqi')}
              className="flex items-center gap-3 cursor-pointer select-none group"
            >
              <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-gradient-to-tr from-teal-600 via-teal-700 to-cyan-600 flex items-center justify-center text-white shadow-md shadow-teal-600/20 group-hover:scale-105 transition-transform">
                <HeartPulse className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-black text-xl sm:text-2xl tracking-tight bg-gradient-to-r from-teal-900 to-cyan-800 bg-clip-text text-transparent">
                    Shwaas
                  </span>
                  <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-teal-50 text-teal-800 border border-teal-200/70 hidden sm:inline-block">
                    COPD Companion
                  </span>
                </div>
                <div className="flex items-center gap-1.5 text-[11px] text-slate-500 font-medium">
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="font-semibold text-slate-700">Mumbai (Sion 400022)</span>
                </div>
              </div>
            </div>

            {/* Desktop Center Segment Nav (Tablets & Desktops) */}
            <nav className="hidden lg:flex items-center bg-slate-100/80 p-1.5 rounded-2xl border border-slate-200/80 space-x-1 shadow-inner">
              {navItems.map((item) => {
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleSelectTab(item.id)}
                    className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                      isActive
                        ? 'bg-white text-teal-800 shadow-sm border border-slate-200/60 scale-102'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
                    }`}
                  >
                    <span className={isActive ? 'text-teal-600' : 'text-slate-400'}>
                      {item.icon}
                    </span>
                    <span>{item.shortLabel}</span>
                  </button>
                );
              })}
            </nav>

            {/* Right Quick Actions: Patient chip, SOS & Menu */}
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Patient Badge */}
              <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-700">
                <div className="w-5 h-5 rounded-full bg-teal-100 text-teal-800 font-bold flex items-center justify-center text-[10px]">
                  <User className="w-3 h-3" />
                </div>
                <span className="font-semibold">{patientName}</span>
              </div>

              {/* Emergency SOS Button */}
              <button
                onClick={onOpenEmergency}
                className="flex items-center gap-1.5 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl bg-gradient-to-r from-rose-50 to-red-50 text-rose-700 hover:from-rose-100 hover:to-red-100 border border-rose-200 text-xs sm:text-sm font-extrabold transition-all shadow-xs active:scale-95 animate-pulse-subtle"
                title="Immediate emergency guidelines & 108 ambulance call"
              >
                <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>Emergency 108</span>
              </button>

              {/* Mobile Drawer Trigger (More tabs) */}
              <button
                onClick={() => setMobileDrawerOpen(!mobileDrawerOpen)}
                className="lg:hidden p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 focus:outline-none transition-colors border border-slate-200/80"
                aria-label="Open full menu"
              >
                {mobileDrawerOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>

          </div>
        </div>

        {/* Mobile slide-down full directory menu */}
        {mobileDrawerOpen && (
          <div className="lg:hidden border-t border-slate-200 bg-white/98 backdrop-blur-xl px-4 py-4 space-y-2 shadow-2xl animate-in slide-in-from-top-4 duration-200">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 text-xs text-slate-500">
              <span className="font-bold uppercase tracking-wider">All Health Features</span>
              <span className="text-teal-700 font-semibold">{patientName} (Sion 400022)</span>
            </div>

            <div className="grid grid-cols-1 gap-1.5 pt-1">
              {navItems.map((item) => {
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleSelectTab(item.id)}
                    className={`w-full flex items-center justify-between px-3.5 py-3 rounded-2xl text-sm font-bold transition-all ${
                      isActive
                        ? 'bg-teal-50 text-teal-900 border border-teal-200 shadow-2xs'
                        : 'text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-xl ${isActive ? 'bg-teal-600 text-white' : 'bg-slate-100 text-slate-600'}`}>
                        {item.icon}
                      </div>
                      <div className="text-left">
                        <span className="block font-bold">{item.label}</span>
                        <span className="text-[10px] text-slate-400 font-normal">{item.category}</span>
                      </div>
                    </div>
                    <ChevronRight className={`w-4 h-4 ${isActive ? 'text-teal-700' : 'text-slate-300'}`} />
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </header>

      {/* Modern Mobile Bottom App Bar (Sticky on phones) */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-xl border-t border-slate-200/90 shadow-2xl px-2 py-1.5 safe-area-bottom">
        <div className="grid grid-cols-5 gap-1 max-w-md mx-auto">
          {mobileBottomItems.map((item) => {
            const isActive = activeTab === item.id || (item.id === 'followups' && activeTab === 'pulmonologist');
            return (
              <button
                key={item.id}
                onClick={() => handleSelectTab(item.id)}
                className={`flex flex-col items-center justify-center py-1.5 px-1 rounded-2xl transition-all ${
                  isActive
                    ? 'text-teal-700 font-black scale-105'
                    : 'text-slate-400 hover:text-slate-700 font-semibold'
                }`}
              >
                <div className={`p-1.5 rounded-xl transition-all ${
                  isActive ? 'bg-teal-50 text-teal-700 shadow-2xs ring-1 ring-teal-200' : ''
                }`}>
                  {item.icon}
                </div>
                <span className="text-[10px] tracking-tight mt-0.5">
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </>
  );
};
