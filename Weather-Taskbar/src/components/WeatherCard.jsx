import React from 'react';
import * as Icons from 'lucide-react';
import { getWeatherIcon } from '../services/weatherService';

const WeatherCard = ({ data, city }) => {
    const current = data.current;
    const iconName = getWeatherIcon(current.weather_code);
    const Icon = Icons[iconName] || Icons.Cloud;

    return (
        <div className="glass-card p-8 flex flex-col items-center text-center animate-fade-in">
            <div className="w-full flex justify-between items-start mb-8">
                <div className="text-left">
                    <h2 className="text-3xl font-bold text-white mb-1">{city?.name || 'Local Weather'}</h2>
                    <p className="text-slate-400 text-base">{city?.country || 'Your Location'}</p>
                </div>
                <div className="bg-indigo-500/20 px-4 py-2 rounded-full border border-indigo-500/30">
                    <span className="text-indigo-400 text-sm font-semibold">Current</span>
                </div>
            </div>

            <div className="my-10 relative">
                <div className="absolute inset-0 bg-indigo-500/20 blur-3xl rounded-full"></div>
                <Icon size={120} className="text-white relative z-10 drop-shadow-2xl" strokeWidth={1.5} />
            </div>

            <div className="mb-6">
                <div className="text-8xl font-bold text-white tracking-tighter mb-4">
                    {Math.round(current.temperature_2m)}°
                </div>
                <p className="text-2xl text-slate-300 font-medium">Feels like {Math.round(current.apparent_temperature)}°</p>
            </div>
        </div>
    );
};

export default WeatherCard;
