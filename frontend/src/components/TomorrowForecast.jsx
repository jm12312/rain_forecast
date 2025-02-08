import React from 'react';
import { Cloud, Droplets, MapPin } from 'lucide-react';

const TomorrowForecast = ({weather, date}) => {
  // Sample data - in real app, this would come from props
  const weatherData = {
    location: "Sydney, NSW",
    chanceOfRain: 70,
    temperature: 24,
    conditions: "Scattered Showers"
  };
  console.log()
  return (
    <div className="w-full max-w-sm bg-gradient-to-br from-blue-500 to-blue-600 rounded-t-2xl overflow-hidden shadow-xl">
      <div className="p-6">
        {/* Date and Location */}
        <div className="text-white mb-6">
          {/* <h2 className="text-2xl font-bold">{weather["0"]}</h2> */}
          <div className="flex items-center mt-2 text-blue-100 font-bold">
            <span>{date}</span>
          </div>
        </div>

        {/* Main Weather Display */}
        <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 mb-4">
          <div className="flex justify-between items-center">
            <div className="text-5xl">
              {weather["Yes"]*100 > 50 ? '🌧️' : '⛅'}
            </div>
          </div>
        </div>

        {/* Precipitation Chance */}
        <div className="bg-white/10 backdrop-blur-md rounded-xl p-4">
          <div className="flex items-center justify-between text-white">
            <div className="flex items-center">
              <Droplets size={20} className="mr-2" />
              <span>Chance of Rain</span>
            </div>
            <div className="flex items-center">
              <span className="text-2xl font-bold">{Math.round(weather.Yes * 100)}%</span>
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="mt-3 bg-white/20 rounded-full h-2">
            <div 
              className="bg-blue-300 h-2 rounded-full transition-all duration-500"
              style={{ width: `${weatherData.Yes * 100}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default TomorrowForecast;