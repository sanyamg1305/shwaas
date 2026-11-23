import React from 'react';
import { AlertOctagon, PhoneCall, X, ShieldAlert, Heart, CheckCircle2 } from 'lucide-react';

interface EmergencyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const EmergencyModal: React.FC<EmergencyModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="relative bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl border-2 border-rose-400 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center shrink-0">
            <AlertOctagon className="w-7 h-7" />
          </div>
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-rose-600 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-200">
              COPD Action Plan: RED ZONE
            </span>
            <h2 className="text-xl font-extrabold text-slate-900 mt-0.5">
              Medical Emergency Guidance
            </h2>
          </div>
        </div>

        {/* Urgent Call to Action */}
        <div className="bg-rose-50 border border-rose-200 rounded-xl p-4 mb-4 text-rose-900">
          <p className="font-bold text-base flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-rose-600 shrink-0" />
            If you experience any of the following, call for emergency medical help immediately:
          </p>
          <ul className="mt-2.5 space-y-1.5 text-sm list-disc list-inside text-rose-800">
            <li><strong>Severe breathlessness</strong> even while resting quietly or sitting still</li>
            <li><strong>Blue, gray, or pale color</strong> in your lips, tongue, or fingernails (cyanosis)</li>
            <li><strong>Chest pain or heavy tightness</strong> that does not go away</li>
            <li><strong>Confusion, slurred speech</strong>, extreme drowsiness, or trouble answering questions</li>
            <li><strong>Rescue inhaler is NOT working</strong> after recommended puffs</li>
            <li>Coughing up fresh blood</li>
          </ul>
        </div>

        {/* Immediate Steps to take while waiting for help */}
        <div className="mb-5 space-y-2.5">
          <h3 className="font-bold text-slate-800 text-sm flex items-center gap-2">
            <Heart className="w-4 h-4 text-teal-600" />
            Immediate Steps While Awaiting Medical Assistance:
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-700">
            <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
              <span className="font-bold text-slate-900 block mb-1">1. Sit Upright / Tripod</span>
              Sit leaning slightly forward with elbows on your knees or a table. Do not lie flat.
            </div>
            <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
              <span className="font-bold text-slate-900 block mb-1">2. Use Rescue Inhaler</span>
              Take your fast-acting rescue inhaler (e.g. Albuterol) with your spacer as prescribed.
            </div>
            <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
              <span className="font-bold text-slate-900 block mb-1">3. Pursed-Lip Breathing</span>
              Breathe gently in through nose (2s), blow out through puckered lips (4s) to calm airways.
            </div>
            <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
              <span className="font-bold text-slate-900 block mb-1">4. Do Not Drive Yourself</span>
              Have an ambulance or trusted caregiver take you to the emergency department.
            </div>
          </div>
        </div>

        {/* Emergency Call Buttons */}
        <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-100">
          <a
            href="tel:911"
            className="flex items-center justify-center gap-2 px-4 py-3 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl shadow-md transition-colors text-center"
          >
            <PhoneCall className="w-5 h-5" />
            <span>Call 911 (US/CAN)</span>
          </a>
          <a
            href="tel:112"
            className="flex items-center justify-center gap-2 px-4 py-3 bg-rose-800 hover:bg-rose-900 text-white font-bold rounded-xl shadow-md transition-colors text-center"
          >
            <PhoneCall className="w-5 h-5" />
            <span>Call 112 (EU/India)</span>
          </a>
        </div>

        <div className="mt-3 text-center">
          <button
            onClick={onClose}
            className="text-xs text-slate-500 hover:text-slate-800 font-medium py-1"
          >
            Dismiss / I am okay
          </button>
        </div>
      </div>
    </div>
  );
};
