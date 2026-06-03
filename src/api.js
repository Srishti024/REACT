// Connects to Open-Meteo API
export async function searchLocation(query) {
  try {
    const res = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(query)}&count=10&language=en&format=json`);
    const data = await res.json();
    
    if (!data.results) return [];
    
    // Explicitly filter for Indian locations
    return data.results.filter(loc => loc.country_code === 'IN' || loc.country === 'India');
  } catch(e) {
    console.error(e)
    return [];
  }
}

export async function getWeather(lat, lon) {
  try {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,is_day,precipitation,weather_code,cloud_cover,wind_speed_10m&daily=weather_code,temperature_2m_max,temperature_2m_min&timezone=auto`;
    const res = await fetch(url);
    const data = await res.json();
    return data;
  } catch(e) {
    console.error(e)
    return null;
  }
}

export function getWeatherDescription(code) {
  // map WMO codes
  if (code === 0) return 'Clear';
  if ([1,2,3].includes(code)) return 'Cloudy';
  if ([45, 48].includes(code)) return 'Fog';
  if ([51, 53, 55, 56, 57].includes(code)) return 'Drizzle';
  if ([61, 63, 65, 66, 67, 80, 81, 82].includes(code)) return 'Rain';
  if ([71, 73, 75, 77, 85, 86].includes(code)) return 'Snow';
  if ([95, 96, 99].includes(code)) return 'Thunderstorm';
  return 'Unknown';
}
