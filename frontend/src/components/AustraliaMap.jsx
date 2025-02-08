import React, { useState, useEffect, useContext, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from 'leaflet';
import axios from "axios";
import CityContext from "../context/cities_context";
import WeatherCard from "./WeatherCard.jsx";

const AustraliaMap = ({ date, time }) => {
    const { location, setLocation, active } = useContext(CityContext);
    const [details, setDetails] = useState(-1);
    const [current_weather, setCurrentWeather] = useState([]);
    const australiaCenter = [-25.2744, 133.7751];
    const australiaBounds = [[-55, 90], [0, 185]];
    const [loading, setLoading] = useState(false);
    const [zoom, setZoom] = useState(null);
    const mapRef = useRef(null);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const locationResponse = await axios.get('http://127.0.0.1:5007/api/weather/');
                setLocation(locationResponse.data);
                const weatherResponse = await axios.get('http://127.0.0.1:5007/api/daily-data');
                setCurrentWeather(weatherResponse.data);
            } catch (error) {
                console.error("Error fetching data:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    useEffect(() => {
        if (zoom && mapRef.current) {
            const map = mapRef.current;
            const zoomLevel = map.getZoom() || 8;
            map.flyTo(zoom, zoomLevel, { animate: true, duration: 1.5,easeLinearity: 0.01, });
        }
    }, [zoom]);

    useEffect(() => {
        const fetch_location = async () => {
            if (active) {
                try {
                    const response = await axios.post('http://127.0.0.1:5007/api/location', {"name": active}, {}, {withCredentials: true});
                    const locationString = response.data.loc;
                    const idx = response.data.idx;
                    const [lat, lon] = JSON.parse(locationString);
                    setZoom([lat, lon]);
                    setDetails(idx)
                } catch (error) {
                    console.error("Error posting data to Flask", error);
                }
            }
        };
        fetch_location();
    }, [active]);
    // console.log(details)
    // console.log(current_weather)
    const getWeatherIcon = (isRainy) => {
        const iconSize = 10; // Reduced from 40
        const commonStyles = `
            width: ${iconSize}px;
            height: ${iconSize}px;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 50%;
            transition: all 0.2s ease;
            font-size: 16px;
            backdrop-filter: blur(2px);
        `;

        if (isRainy) {
            return new L.DivIcon({
                className: 'weather-icon-rainy',
                html: `
                    <div style="${commonStyles} background: rgba(56, 189, 248, 0.25); border: 1px solid rgba(56, 189, 248, 0.5);">
                        🌧️
                    </div>
                `,
                iconSize: [iconSize, iconSize],
            });
        } else {
            return new L.DivIcon({
                className: 'weather-icon-sunny',
                html: `
                    <div style="${commonStyles} background: rgba(250, 204, 21, 0.25); border: 1px solid rgba(250, 204, 21, 0.5);">
                        ☀️
                    </div>
                `,
                iconSize: [iconSize, iconSize],
            });
        }
    };

    const WeatherPopup = ({ cityName, isRainy }) => (
        <div className="bg-gray-800 rounded-lg overflow-hidden w-48">
            <div className="bg-gray-700 p-2 border-b border-gray-600">
                <h4 className="text-sky-400 font-medium text-center">
                    {cityName}
                </h4>
            </div>
            <div className="p-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <span className="text-lg">
                        {isRainy ? '🌧️' : '☀️'}
                    </span>
                    <span className="text-gray-200 text-sm">
                        {isRainy ? 'Rainfall' : 'Clear Weather'}
                    </span>
                </div>
            </div>

        </div>
    );

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-900">
                <div className="text-sky-400 text-2xl animate-pulse">Loading weather data...</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-900 p-4 lg:p-8">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col lg:flex-row gap-8">
                    <div className="flex-1">
                        <div className="bg-gray-800/50 backdrop-blur-md rounded-t-2xl p-4 border-t border-x border-gray-700">
                            <h3 className="text-sky-400 text-2xl lg:text-4xl font-bold text-center">
                                {time === "current" 
                                    ? "Current Weather" 
                                    : `Weather Forecast for ${date}`}
                            </h3>
                        </div>

                        <MapContainer
                            center={australiaCenter}
                            zoom={4}
                            maxBounds={australiaBounds}
                            maxBoundsViscosity={1.0}
                            className="h-[300px] lg:h-[350px] w-full rounded-b-2xl shadow-2xl border border-gray-700"
                            ref={mapRef}
                        >
                            <TileLayer
                                url="https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png"
                                attribution='&copy; <a href="https://stadiamaps.com/">Stadia Maps</a>'
                            />

                            {location && location.map((val, idx) => {
                                const position = JSON.parse(val["position"]);
                                const isRainy = time === "forecast" 
                                    ? (val["Yes"] > 0.5) 
                                    : (val["RainToday"] === 1);
                                const weatherIcon = getWeatherIcon(isRainy);

                                return (
                                    <Marker 
                                        position={position} 
                                        key={idx + 1} 
                                        icon={weatherIcon}
                                        eventHandlers={{
                                            click: () => {
                                                setDetails(idx);
                                                setZoom(position);
                                            }
                                        }}
                                    >
                                        <Popup closeButton={false}>
                                            <WeatherPopup 
                                                cityName={`${val["0"]}, Australia`}
                                                isRainy={isRainy}
                                            />
                                        </Popup>
                                    </Marker>
                                );
                            })}
                        </MapContainer>
                    </div>

                    <div className="lg:w-1/3">
                        {details >= 0 && (
                            <div className="bg-gray-800/50 backdrop-blur-md rounded-2xl p-4 border border-gray-700 shadow-xl">
                                <WeatherCard 
                                    details={details} 
                                    setDetails={setDetails} 
                                    current_weather={current_weather} 
                                    time={time} 
                                />
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AustraliaMap;