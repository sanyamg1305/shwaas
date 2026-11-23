import React, { useState, useEffect } from 'react';
import { 
  Pill, 
  Plus, 
  Trash2, 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  RotateCw, 
  ShieldAlert, 
  X,
  Sparkles,
  Flame,
  Check,
  Calendar
} from 'lucide-react';
import { Medication, MedicationDoseLog, TimeOfDay } from '../../types/medication';
import { storage } from '../../services/storageService';

export const MedicationTracker: React.FC = () => {
  const [medications, setMedications] = useState<Medication[]>([]);
  const [doseLogs, setDoseLogs] = useState<MedicationDoseLog[]>([]);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<TimeOfDay>('Morning');
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [rescueSuccessMsg, setRescueSuccessMsg] = useState<string>('');

  // Add med form state
  const [name, setName] = useState<string>('');
  const [genericName, setGenericName] = useState<string>('');
  const [type, setType] = useState<Medication['type']>('Controller / Maintenance');
  const [dosage, setDosage] = useState<string>('');
  const [selectedSchedules, setSelectedSchedules] = useState<TimeOfDay[]>(['Morning']);
  const [isInhaler, setIsInhaler] = useState<boolean>(true);
  const [totalPuffs, setTotalPuffs] = useState<string>('60');
  const [remainingPuffs, setRemainingPuffs] = useState<string>('60');
  const [notes, setNotes] = useState<string>('');

  const todayStr = new Date().toISOString().split('T')[0];

  useEffect(() => {
    setMedications(storage.getMedications());
    setDoseLogs(storage.getMedicationLogs());
  }, []);

  const handleTakeDose = (med: Medication, slot: TimeOfDay) => {
    const isTaken = doseLogs.some(
      l => l.medicationId === med.id && l.date === todayStr && l.timeSlot === slot
    );

    if (isTaken) return; // already taken

    const newLog: MedicationDoseLog = {
      id: `dose-${Date.now()}`,
      medicationId: med.id,
      medicationName: med.name,
      timeSlot: slot,
      date: todayStr,
      takenAt: new Date().toISOString(),
      status: 'taken',
    };

    // If it's an inhaler, also decrement puffs
    if (med.isInhaler && med.remainingPuffs !== undefined) {
      const puffsToDeduct = med.dosage.includes('2') ? 2 : 1;
      const updatedMeds = storage.decrementInhalerPuff(med.id, puffsToDeduct);
      setMedications(updatedMeds);
    }

    const updatedLogs = storage.logMedicationDose(newLog);
    setDoseLogs(updatedLogs);
  };

  const handleLogRescuePuff = () => {
    // Find rescue medication
    const rescueMed = medications.find(m => m.type === 'Fast-Acting Rescue') || medications[0];
    
    if (rescueMed) {
      const updatedMeds = storage.decrementInhalerPuff(rescueMed.id, 1);
      setMedications(updatedMeds);

      const log: MedicationDoseLog = {
        id: `rescue-${Date.now()}`,
        medicationId: rescueMed.id,
        medicationName: rescueMed.name,
        timeSlot: 'As Needed',
        date: todayStr,
        takenAt: new Date().toISOString(),
        status: 'taken',
        isRescueDose: true,
      };
      const updatedLogs = storage.logMedicationDose(log);
      setDoseLogs(updatedLogs);

      setRescueSuccessMsg(`Recorded 1 puff of ${rescueMed.name} at ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`);
      setTimeout(() => setRescueSuccessMsg(''), 4000);
    }
  };

  const handleRefillInhaler = (medId: string) => {
    const updated = storage.refillInhaler(medId);
    setMedications(updated);
  };

  const handleDeleteMedication = (id: string) => {
    const updated = storage.deleteMedication(id);
    setMedications(updated);
  };

  const handleAddMedication = () => {
    if (!name.trim()) return;

    const newMed: Medication = {
      id: `med-${Date.now()}`,
      name: name.trim(),
      genericName: genericName.trim() || undefined,
      type,
      dosage: dosage.trim() || '1 dose',
      schedule: selectedSchedules,
      isInhaler,
      totalPuffs: isInhaler && totalPuffs ? parseInt(totalPuffs) : undefined,
      remainingPuffs: isInhaler && remainingPuffs ? parseInt(remainingPuffs) : undefined,
      refillReminderThreshold: 15,
      notes: notes.trim() || undefined,
    };

    const updated = storage.saveMedication(newMed);
    setMedications(updated);
    setShowAddModal(false);

    // reset fields
    setName('');
    setGenericName('');
    setDosage('');
    setNotes('');
  };

  const timeSlots: TimeOfDay[] = ['Morning', 'Afternoon', 'Evening', 'Bedtime', 'As Needed'];

  // Filter meds for current schedule view
  const currentSlotMeds = medications.filter(m => m.schedule.includes(selectedTimeSlot));

  // Compute today's adherence rate
  const scheduledToday = medications.flatMap(m => 
    m.schedule.filter(s => s !== 'As Needed').map(s => ({ medId: m.id, slot: s }))
  );
  const takenTodayCount = scheduledToday.filter(st => 
    doseLogs.some(l => l.medicationId === st.medId && l.date === todayStr && l.timeSlot === st.slot)
  ).length;
  const adherencePercent = scheduledToday.length > 0 
    ? Math.round((takenTodayCount / scheduledToday.length) * 100) 
    : 100;

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-50 text-teal-800 text-xs font-semibold mb-2 border border-teal-200">
            <Pill className="w-3.5 h-3.5 text-teal-600" />
            <span>Prescription & Dose Counter</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">
            Respiratory Medication Tracker
          </h1>
          <p className="text-slate-600 text-sm mt-1 max-w-2xl leading-relaxed">
            Monitor daily maintenance controller inhalers, track remaining puffs in your canisters to prevent running empty, and log rescue inhaler usage.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => {
              storage.reloadAllDummyData();
              setMedications(storage.getMedications());
              setDoseLogs(storage.getMedicationLogs());
            }}
            className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold border border-slate-200 transition-colors"
            title="Populate standard Indian COPD medicines"
          >
            <RotateCw className="w-3.5 h-3.5" />
            <span>Load Sample Meds</span>
          </button>

          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs sm:text-sm font-bold shadow-md transition-colors shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Medication</span>
          </button>
        </div>
      </div>

      {/* Quick Rescue Inhaler Bar (Critical for COPD patients during flare-up) */}
      <div className="bg-gradient-to-r from-rose-500 via-rose-600 to-red-600 rounded-3xl p-5 sm:p-6 text-white shadow-lg flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-xs flex items-center justify-center shrink-0">
            <Flame className="w-6 h-6 text-rose-100" />
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-rose-200">
              Emergency / Sudden Shortness of Breath
            </span>
            <h3 className="text-base sm:text-lg font-black">
              Quick-Log Rescue Inhaler Puff
            </h3>
            <p className="text-xs text-rose-100">
              One tap logs your fast-acting puff and subtracts from your canister count.
            </p>
          </div>
        </div>

        <button
          onClick={handleLogRescuePuff}
          className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-white text-rose-700 hover:bg-rose-50 font-black text-xs sm:text-sm shadow-md transition-all active:scale-95 shrink-0"
        >
          + Log 1 Rescue Puff Now
        </button>
      </div>

      {rescueSuccessMsg && (
        <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold text-center animate-in fade-in">
          {rescueSuccessMsg}
        </div>
      )}

      {/* Inhaler Puff Gauges Row */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900">Inhaler Canister Counters</h3>
            <p className="text-xs text-slate-500">Never get caught with an empty canister during an emergency</p>
          </div>
          <span className="text-xs font-semibold px-3 py-1 bg-teal-50 text-teal-800 rounded-xl border border-teal-100">
            Today's Adherence: <strong>{adherencePercent}%</strong>
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {medications.filter(m => m.isInhaler && m.remainingPuffs !== undefined).map((med) => {
            const total = med.totalPuffs || 60;
            const remaining = med.remainingPuffs || 0;
            const pct = Math.round((remaining / total) * 100);
            const isLow = remaining <= (med.refillReminderThreshold || 15);

            return (
              <div 
                key={med.id}
                className={`p-4 rounded-2xl border transition-all ${
                  isLow 
                    ? 'bg-rose-50/50 border-rose-300 ring-2 ring-rose-200' 
                    : 'bg-slate-50 border-slate-200'
                }`}
              >
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div>
                    <h4 className="font-extrabold text-slate-900 text-sm">{med.name}</h4>
                    <span className="text-[10px] uppercase font-bold text-slate-500">{med.type}</span>
                  </div>
                  {isLow && (
                    <span className="text-[10px] font-bold text-rose-700 bg-rose-100 px-2 py-0.5 rounded-full shrink-0">
                      Refill Soon!
                    </span>
                  )}
                </div>

                {/* Counter Visual Bar */}
                <div className="my-3 space-y-1">
                  <div className="flex justify-between text-xs font-bold">
                    <span className={isLow ? 'text-rose-700 font-extrabold' : 'text-teal-700'}>
                      {remaining} puffs left
                    </span>
                    <span className="text-slate-400 font-normal">of {total}</span>
                  </div>
                  <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full transition-all ${
                        isLow ? 'bg-rose-500' : pct < 40 ? 'bg-amber-500' : 'bg-teal-500'
                      }`}
                      style={{ width: `${Math.min(100, Math.max(0, pct))}%` }}
                    />
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 pt-2 border-t border-slate-200/60 text-xs">
                  <button
                    onClick={() => {
                      const updated = storage.decrementInhalerPuff(med.id, 1);
                      setMedications(updated);
                    }}
                    className="flex-1 py-1.5 px-2 bg-white hover:bg-slate-100 border border-slate-200 rounded-lg font-bold text-slate-700"
                  >
                    -1 Puff
                  </button>
                  <button
                    onClick={() => handleRefillInhaler(med.id)}
                    className="py-1.5 px-2.5 text-slate-500 hover:text-teal-700 hover:bg-teal-50 rounded-lg font-semibold flex items-center gap-1"
                    title="Reset to full canister"
                  >
                    <RotateCw className="w-3.5 h-3.5" />
                    <span>Refill</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Daily Schedule Slots */}
      <div className="space-y-4">
        {/* Slot selector tabs */}
        <div className="flex overflow-x-auto pb-1 gap-2">
          {timeSlots.map((slot) => {
            const isSelected = selectedTimeSlot === slot;
            return (
              <button
                key={slot}
                onClick={() => setSelectedTimeSlot(slot)}
                className={`px-4 py-2.5 rounded-2xl text-xs font-extrabold whitespace-nowrap transition-all border ${
                  isSelected
                    ? 'bg-teal-600 text-white border-teal-600 shadow-sm'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                }`}
              >
                {slot}
              </button>
            );
          })}
        </div>

        {/* Medications List for Selected Slot */}
        <div className="space-y-3">
          {currentSlotMeds.length === 0 ? (
            <div className="bg-white rounded-3xl p-8 text-center border border-slate-200 text-slate-500">
              <Pill className="w-8 h-8 mx-auto text-slate-300 mb-2" />
              <p className="text-xs font-semibold">No medications scheduled for {selectedTimeSlot}.</p>
            </div>
          ) : (
            currentSlotMeds.map((med) => {
              const isTaken = doseLogs.some(
                l => l.medicationId === med.id && l.date === todayStr && l.timeSlot === selectedTimeSlot
              );

              return (
                <div 
                  key={med.id}
                  className={`bg-white rounded-2xl p-5 border shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all ${
                    isTaken ? 'border-emerald-200 bg-emerald-50/20' : 'border-slate-200'
                  }`}
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-extrabold text-slate-900 text-base">{med.name}</h4>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                        {med.type}
                      </span>
                    </div>

                    <p className="text-xs text-slate-600 font-medium">
                      Dosage: <strong>{med.dosage}</strong>
                    </p>

                    {med.notes && (
                      <p className="text-[11px] text-slate-500 italic">
                        {med.notes}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <button
                      onClick={() => handleTakeDose(med, selectedTimeSlot)}
                      disabled={isTaken}
                      className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl font-bold text-xs transition-all ${
                        isTaken
                          ? 'bg-emerald-100 text-emerald-800 cursor-default'
                          : 'bg-teal-600 hover:bg-teal-700 text-white shadow-sm active:scale-95'
                      }`}
                    >
                      <Check className="w-4 h-4" />
                      <span>{isTaken ? 'Dose Taken Today' : 'Mark as Taken'}</span>
                    </button>

                    <button
                      onClick={() => handleDeleteMedication(med.id)}
                      className="p-2 text-slate-300 hover:text-rose-600 rounded-lg hover:bg-rose-50"
                      title="Delete medication"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Add Medication Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">Add Respiratory Medication</h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-1 text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="py-4 space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Medication / Inhaler Name *</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Foracort 200, Asthalin, or Tiova Rotacaps"
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Type</label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-400"
                  >
                    <option>Controller / Maintenance</option>
                    <option>Fast-Acting Rescue</option>
                    <option>Oral / Pill</option>
                    <option>Nebulizer Solution</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Dosage</label>
                  <input
                    type="text"
                    value={dosage}
                    onChange={(e) => setDosage(e.target.value)}
                    placeholder="e.g. 1 puff, 2 puffs"
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-400"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1.5">Daily Schedule Slots</label>
                <div className="flex flex-wrap gap-2">
                  {timeSlots.map((slot) => {
                    const isChecked = selectedSchedules.includes(slot);
                    return (
                      <button
                        key={slot}
                        type="button"
                        onClick={() => {
                          if (isChecked) {
                            setSelectedSchedules(selectedSchedules.filter(s => s !== slot));
                          } else {
                            setSelectedSchedules([...selectedSchedules, slot]);
                          }
                        }}
                        className={`px-3 py-1.5 rounded-xl border text-xs font-bold transition-all ${
                          isChecked 
                            ? 'bg-teal-50 border-teal-500 text-teal-800' 
                            : 'bg-slate-50 border-slate-200 text-slate-600'
                        }`}
                      >
                        {slot}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="isInhalerCheck"
                    checked={isInhaler}
                    onChange={(e) => setIsInhaler(e.target.checked)}
                    className="w-4 h-4 rounded text-teal-600 focus:ring-teal-400"
                  />
                  <label htmlFor="isInhalerCheck" className="font-bold text-slate-800">
                    This is an inhaler (track canister puff count)
                  </label>
                </div>

                {isInhaler && (
                  <div className="grid grid-cols-2 gap-3 pt-1">
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                        Total Puffs in Canister:
                      </label>
                      <input
                        type="number"
                        value={totalPuffs}
                        onChange={(e) => setTotalPuffs(e.target.value)}
                        placeholder="e.g. 60 or 200"
                        className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-slate-800"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                        Puffs Remaining Now:
                      </label>
                      <input
                        type="number"
                        value={remainingPuffs}
                        onChange={(e) => setRemainingPuffs(e.target.value)}
                        placeholder="e.g. 60"
                        className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-slate-800"
                      />
                    </div>
                  </div>
                )}
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Special Instructions / Notes</label>
                <input
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g. Rinse mouth after inhaling. Take with spacer."
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-400"
                />
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
              <button
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                onClick={handleAddMedication}
                className="px-5 py-2 rounded-xl text-xs font-bold bg-teal-600 hover:bg-teal-700 text-white shadow-xs"
              >
                Save Medication
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
