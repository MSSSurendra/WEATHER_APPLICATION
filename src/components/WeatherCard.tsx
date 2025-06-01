import React from 'react';
import { Thermometer, Droplets, Wind } from 'lucide-react';
import type { WeatherData } from '../types/weather';

interface WeatherCardProps {
  weather: WeatherData;
  isDark: boolean;
}

export function WeatherCard({ weather, isDark }: WeatherCardProps) {
  return (
    <div
      className={`p-6 rounded-xl ${
        isDark ? 'bg-gray-800/50' : 'bg-white/30 backdrop-blur-md'
      }`}
    >
      <div className="flex flex-col md:flex-row items-center justify-between">
        <div className="text-center md:text-left mb-4 md:mb-0">
          <h2 className="text-3xl font-bold text-white mb-1">{weather.name}</h2>
          <p className="text-5xl font-bold text-white">
            {Math.round(weather.main.temp)}°C
          </p>
          <p className="text-xl text-white/80 mt-1">
            {weather.weather[0].description}
          </p>
        </div>

        <div className="flex items-center justify-center">
          <img
            src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@4x.png`}
            alt={weather.weather[0].description}
            className="w-32 h-32"
          />
        </div>

        <div className="grid grid-cols-1 gap-4 text-white">
          <div className="flex items-center gap-2">
            <Thermometer className="w-5 h-5 text-white/80" />
            <span>Feels like: {Math.round(weather.main.feels_like)}°C</span>
          </div>
          <div className="flex items-center gap-2">
            <Droplets className="w-5 h-5 text-white/80" />
            <span>Humidity: {weather.main.humidity}%</span>
          </div>
          <div className="flex items-center gap-2">
            <Wind className="w-5 h-5 text-white/80" />
            <span>Wind: {Math.round(weather.wind.speed)} m/s</span>
          </div>
        </div>
      </div>
    </div>
  );
}