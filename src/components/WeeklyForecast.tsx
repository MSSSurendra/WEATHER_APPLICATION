import React from 'react';
import { Cloud, Droplets, Wind } from 'lucide-react';
import type { DailyForecast } from '../types/weather';

interface WeeklyForecastProps {
  daily: DailyForecast[];
  isDark: boolean;
  isCelsius: boolean;
  convertTemp: (temp: number) => number;
}

export function WeeklyForecast({ daily, isDark, isCelsius, convertTemp }: WeeklyForecastProps) {
  const getDayName = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleDateString('en-US', { weekday: 'long' });
  };

  return (
    <div className={`mt-8 p-6 rounded-2xl backdrop-blur-lg ${
      isDark ? 'bg-gray-800/50' : 'bg-white/30'
    }`}>
      <h2 className="text-2xl font-semibold text-white mb-6">7-Day Forecast</h2>
      <div className="space-y-4">
        {daily.slice(0, 7).map((day) => (
          <div
            key={day.dt}
            className={`p-4 rounded-xl flex items-center justify-between transform transition-all duration-300 hover:scale-[1.01] ${
              isDark ? 'bg-gray-700/50 hover:bg-gray-900' : 'bg-white/10 hover:bg-white/10'
            }`}
          >
            <div className="flex items-center gap-4">
              <span className="text-white font-medium w-32">{getDayName(day.dt)}</span>
              <div className="relative group w-16">
                <img
                  src={`https://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png`}
                  alt={day.weather[0].description}
                  className="transform transition-transform group-hover:scale-110"
                />
                <span className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-xs text-white bg-black/50 rounded-lg">
                  {day.weather[0].description}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-8">
              <div className="flex items-center gap-2 text-white/80">
                <Droplets className="w-4 h-4 text-blue-400" />
                <span className="text-sm">{day.humidity}%</span>
              </div>
              <div className="flex items-center gap-2 text-white/80">
                <Wind className="w-4 h-4 text-blue-400" />
                <span className="text-sm">{Math.round(day.wind_speed)}m/s</span>
              </div>
              <div className="w-24 text-right">
                <span className="text-lg font-semibold text-white">
                  {Math.round(convertTemp(day.temp.max))}°
                </span>
                <span className="text-sm text-white/70 ml-2">
                  {Math.round(convertTemp(day.temp.min))}°{isCelsius ? 'C' : 'F'}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}