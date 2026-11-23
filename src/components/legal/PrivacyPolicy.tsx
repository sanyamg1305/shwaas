import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Lock, 
  EyeOff, 
  Database, 
  MapPin, 
  Trash2, 
  Download, 
  CheckCircle, 
  AlertTriangle, 
  ArrowLeft,
  FileText,
  Server,
  Share2
} from 'lucide-react';
import { storage } from '../../services/storageService';

interface PrivacyPolicyProps {
  onBack?: () => void;
}

export const PrivacyPolicy: React.FC<PrivacyPolicyProps> = ({ onBack }) => {
  const [clearedMessage, setClearedMessage] = useState(false);
  const [exportedMessage, setExportedMessage] = useState(false);

  const handleExportData = () => {
    try {
      const data = {
        patientName: storage.getPatientName(),
        symptomLogs: storage.getSymptomLogs(),
        doctorAppointments: storage.getDoctorAppointments(),
        medications: storage.getMedications(),
        medicationLogs: storage.getMedicationLogs(),
        breathingLogs: storage.getBreathingLogs(),
        savedPulmonologists: storage.getSavedPulmonologists(),
        exportedAt: new Date().toISOString(),
        appName: 'Shwaas COPD Companion',
        version: '1.0.0',
      };

      const jsonStr = JSON.stringify(data, null, 2);
      const blob = new Blob([jsonStr], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `shwaas-health-backup-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      setExportedMessage(true);
      setTimeout(() => setExportedMessage(false), 3500);
    } catch (e) {
      console.error('Failed to export health data:', e);
    }
  };

  const handleClearAllData = () => {
    const confirmed = window.confirm(
      'Are you sure you want to delete all locally stored Shwaas health logs, CAT assessments, and medication tracking history? This action cannot be undone.'
    );

    if (confirmed) {
      localStorage.clear();
      setClearedMessage(true);
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-10">
      {/* Header Bar with Back Button */}
      {onBack && (
        <button
          onClick={onBack}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-teal-700 hover:text-teal-900 bg-white px-3.5 py-2 rounded-xl border border-slate-200 shadow-2xs hover:bg-slate-50 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Dashboard</span>
        </button>
      )}

      {/* Main Hero Header */}
      <div className="bg-gradient-to-br from-teal-800 via-teal-900 to-slate-900 text-white rounded-3xl p-6 sm:p-10 shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 translate-x-12 -translate-y-12 w-64 h-64 bg-teal-500/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-500/20 border border-teal-400/30 text-teal-200 text-xs font-semibold mb-3">
            <ShieldCheck className="w-4 h-4 text-teal-300" />
            <span>Digital Personal Data Protection & Health Privacy</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
            Privacy Policy & Data Security
          </h1>
          <p className="text-slate-300 text-xs sm:text-sm mt-2 max-w-2xl leading-relaxed">
            Your respiratory health data belongs solely to you. Shwaas is built on a 
            <strong> zero-knowledge, 100% on-device architecture</strong>. We do not sell, track, or transmit your medical history to any third-party ad networks or surveillance brokers.
          </p>

          <div className="flex flex-wrap gap-3 mt-5 pt-4 border-t border-teal-700/60 text-[11px] text-teal-200">
            <span>Last Updated: November 2026</span>
            <span>•</span>
            <span>Framework: DPDP Act (India) & Global Medical Privacy Standards</span>
            <span>•</span>
            <span>Storage: Local Browser Only</span>
          </div>
        </div>
      </div>

      {/* Quick Summary Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
          <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center mb-3">
            <Lock className="w-5 h-5" />
          </div>
          <h3 className="font-extrabold text-slate-900 text-sm">100% Local Device Storage</h3>
          <p className="text-slate-600 text-xs mt-1 leading-relaxed">
            All your CAT questionnaires, spirometry values, inhaler doses, and notes are saved directly in your browser's private <code className="bg-slate-100 px-1 py-0.5 rounded text-[11px]">localStorage</code>.
          </p>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
          <div className="w-10 h-10 rounded-xl bg-cyan-50 text-cyan-700 flex items-center justify-center mb-3">
            <EyeOff className="w-5 h-5" />
          </div>
          <h3 className="font-extrabold text-slate-900 text-sm">No Accounts or Passwords</h3>
          <p className="text-slate-600 text-xs mt-1 leading-relaxed">
            You don't need to create an account, provide an email address, or link personal identifiers to use Shwaas guided breathing or symptom tracking.
          </p>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center mb-3">
            <Server className="w-5 h-5" />
          </div>
          <h3 className="font-extrabold text-slate-900 text-sm">Zero Cloud Tracking</h3>
          <p className="text-slate-600 text-xs mt-1 leading-relaxed">
            We operate zero analytics cookies, tracking pixels, or advertising beacons. Your health records are never uploaded to remote servers.
          </p>
        </div>
      </div>

      {/* Detailed Policy Sections */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6 text-slate-700 text-xs sm:text-sm leading-relaxed">
        
        {/* Section 1 */}
        <section className="space-y-2">
          <h2 className="text-base sm:text-lg font-extrabold text-slate-900 flex items-center gap-2">
            <span className="w-6 h-6 rounded-lg bg-teal-100 text-teal-800 text-xs flex items-center justify-center font-black">1</span>
            Health & Clinical Information We Process Locally
          </h2>
          <p>
            When you use the Shwaas platform, the following respiratory and pulmonary data points may be recorded on your device:
          </p>
          <ul className="list-disc pl-5 space-y-1 text-slate-600">
            <li><strong>COPD Assessment Test™ (CAT) Scores:</strong> Ratings (0–5) across the 8 clinical dimensions (cough, phlegm, chest tightness, breathlessness, activity limitation, confidence leaving home, sleep quality, energy levels).</li>
            <li><strong>Medication & Inhaler Dose Logs:</strong> Inhaler canister counts, remaining puff numbers, time stamps, and emergency rescue puff logs.</li>
            <li><strong>Pulmonary Rehab Logs:</strong> Duration and repetitions of diaphragmatic, pursed-lip, and thoracic breathing exercises.</li>
            <li><strong>Doctor Follow-Up Records:</strong> Spirometry test notes (<InlineMath>FEV_1 \%</InlineMath>, <InlineMath>SpO_2 \%</InlineMath>) and consultation preparation questions.</li>
          </ul>
          <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200/80 text-slate-600 text-xs">
            <strong>Key Distinction:</strong> All of the above data stays exclusively on your client device. None of this health data is transmitted to or stored on our servers.
          </div>
        </section>

        {/* Section 2 */}
        <section className="space-y-2">
          <h2 className="text-base sm:text-lg font-extrabold text-slate-900 flex items-center gap-2">
            <span className="w-6 h-6 rounded-lg bg-teal-100 text-teal-800 text-xs flex items-center justify-center font-black">2</span>
            Location Data & Environmental Air Quality (AQI)
          </h2>
          <p>
            To protect patients with COPD from dangerous air pollution triggers (<InlineMath>PM_{2.5}</InlineMath>, <InlineMath>PM_{10}</InlineMath>, <InlineMath>NO_2</InlineMath>), Shwaas retrieves live environmental metrics:
          </p>
          <ul className="list-disc pl-5 space-y-1 text-slate-600">
            <li><strong>GPS Geolocation:</strong> Requested through your browser's standard prompt solely to fetch local AQI readings and calculate distance to nearby chest clinics.</li>
            <li><strong>IP-based Geolocation Fallback:</strong> If GPS is unavailable or declined, a general city-level lookup is used to avoid forcing incorrect defaults.</li>
            <li><strong>No Location Tracking:</strong> Coordinates are used ephemerally in real time to fetch data from the open-source Open-Meteo Air Quality API and OpenStreetMap. Your location history is never tracked, stored remotely, or profiled.</li>
          </ul>
        </section>

        {/* Section 3 */}
        <section className="space-y-2">
          <h2 className="text-base sm:text-lg font-extrabold text-slate-900 flex items-center gap-2">
            <span className="w-6 h-6 rounded-lg bg-teal-100 text-teal-800 text-xs flex items-center justify-center font-black">3</span>
            Third-Party Services & Integrations
          </h2>
          <p>
            Shwaas connects to a minimal set of public, privacy-respecting APIs:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2">
            <div className="p-3 rounded-2xl border border-slate-100 bg-slate-50">
              <h4 className="font-bold text-slate-800 text-xs">Open-Meteo Air Quality API</h4>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Free, zero-key, EU-hosted meteorological service that delivers live US EPA AQI and pollutant counts without tracking user identity.
              </p>
            </div>
            <div className="p-3 rounded-2xl border border-slate-100 bg-slate-50">
              <h4 className="font-bold text-slate-800 text-xs">YouTube Video Embeds</h4>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Educational inhaler demonstration videos are loaded using privacy-enhanced YouTube player embeds (<code className="text-[10px]">youtube-nocookie.com</code>).
              </p>
            </div>
          </div>
        </section>

        {/* Section 4 */}
        <section className="space-y-2">
          <h2 className="text-base sm:text-lg font-extrabold text-slate-900 flex items-center gap-2">
            <span className="w-6 h-6 rounded-lg bg-teal-100 text-teal-800 text-xs flex items-center justify-center font-black">4</span>
            Compliance with India's DPDP Act, 2023
          </h2>
          <p>
            In accordance with India's <strong>Digital Personal Data Protection Act, 2023 (DPDP)</strong>:
          </p>
          <ul className="list-disc pl-5 space-y-1 text-slate-600">
            <li><strong>Right to Access & Portability:</strong> You can export your entire clinical history and logs in machine-readable JSON format at any time using the button below.</li>
            <li><strong>Right to Erasure:</strong> You can permanently wipe all stored assessments and medications from your device in a single click.</li>
            <li><strong>Data Minimization:</strong> Shwaas only processes the minimum data strictly required to calculate your CAT score and provide breathing pacing.</li>
          </ul>
        </section>

        {/* Section 5 */}
        <section className="space-y-2">
          <h2 className="text-base sm:text-lg font-extrabold text-slate-900 flex items-center gap-2">
            <span className="w-6 h-6 rounded-lg bg-teal-100 text-teal-800 text-xs flex items-center justify-center font-black">5</span>
            Medical Disclaimer
          </h2>
          <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200/80 text-amber-900 text-xs leading-relaxed flex items-start gap-2.5">
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <strong>Not Medical Advice:</strong> Shwaas is an educational companion and self-monitoring application designed to support COPD patients and their caregivers. It is <strong>not</strong> an automated diagnostic device and does not replace the judgment of a licensed chest physician or pulmonologist. In case of acute respiratory distress, severe chest tightness, or cyanosis, dial <strong>108 (Ambulance)</strong> or <strong>112 (National Emergency)</strong> immediately.
            </div>
          </div>
        </section>
      </div>

      {/* User Data Management & Portability Arena */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm">
        <h2 className="text-base sm:text-lg font-extrabold text-slate-900 mb-1">
          Your Data, Your Control
        </h2>
        <p className="text-slate-600 text-xs mb-5">
          Exercise your privacy rights at any time directly from your browser.
        </p>

        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={handleExportData}
            className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-2xl bg-teal-50 hover:bg-teal-100 text-teal-800 border border-teal-200 text-xs sm:text-sm font-bold transition-all shadow-2xs"
          >
            <Download className="w-4 h-4 text-teal-600" />
            <span>Export Health Backup (JSON)</span>
          </button>

          <button
            onClick={handleClearAllData}
            className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-2xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs sm:text-sm font-bold transition-all shadow-2xs"
          >
            <Trash2 className="w-4 h-4 text-rose-600" />
            <span>Clear All Local Data & Reset</span>
          </button>
        </div>

        {exportedMessage && (
          <div className="mt-3 p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Health data exported successfully! Download saved to your device.</span>
          </div>
        )}

        {clearedMessage && (
          <div className="mt-3 p-3 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>All local data cleared. Reloading Shwaas...</span>
          </div>
        )}
      </div>
    </div>
  );
};

// Inline helper for KaTeX / formulas
const InlineMath: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <span className="font-mono text-slate-900 font-semibold">{children}</span>;
};
