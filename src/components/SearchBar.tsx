import React, { useState } from 'react';
import { Search } from 'lucide-react';

interface SearchBarProps {
  onSearch: (city: string) => void;
  isDark: boolean;
}

export function SearchBar({ onSearch, isDark }: SearchBarProps) {
  const [city, setCity] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (city.trim()) {
      onSearch(city.trim());
      setCity('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-md mx-auto mb-8">
      <div className="relative">
        <input
          type="text"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          placeholder="Search for a city..."
          className={`w-full px-4 py-2 ${
            isDark 
              ? 'bg-gray-800 text-white border-gray-700 focus:ring-blue-500' 
              : 'bg-white text-gray-900 border-gray-300 focus:ring-blue-500'
          } border rounded-lg focus:outline-none focus:ring-2 pr-12 transition-colors duration-200`}
        />
        <button
          type="submit"
          className={`absolute right-2 top-1/2 -translate-y-1/2 ${
            isDark ? 'text-gray-400 hover:text-blue-400' : 'text-gray-500 hover:text-blue-500'
          } transition-colors duration-200`}
        >
          <Search className="w-6 h-6" />
        </button>
      </div>
    </form>
  );
}