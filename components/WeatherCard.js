import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function WeatherCard({ weather }) {
  return (
    <View style={styles.card}>
      <Text style={styles.city}>{weather.name}, {weather.country}</Text>
      <Text style={styles.temp}>{weather.temperature}°C</Text>
      <Text style={styles.condition}>{weather.emoji} {weather.label}</Text>
      <Text style={styles.wind}>💨 Angin: {weather.windspeed} km/jam {weather.windDirectionText}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: '#fff', padding: 20, borderRadius: 12, width: '100%', alignItems: 'center', elevation: 3 },
  city: { fontSize: 24, fontWeight: 'bold', marginBottom: 8 },
  temp: { fontSize: 48, fontWeight: 'bold', color: '#007AFF', marginBottom: 8 },
  condition: { fontSize: 18, marginBottom: 8 },
  wind: { fontSize: 16, color: '#555' },
});