const BASE_URL = 'https://api.open-meteo.com/v1/forecast';
const GEO_URL = 'https://geocoding-api.open-meteo.com/v1/search';

export const fetchWeather = async (lat, lon) => {
  const response = await fetch(
    `${BASE_URL}?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,weather_code,wind_speed_10m&daily=weather_code,temperature_2m_max,temperature_2m_min&timezone=auto`
  );
  if (!response.ok) throw new Error('Failed to fetch weather data');
  return response.json();
};

export const searchCities = async (query) => {
  if (!query || query.length < 2) return [];
  const response = await fetch(`${GEO_URL}?name=${encodeURIComponent(query)}&count=5&language=en&format=json`);
  if (!response.ok) throw new Error('Failed to fetch locations');
  const data = await response.json();
  return data.results || [];
};

export const getWeatherIcon = (code) => {
  // Simplified WMO Weather interpretation codes
  if (code === 0) return 'Sun';
  if (code >= 1 && code <= 3) return 'CloudSun';
  if (code >= 45 && code <= 48) return 'CloudFog';
  if (code >= 51 && code <= 67) return 'CloudRain';
  if (code >= 71 && code <= 77) return 'CloudSnow';
  if (code >= 80 && code <= 82) return 'CloudRainWind';
  if (code >= 95) return 'CloudLightning';
  return 'Cloud';
};
