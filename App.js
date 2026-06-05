import React, { useState, useEffect, useRef } from 'react';
import { View, TextInput, Text, ActivityIndicator, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView, Keyboard } from 'react-native';
import { getWeatherInfo } from './utils/weatherCodes';
import { degToDirection } from './utils/windDirection';
import WeatherCard from './components/WeatherCard';

export default function App() {
  const [input, setInput] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [refreshFlag, setRefreshFlag] = useState(0);
  const abortRef = useRef(null);
  const timerRef = useRef(null);

  useEffect(() => {
    if (!searchTerm.trim()) {
      setWeather(null);
      setError(null);
      setLoading(false);
      return;
    }
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(async () => {
      setLoading(true);
      setError(null);
      if (abortRef.current) abortRef.current.abort();
      const controller = new AbortController();
      abortRef.current = controller;
      try {
        const geoUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(searchTerm)}&count=1&language=id`;
        const geoRes = await fetch(geoUrl, { signal: controller.signal });
        const geoData = await geoRes.json();
        if (!geoData.results || geoData.results.length === 0) throw new Error('Kota tidak ditemukan');
        const { latitude, longitude, name, country } = geoData.results[0];
        const forecastUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true&timezone=auto`;
        const forecastRes = await fetch(forecastUrl, { signal: controller.signal });
        const forecastData = await forecastRes.json();
        const current = forecastData.current_weather;
        const weatherInfo = getWeatherInfo(current.weathercode);
        setWeather({
          name, country, temperature: current.temperature,
          label: weatherInfo.label, emoji: weatherInfo.emoji,
          windspeed: current.windspeed, winddirection: current.winddirection,
          windDirectionText: degToDirection(current.winddirection),
        });
      } catch (err) {
        if (err.name !== 'AbortError') setError(err.message);
      } finally {
        if (controller === abortRef.current) setLoading(false);
      }
    }, 500);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      if (abortRef.current) abortRef.current.abort();
    };
  }, [searchTerm, refreshFlag]);

  const handleInputChange = (text) => {
    setInput(text);
    setSearchTerm(text);
  };
  const handleRefresh = () => {
    if (searchTerm.trim()) setRefreshFlag(prev => prev + 1);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollView}>
        <Text style={styles.title}>WeatherFinder</Text>
        <TextInput style={styles.input} placeholder="Cari kota..." value={input} onChangeText={handleInputChange} returnKeyType="search" onSubmitEditing={() => Keyboard.dismiss()} />
        {weather && !loading && <TouchableOpacity style={styles.refreshButton} onPress={handleRefresh}><Text style={styles.refreshText}>🔄 Cari Ulang</Text></TouchableOpacity>}
        {!searchTerm.trim() && !weather && !error && <Text style={styles.hint}>🔍 Masukkan nama kota</Text>}
        {loading && <ActivityIndicator size="large" color="#007AFF" />}
        {error && <Text style={styles.error}>⚠️ {error}</Text>}
        {weather && <WeatherCard weather={weather} />}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  scrollView: { flexGrow: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  title: { fontSize: 32, fontWeight: 'bold', marginBottom: 20, color: '#007AFF' },
  input: { width: '100%', backgroundColor: '#fff', padding: 12, borderRadius: 8, fontSize: 16, borderWidth: 1, borderColor: '#ddd', marginBottom: 20 },
  refreshButton: { backgroundColor: '#28a745', paddingVertical: 10, paddingHorizontal: 20, borderRadius: 8, marginBottom: 20 },
  refreshText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  hint: { fontSize: 16, color: '#888' },
  error: { fontSize: 16, color: 'red' },
});