import React, { useState, useEffect } from 'react';
import { 
  Calendar, 
  Clock, 
  Plus, 
  Trash2, 
  CheckCircle2, 
  FileText, 
  AlertCircle, 
  ChevronRight, 
  Edit3, 
  Stethoscope, 
  X,
  Activity,
  HelpCircle,
  Share2,
  RotateCcw
} from 'lucide-react';
import { DoctorAppointment } from '../../types/doctor';
import { storage } from '../../services/storageService';

export const DoctorFollowups: React.FC = () => {
  const [appointments, setAppointments] = useState<DoctorAppointment[]>([]);
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'upcoming' | 'past' | 'prep'>('upcoming');

  // New appointment form state
  const [doctorName, setDoctorName] = useState<string>('');
  const [clinicName, setClinicName] = useState<string>('');
  const [dateTime, setDateTime] = useState<string>('');
  const [visitType, setVisitType] = useState<DoctorAppointment['visitType']>('Routine 3-Month Checkup');
  const [phone, setPhone] = useState<string>('');
  const [doctorAdviceNotes, setDoctorAdviceNotes] = useState<string>('');
  const [fev1Percent, setFev1Percent] = useState<string>('');
  const [spo2Percent, setSpo2Percent] = useState<string>('');
  const [questionsForDoctor, setQuestionsForDoctor] = useState<string[]>([
    'Is my inhaler technique delivering enough medication?',
    'Should we adjust my maintenance inhaler dosage?',
    'Am I due for an updated pneumonia or flu vaccination?',
    'Is my resting blood oxygen (SpO2) within safe target limits?'
  ]);
  const [newQuestionInput, setNewQuestionInput] = useState<string>('');

  useEffect(() => {
    setAppointments(storage.getDoctorAppointments());
  }, []);

  const handleSaveAppointment = () => {
    if (!doctorName.trim() || !dateTime) return;

    const newAppt: DoctorAppointment = {
      id: `appt-${Date.now()}`,
      doctorName: doctorName.trim(),
      clinicName: clinicName.trim() || 'Pulmonology Clinic',
      phone: phone.trim(),
      dateTime: new Date(dateTime).toISOString(),
      visitType,
      status: 'Scheduled',
      questionsForDoctor,
      doctorAdviceNotes: doctorAdviceNotes.trim() || undefined,
      spirometry: {
        fev1Percent: fev1Percent ? parseFloat(fev1Percent) : undefined,
        spo2Percent: spo2Percent ? parseFloat(spo2Percent) : undefined,
      },
    };

    const updated = storage.saveDoctorAppointment(newAppt);
    setAppointments(updated);
    setShowAddModal(false);

    // reset inputs
    setDoctorName('');
    setClinicName('');
    setDateTime('');
    setDoctorAdviceNotes('');
    setFev1Percent('');
    setSpo2Percent('');
  };

  const handleDeleteAppointment = (id: string) => {
    const updated = storage.deleteDoctorAppointment(id);
    setAppointments(updated);
  };

  const handleAddQuestion = () => {
    if (!newQuestionInput.trim()) return;
    setQuestionsForDoctor([...questionsForDoctor, newQuestionInput.trim()]);
    setNewQuestionInput('');
  };

  const handleRemoveQuestion = (idx: number) => {
    setQuestionsForDoctor(questionsForDoctor.filter((_, i) => i !== idx));
  };

  const now = new Date().getTime();
  const upcomingAppts = appointments.filter(a => new Date(a.dateTime).getTime() >= now && a.status !== 'Cancelled');
  const pastAppts = appointments.filter(a => new Date(a.dateTime).getTime() < now || a.status === 'Completed');

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-50 text-teal-800 text-xs font-semibold mb-2 border border-teal-200">
            <Calendar className="w-3.5 h-3.5 text-teal-600" />
            <span>Care Management</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">
            Doctor Follow-Ups & Visit Logs
          </h1>
          <p className="text-slate-600 text-sm mt-1 max-w-2xl leading-relaxed">
            Stay on top of scheduled pulmonologist appointments, record spirometry test results (FEV1, SpO2), and organize pre-visit questions so nothing is forgotten during your consultation.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => {
              storage.reloadAllDummyData();
              setAppointments(storage.getDoctorAppointments());
            }}
            className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold border border-slate-200 transition-colors"
            title="Populate realistic Mumbai pulmonology records"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Load Sample Data</span>
          </button>

          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs sm:text-sm font-bold shadow-md transition-colors shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Record New Follow-Up</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex bg-slate-100 p-1 rounded-2xl border border-slate-200 text-xs font-bold w-fit">
        <button
          onClick={() => setActiveTab('upcoming')}
          className={`px-4 py-2 rounded-xl transition-all ${
            activeTab === 'upcoming' ? 'bg-white text-teal-800 shadow-xs' : 'text-slate-600'
          }`}
        >
          Upcoming Visits ({upcomingAppts.length})
        </button>
        <button
          onClick={() => setActiveTab('past')}
          className={`px-4 py-2 rounded-xl transition-all ${
            activeTab === 'past' ? 'bg-white text-teal-800 shadow-xs' : 'text-slate-600'
          }`}
        >
          Past Records ({pastAppts.length})
        </button>
        <button
          onClick={() => setActiveTab('prep')}
          className={`px-4 py-2 rounded-xl transition-all ${
            activeTab === 'prep' ? 'bg-white text-teal-800 shadow-xs' : 'text-slate-600'
          }`}
        >
          Pre-Visit Questions Checklist
        </button>
      </div>

      {/* Upcoming Tab */}
      {activeTab === 'upcoming' && (
        <div className="space-y-4">
          {upcomingAppts.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 text-slate-500">
              <Calendar className="w-12 h-12 mx-auto text-slate-300 mb-2" />
              <p className="text-sm font-bold text-slate-700">No upcoming appointments scheduled.</p>
              <p className="text-xs mt-1">Routine 3 to 6-month pulmonology reviews are vital for optimal COPD control.</p>
              <div className="mt-4 flex items-center justify-center gap-2">
                <button
                  onClick={() => {
                    storage.reloadAllDummyData();
                    setAppointments(storage.getDoctorAppointments());
                  }}
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-teal-50 border border-teal-200 text-teal-800 rounded-xl text-xs font-bold shadow-2xs hover:bg-teal-100"
                >
                  <RotateCcw className="w-3.5 h-3.5 text-teal-600" />
                  <span>Load Sample Mumbai Appointments</span>
                </button>
                <button
                  onClick={() => setShowAddModal(true)}
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-teal-600 text-white rounded-xl text-xs font-bold shadow-sm hover:bg-teal-700"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Schedule Appointment</span>
                </button>
              </div>
            </div>
          ) : (
            upcomingAppts.map((appt) => {
              const dateObj = new Date(appt.dateTime);
              const formattedDate = dateObj.toLocaleDateString([], {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              });
              const formattedTime = dateObj.toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
              });

              return (
                <div 
                  key={appt.id}
                  className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs hover:border-teal-300 transition-all space-y-4"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center font-black text-sm shrink-0 border border-teal-200">
                        {dateObj.getDate()}
                      </div>
                      <div>
                        <h3 className="font-extrabold text-slate-900 text-base">{appt.doctorName}</h3>
                        <p className="text-xs text-slate-500">{appt.clinicName}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-xs px-3 py-1 rounded-full font-bold bg-teal-50 text-teal-800 border border-teal-200">
                        {appt.visitType}
                      </span>
                      <button
                        onClick={() => handleDeleteAppointment(appt.id)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50"
                        title="Delete record"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-700">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-teal-600" />
                      <span>{formattedDate} at {formattedTime}</span>
                    </div>
                    {appt.phone && (
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-teal-600" />
                        <span>Phone: {appt.phone}</span>
                      </div>
                    )}
                  </div>

                  {appt.questionsForDoctor && appt.questionsForDoctor.length > 0 && (
                    <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100 text-xs">
                      <span className="font-bold text-slate-800 block mb-1">
                        Questions planned to ask the doctor ({appt.questionsForDoctor.length}):
                      </span>
                      <ul className="list-disc list-inside space-y-1 text-slate-600">
                        {appt.questionsForDoctor.slice(0, 3).map((q, i) => (
                          <li key={i}>{q}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      )}

      {/* Past Tab */}
      {activeTab === 'past' && (
        <div className="space-y-4">
          {pastAppts.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 text-slate-500">
              <FileText className="w-12 h-12 mx-auto text-slate-300 mb-2" />
              <p className="text-sm font-bold text-slate-700">No past doctor notes logged.</p>
              <p className="text-xs mt-1">Recording your doctor's test recommendations and spirometry values keeps your medical history organized.</p>
            </div>
          ) : (
            pastAppts.map((appt) => {
              const dateStr = new Date(appt.dateTime).toLocaleDateString([], {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
              });
              return (
                <div key={appt.id} className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-extrabold text-slate-900 text-base">{appt.doctorName}</span>
                        <span className="text-xs px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 font-medium">
                          {appt.visitType}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500">{dateStr} • {appt.clinicName}</p>
                    </div>

                    <button
                      onClick={() => handleDeleteAppointment(appt.id)}
                      className="text-slate-400 hover:text-rose-600 p-1"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  {appt.spirometry && (appt.spirometry.fev1Percent || appt.spirometry.spo2Percent) && (
                    <div className="grid grid-cols-2 gap-3 text-xs bg-teal-50/50 p-3 rounded-xl border border-teal-100">
                      {appt.spirometry.fev1Percent && (
                        <div>
                          <span className="text-slate-500 block">FEV1 % Predicted:</span>
                          <span className="font-extrabold text-teal-800 text-sm">{appt.spirometry.fev1Percent}%</span>
                        </div>
                      )}
                      {appt.spirometry.spo2Percent && (
                        <div>
                          <span className="text-slate-500 block">Resting SpO2:</span>
                          <span className="font-extrabold text-teal-800 text-sm">{appt.spirometry.spo2Percent}%</span>
                        </div>
                      )}
                    </div>
                  )}

                  {appt.doctorAdviceNotes && (
                    <div className="text-xs text-slate-700 bg-slate-50 p-3 rounded-xl border border-slate-100">
                      <span className="font-bold block text-slate-900 mb-0.5">Doctor's Advice & Plan:</span>
                      <p>{appt.doctorAdviceNotes}</p>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      )}

      {/* Pre-Visit Prep Tab */}
      {activeTab === 'prep' && (
        <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200 shadow-sm space-y-5">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Pulmonology Consultation Checklist</h2>
              <p className="text-xs text-slate-500">
                Patients who ask prepared questions receive better personalized treatment adjustments.
              </p>
            </div>
            <button
              onClick={() => window.print()}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Print Checklist</span>
            </button>
          </div>

          <div className="space-y-2.5">
            {questionsForDoctor.map((q, idx) => (
              <div 
                key={idx}
                className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-800"
              >
                <div className="flex items-center gap-2.5">
                  <input type="checkbox" className="w-4 h-4 rounded text-teal-600 focus:ring-teal-400" />
                  <span>{q}</span>
                </div>
                <button
                  onClick={() => handleRemoveQuestion(idx)}
                  className="text-slate-400 hover:text-rose-600 p-1"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>

          {/* Add question input */}
          <div className="flex gap-2 pt-2">
            <input
              type="text"
              value={newQuestionInput}
              onChange={(e) => setNewQuestionInput(e.target.value)}
              placeholder="Add another question for your doctor..."
              className="flex-1 px-3.5 py-2.5 text-xs rounded-xl bg-slate-50 border border-slate-200 text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-400"
            />
            <button
              onClick={handleAddQuestion}
              className="px-4 py-2.5 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span>Add Question</span>
            </button>
          </div>
        </div>
      )}

      {/* Record Follow-up Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">Record Doctor Follow-Up</h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-1 text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="py-4 space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Doctor Name *</label>
                <input
                  type="text"
                  value={doctorName}
                  onChange={(e) => setDoctorName(e.target.value)}
                  placeholder="e.g. Dr. Jennifer Adams"
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-400"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Clinic / Hospital</label>
                  <input
                    type="text"
                    value={clinicName}
                    onChange={(e) => setClinicName(e.target.value)}
                    placeholder="e.g. North Respiratory Institute"
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-400"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Appointment Date & Time *</label>
                  <input
                    type="datetime-local"
                    value={dateTime}
                    onChange={(e) => setDateTime(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-400"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Visit Type</label>
                <select
                  value={visitType}
                  onChange={(e) => setVisitType(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-400"
                >
                  <option>Routine 3-Month Checkup</option>
                  <option>Symptom Flare-up / Exacerbation</option>
                  <option>Spirometry Test</option>
                  <option>Medication Review</option>
                  <option>Other</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-1">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">FEV1 % Predicted (if measured)</label>
                  <input
                    type="number"
                    value={fev1Percent}
                    onChange={(e) => setFev1Percent(e.target.value)}
                    placeholder="e.g. 58"
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-400"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Resting SpO2 %</label>
                  <input
                    type="number"
                    value={spo2Percent}
                    onChange={(e) => setSpo2Percent(e.target.value)}
                    placeholder="e.g. 94"
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-400"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Doctor's Advice / Notes</label>
                <textarea
                  value={doctorAdviceNotes}
                  onChange={(e) => setDoctorAdviceNotes(e.target.value)}
                  placeholder="e.g. Continue tiotropium in morning. Use spacer for albuterol. Return in 3 months with daily symptom log."
                  rows={3}
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
                onClick={handleSaveAppointment}
                className="px-5 py-2 rounded-xl text-xs font-bold bg-teal-600 hover:bg-teal-700 text-white shadow-xs"
              >
                Save Record
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
