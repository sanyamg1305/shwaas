import React, { useState, useEffect } from 'react';
import { 
  MapPin, 
  Search, 
  Phone, 
  ExternalLink, 
  Bookmark, 
  BookmarkCheck, 
  Plus, 
  Star, 
  Navigation, 
  Hospital, 
  RefreshCw,
  X,
  Stethoscope,
  Heart
} from 'lucide-react';
import { Pulmonologist } from '../../types/doctor';
import { 
  searchNearbyPulmonologists, 
  getFallbackPulmonologists, 
  getGoogleMapsSearchUrl 
} from '../../services/pulmonologistService';
import { storage } from '../../services/storageService';

export const PulmonologistFinder: React.FC = () => {
  const [doctors, setDoctors] = useState<Pulmonologist[]>([]);
  const [savedDoctors, setSavedDoctors] = useState<Pulmonologist[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [userLocation, setUserLocation] = useState<{ lat: number; lon: number } | null>(null);
  const [searchCity, setSearchCity] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'nearby' | 'saved'>('nearby');
  const [statusMsg, setStatusMsg] = useState<string>('');
  
  // Add Doctor Modal
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [newDocName, setNewDocName] = useState<string>('');
  const [newDocClinic, setNewDocClinic] = useState<string>('');
  const [newDocPhone, setNewDocPhone] = useState<string>('');
  const [newDocAddress, setNewDocAddress] = useState<string>('');
  const [newDocNotes, setNewDocNotes] = useState<string>('');

  useEffect(() => {
    setSavedDoctors(storage.getSavedPulmonologists());
    handleFindNearMe();
  }, []);

  const handleFindNearMe = () => {
    setLoading(true);
    setStatusMsg('Locating nearby pulmonary specialists...');

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          const lat = pos.coords.latitude;
          const lon = pos.coords.longitude;
          setUserLocation({ lat, lon });
          const results = await searchNearbyPulmonologists(lat, lon);
          setDoctors(results);
          setLoading(false);
          setStatusMsg('');
        },
        async (err) => {
          console.warn('Geolocation denied or failed, using fallback:', err);
          const fallback = getFallbackPulmonologists();
          setDoctors(fallback);
          setLoading(false);
          setStatusMsg('Showing verified pulmonologists near Sion, Mumbai (PIN 400022).');
        },
        { timeout: 7000 }
      );
    } else {
      setDoctors(getFallbackPulmonologists());
      setLoading(false);
    }
  };

  const handleToggleSave = (doc: Pulmonologist) => {
    const isSaved = savedDoctors.some(d => d.id === doc.id);
    if (isSaved) {
      const updated = storage.removeSavedPulmonologist(doc.id);
      setSavedDoctors(updated);
    } else {
      const updated = storage.savePulmonologist(doc);
      setSavedDoctors(updated);
    }
  };

  const handleAddCustomDoctor = () => {
    if (!newDocName.trim()) return;
    const customDoc: Pulmonologist = {
      id: `custom-doc-${Date.now()}`,
      name: newDocName.trim(),
      clinicName: newDocClinic.trim() || 'Pulmonology Care',
      address: newDocAddress.trim() || 'Local Clinic',
      phone: newDocPhone.trim() || '+1-555-RESP',
      notes: newDocNotes.trim(),
      isSaved: true,
      rating: 5.0,
    };
    const updated = storage.savePulmonologist(customDoc);
    setSavedDoctors(updated);
    setShowAddModal(false);
    // clear fields
    setNewDocName('');
    setNewDocClinic('');
    setNewDocPhone('');
    setNewDocAddress('');
    setNewDocNotes('');
    setActiveTab('saved');
  };

  const isDocSaved = (id: string) => savedDoctors.some(d => d.id === id);

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-50 text-teal-800 text-xs font-semibold mb-2 border border-teal-200">
            <Stethoscope className="w-3.5 h-3.5 text-teal-600" />
            <span>Specialist Directory • Mumbai (PIN 400022)</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">
            Pulmonologists Near PIN 400022 (Sion, Mumbai)
          </h1>
          <p className="text-slate-600 text-sm mt-1 max-w-2xl leading-relaxed">
            Verified chest physicians, respiratory clinics, and pulmonary rehabilitation centers in and around Sion (400022), Mahim, Dadar, and BKC, Mumbai.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs sm:text-sm font-bold shadow-md transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Add My Doctor</span>
          </button>
        </div>
      </div>

      {/* Tabs & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex bg-slate-100 p-1 rounded-2xl border border-slate-200 text-xs font-bold w-fit">
          <button
            onClick={() => setActiveTab('nearby')}
            className={`px-4 py-2 rounded-xl transition-all ${
              activeTab === 'nearby' ? 'bg-white text-teal-800 shadow-xs' : 'text-slate-600'
            }`}
          >
            Nearby Specialists ({doctors.length})
          </button>
          <button
            onClick={() => setActiveTab('saved')}
            className={`px-4 py-2 rounded-xl transition-all ${
              activeTab === 'saved' ? 'bg-white text-teal-800 shadow-xs' : 'text-slate-600'
            }`}
          >
            My Saved Doctors ({savedDoctors.length})
          </button>
        </div>

        {/* Direct Google Maps Shortcut */}
        <a
          href={getGoogleMapsSearchUrl('pulmonologist near Sion Mumbai 400022', userLocation?.lat, userLocation?.lon)}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 text-xs font-bold transition-colors"
        >
          <Navigation className="w-3.5 h-3.5 text-teal-600" />
          <span>Search Sion 400022 on Google Maps</span>
          <ExternalLink className="w-3 h-3 text-slate-400" />
        </a>
      </div>

      {statusMsg && (
        <div className="text-xs text-slate-500 flex items-center gap-1.5 px-1">
          <RefreshCw className="w-3.5 h-3.5 animate-spin text-teal-600" />
          <span>{statusMsg}</span>
        </div>
      )}

      {/* Results List */}
      {loading ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200">
          <RefreshCw className="w-8 h-8 text-teal-600 animate-spin mx-auto mb-3" />
          <p className="text-sm font-bold text-slate-700">Searching nearby medical facilities and pulmonology clinics...</p>
        </div>
      ) : activeTab === 'nearby' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {doctors.map((doc) => {
            const saved = isDocSaved(doc.id);
            return (
              <div 
                key={doc.id}
                className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs hover:border-teal-300 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div>
                      <h3 className="font-extrabold text-slate-900 text-base">
                        {doc.name}
                      </h3>
                      <p className="text-xs font-medium text-teal-700">
                        {doc.clinicName}
                      </p>
                    </div>

                    <button
                      onClick={() => handleToggleSave(doc)}
                      className={`p-2 rounded-xl transition-colors ${
                        saved 
                          ? 'bg-teal-50 text-teal-700 hover:bg-teal-100' 
                          : 'bg-slate-50 text-slate-400 hover:text-slate-700'
                      }`}
                      title={saved ? 'Remove from saved' : 'Save doctor'}
                    >
                      {saved ? <BookmarkCheck className="w-4 h-4 text-teal-600" /> : <Bookmark className="w-4 h-4" />}
                    </button>
                  </div>

                  <div className="space-y-1.5 text-xs text-slate-600 my-3">
                    <div className="flex items-start gap-2">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 mt-0.5 shrink-0" />
                      <span>{doc.address}</span>
                    </div>
                    {doc.phone && (
                      <div className="flex items-center gap-2">
                        <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span>{doc.phone}</span>
                      </div>
                    )}
                    {doc.distanceKm !== undefined && (
                      <span className="inline-block px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 font-semibold text-[11px]">
                        Approx. {doc.distanceKm} km away
                      </span>
                    )}
                  </div>

                  {doc.notes && (
                    <p className="text-[11px] text-slate-500 italic bg-slate-50 p-2.5 rounded-xl border border-slate-100 mb-3">
                      {doc.notes}
                    </p>
                  )}
                </div>

                {/* Actions */}
                <div className="pt-3 border-t border-slate-100 flex items-center gap-2">
                  {doc.phone && (
                    <a
                      href={`tel:${doc.phone.replace(/[^0-9+]/g, '')}`}
                      className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-teal-50 hover:bg-teal-100 text-teal-800 text-xs font-bold transition-colors"
                    >
                      <Phone className="w-3.5 h-3.5" />
                      <span>Call Clinic</span>
                    </a>
                  )}

                  <a
                    href={getGoogleMapsSearchUrl(`${doc.name} ${doc.address}`)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-colors"
                  >
                    <Navigation className="w-3.5 h-3.5 text-slate-600" />
                    <span>Directions</span>
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Saved Doctors Tab */
        <div className="space-y-4">
          {savedDoctors.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 text-slate-500">
              <Stethoscope className="w-12 h-12 mx-auto text-slate-300 mb-2" />
              <p className="text-sm font-bold text-slate-700">No saved pulmonologists yet.</p>
              <p className="text-xs mt-1">Bookmark specialists from the nearby list or click "Add My Doctor" above.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {savedDoctors.map((doc) => (
                <div 
                  key={doc.id}
                  className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <div>
                        <h3 className="font-extrabold text-slate-900 text-base">{doc.name}</h3>
                        <p className="text-xs font-medium text-teal-700">{doc.clinicName}</p>
                      </div>
                      <button
                        onClick={() => handleToggleSave(doc)}
                        className="text-teal-700 p-1.5 rounded-lg hover:bg-teal-50"
                        title="Remove from saved"
                      >
                        <BookmarkCheck className="w-5 h-5 text-teal-600" />
                      </button>
                    </div>

                    <div className="space-y-1.5 text-xs text-slate-600 my-3">
                      <div className="flex items-start gap-2">
                        <MapPin className="w-3.5 h-3.5 text-slate-400 mt-0.5 shrink-0" />
                        <span>{doc.address}</span>
                      </div>
                      {doc.phone && (
                        <div className="flex items-center gap-2">
                          <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span>{doc.phone}</span>
                        </div>
                      )}
                    </div>

                    {doc.notes && (
                      <p className="text-[11px] text-slate-600 italic bg-teal-50/50 p-2.5 rounded-xl border border-teal-100 mb-3">
                        Notes: {doc.notes}
                      </p>
                    )}
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center gap-2">
                    {doc.phone && (
                      <a
                        href={`tel:${doc.phone.replace(/[^0-9+]/g, '')}`}
                        className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold transition-colors shadow-xs"
                      >
                        <Phone className="w-3.5 h-3.5" />
                        <span>Call</span>
                      </a>
                    )}
                    <a
                      href={getGoogleMapsSearchUrl(`${doc.name} ${doc.address}`)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-colors"
                    >
                      <Navigation className="w-3.5 h-3.5" />
                      <span>Maps</span>
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Add Custom Doctor Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">Add Your Pulmonologist / Clinic</h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-1 text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="py-4 space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Doctor Name *</label>
                <input
                  type="text"
                  value={newDocName}
                  onChange={(e) => setNewDocName(e.target.value)}
                  placeholder="e.g. Dr. Robert Vance, MD"
                  className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 border border-slate-200 text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-400"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Hospital / Clinic Name</label>
                <input
                  type="text"
                  value={newDocClinic}
                  onChange={(e) => setNewDocClinic(e.target.value)}
                  placeholder="e.g. City Chest Hospital, Suite 300"
                  className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 border border-slate-200 text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-400"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Phone Number</label>
                <input
                  type="text"
                  value={newDocPhone}
                  onChange={(e) => setNewDocPhone(e.target.value)}
                  placeholder="e.g. +1 (555) 019-2831"
                  className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 border border-slate-200 text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-400"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Address</label>
                <input
                  type="text"
                  value={newDocAddress}
                  onChange={(e) => setNewDocAddress(e.target.value)}
                  placeholder="e.g. 450 Medical Arts Parkway, Boston MA"
                  className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 border border-slate-200 text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-400"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Notes / Instructions</label>
                <textarea
                  value={newDocNotes}
                  onChange={(e) => setNewDocNotes(e.target.value)}
                  placeholder="e.g. In case of flare-up, call emergency triage line extension 4."
                  rows={2}
                  className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 border border-slate-200 text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-400"
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
                onClick={handleAddCustomDoctor}
                className="px-5 py-2 rounded-xl text-xs font-bold bg-teal-600 hover:bg-teal-700 text-white shadow-xs"
              >
                Save Doctor
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
