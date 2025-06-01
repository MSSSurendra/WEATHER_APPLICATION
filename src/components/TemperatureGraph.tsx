import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import type { HourlyForecast } from '../types/weather';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface TemperatureGraphProps {
  forecast: HourlyForecast[];
  isDark: boolean;
  isCelsius: boolean;
  convertTemp: (temp: number) => number;
}

export function TemperatureGraph({ forecast, isDark, isCelsius, convertTemp }: TemperatureGraphProps) {
  const next24Hours = forecast.slice(0, 24);

  const data = {
    labels: next24Hours.map(hour => 
      new Date(hour.dt * 1000).toLocaleTimeString('en-US', { hour: 'numeric', hour12: true })
    ),
    datasets: [
      {
        label: `Temperature (°${isCelsius ? 'C' : 'F'})`,
        data: next24Hours.map(hour => Math.round(convertTemp(hour.main.temp))),
        borderColor: '#60A5FA',
        backgroundColor: 'rgba(96, 165, 250, 0.2)',
        borderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 6,
        pointBackgroundColor: '#60A5FA',
        pointHoverBackgroundColor: '#2563EB',
        pointBorderColor: '#fff',
        pointHoverBorderColor: '#fff',
        tension: 0.4,
        fill: true,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        labels: {
          color: '#fff',
          font: {
            size: 14,
          },
        },
      },
      tooltip: {
        mode: 'index' as const,
        intersect: false,
        backgroundColor: isDark ? 'rgba(17, 24, 39, 0.8)' : 'rgba(255, 255, 255, 0.8)',
        titleColor: isDark ? '#fff' : '#000',
        bodyColor: isDark ? '#fff' : '#000',
        borderColor: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
        borderWidth: 1,
        padding: 12,
        bodyFont: {
          size: 14,
        },
        titleFont: {
          size: 14,
          weight: 'bold',
        },
      },
    },
    scales: {
      x: {
        grid: {
          color: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
        },
        ticks: {
          color: '#fff',
          font: {
            size: 12,
          },
        },
      },
      y: {
        grid: {
          color: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
        },
        ticks: {
          color: '#fff',
          font: {
            size: 12,
          },
        },
      },
    },
    interaction: {
      mode: 'nearest' as const,
      axis: 'x' as const,
      intersect: false,
    },
  };

  return (
    <div className={`mt-8 p-6 rounded-2xl backdrop-blur-lg ${
      isDark ? 'bg-gray-800/50' : 'bg-white/30'
    }`}>
      <h2 className="text-2xl font-semibold text-white mb-6">Temperature Trend</h2>
      <div className="h-[400px] w-full">
        <Line data={data} options={options} />
      </div>
    </div>
  );
}