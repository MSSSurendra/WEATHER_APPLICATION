import React, { useState, useEffect } from 'react';
import { Cloud, AlertCircle, Sun, Moon, Linkedin, Github, Mail } from 'lucide-react';
import { WeatherCard } from './components/WeatherCard';
import { SearchBar } from './components/SearchBar';
import { HourlyForecast } from './components/HourlyForecast';
import { WeeklyForecast } from './components/WeeklyForecast';
import { TemperatureGraph } from './components/TemperatureGraph';
import type { DailyForecast } from './types/weather';
import type { WeatherData, HourlyForecast as HourlyForecastType } from './types/weather';

const API_KEY = '657c4af6d41bd235c86bb2b03b63ccc6';

function App() {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [forecast, setForecast] = useState<HourlyForecastType[]>([]);
  const [dailyForecast, setDailyForecast] = useState<DailyForecast[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isCelsius, setIsCelsius] = useState(true);
  const [isDark, setIsDark] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('theme') === 'dark';
    }
    return false;
  });

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDark]);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          fetchWeatherByCoords(position.coords.latitude, position.coords.longitude);
        },
        (error) => {
          console.error('Error getting location:', error);
          setError('Unable to get your location. Please search for a city manually.');
        }
      );
    }
  }, []);

  const processDaily = (list: any[]): DailyForecast[] => {
    const dailyData: { [key: string]: any } = {};
    
    list.forEach(item => {
      const date = new Date(item.dt * 1000).toLocaleDateString();
      if (!dailyData[date]) {
        dailyData[date] = {
          dt: item.dt,
          temp: {
            min: item.main.temp_min,
            max: item.main.temp_max,
            day: item.main.temp
          },
          weather: item.weather,
          humidity: item.main.humidity,
          wind_speed: item.wind.speed
        };
      } else {
        dailyData[date].temp.min = Math.min(dailyData[date].temp.min, item.main.temp_min);
        dailyData[date].temp.max = Math.max(dailyData[date].temp.max, item.main.temp_max);
      }
    });

    return Object.values(dailyData);
  };

  const convertTemp = (temp: number) => {
    return isCelsius ? temp : (temp * 9/5) + 32;
  };

  const fetchWeatherByCoords = async (lat: number, lon: number) => {
    setLoading(true);
    setError(null);
    try {
      const [weatherResponse, forecastResponse] = await Promise.all([
        fetch(
          `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`
        ),
        fetch(
          `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`
        )
      ]);

      if (!weatherResponse.ok || !forecastResponse.ok) {
        throw new Error('Failed to fetch weather data');
      }

      const [weatherData, forecastData] = await Promise.all([
        weatherResponse.json(),
        forecastResponse.json(),
      ]);

      setWeather(weatherData);
      setForecast(forecastData.list);
      setDailyForecast(processDaily(forecastData.list));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch weather data');
      setWeather(null);
      setForecast([]);
      setDailyForecast([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchWeatherData = async (city: string) => {
    setLoading(true);
    setError(null);
    try {
      const [weatherResponse, forecastResponse] = await Promise.all([
        fetch(
          `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${API_KEY}`
        ),
        fetch(
          `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${API_KEY}`
        )
      ]);

      if (!weatherResponse.ok || !forecastResponse.ok) {
        throw new Error('City not found');
      }

      const [weatherData, forecastData] = await Promise.all([
        weatherResponse.json(),
        forecastResponse.json(),
      ]);

      setWeather(weatherData);
      setForecast(forecastData.list);
      setDailyForecast(processDaily(forecastData.list));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch weather data');
      setWeather(null);
      setForecast([]);
      setDailyForecast([]);
    } finally {
      setLoading(false);
    }
  };

 return (
    <div className={`min-h-screen transition-colors duration-200 ${
      isDark 
        ? 'bg-gradient-to-br from-gray-900 via-gray-700 to-gray-800' 
        : 'bg-gradient-to-br from-sky-800 via-sky-700 to-sky-500'
    } py-12 px-4 relative`}>
      <button
        onClick={() => setIsDark(!isDark)}
        className="fixed bottom-6 right-6 p-3 rounded-full bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl transition-all duration-200"
        aria-label="Toggle theme"
      >
        {isDark ? (
          <Sun className="w-6 h-6 text-yellow-500" />
        ) : (
          <Moon className="w-6 h-6 text-gray-700" />
        )}
      </button>

      <div className="max-w-4xl mx-auto relative z-10">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2 flex items-center justify-center gap-2">
            <Cloud className="w-10 h-10" />
            Weather Forecast
          </h1>
          <p className="text-white/80">
            Get current weather conditions and forecast
          </p>
        </div>

        <div className="flex items-center justify-center gap-4 mb-8">
          <SearchBar onSearch={fetchWeatherData} isDark={isDark} />
          <button
            onClick={() => setIsCelsius(!isCelsius)}
            className="p-3 rounded-full w-12 h-12 flex items-center justify-center transition-all duration-200 bg-white/10 backdrop-blur-md hover:bg-white/20 text-white"
            title="Toggle temperature unit"
          >
            {isCelsius ? '°C' : '°F'}
          </button>
        </div>

        {loading && (
          <div className="text-center text-white">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto"></div>
            <p className="mt-4">Loading weather data...</p>
          </div>
        )}

        {error && (
          <div className="bg-red-50/10 backdrop-blur-md border-l-4 border-red-500 p-4 rounded-md max-w-sm mx-auto">
            <div className="flex items-center">
              <AlertCircle className="w-6 h-6 text-red-500 mr-2" />
              <p className="text-white">{error}</p>
            </div>
          </div>
        )}

        {weather && !loading && !error && (
          <>
            <WeatherCard weather={weather} isDark={isDark} isCelsius={isCelsius} convertTemp={convertTemp} />
            <TemperatureGraph forecast={forecast} isDark={isDark} isCelsius={isCelsius} convertTemp={convertTemp} />
            <HourlyForecast forecast={forecast} isDark={isDark} isCelsius={isCelsius} convertTemp={convertTemp} />
            {dailyForecast.length > 0 && (
              <WeeklyForecast daily={dailyForecast} isDark={isDark} isCelsius={isCelsius} convertTemp={convertTemp} />
            )}
          </>
        )}

        <footer className="mt-12 text-center">
          <div className="flex justify-center gap-8 flex-wrap mb-6">
            <a
              href="https://www.linkedin.com/in/surendrameka"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-white hover:text-blue-300 transition-colors duration-200"
            >
              <Linkedin className="w-6 h-6" />
              <span>LinkedIn</span>
            </a>

            <a
              href="https://www.github.com/MSSSurendra"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-white hover:text-blue-300 transition-colors duration-200"
            >
              <Github className="w-6 h-6" />
              <span>GitHub</span>
            </a>

            <a
              href="mailto:surendrachowdarymeka18@gmail.com"
              className="inline-flex items-center gap-2 text-white hover:text-blue-300 transition-colors duration-200"
            >
              <Mail className="w-6 h-6" />
              <span>Email</span>
            </a>
          </div>
          <div className="text-white/70 text-sm">
            © {new Date().getFullYear()} Made  with ❤️  by M.S.S.Surendra.
          </div>
        </footer>
      </div>
    </div>
  );
}

export default App;