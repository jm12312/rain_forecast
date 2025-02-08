import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { Calendar, SunMedium } from 'lucide-react';
import './App.css';
import AustraliaMap from './components/AustraliaMap';
import SearchBar from './components/SearchBar';
import CityContext from './context/cities_context';

function App() {
  const [data, setData] = useState(null);
  const [query, setQuery] = useState('');
  const { location , active, setActive} = useContext(CityContext);
  const [filteredItems, setFilteredItems] = useState(location);
  const [time, setTime] = useState("current");
  const [isLoading, setIsLoading] = useState(true);
  // console.log(location)
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get('https://rain-forecast.onrender.com/api/home/');
        setData(response.data.message);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleSearch = (query) => {
    if (query === '') {
      setFilteredItems(location);
    } else {
      const lowercasedQuery = query.toLowerCase();
      setFilteredItems(
        location.filter(location => 
          location["0"].toLowerCase().includes(lowercasedQuery)
        )
      );
    }
  };

  const handleChange = (val) => {
    setQuery(val);
    setFilteredItems(null);
    setActive(val)
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 text-gray-100">
      <div className="container mx-auto px-4">
        {/* Header Section */}
        <div className="mb-3 text-center">
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-emerald-400">
            Australian Weather Map
          </h1>
          <p className="text-gray-400 text-sm">Explore weather conditions across Australia</p>
        </div>
        <div className='flex justify-evenly'> 
        {/* Search Section */}
        <div className="relative z-10 w-1/4">
          <SearchBar onSearch={handleSearch} query={query} setQuery={setQuery} />
          
          {/* Dropdown Results */}
          {filteredItems && query.length > 1 && (
            <div className="absolute left-1/2 transform -translate-x-1/2 mt-2 w-full max-w-2xl max-h-48 overflow-y-auto 
                          bg-gray-800/90 backdrop-blur-sm border border-gray-700 rounded-lg shadow-lg">
              <ul className="py-2">
                {filteredItems.map((item, index) => (
                  <li
                    key={index}
                    className="px-4 py-3 text-gray-200 hover:bg-gray-700/50 cursor-pointer transition-colors duration-200"
                    onClick={() => handleChange(item["0"])}
                  >
                    {item["0"]}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Time Toggle Section */}
        <div className="flex justify-center gap-4 my-3">
          <button
            onClick={() => setTime("current")}
            className={`
              flex items-center gap-2 px-6 py-3 rounded-full
              transition-all duration-300 ease-in-out
              ${time === "current" 
                ? "bg-blue-500/20 text-blue-400 ring-1 ring-blue-500/50" 
                : "bg-gray-800/50 text-gray-400 hover:bg-gray-700/50"}
            `}
          >
            <SunMedium className="w-5 h-5" />
            Today
          </button>
          <button
            onClick={() => setTime("forecast")}
            className={`
              flex items-center gap-2 px-6 py-3 rounded-full
              transition-all duration-300 ease-in-out
              ${time === "forecast" 
                ? "bg-blue-500/20 text-blue-400 ring-1 ring-blue-500/50" 
                : "bg-gray-800/50 text-gray-400 hover:bg-gray-700/50"}
            `}
          >
            <Calendar className="w-5 h-5" />
            Tomorrow
          </button>
        </div>
        </div>


        {/* Map Section */}
        <div className="relative rounded-xl  bg-gray-800/30 p-4">
          {isLoading ? (
            <div className="flex items-center justify-center min-h-[400px]">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : (
            <div className="transition-opacity duration-300">
              <AustraliaMap date={data} time={time} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;