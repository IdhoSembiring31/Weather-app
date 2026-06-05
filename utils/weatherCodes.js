export const getWeatherInfo = (code) => {
  const map = {
    0: { label: 'Cerah', emoji: '☀️' },
    1: { label: 'Cerah Berawan', emoji: '🌤️' },
    2: { label: 'Berawan', emoji: '⛅' },
    3: { label: 'Mendung', emoji: '☁️' },
    45: { label: 'Kabut', emoji: '🌫️' },
    51: { label: 'Gerimis', emoji: '🌦️' },
    61: { label: 'Hujan', emoji: '🌧️' },
    71: { label: 'Salju', emoji: '❄️' },
    80: { label: 'Hujan Lebat', emoji: '⛈️' },
    95: { label: 'Badai', emoji: '⛈️' },
  };
  return map[code] || { label: 'Unknown', emoji: '❓' };
};