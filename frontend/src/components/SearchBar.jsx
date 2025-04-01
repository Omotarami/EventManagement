import React, { useState } from 'react';
import { Search } from 'lucide-react';

const SearchBar = ({ onSearch, placeholder = "Search", className = "" }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(searchTerm);
    }
  };

  const handleChange = (e) => {
    setSearchTerm(e.target.value);
    //Add debounce logic here for real-time search
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch(e);
    }
  };

  return (
    <div className={`relative ${className}`} style={{ width: '369px' }}>
      <input
        type="text"
        className="w-full py-2 pl-4 pr-10 text-sm text-gray-700 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
        placeholder={placeholder}
        value={searchTerm}
        onChange={handleChange}
        onKeyPress={handleKeyPress}
      />
      <button
        className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-500 hover:text-teal-600 transition-colors"
        onClick={handleSearch}
        aria-label="Search"
      >
        <Search size={18} />
      </button>
    </div>
  );
};

export default SearchBar;