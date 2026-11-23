import React, { useState, useEffect } from 'react';
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
  Stethoscope,
  ChevronRight,
  Phone
} from 'lucide-react';
import { getSavedLocation, UserLocation } from '../../services/locationService';

export type ActiveTab = 'breathing' | 'aqi' | 'symptoms' | 'inhaler' | 'medication' | 'followups' | 'pulmonologist';

interface NavbarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  onOpenEmergency: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ activeTab, setActiveTab, onOpenEmergency }) => {
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const [currentLocation, setCurrentLocation] = useState<UserLocation | null>(() => getSavedLocation());

  useEffect(() => {
    const handleLoc = (e: any) => {
      if (e.detail) setCurrentLocation(e.detail);
    };
    window.addEventListener('shwaas_location_updated', handleLoc);
    return () => window.removeEventListener('shwaas_location_updated', handleLoc);
  }, []);

  const navItems: { id: ActiveTab; label: string; shortLabel: string; icon: React.ReactNode }[] = [
    { id: 'breathing', label: 'Breathing Exercises', shortLabel: 'Breathing', icon: <Activity className="w-4 h-4" /> },
    { id: 'aqi', label: 'Air Quality (AQI)', shortLabel: 'Air (AQI)', icon: <Wind className="w-4 h-4" /> },
    { id: 'symptoms', label: 'CAT Symptom Test', shortLabel: 'CAT Test', icon: <ClipboardCheck className="w-4 h-4" /> },
    { id: 'inhaler', label: 'Inhaler Guide', shortLabel: 'Inhaler', icon: <Info className="w-4 h-4" /> },
    { id: 'medication', label: 'Medications', shortLabel: 'Meds', icon: <Pill className="w-4 h-4" /> },
    { id: 'followups', label: 'Doctor Follow-Ups', shortLabel: 'Visits', icon: <Calendar className="w-4 h-4" /> },
    { id: 'pulmonologist', label: 'Find Pulmonologist', shortLabel: 'Doctors', icon: <MapPin className="w-4 h-4" /> },
  ];

  // Mobile bottom bar items (5 primary tabs)
  const mobileBottomItems: { id: ActiveTab; label: string; icon: React.ReactNode }[] = [
    { id: 'breathing', label: 'Breathing', icon: <Activity className="w-5 h-5" /> },
    { id: 'aqi', label: 'Air AQI', icon: <Wind className="w-5 h-5" /> },
    { id: 'symptoms', label: 'CAT Test', icon: <ClipboardCheck className="w-5 h-5" /> },
    { id: 'inhaler', label: 'Inhaler', icon: <Info className="w-5 h-5" /> },
    { id: 'medication', label: 'Meds', icon: <Pill className="w-5 h-5" /> },
  ];

  const handleSelectTab = (tab: ActiveTab) => {
    setActiveTab(tab);
    setMobileDrawerOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      {/* Top Header */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14 sm:h-16">
            
            {/* Logo & Brand */}
            <div 
              onClick={() => handleSelectTab('breathing')}
              className="flex items-center gap-2.5 cursor-pointer select-none group"
            >
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-white shadow-xs border border-slate-200/80 flex items-center justify-center overflow-hidden p-0.5 group-hover:scale-105 transition-transform">
                <img 
                  src="/logo.jpeg" 
                  alt="Shwaas Logo" 
                  className="w-full h-full object-cover rounded-lg"
                />
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5">
                  <span className="font-extrabold text-lg sm:text-xl tracking-tight text-slate-900">
                    Shwaas
                  </span>
                  <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.2 rounded-md bg-teal-50 text-teal-700 border border-teal-200">
                    COPD
                  </span>
                </div>
                <div 
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSelectTab('aqi');
                  }}
                  className="flex items-center gap-1 text-[10px] text-slate-500 font-medium -mt-0.5 hover:text-teal-700 cursor-pointer"
                  title="Click to view air quality or change location"
                >
                  <MapPin className="w-2.5 h-2.5 text-teal-600 shrink-0" />
                  <span className="truncate max-w-[120px] sm:max-w-[160px]">
                    {currentLocation?.city ? `${currentLocation.city}${currentLocation.postalCode ? ' ' + currentLocation.postalCode : ''}` : 'Detecting GPS...'}
                  </span>
                  {currentLocation?.source === 'gps' && (
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" title="High-accuracy GPS active" />
                  )}
                  {currentLocation?.source === 'ip' && (
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0" title="IP location detected" />
                  )}
                </div>
              </div>
            </div>

            {/* Desktop Center Nav Tabs */}
            <nav className="hidden lg:flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200/80 space-x-1">
              {navItems.map((item) => {
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleSelectTab(item.id)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                      isActive
                        ? 'bg-white text-teal-800 shadow-xs border border-slate-200/60'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
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

            {/* Right: Emergency 108 & Mobile Menu */}
            <div className="flex items-center gap-2">
              <button
                onClick={onOpenEmergency}
                className="flex items-center gap-1 px-2.5 py-1.5 sm:px-3 sm:py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-extrabold transition-all active:scale-95 whitespace-nowrap shadow-2xs"
                title="Immediate 108 Ambulance Call & Red Zone Guidance"
              >
                <Phone className="w-3.5 h-3.5 text-rose-600 fill-rose-600" />
                <span>108 SOS</span>
              </button>

              <button
                onClick={() => setMobileDrawerOpen(!mobileDrawerOpen)}
                className="lg:hidden p-1.5 rounded-xl text-slate-600 hover:bg-slate-100 border border-slate-200 focus:outline-none"
                aria-label="Menu"
              >
                {mobileDrawerOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>

          </div>
        </div>

        {/* Mobile Full Menu Drawer */}
        {mobileDrawerOpen && (
          <div className="lg:hidden border-t border-slate-200 bg-white px-4 py-3 space-y-1.5 shadow-xl animate-in slide-in-from-top-2 duration-150">
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider pb-1">
              All Sections
            </div>
            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleSelectTab(item.id)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                    isActive
                      ? 'bg-teal-50 text-teal-900 border border-teal-200'
                      : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span className={isActive ? 'text-teal-600' : 'text-slate-400'}>
                      {item.icon}
                    </span>
                    <span>{item.label}</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-300" />
                </button>
              );
            })}
          </div>
        )}
      </header>

      {/* Modern Mobile Bottom App Bar */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/98 backdrop-blur-lg border-t border-slate-200 shadow-lg px-1 py-1 safe-area-bottom">
        <div className="grid grid-cols-5 gap-0.5 max-w-md mx-auto">
          {mobileBottomItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleSelectTab(item.id)}
                className={`flex flex-col items-center justify-center py-1 rounded-xl transition-all ${
                  isActive
                    ? 'text-teal-700 font-extrabold'
                    : 'text-slate-400 hover:text-slate-700 font-medium'
                }`}
              >
                <div className={`p-1 rounded-lg ${isActive ? 'bg-teal-50 text-teal-700' : ''}`}>
                  {item.icon}
                </div>
                <span className="text-[10px] tracking-tight">
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
