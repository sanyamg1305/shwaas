import React, { useState, useEffect } from 'react';
import { 
  Wind, 
  MapPin, 
  Search, 
  RefreshCw, 
  AlertCircle, 
  ShieldCheck, 
  Activity, 
  CheckCircle, 
  XCircle,
  Info,
  Sparkles,
  ChevronRight,
  TrendingUp
} from 'lucide-react';
import { AQIData, GeocodingResult } from '../../types/aqi';
import { fetchLiveAQI, searchCities } from '../../services/aqiService';
import { SION_MUMBAI_COORDS } from '../../services/pulmonologistService';
import { 
  detectUserLocation, 
  getSavedLocation, 
  saveUserLocation, 
  UserLocation 
} from '../../services/locationService';

export const AQISection: React.FC = () => {
  const [aqiData, setAqiData] = useState<AQIData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [cityResults, setCityResults] = useState<GeocodingResult[]>([]);
  const [searching, setSearching] = useState<boolean>(false);
  const [locationStatus, setLocationStatus] = useState<string>('');
  const [activeLocation, setActiveLocation] = useState<UserLocation | null>(null);

  const loadLocationAQI = async (lat: number, lon: number, cityName: string) => {
    setLoading(true);
    setLocationStatus(`Fetching live air quality for ${cityName}...`);
    try {
      const data = await fetchLiveAQI(lat, lon, cityName);
      setAqiData(data);
      setLocationStatus('');
    } catch (err) {
      console.error(err);
      setLocationStatus('Failed to load live air data.');
    } finally {
      setLoading(false);
    }
  };

  const handleUseCurrentLocation = async (forceFresh: boolean = false) => {
    setLocationStatus('Acquiring high-accuracy GPS coordinates...');
    setLoading(true);

    try {
      const loc = await detectUserLocation(forceFresh);
      setActiveLocation(loc);
      setLocationStatus(loc.source === 'gps' ? 'Live GPS Location Acquired' : 'Auto-detected via IP');
      await loadLocationAQI(loc.latitude, loc.longitude, loc.displayName);
    } catch (error) {
      console.warn('Geolocation detection error:', error);
      setLocationStatus('Location access failed. Loaded Mumbai (Sion 400022).');
      loadLocationAQI(SION_MUMBAI_COORDS.lat, SION_MUMBAI_COORDS.lon, 'Mumbai (Sion 400022), Maharashtra');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const saved = getSavedLocation();
    if (saved) {
      setActiveLocation(saved);
      loadLocationAQI(saved.latitude, saved.longitude, saved.displayName);
    } else {
      handleUseCurrentLocation(false);
    }

    const handleLocationUpdate = (e: any) => {
      if (e.detail) {
        setActiveLocation(e.detail);
        loadLocationAQI(e.detail.latitude, e.detail.longitude, e.detail.displayName);
      }
    };
    window.addEventListener('shwaas_location_updated', handleLocationUpdate);
    return () => window.removeEventListener('shwaas_location_updated', handleLocationUpdate);
  }, []);

  // Handle city search debounce
  useEffect(() => {
    const timer = setTimeout(async () => {
      if (searchQuery.trim().length >= 2) {
        setSearching(true);
        const results = await searchCities(searchQuery);
        setCityResults(results);
        setSearching(false);
      } else {
        setCityResults([]);
      }
    }, 350);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const handleSelectCity = (city: GeocodingResult) => {
    const displayName = `${city.name}${city.admin1 ? ', ' + city.admin1 : ''}, ${city.country}`;
    setSearchQuery('');
    setCityResults([]);
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
    setActiveLocation(loc);
    loadLocationAQI(city.latitude, city.longitude, displayName);
  };

  const handleSelectPopularCity = (c: { name: string; lat: number; lon: number }) => {
    const loc: UserLocation = {
      latitude: c.lat,
      longitude: c.lon,
      city: c.name.split('(')[0].trim(),
      country: 'India',
      displayName: c.name,
      source: 'manual',
      timestamp: Date.now(),
    };
    saveUserLocation(loc);
    setActiveLocation(loc);
    loadLocationAQI(c.lat, c.lon, c.name);
  };

  // Popular Indian cities
  const popularCities = [
    { name: 'Mumbai (Sion 400022)', lat: 19.0434, lon: 72.8634 },
    { name: 'Delhi (NCR)', lat: 28.6139, lon: 77.209 },
    { name: 'Bengaluru', lat: 12.9716, lon: 77.5946 },
    { name: 'Pune', lat: 18.5204, lon: 73.8567 },
    { name: 'Kolkata', lat: 22.5726, lon: 88.3639 },
    { name: 'Ahmedabad', lat: 23.0225, lon: 72.5714 },
    { name: 'Chennai', lat: 13.0827, lon: 80.2707 },
    { name: 'Hyderabad', lat: 17.3850, lon: 78.4867 },
  ];

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Hero Environmental Monitoring Card */}
      <div className="bg-gradient-to-br from-teal-800 via-teal-900 to-slate-900 rounded-3xl p-5 sm:p-8 text-white shadow-xl relative overflow-hidden">
        {/* Ambient subtle glow circles */}
        <div className="absolute right-0 top-0 translate-x-12 -translate-y-12 w-72 h-72 bg-teal-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute left-1/3 bottom-0 translate-y-12 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div className="max-w-xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-500/20 text-teal-200 text-xs font-bold backdrop-blur-md mb-2.5 border border-teal-400/20">
              <Wind className="w-3.5 h-3.5" />
              <span>Real-Time Environmental Monitoring</span>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight">
              Daily Air Quality Index (AQI)
            </h1>
            <p className="text-teal-100/85 text-xs sm:text-sm mt-2 leading-relaxed">
              Air pollution and airborne particulate matter (PM2.5 & PM10) are primary triggers for COPD exacerbations. Check your live local index before venturing outdoors.
            </p>
          </div>

          {/* Quick API badge */}
          <div className="bg-white/10 backdrop-blur-md border border-white/15 rounded-2xl p-3.5 text-xs shrink-0 md:w-60 space-y-1 shadow-inner">
            <div className="flex items-center gap-1.5 font-bold text-teal-200 text-xs">
              <Info className="w-4 h-4 shrink-0" />
              <span>Open-Meteo Air Quality</span>
            </div>
            <p className="text-slate-300 text-[11px] leading-snug">
              Live European & US EPA standards with global satellite feeds & ground station data.
            </p>
          </div>
        </div>

        {/* Search & Location Controls */}
        <div className="mt-6 pt-5 border-t border-teal-700/50 flex flex-col sm:flex-row gap-2.5 relative">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search Indian city, pin code or locality..."
              className="w-full pl-10 pr-4 py-3 rounded-2xl bg-white text-slate-900 placeholder:text-slate-400 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-teal-400 shadow-sm"
            />
            {searching && (
              <RefreshCw className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 animate-spin" />
            )}

            {/* City Autocomplete Dropdown */}
            {cityResults.length > 0 && (
              <div className="absolute left-0 right-0 top-full mt-2 bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden z-30 divide-y divide-slate-100">
                {cityResults.map((city) => (
                  <button
                    key={`${city.id}-${city.latitude}`}
                    onClick={() => handleSelectCity(city)}
                    className="w-full text-left px-4 py-3 text-slate-800 hover:bg-teal-50 flex items-center justify-between text-sm transition-colors font-medium"
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

          <button
            onClick={() => handleUseCurrentLocation(true)}
            className="flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-teal-400 hover:bg-teal-300 active:scale-95 text-slate-950 font-black text-xs sm:text-sm transition-all shadow-md shrink-0"
          >
            <MapPin className="w-4 h-4" />
            <span>Detect My GPS</span>
          </button>
        </div>

        {/* Quick Indian city pills */}
        <div className="mt-3.5 flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1 text-xs">
          <span className="text-teal-300 font-bold whitespace-nowrap mr-1">Quick Select:</span>
          {popularCities.map((c) => (
            <button
              key={c.name}
              onClick={() => handleSelectPopularCity(c)}
              className="whitespace-nowrap px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-medium transition-colors border border-white/10 text-[11px]"
            >
              {c.name}
            </button>
          ))}
        </div>
      </div>

      {locationStatus && (
        <div className="text-xs text-slate-500 flex items-center gap-2 px-2 animate-pulse">
          <RefreshCw className="w-3.5 h-3.5 animate-spin text-teal-600" />
          <span>{locationStatus}</span>
        </div>
      )}

      {/* Main AQI Reading & Clinical Impact Cards */}
      {loading ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 shadow-sm flex flex-col items-center justify-center">
          <div className="w-12 h-12 rounded-full border-4 border-teal-200 border-t-teal-600 animate-spin mb-3" />
          <p className="text-sm font-bold text-slate-700">Fetching live atmospheric & particulate readings...</p>
        </div>
      ) : aqiData ? (
        <div className="space-y-6">
          
          {/* Main Hero Card: Split Left (Radial Dial) & Right (COPD Guidelines) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 bg-white rounded-3xl border border-slate-200/90 shadow-sm p-5 sm:p-8">
            
            {/* Left Column: Premium Radial AQI Dial */}
            <div className="lg:col-span-5 flex flex-col items-center justify-center text-center p-6 rounded-3xl bg-slate-50 border border-slate-100 shadow-inner">
              <span className="text-[11px] uppercase tracking-widest font-black text-slate-400 mb-1">
                Air Quality Index (AQI)
              </span>

              {/* Dial with soft glow */}
              <div 
                className="w-36 h-36 sm:w-40 sm:h-40 rounded-full flex flex-col items-center justify-center my-3 shadow-lg border-8 transition-transform hover:scale-105"
                style={{ 
                  backgroundColor: `${aqiData.color}10`, 
                  borderColor: aqiData.color,
                  boxShadow: `0 10px 30px ${aqiData.color}25`
                }}
              >
                <span 
                  className="text-5xl sm:text-6xl font-black tracking-tight"
                  style={{ color: aqiData.color }}
                >
                  {aqiData.aqi}
                </span>
                <span className="text-[10px] font-extrabold text-slate-500 uppercase tracking-widest mt-0.5">
                  US EPA Scale
                </span>
              </div>

              {/* Status Badge */}
              <div 
                className="inline-block px-4 py-1.5 rounded-full text-xs sm:text-sm font-black uppercase tracking-wider mt-1 border"
                style={{ 
                  backgroundColor: `${aqiData.color}15`, 
                  borderColor: `${aqiData.color}40`,
                  color: aqiData.color 
                }}
              >
                {aqiData.category}
              </div>

              {/* Location Tag */}
              <div className="mt-4 flex items-center gap-1.5 text-xs text-slate-600 font-semibold">
                <MapPin className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                <span className="text-slate-800">{aqiData.city}</span>
                <span className="text-slate-400 font-normal">({aqiData.updatedAt})</span>
              </div>
            </div>

            {/* Right Column: Personalized COPD Clinical Guidance */}
            <div className="lg:col-span-7 flex flex-col justify-between space-y-4">
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <ShieldCheck className="w-5 h-5 text-teal-600" />
                  <h3 className="text-base font-extrabold text-slate-900">
                    What this means for COPD Patients Today
                  </h3>
                </div>

                {/* Major Severity Banner */}
                <div className={`p-4 sm:p-5 rounded-2xl border ${aqiData.bgColor} mb-4 shadow-2xs`}>
                  <p className={`text-xs sm:text-sm font-bold leading-relaxed ${aqiData.textColor}`}>
                    {aqiData.copdAdvice}
                  </p>
                </div>

                {/* Micro Action Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-center gap-3">
                    {aqiData.outdoorAllowed ? (
                      <CheckCircle className="w-6 h-6 text-emerald-600 shrink-0" />
                    ) : (
                      <XCircle className="w-6 h-6 text-rose-500 shrink-0" />
                    )}
                    <div>
                      <span className="font-bold text-slate-900 block text-xs">Outdoor Activities</span>
                      <span className="text-slate-500 text-[11px]">
                        {aqiData.outdoorAllowed ? 'Acceptable with caution' : 'Limit or avoid outside walks'}
                      </span>
                    </div>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-center gap-3">
                    {aqiData.maskRecommended ? (
                      <AlertCircle className="w-6 h-6 text-amber-500 shrink-0" />
                    ) : (
                      <CheckCircle className="w-6 h-6 text-teal-600 shrink-0" />
                    )}
                    <div>
                      <span className="font-bold text-slate-900 block text-xs">Mask Recommendation</span>
                      <span className="text-slate-500 text-[11px]">
                        {aqiData.maskRecommended ? 'N95 / FFP2 mask advised outdoors' : 'Standard air; mask optional'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Localized Shwaas Tip */}
              <div className="p-3.5 rounded-2xl bg-teal-50/80 border border-teal-200/70 flex items-center gap-3 text-xs text-teal-900">
                <Activity className="w-4 h-4 text-teal-700 shrink-0" />
                <span className="leading-relaxed">
                  <strong>Indian Air Tip:</strong> In areas like Mumbai and Delhi, early morning humidity traps smoke & vehicle soot. Complete breathing exercises indoors before 8:00 AM.
                </span>
              </div>
            </div>

          </div>

          {/* Granular Pollutant Cards (Clean 2-col on mobile, 3 on tablet, 6 on desktop) */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-5 sm:p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-extrabold text-slate-900">Key Respiratory Pollutant Readings</h3>
                <p className="text-xs text-slate-500">Fine particulates that directly irritate bronchial walls</p>
              </div>
              <span className="text-xs font-bold px-2.5 py-1 bg-slate-100 text-slate-700 rounded-lg">
                µg/m³
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              {/* PM2.5 */}
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 hover:border-teal-400 transition-colors">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-black text-sm text-slate-900">PM2.5</span>
                  <span className="text-[10px] font-bold text-rose-700 bg-rose-50 px-1.5 py-0.5 rounded">
                    Critical
                  </span>
                </div>
                <div className="text-xl font-black text-slate-900">
                  {aqiData.pollutants.pm2_5} <span className="text-xs font-normal text-slate-400">µg/m³</span>
                </div>
                <p className="text-[11px] text-slate-500 mt-1 leading-snug">
                  Penetrates deep into alveoli.
                </p>
              </div>

              {/* PM10 */}
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 hover:border-teal-400 transition-colors">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-black text-sm text-slate-900">PM10</span>
                  <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded">
                    Dust
                  </span>
                </div>
                <div className="text-xl font-black text-slate-900">
                  {aqiData.pollutants.pm10} <span className="text-xs font-normal text-slate-400">µg/m³</span>
                </div>
                <p className="text-[11px] text-slate-500 mt-1 leading-snug">
                  Triggers upper airway cough.
                </p>
              </div>

              {/* Ozone */}
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 hover:border-teal-400 transition-colors">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-black text-sm text-slate-900">Ozone (O₃)</span>
                </div>
                <div className="text-xl font-black text-slate-900">
                  {aqiData.pollutants.o3 ?? '--'} <span className="text-xs font-normal text-slate-400">µg/m³</span>
                </div>
                <p className="text-[11px] text-slate-500 mt-1 leading-snug">
                  Irritates mucous lining.
                </p>
              </div>

              {/* NO2 */}
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 hover:border-teal-400 transition-colors">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-black text-sm text-slate-900">NO₂</span>
                </div>
                <div className="text-xl font-black text-slate-900">
                  {aqiData.pollutants.no2 ?? '--'} <span className="text-xs font-normal text-slate-400">µg/m³</span>
                </div>
                <p className="text-[11px] text-slate-500 mt-1 leading-snug">
                  Traffic & diesel emission gas.
                </p>
              </div>

              {/* SO2 */}
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 hover:border-teal-400 transition-colors">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-black text-sm text-slate-900">SO₂</span>
                </div>
                <div className="text-xl font-black text-slate-900">
                  {aqiData.pollutants.so2 ?? '--'} <span className="text-xs font-normal text-slate-400">µg/m³</span>
                </div>
                <p className="text-[11px] text-slate-500 mt-1 leading-snug">
                  Causes bronchial spasms.
                </p>
              </div>

              {/* CO */}
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 hover:border-teal-400 transition-colors">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-black text-sm text-slate-900">CO</span>
                </div>
                <div className="text-xl font-black text-slate-900">
                  {aqiData.pollutants.co ?? '--'} <span className="text-xs font-normal text-slate-400">µg/m³</span>
                </div>
                <p className="text-[11px] text-slate-500 mt-1 leading-snug">
                  Impairs oxygen transport.
                </p>
              </div>
            </div>
          </div>

        </div>
      ) : null}
    </div>
  );
};
