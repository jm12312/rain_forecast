import React, { useState } from 'react';
import { Cloud, Droplets, Wind, Gauge } from 'lucide-react';
import TomorrowForecast from './TomorrowForecast';

const WeatherCard = ({ details, setDetails, current_weather }) => {
  const [showmoreinfo, setShowMoreInfo] = useState(false)
  if (details === undefined || details === null || details < 0 || !current_weather || !current_weather[details]) {
    return null;
  }

  const weather = current_weather[details] || {};
  const days = {
    6: 'Sunday', 0: 'Monday', 1: 'Tuesday',
    2: 'Wednesday', 3: 'Thursday', 4: 'Friday', 5: 'Saturday'
  };

  const isRainy = weather.RainToday === 'Yes';
  const format = (num) => {
    if (num === undefined || num === null || isNaN(num)) return '0.0';
    return Number(num).toFixed(1);
  };

  const TimeData = ({ label, time9am, time3pm, icon: Icon }) => (
    <div className="grid grid-cols-3 items-center gap-2 py-1.5">
      <div className="flex items-center gap-2 text-gray-600">
        <Icon size={16} />
        <span>{label}</span>
      </div>
      <div className="font-medium text-center">{time9am}</div>
      <div className="font-medium text-center">{time3pm}</div>
    </div>
  );

  const date = weather[0] || 'N/A';
  const dayOfWeek = days[weather.dayofweek] || 'N/A';
  const minTemp = format(weather.MinTemp);
  const maxTemp = format(weather.MaxTemp);
  const rainfall = format(weather.Rainfall);

  const humidity9am = format(weather.Humidity9am);
  const humidity3pm = format(weather.Humidity3pm);
  const windSpeed9am = format(weather.WindSpeed9am);
  const windSpeed3pm = format(weather.WindSpeed3pm);
  const windDir9am = weather.WindDir9am || '-';
  const windDir3pm = weather.WindDir3pm || '-';
  const pressure9am = format(weather.Pressure9am);
  const pressure3pm = format(weather.Pressure3pm);
  const cloud9am = format(weather.Cloud9am);
  const cloud3pm = format(weather.Cloud3pm);
  // console.log(weather)
  return (
    <div className="max-w-md mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
      <div className="bg-gradient-to-r from-sky-500 to-blue-600 p-4">
        <div className="flex justify-between items-center text-white">
          <div>
            <h2 className="text-2xl font-bold">{date}</h2>
            <p className="text-sky-100">{dayOfWeek}</p>
          </div>
          <button
            onClick={() => setDetails(-1)}
            className="p-1.5 hover:bg-white/20 rounded-full transition-colors"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M6 18L18 6M6 6l12 12" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
        </div>
      </div>

      <div className="p-6 text-gray-500">
        <div className="flex justify-between items-center mb-6">
          <div className="text-3xl font-bold text-gray-900">
            {minTemp}° / {maxTemp}°
          </div>
          <div className="text-6xl">
            {isRainy ? '🌧️' : '☀️'}
          </div>
        </div>

        <div className="bg-blue-50 rounded-lg p-4 mb-6">
          <div className="flex items-center gap-2 text-blue-800">
            <Droplets size={20} />
            <span className="text-lg font-medium">
              Rainfall: {rainfall} mm
            </span>
          </div>
        </div>
        <div>
          <button onClick={() => setShowMoreInfo(!showmoreinfo)}>{showmoreinfo?"Show less":"Show more"}</button>
        </div>
        {
          showmoreinfo &&
          <div className="border border-gray-200 rounded-lg p-4 space-y-2">
            <div className="grid grid-cols-3 pb-2 border-b border-gray-200">
              <div className="font-semibold">Time</div>
              <div className="font-semibold text-center">9 AM</div>
              <div className="font-semibold text-center">3 PM</div>
            </div>

            <TimeData
              label="Humidity"
              time9am={`${humidity9am}%`}
              time3pm={`${humidity3pm}%`}
              icon={Droplets}
            />
            <TimeData
              label="Wind"
              time9am={`${windSpeed9am} (${windDir9am})`}
              time3pm={`${windSpeed3pm} (${windDir3pm})`}
              icon={Wind}
            />
            <TimeData
              label="Pressure"
              time9am={`${pressure9am} hPa`}
              time3pm={`${pressure3pm} hPa`}
              icon={Gauge}
            />
            <TimeData
              label="Cloud"
              time9am={`${cloud9am}%`}
              time3pm={`${cloud3pm}%`}
              icon={Cloud}
            />
          </div>
        }

      </div>
      <TomorrowForecast weather={weather} date={days[weather.dayofweek + 1]} />
    </div>
  );
};

export default WeatherCard;