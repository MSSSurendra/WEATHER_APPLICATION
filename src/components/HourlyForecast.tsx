import React, { useState, useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { HourlyForecast as HourlyForecastType } from '../types/weather';

interface HourlyForecastProps {
  forecast: HourlyForecastType[];
  isDark: boolean;
  isCelsius: boolean;
  convertTemp: (temp: number) => number;
}

export function HourlyForecast({ forecast, isDark, isCelsius, convertTemp }: HourlyForecastProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);

  const getHourString = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleTimeString('en-US', {
      hour: 'numeric',
      hour12: true,
    });
  };

  const scroll = (direction: 'left' | 'right') => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const scrollAmount = direction === 'left' ? -200 : 200;
    container.scrollBy({ left: scrollAmount, behavior: 'smooth' });

    // Update arrow visibility after scroll
    setTimeout(() => {
      if (container) {
        setShowLeftArrow(container.scrollLeft > 0);
        setShowRightArrow(
          container.scrollLeft < container.scrollWidth - container.clientWidth
        );
      }
    }, 300);
  };

  const handleScroll = () => {
    const container = scrollContainerRef.current;
    if (!container) return;

    setShowLeftArrow(container.scrollLeft > 0);
    setShowRightArrow(
      container.scrollLeft < container.scrollWidth - container.clientWidth
    );
  };

  return (
    <div className={`mt-8 p-6 rounded-2xl backdrop-blur-lg relative ${
      isDark ? 'bg-gray-800/50' : 'bg-white/30'
    }`}>
      <h2 className="text-2xl font-semibold text-white mb-6">Hourly Forecast</h2>
      
      {showLeftArrow && (
        <button
          onClick={() => scroll('left')}
          className={`absolute left-2 top-1/2 transform -translate-y-1/2 z-10 p-2 rounded-full ${
            isDark ? 'bg-gray-700 hover:bg-gray-600' : 'bg-white/60 hover:bg-white/40'
          } text-white transition-all duration-200`}
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
      )}

      {showRightArrow && (
        <button
          onClick={() => scroll('right')}
          className={`absolute right-2 top-1/2 transform -translate-y-1/2 z-10 p-2 rounded-full ${
            isDark ? 'bg-gray-700 hover:bg-gray-600' : 'bg-white/30 hover:bg-white/40'
          } text-white transition-all duration-200`}
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      )}

      <div 
        ref={scrollContainerRef}
        onScroll={handleScroll}
        className="flex overflow-x-auto pb-4 gap-4 scrollbar-hide scroll-smooth"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {forecast.slice(0, 24).map((hour) => (
          <div
            key={hour.dt}
            className={`flex-none w-24 p-4 rounded-xl transform transition-all duration-300 hover:scale-105 ${
              isDark ? 'bg-gray-700/50 hover:bg-gray-700' : 'bg-white/20 hover:bg-white/30'
            }`}
          >
            <p className="text-white text-center font-medium mb-2">
              {getHourString(hour.dt)}
            </p>
            <div className="relative group">
              <img
                src={`https://openweathermap.org/img/wn/${hour.weather[0].icon}@2x.png`}
                alt={hour.weather[0].description}
                className="w-16 h-16 mx-auto transform transition-transform group-hover:scale-110"
              />
              <span className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-xs text-white bg-black/50 rounded-lg">
                {hour.weather[0].description}
              </span>
            </div>
            <p className="text-white text-center mt-1">
              <span className="text-lg font-semibold">
                {Math.round(convertTemp(hour.main.temp))}°
              </span>
              <span className="text-sm ml-1">{isCelsius ? 'C' : 'F'}</span>
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}