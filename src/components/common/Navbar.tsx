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
  HeartPulse
} from 'lucide-react';

export type ActiveTab = 'aqi' | 'symptoms' | 'breathing' | 'pulmonologist' | 'followups' | 'inhaler' | 'medication';

interface NavbarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  onOpenEmergency: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ activeTab, setActiveTab, onOpenEmergency }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems: { id: ActiveTab; label: string; icon: React.ReactNode; badge?: string }[] = [
    { id: 'aqi', label: 'Air Quality (AQI)', icon: <Wind className="w-4 h-4" /> },
    { id: 'symptoms', label: 'Symptom Tracker', icon: <ClipboardCheck className="w-4 h-4" /> },
    { id: 'breathing', label: 'Breathing Exercises', icon: <Activity className="w-4 h-4" /> },
    { id: 'inhaler', label: 'Inhaler Guide', icon: <Info className="w-4 h-4" /> },
    { id: 'medication', label: 'Medications', icon: <Pill className="w-4 h-4" /> },
    { id: 'followups', label: 'Doctor Follow-Ups', icon: <Calendar className="w-4 h-4" /> },
    { id: 'pulmonologist', label: 'Find Pulmonologist', icon: <MapPin className="w-4 h-4" /> },
  ];

  const handleSelectTab = (tab: ActiveTab) => {
    setActiveTab(tab);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-slate-200 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <div 
            onClick={() => handleSelectTab('aqi')}
            className="flex items-center gap-2.5 cursor-pointer select-none group"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-teal-600 to-cyan-500 flex items-center justify-center text-white shadow-md shadow-teal-500/20 group-hover:scale-105 transition-transform">
              <HeartPulse className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-2xl tracking-tight bg-gradient-to-r from-teal-800 to-cyan-700 bg-clip-text text-transparent">
                  Shwaas
                </span>
                <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded-full bg-teal-100 text-teal-800 border border-teal-200">
                  COPD Companion
                </span>
              </div>
              <p className="text-xs text-slate-500 hidden sm:block">Daily Respiratory Health & Inhaler Guide</p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden xl:flex items-center space-x-1">
            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleSelectTab(item.id)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-teal-50 text-teal-800 font-semibold shadow-xs border border-teal-100'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <span className={isActive ? 'text-teal-600' : 'text-slate-400'}>
                    {item.icon}
                  </span>
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Right Action: Emergency Button & Mobile Toggle */}
          <div className="flex items-center gap-2.5">
            <button
              onClick={onOpenEmergency}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200 text-xs sm:text-sm font-semibold transition-colors shadow-xs"
              title="COPD Action Plan Red Zone: When to call for urgent help"
            >
              <AlertTriangle className="w-4 h-4 text-rose-600" />
              <span>Emergency Help</span>
            </button>

            {/* Mobile menu hamburger button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="xl:hidden p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 focus:outline-none"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Sub-nav row for intermediate screen sizes (tablets/laptops) */}
      <div className="hidden md:flex xl:hidden border-t border-slate-100 bg-slate-50/70 overflow-x-auto py-1 px-4 max-w-7xl mx-auto gap-1">
        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => handleSelectTab(item.id)}
              className={`whitespace-nowrap flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                isActive
                  ? 'bg-white text-teal-700 font-semibold shadow-xs border border-slate-200'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {item.icon}
              {item.label}
            </button>
          );
        })}
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="xl:hidden border-t border-slate-200 bg-white px-4 pt-2 pb-4 space-y-1 shadow-lg">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleSelectTab(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-teal-50 text-teal-800 font-bold border-l-4 border-teal-600'
                    : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                <span className={isActive ? 'text-teal-600' : 'text-slate-500'}>
                  {item.icon}
                </span>
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      )}
    </header>
  );
};
