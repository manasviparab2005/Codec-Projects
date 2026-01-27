import React, { useState, useEffect } from 'react';
import { Search as SearchIcon, MapPin } from 'lucide-react';
import { searchCities } from '../services/weatherService';

const Search = ({ onSelectCity }) => {
    const [query, setQuery] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        const delayDebounceFn = setTimeout(async () => {
            if (query.length >= 2) {
                try {
                    const results = await searchCities(query);
                    setSuggestions(results);
                    setIsOpen(true);
                } catch (error) {
                    console.error(error);
                }
            } else {
                setSuggestions([]);
                setIsOpen(false);
            }
        }, 500);

        return () => clearTimeout(delayDebounceFn);
    }, [query]);

    const handleSelect = (city) => {
        onSelectCity(city);
        setQuery('');
        setIsOpen(false);
    };

    return (
        <div className="relative w-full max-w-md mx-auto mb-8 animate-fade-in" style={{ zIndex: 100 }}>
            <div className="relative flex items-center">
                <div className="absolute left-4 text-slate-400">
                    <SearchIcon size={20} />
                </div>
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search for a city..."
                    className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 rounded-2xl focus:outline-none focus:border-indigo-500 transition-all text-white placeholder-slate-400 backdrop-blur-md"
                />
            </div>

            {isOpen && suggestions.length > 0 && (
                <div
                    className="absolute top-full left-0 right-0 mt-2 bg-slate-900/95 border border-white/10 rounded-2xl backdrop-blur-xl shadow-2xl overflow-hidden max-h-80 overflow-y-auto flex flex-col"
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        position: 'absolute',
                        top: '100%',
                        left: 0,
                        right: 0,
                        marginTop: '0.5rem',
                        backgroundColor: 'rgba(15, 23, 42, 0.98)',
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                        borderRadius: '1rem',
                        backdropFilter: 'blur(16px)',
                        WebkitBackdropFilter: 'blur(16px)',
                        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.8)',
                        maxHeight: '20rem',
                        overflowY: 'auto',
                        zIndex: 1000
                    }}
                >
                    {suggestions.map((city, index) => (
                        <button
                            key={`${city.id}-${index}`}
                            onClick={() => handleSelect(city)}
                            className="w-full px-5 py-4 hover:bg-white/10 transition-all duration-200 text-left border-b border-white/5 last:border-b-0 block"
                            style={{
                                display: 'block',
                                width: '100%',
                                padding: '1rem 1.25rem',
                                textAlign: 'left',
                                border: 'none',
                                borderBottom: index < suggestions.length - 1 ? '1px solid rgba(255, 255, 255, 0.05)' : 'none',
                                background: 'transparent',
                                cursor: 'pointer'
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)'}
                            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                        >
                            <div className="flex items-start gap-3" style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                                <MapPin size={18} className="text-indigo-400 flex-shrink-0 mt-0.5" style={{ color: '#818cf8', flexShrink: 0 }} />
                                <div className="flex-1" style={{ flex: 1 }}>
                                    <div className="font-semibold text-white text-base block" style={{ fontWeight: 600, color: 'white', fontSize: '1rem', display: 'block' }}>{city.name}</div>
                                    <div className="text-sm text-slate-400 block" style={{ fontSize: '0.875rem', color: '#94a3b8', display: 'block', marginTop: '0.25rem' }}>
                                        {city.admin1 && `${city.admin1}, `}{city.country}
                                    </div>
                                </div>
                            </div>
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Search;
