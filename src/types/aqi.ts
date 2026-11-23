export interface AQIData {
  aqi: number;
  category: 'Good' | 'Moderate' | 'Unhealthy for Sensitive Groups' | 'Unhealthy' | 'Very Unhealthy' | 'Hazardous';
  color: string;
  bgColor: string;
  textColor: string;
  description: string;
  copdAdvice: string;
  outdoorAllowed: boolean;
  maskRecommended: boolean;
  pollutants: {
    pm2_5: number;
    pm10: number;
    co?: number;
    no2?: number;
    so2?: number;
    o3?: number;
  };
  city: string;
  latitude: number;
  longitude: number;
  updatedAt: string;
}

export interface GeocodingResult {
  id: number;
  name: string;
  country: string;
  admin1?: string;
  latitude: number;
  longitude: number;
}
