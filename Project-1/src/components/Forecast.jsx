import React from 'react';
import * as Icons from 'lucide-react';
import { getWeatherIcon } from '../services/weatherService';

const Forecast = ({ daily }) => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    return (
        <div className="mt-8 glass-card p-8 animate-fade-in" style={{ animationDelay: '0.2s' }}>
            <h3 className="text-xl font-bold text-white mb-6">7-Day Forecast</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
                {daily.time.slice(0, 7).map((time, idx) => {
                    const date = new Date(time);
                    const dayName = days[date.getDay()];
                    const iconName = getWeatherIcon(daily.weather_code[idx]);
                    const Icon = Icons[iconName] || Icons.Cloud;

                    return (
                        <div key={time} className="flex flex-col items-center p-4 rounded-2xl hover:bg-white/5 transition-colors group">
                            <p className="text-sm font-medium text-slate-400 mb-3 group-hover:text-amber-400 transition-colors">{dayName}</p>
                            <Icon size={32} className="text-white mb-3" />
                            <div className="text-center">
                                <p className="text-lg font-bold text-white">{Math.round(daily.temperature_2m_max[idx])}°</p>
                                <p className="text-sm text-slate-500">{Math.round(daily.temperature_2m_min[idx])}°</p>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default Forecast;
