import React from 'react';
import { Droplets, Wind, Thermometer, Eye } from 'lucide-react';

const WeatherStats = ({ current }) => {
    const stats = [
        { label: 'Humidity', value: `${current.relative_humidity_2m}%`, icon: Droplets, color: 'text-blue-400' },
        { label: 'Wind Speed', value: `${current.wind_speed_10m} km/h`, icon: Wind, color: 'text-teal-400' },
        { label: 'Feels Like', value: `${Math.round(current.apparent_temperature)}°`, icon: Thermometer, color: 'text-orange-400' },
        { label: 'UV Index', value: 'Low', icon: Eye, color: 'text-purple-400' },
    ];

    return (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-8 animate-fade-in" style={{ animationDelay: '0.1s' }}>
            {stats.map((stat, idx) => {
                const Icon = stat.icon;
                return (
                    <div key={idx} className="glass-card p-6 flex flex-col items-center gap-3">
                        <Icon className={stat.color} size={24} />
                        <div className="text-center">
                            <p className="text-xs text-slate-400 uppercase tracking-wider mb-1">{stat.label}</p>
                            <p className="text-xl font-bold text-white">{stat.value}</p>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default WeatherStats;
