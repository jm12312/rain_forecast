import React, { useState } from 'react';
import { Search } from 'lucide-react';

const SearchBar = ({ onSearch, query, setQuery }) => {
  const [isFocused, setIsFocused] = useState(false);

  const handleInputChange = (event) => {
    setQuery(event.target.value);
    onSearch(event.target.value);
  };

  return (
    <div className="w-full max-w-2xl mx-auto pt-3 px-4  z-100 border-white">
      <div
        className={`
          flex items-center gap-3 px-4 py-3
          bg-gray-900/50 backdrop-blur-sm
          border border-gray-800
          rounded-full
          shadow-lg shadow-gray-950/10
          transition-all duration-300 ease-in-out
          ${isFocused ? 'ring-2 ring-blue-500/50 border-blue-500/50 scale-[1.01]' : 'hover:border-gray-700 hover:shadow-xl'}
        `}
      >
        <Search 
          className={`
            w-5 h-5
            text-gray-400
            transition-colors duration-300
            ${isFocused ? 'text-blue-400' : ''}
          `}
        />
        <input
          type="text"
          value={query}
          onChange={handleInputChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder="Search for a city..."
          className="
            flex-1
            bg-transparent
            text-gray-100
            placeholder:text-gray-500
            text-base
            focus:outline-none
            selection:bg-blue-500/30
          "
          aria-label="Search input"
        />
      </div>
    </div>
  );
};

export default SearchBar;
