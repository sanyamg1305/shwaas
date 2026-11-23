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
  Heart,
  LocateFixed
} from 'lucide-react';
import { Pulmonologist } from '../../types/doctor';
import { 
  searchNearbyPulmonologists, 
  getFallbackPulmonologists, 
  getGoogleMapsSearchUrl 
} from '../../services/pulmonologistService';
import { 
  detectUserLocation, 
  getSavedLocation, 
  saveUserLocation,
  UserLocation 
} from '../../services/locationService';
import { searchCities } from '../../services/aqiService';
import { GeocodingResult } from '../../types/aqi';
import { storage } from '../../services/storageService';

export const PulmonologistFinder: React.FC = () => {
  const [doctors, setDoctors] = useState<Pulmonologist[]>([]);
  const [savedDoctors, setSavedDoctors] = useState<Pulmonologist[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [userLocation, setUserLocation] = useState<UserLocation | null>(null);
  const [activeTab, setActiveTab] = useState<'nearby' | 'saved'>('nearby');
  const [statusMsg, setStatusMsg] = useState<string>('');
  
  // City Search
  const [citySearchQuery, setCitySearchQuery] = useState<string>('');
  const [citySearchResults, setCitySearchResults] = useState<GeocodingResult[]>([]);
  const [searchingCities, setSearchingCities] = useState<boolean>(false);

  // Add Doctor Modal
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [newDocName, setNewDocName] = useState<string>('');
  const [newDocClinic, setNewDocClinic] = useState<string>('');
  const [newDocPhone, setNewDocPhone] = useState<string>('');
  const [newDocAddress, setNewDocAddress] = useState<string>('');
  const [newDocNotes, setNewDocNotes] = useState<string>('');

  const loadDoctorsForLocation = async (loc: UserLocation) => {
    setUserLocation(loc);
    setLoading(true);
    setStatusMsg(`Finding specialists near ${loc.displayName}...`);

    try {
      const results = await searchNearbyPulmonologists(loc.latitude, loc.longitude, loc.city);
      setDoctors(results);
      setStatusMsg('');
    } catch (err) {
      console.warn('Failed to load specialists:', err);
      const fallbacks = getFallbackPulmonologists(loc.latitude, loc.longitude);
      setDoctors(fallbacks);
      setStatusMsg('');
    } finally {
      setLoading(false);
    }
  };

  const handleDetectLocation = async (forceFresh: boolean = false) => {
    setLoading(true);
    setStatusMsg('Acquiring high-accuracy GPS coordinates...');
    try {
      const loc = await detectUserLocation(forceFresh);
      await loadDoctorsForLocation(loc);
    } catch (e) {
      console.warn('Location detection failed:', e);
      setLoading(false);
    }
  };

  useEffect(() => {
    setSavedDoctors(storage.getSavedPulmonologists());
    
    // Check saved or detect
    const saved = getSavedLocation();
    if (saved) {
      loadDoctorsForLocation(saved);
    } else {
      handleDetectLocation(false);
    }

    // Listen to location changes dispatched from navbar or AQI
    const handleLocationUpdate = (e: any) => {
      if (e.detail) {
        loadDoctorsForLocation(e.detail);
      }
    };
    window.addEventListener('shwaas_location_updated', handleLocationUpdate);
    return () => window.removeEventListener('shwaas_location_updated', handleLocationUpdate);
  }, []);

  // Debounced City Search
  useEffect(() => {
    const timer = setTimeout(async () => {
      if (citySearchQuery.trim().length >= 2) {
        setSearchingCities(true);
        const results = await searchCities(citySearchQuery);
        setCitySearchResults(results);
        setSearchingCities(false);
      } else {
        setCitySearchResults([]);
      }
    }, 350);

    return () => clearTimeout(timer);
  }, [citySearchQuery]);

  const handleSelectCity = (city: GeocodingResult) => {
    const displayName = `${city.name}${city.admin1 ? ', ' + city.admin1 : ''}, ${city.country}`;
    setCitySearchQuery('');
    setCitySearchResults([]);
    const loc: UserLocation = {
      latitude: city.latitude,
      longitude: city.longitude,
      city: city.name,
      state: city.admin1,
      country: city.country,
      displayName,
      source: 'manual',
      timestamp: Date.now(),
    };
    saveUserLocation(loc);
    loadDoctorsForLocation(loc);
  };

  const handleSelectPopularCity = (name: string, lat: number, lon: number) => {
    const loc: UserLocation = {
      latitude: lat,
      longitude: lon,
      city: name.split('(')[0].trim(),
      country: 'India',
      displayName: name,
      source: 'manual',
      timestamp: Date.now(),
    };
    saveUserLocation(loc);
    loadDoctorsForLocation(loc);
  };

  const popularCities = [
    { name: 'Rajkot', lat: 22.3039, lon: 70.8022 },
    { name: 'Mumbai', lat: 19.0434, lon: 72.8634 },
    { name: 'Ahmedabad', lat: 23.0225, lon: 72.5714 },
    { name: 'Surat', lat: 21.1702, lon: 72.8311 },
    { name: 'Vadodara', lat: 22.3072, lon: 73.1812 },
    { name: 'Delhi (NCR)', lat: 28.6139, lon: 77.209 },
    { name: 'Bengaluru', lat: 12.9716, lon: 77.5946 },
    { name: 'Pune', lat: 18.5204, lon: 73.8567 },
    { name: 'Kolkata', lat: 22.5726, lon: 88.3639 },
    { name: 'Hyderabad', lat: 17.3850, lon: 78.4867 },
    { name: 'Chennai', lat: 13.0827, lon: 80.2707 },
    { name: 'Jaipur', lat: 26.9124, lon: 75.7873 },
    { name: 'Lucknow', lat: 26.8467, lon: 80.9462 },
    { name: 'Indore', lat: 22.7196, lon: 75.8577 },
  ];

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
      address: newDocAddress.trim() || (userLocation ? `${userLocation.city}, India` : 'Local Clinic'),
      phone: newDocPhone.trim() || '+91 22 2407 6381',
      notes: newDocNotes.trim(),
      isSaved: true,
      rating: 5.0,
      distanceKm: 1.0,
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
            <span>
              Specialist Directory • {userLocation?.displayName || 'Locating You...'}
            </span>
            {userLocation?.source === 'gps' && (
              <span className="bg-emerald-100 text-emerald-800 text-[10px] px-1.5 py-0.2 rounded font-bold">
                GPS Live
              </span>
            )}
            {userLocation?.source === 'ip' && (
              <span className="bg-blue-100 text-blue-800 text-[10px] px-1.5 py-0.2 rounded font-bold">
                IP Detected
              </span>
            )}
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">
            Pulmonologists Near {userLocation?.city || 'You'}
          </h1>
          <p className="text-slate-600 text-sm mt-1 max-w-2xl leading-relaxed">
            Verified chest physicians, respiratory clinics, and pulmonary rehabilitation centers near{' '}
            <strong className="text-slate-800">{userLocation?.displayName || 'your current location'}</strong>.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => handleDetectLocation(true)}
            disabled={loading}
            className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs sm:text-sm font-bold border border-slate-200 transition-colors"
            title="Refresh GPS location"
          >
            <LocateFixed className={`w-4 h-4 text-teal-600 ${loading ? 'animate-spin' : ''}`} />
            <span>{loading ? 'Detecting...' : 'Detect GPS'}</span>
          </button>

          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs sm:text-sm font-bold shadow-md transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Add My Doctor</span>
          </button>
        </div>
      </div>

      {/* City Search & Quick Select Filter */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-2xs space-y-3">
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={citySearchQuery}
            onChange={(e) => setCitySearchQuery(e.target.value)}
            placeholder="Search any Indian city, district, or PIN code to find specialists..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 placeholder:text-slate-400 text-xs sm:text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-teal-400"
          />
          {searchingCities && (
            <RefreshCw className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 animate-spin" />
          )}

          {/* Autocomplete Dropdown */}
          {citySearchResults.length > 0 && (
            <div className="absolute left-0 right-0 top-full mt-2 bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden z-30 divide-y divide-slate-100">
              {citySearchResults.map((city) => (
                <button
                  key={`${city.id}-${city.latitude}`}
                  onClick={() => handleSelectCity(city)}
                  className="w-full text-left px-4 py-2.5 text-slate-800 hover:bg-teal-50 flex items-center justify-between text-xs sm:text-sm transition-colors font-medium"
                >
                  <span>
                    {city.name}{city.admin1 ? `, ${city.admin1}` : ''}
                  </span>
                  <span className="text-xs text-slate-400">{city.country}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Popular Cities Horizontal Scroller */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-0.5 text-xs">
          <span className="text-slate-400 font-bold whitespace-nowrap text-[11px] mr-1">Quick Cities:</span>
          {popularCities.map((c) => {
            const isSelected = (userLocation?.city || '').toLowerCase().includes(c.name.toLowerCase().split(' ')[0]);
            return (
              <button
                key={c.name}
                onClick={() => handleSelectPopularCity(c.name, c.lat, c.lon)}
                className={`whitespace-nowrap px-3 py-1 rounded-xl text-xs font-semibold transition-all border ${
                  isSelected
                    ? 'bg-teal-700 text-white border-teal-700 shadow-2xs'
                    : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                }`}
              >
                {c.name}
              </button>
            );
          })}
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
          href={getGoogleMapsSearchUrl(
            'pulmonologist chest specialist near me',
            userLocation?.latitude,
            userLocation?.longitude,
            userLocation?.city
          )}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 text-xs font-bold transition-colors"
        >
          <Navigation className="w-3.5 h-3.5 text-teal-600" />
          <span>Search {userLocation?.city || 'My Area'} on Google Maps</span>
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
      {activeTab === 'nearby' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {doctors.map((doc) => (
            <div
              key={doc.id}
              className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs hover:border-teal-300 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="font-extrabold text-slate-900 text-base leading-snug">
                      {doc.name}
                    </h3>
                    <p className="text-teal-700 text-xs font-semibold mt-0.5">
                      {doc.clinicName}
                    </p>
                  </div>
                  <button
                    onClick={() => handleToggleSave(doc)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-teal-600 hover:bg-teal-50 transition-colors"
                    title={isDocSaved(doc.id) ? 'Remove bookmark' : 'Bookmark doctor'}
                  >
                    {isDocSaved(doc.id) ? (
                      <BookmarkCheck className="w-5 h-5 text-teal-600 fill-teal-100" />
                    ) : (
                      <Bookmark className="w-5 h-5" />
                    )}
                  </button>
                </div>

                <div className="space-y-1.5 text-xs text-slate-500 mt-3">
                  <div className="flex items-start gap-2">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                    <span className="line-clamp-2">{doc.address}</span>
                  </div>
                  {doc.phone && (
                    <div className="flex items-center gap-2">
                      <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>{doc.phone}</span>
                    </div>
                  )}
                  {doc.distanceKm !== undefined && (
                    <div className="flex items-center gap-2">
                      <span className="inline-block px-2 py-0.5 rounded-md bg-slate-100 font-bold text-slate-700 text-[11px]">
                        Approx. {doc.distanceKm} km away
                      </span>
                    </div>
                  )}
                </div>

                {doc.notes && (
                  <p className="text-xs text-slate-600 bg-slate-50 p-2.5 rounded-xl border border-slate-100 mt-3 italic">
                    {doc.notes}
                  </p>
                )}
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-2 mt-4 pt-3 border-t border-slate-100">
                <a
                  href={doc.phone ? `tel:${doc.phone.replace(/[^0-9+]/g, '')}` : '#'}
                  className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-teal-50 hover:bg-teal-100 text-teal-800 text-xs font-bold transition-colors"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>Call Clinic</span>
                </a>
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                    `${doc.name} ${doc.clinicName} ${doc.address}`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors"
                >
                  <Navigation className="w-3.5 h-3.5" />
                  <span>Directions</span>
                </a>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Saved Doctors Tab */
        <div className="space-y-4">
          {savedDoctors.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-slate-200">
              <div className="w-12 h-12 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center mx-auto mb-3">
                <Bookmark className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-slate-800 text-base">No Saved Doctors Yet</h3>
              <p className="text-slate-500 text-xs mt-1 max-w-sm mx-auto">
                Bookmark pulmonologists from the Nearby Specialists tab or click "Add My Doctor" to save your personal physician.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {savedDoctors.map((doc) => (
                <div
                  key={doc.id}
                  className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h3 className="font-extrabold text-slate-900 text-base leading-snug">
                          {doc.name}
                        </h3>
                        <p className="text-teal-700 text-xs font-semibold mt-0.5">
                          {doc.clinicName}
                        </p>
                      </div>
                      <button
                        onClick={() => handleToggleSave(doc)}
                        className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 transition-colors"
                        title="Remove from saved"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="space-y-1 text-xs text-slate-500 mt-3">
                      <p className="flex items-start gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                        <span>{doc.address}</span>
                      </p>
                      {doc.phone && (
                        <p className="flex items-center gap-1.5">
                          <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span>{doc.phone}</span>
                        </p>
                      )}
                    </div>

                    {doc.notes && (
                      <p className="text-xs text-slate-600 bg-slate-50 p-2.5 rounded-xl border border-slate-100 mt-3 italic">
                        {doc.notes}
                      </p>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-2 mt-4 pt-3 border-t border-slate-100">
                    <a
                      href={doc.phone ? `tel:${doc.phone.replace(/[^0-9+]/g, '')}` : '#'}
                      className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-teal-50 hover:bg-teal-100 text-teal-800 text-xs font-bold transition-colors"
                    >
                      <Phone className="w-3.5 h-3.5" />
                      <span>Call Clinic</span>
                    </a>
                    <a
                      href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                        `${doc.name} ${doc.clinicName} ${doc.address}`
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors"
                    >
                      <Navigation className="w-3.5 h-3.5" />
                      <span>Directions</span>
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
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-extrabold text-slate-900 text-base">Add Your Pulmonologist</h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-1.5 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3.5 mt-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Doctor Name *</label>
                <input
                  type="text"
                  value={newDocName}
                  onChange={(e) => setNewDocName(e.target.value)}
                  placeholder="e.g. Dr. Rajesh Sharma, MD (Pulmonary)"
                  className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 border border-slate-200 text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-400"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Hospital / Clinic Name</label>
                <input
                  type="text"
                  value={newDocClinic}
                  onChange={(e) => setNewDocClinic(e.target.value)}
                  placeholder="e.g. Chest Care Clinic / Somaiya Ayurvihar"
                  className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 border border-slate-200 text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-400"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Phone Number</label>
                <input
                  type="text"
                  value={newDocPhone}
                  onChange={(e) => setNewDocPhone(e.target.value)}
                  placeholder="e.g. +91 22 2407 6381 or +91 98200 12345"
                  className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 border border-slate-200 text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-400"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Address</label>
                <input
                  type="text"
                  value={newDocAddress}
                  onChange={(e) => setNewDocAddress(e.target.value)}
                  placeholder="e.g. Local Hospital Road, Near Station"
                  className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 border border-slate-200 text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-400"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Notes / Instructions</label>
                <textarea
                  value={newDocNotes}
                  onChange={(e) => setNewDocNotes(e.target.value)}
                  placeholder="e.g. In case of acute flare-up, call emergency triage extension."
                  rows={2}
                  className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 border border-slate-200 text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-400"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 mt-5 pt-3 border-t border-slate-100">
              <button
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleAddCustomDoctor}
                disabled={!newDocName.trim()}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-teal-600 hover:bg-teal-700 text-white shadow-md disabled:opacity-50 transition-colors"
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
