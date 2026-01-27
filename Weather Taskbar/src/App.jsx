import React, { useState, useEffect } from 'react'
import Search from './components/Search'
import WeatherCard from './components/WeatherCard'
import WeatherStats from './components/WeatherStats'
import Forecast from './components/Forecast'
import { fetchWeather } from './services/weatherService'
import { CloudRain } from 'lucide-react'

function App() {
  const [weatherData, setWeatherData] = useState(null)
  const [selectedCity, setSelectedCity] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    // Default to London or user's preference
    const defaultCity = { name: 'London', latitude: 51.5074, longitude: -0.1278, country: 'United Kingdom' }
    handleCitySelect(defaultCity)
  }, [])

  const handleCitySelect = async (city) => {
    setLoading(true)
    setError(null)
    setSelectedCity(city)
    try {
      const data = await fetchWeather(city.latitude, city.longitude)
      setWeatherData(data)
    } catch (err) {
      setError('Could not fetch weather data. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (loading && !weatherData) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] animate-pulse">
        <div className="w-16 h-16 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin"></div>
        <p className="mt-4 text-slate-400 font-medium">Fetching conditions...</p>
      </div>
    )
  }

  return (
    <main className="w-full max-w-5xl mx-auto py-10 px-4 flex flex-col min-h-screen">
      <header className="text-center mb-12">
        <h1 className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400 mb-2">
          SkyCast
        </h1>
        <p className="text-slate-400">Premium Real-time Weather Insights</p>
      </header>

      <Search onSelectCity={handleCitySelect} />

      {error ? (
        <div className="glass-card p-6 border-red-500/30 bg-red-500/10 text-center text-red-400">
          <CloudRain className="mx-auto mb-2" />
          <p>{error}</p>
        </div>
      ) : (
        weatherData && (
          <>
            <div className="grid grid-cols-1 lg:grid-cols-1 gap-8">
              <WeatherCard data={weatherData} city={selectedCity} />
            </div>
            <WeatherStats current={weatherData.current} />
            <Forecast daily={weatherData.daily} />
          </>
        )
      )}

      <footer className="mt-auto py-8 text-center text-slate-500 text-sm">
        <p>&copy; {new Date().getFullYear()} SkyCast Weather. Powered by Open-Meteo.</p>
      </footer>
    </main>
  )
}

export default App
