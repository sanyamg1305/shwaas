import React, { useState, useEffect } from 'react';
import { 
  Wind, 
  MapPin, 
  Search, 
  RefreshCw, 
  AlertCircle, 
  ShieldCheck, 
  Activity, 
  HelpCircle, 
  CheckCircle, 
  XCircle,
  Eye,
  Info
} from 'lucide-react';
import { AQIData, GeocodingResult } from '../../types/aqi';
import { fetchLiveAQI, searchCities } from '../../services/aqiService';

export const AQISection: React.FC = () => {
  const [aqiData, setAqiData] = useState<AQIData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [cityResults, setCityResults] = useState<GeocodingResult[]>([]);
  const [searching, setSearching] = useState<boolean>(false);
  const [locationStatus, setLocationStatus] = useState<string>('');

  // Default coordinate: San Francisco / New York / or user location
  const loadLocationAQI = async (lat: number, lon: number, cityName: string) => {
    setLoading(true);
    setLocationStatus(`Fetching air quality data for ${cityName}...`);
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

  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) {
      setLocationStatus('Geolocation is not supported by your browser.');
      return;
    }

    setLocationStatus('Acquiring your GPS location...');
    setLoading(true);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        await loadLocationAQI(latitude, longitude, 'Your Current Location');
      },
      (error) => {
        console.warn('Geolocation error:', error);
        setLocationStatus('Location access was denied or timed out. Loaded default city.');
        loadLocationAQI(40.7128, -74.006, 'New York, USA');
      },
      { timeout: 8000 }
    );
  };

  useEffect(() => {
    // Initial fetch on mount: try browser geolocation or fallback to a standard city
    handleUseCurrentLocation();
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
    loadLocationAQI(city.latitude, city.longitude, displayName);
  };

  // Popular quick cities
  const popularCities = [
    { name: 'New York', lat: 40.7128, lon: -74.006 },
    { name: 'London', lat: 51.5074, lon: -0.1278 },
    { name: 'Delhi', lat: 28.6139, lon: 77.209 },
    { name: 'Los Angeles', lat: 34.0522, lon: -118.2437 },
    { name: 'Chicago', lat: 41.8781, lon: -87.6298 },
    { name: 'Toronto', lat: 43.6532, lon: -79.3832 },
  ];

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header and API Info Card */}
      <div className="bg-gradient-to-r from-teal-700 via-teal-800 to-cyan-900 rounded-3xl p-6 md:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 translate-x-12 -translate-y-12 w-64 h-64 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="max-w-xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-500/20 text-teal-200 text-xs font-semibold backdrop-blur-xs mb-3 border border-teal-400/20">
              <Wind className="w-3.5 h-3.5" />
              <span>Real-Time Environmental Monitoring</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
              Daily Air Quality Index (AQI)
            </h1>
            <p className="text-teal-100/90 text-sm md:text-base mt-2 leading-relaxed">
              Air pollution and airborne particulates (PM2.5 & PM10) are prime triggers for COPD exacerbations and airway spasms. Check your live local index before outdoor activities.
            </p>
          </div>

          {/* Quick API badge */}
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4 text-xs shrink-0 md:w-64 space-y-1.5">
            <div className="flex items-center gap-2 font-bold text-teal-200">
              <Info className="w-4 h-4 shrink-0" />
              <span>Integrated AQI Service</span>
            </div>
            <p className="text-slate-200 text-[11px] leading-normal">
              Powered by <strong>Open-Meteo Air Quality API</strong> (Free, zero-key, live European & US EPA scales with global satellite & ground stations).
            </p>
          </div>
        </div>

        {/* Search & Location Bar */}
        <div className="mt-6 pt-5 border-t border-teal-600/50 flex flex-col sm:flex-row gap-2.5 relative">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search city, town, or region..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white text-slate-900 placeholder:text-slate-400 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-teal-400 shadow-sm"
            />
            {searching && (
              <RefreshCw className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 animate-spin" />
            )}

            {/* City Autocomplete Dropdown */}
            {cityResults.length > 0 && (
              <div className="absolute left-0 right-0 top-full mt-1.5 bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden z-30 divide-y divide-slate-100">
                {cityResults.map((city) => (
                  <button
                    key={`${city.id}-${city.latitude}`}
                    onClick={() => handleSelectCity(city)}
                    className="w-full text-left px-4 py-3 text-slate-800 hover:bg-teal-50 flex items-center justify-between text-sm transition-colors"
                  >
                    <span className="font-medium">
                      {city.name}{city.admin1 ? `, ${city.admin1}` : ''}
                    </span>
                    <span className="text-xs text-slate-500 font-normal">{city.country}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          <button
            onClick={handleUseCurrentLocation}
            className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-sm transition-all shadow-md shrink-0 active:scale-95"
          >
            <MapPin className="w-4 h-4" />
            <span>My Location</span>
          </button>
        </div>

        {/* Quick popular city chips */}
        <div className="mt-3 flex items-center gap-1.5 flex-wrap text-xs">
          <span className="text-teal-300 font-semibold mr-1">Quick Select:</span>
          {popularCities.map((c) => (
            <button
              key={c.name}
              onClick={() => loadLocationAQI(c.lat, c.lon, c.name)}
              className="px-2.5 py-1 rounded-full bg-white/10 hover:bg-white/20 text-white font-medium transition-colors border border-white/10 text-[11px]"
            >
              {c.name}
            </button>
          ))}
        </div>
      </div>

      {locationStatus && (
        <div className="text-xs text-slate-500 flex items-center gap-1.5 px-2">
          <RefreshCw className="w-3.5 h-3.5 animate-spin text-teal-600" />
          <span>{locationStatus}</span>
        </div>
      )}

      {/* Main AQI Display Card */}
      {loading ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 shadow-sm flex flex-col items-center justify-center">
          <RefreshCw className="w-8 h-8 text-teal-600 animate-spin mb-3" />
          <p className="text-sm font-semibold text-slate-700">Fetching live atmospheric & particulate readings...</p>
        </div>
      ) : aqiData ? (
        <div className="space-y-6">
          {/* Main Reading Card */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 bg-white rounded-3xl border border-slate-200 shadow-sm p-6 md:p-8">
            
            {/* Left Column: AQI Big Score & Dial */}
            <div className="lg:col-span-5 flex flex-col items-center justify-center text-center p-6 rounded-2xl bg-slate-50 border border-slate-100">
              <span className="text-xs uppercase tracking-wider font-bold text-slate-500 mb-1">
                US EPA Air Quality Index
              </span>
              <div 
                className="w-32 h-32 rounded-full flex flex-col items-center justify-center my-3 shadow-inner border-4 transition-transform hover:scale-105"
                style={{ 
                  backgroundColor: `${aqiData.color}15`, 
                  borderColor: aqiData.color 
                }}
              >
                <span 
                  className="text-5xl font-black tracking-tight"
                  style={{ color: aqiData.color }}
                >
                  {aqiData.aqi}
                </span>
                <span className="text-[10px] font-bold text-slate-500 tracking-wider uppercase">
                  AQI
                </span>
              </div>

              <div 
                className="inline-block px-3.5 py-1 rounded-full text-sm font-extrabold uppercase tracking-wide mt-1"
                style={{ 
                  backgroundColor: `${aqiData.color}20`, 
                  color: aqiData.color 
                }}
              >
                {aqiData.category}
              </div>

              <div className="mt-4 flex items-center gap-1 text-xs text-slate-500">
                <MapPin className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                <span className="font-semibold text-slate-700">{aqiData.city}</span>
                <span className="text-slate-400">({aqiData.updatedAt})</span>
              </div>
            </div>

            {/* Right Column: Tailored COPD Advice */}
            <div className="lg:col-span-7 flex flex-col justify-between space-y-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <ShieldCheck className="w-5 h-5 text-teal-600" />
                  <h3 className="text-base font-bold text-slate-900">
                    What this means for COPD Patients Today
                  </h3>
                </div>

                <div className={`p-4 rounded-2xl border ${aqiData.bgColor} mb-4`}>
                  <p className={`text-sm font-semibold leading-relaxed ${aqiData.textColor}`}>
                    {aqiData.copdAdvice}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center gap-2.5">
                    {aqiData.outdoorAllowed ? (
                      <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
                    ) : (
                      <XCircle className="w-5 h-5 text-rose-500 shrink-0" />
                    )}
                    <div>
                      <span className="font-bold text-slate-800 block">Outdoor Exercise</span>
                      <span className="text-slate-500">
                        {aqiData.outdoorAllowed ? 'Acceptable with caution' : 'Limit or avoid outside'}
                      </span>
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center gap-2.5">
                    {aqiData.maskRecommended ? (
                      <AlertCircle className="w-5 h-5 text-amber-500 shrink-0" />
                    ) : (
                      <CheckCircle className="w-5 h-5 text-teal-600 shrink-0" />
                    )}
                    <div>
                      <span className="font-bold text-slate-800 block">Mask Recommendation</span>
                      <span className="text-slate-500">
                        {aqiData.maskRecommended ? 'N95 / FFP2 if venturing out' : 'Not required for healthy air'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-teal-50/70 border border-teal-100 flex items-center gap-3 text-xs text-teal-900">
                <Activity className="w-4 h-4 text-teal-700 shrink-0" />
                <span>
                  <strong>Tip for COPD:</strong> Cold, humid, or high-pollution air can trigger bronchial constriction. Always carry your rescue inhaler before leaving the house.
                </span>
              </div>
            </div>
          </div>

          {/* Granular Pollutants Grid */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-bold text-slate-900">Key Respiratory Pollutant Breakdown</h3>
                <p className="text-xs text-slate-500">Microscopic particulates that penetrate deep into lung airways</p>
              </div>
              <span className="text-xs font-semibold px-2.5 py-1 bg-slate-100 text-slate-600 rounded-lg">
                µg/m³
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              {/* PM2.5 */}
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 hover:border-teal-300 transition-colors">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-extrabold text-sm text-slate-800">PM2.5</span>
                  <span className="text-[10px] uppercase font-bold text-teal-700 bg-teal-50 px-1.5 py-0.5 rounded">
                    Fine Dust
                  </span>
                </div>
                <div className="text-xl font-black text-slate-900">
                  {aqiData.pollutants.pm2_5} <span className="text-xs font-normal text-slate-500">µg/m³</span>
                </div>
                <p className="text-[11px] text-slate-500 mt-1">
                  Most critical for COPD. Penetrates alveoli.
                </p>
              </div>

              {/* PM10 */}
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 hover:border-teal-300 transition-colors">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-extrabold text-sm text-slate-800">PM10</span>
                  <span className="text-[10px] uppercase font-bold text-slate-600 bg-slate-100 px-1.5 py-0.5 rounded">
                    Coarse Dust
                  </span>
                </div>
                <div className="text-xl font-black text-slate-900">
                  {aqiData.pollutants.pm10} <span className="text-xs font-normal text-slate-500">µg/m³</span>
                </div>
                <p className="text-[11px] text-slate-500 mt-1">
                  Irritates trachea and causes coughing.
                </p>
              </div>

              {/* O3 Ozone */}
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 hover:border-teal-300 transition-colors">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-extrabold text-sm text-slate-800">Ozone (O₃)</span>
                </div>
                <div className="text-xl font-black text-slate-900">
                  {aqiData.pollutants.o3 ?? '--'} <span className="text-xs font-normal text-slate-500">µg/m³</span>
                </div>
                <p className="text-[11px] text-slate-500 mt-1">
                  Strong oxidizing lung irritant.
                </p>
              </div>

              {/* NO2 */}
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 hover:border-teal-300 transition-colors">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-extrabold text-sm text-slate-800">NO₂</span>
                </div>
                <div className="text-xl font-black text-slate-900">
                  {aqiData.pollutants.no2 ?? '--'} <span className="text-xs font-normal text-slate-500">µg/m³</span>
                </div>
                <p className="text-[11px] text-slate-500 mt-1">
                  Traffic & diesel exhaust by-product.
                </p>
              </div>

              {/* SO2 */}
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 hover:border-teal-300 transition-colors">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-extrabold text-sm text-slate-800">SO₂</span>
                </div>
                <div className="text-xl font-black text-slate-900">
                  {aqiData.pollutants.so2 ?? '--'} <span className="text-xs font-normal text-slate-500">µg/m³</span>
                </div>
                <p className="text-[11px] text-slate-500 mt-1">
                  Industrial emissions trigger wheezing.
                </p>
              </div>

              {/* CO */}
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 hover:border-teal-300 transition-colors">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-extrabold text-sm text-slate-800">CO</span>
                </div>
                <div className="text-xl font-black text-slate-900">
                  {aqiData.pollutants.co ?? '--'} <span className="text-xs font-normal text-slate-500">µg/m³</span>
                </div>
                <p className="text-[11px] text-slate-500 mt-1">
                  Reduces oxygen carrying capacity.
                </p>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
};
