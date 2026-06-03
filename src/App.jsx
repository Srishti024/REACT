import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, CloudRain, Sun, Wind, Droplets, Cloud, CloudLightning, Snowflake, Loader2, MapPin } from 'lucide-react'
import { searchLocation, getWeather, getWeatherDescription } from './api'

function WeatherIcon({ desc, size = 24, className = "" }) {
  switch (desc) {
    case 'Clear': return <Sun size={size} className={`text-yellow-500 ${className}`} />
    case 'Cloudy': return <Cloud size={size} className={`text-slate-400 ${className}`} />
    case 'Drizzle':
    case 'Rain': return <CloudRain size={size} className={`text-blue-500 ${className}`} />
    case 'Thunderstorm': return <CloudLightning size={size} className={`text-indigo-600 ${className}`} />
    case 'Snow': return <Snowflake size={size} className={`text-sky-300 ${className}`} />
    case 'Fog': return <Cloud size={size} className={`text-slate-400 ${className}`} />
    default: return <Cloud size={size} className={`text-slate-400 ${className}`} />
  }
}

// Framer motion variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
}

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { type: "spring", stiffness: 300, damping: 24 }
  }
}

function App() {
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState([])
  const [isSearching, setIsSearching] = useState(false)

  const [location, setLocation] = useState(null)
  const [weather, setWeather] = useState(null)
  const [isLoading, setIsLoading] = useState(false)

  // Auto search
  useEffect(() => {
    if (searchQuery.trim().length < 3) {
      setSearchResults([])
      return
    }
    const timer = setTimeout(async () => {
      setIsSearching(true)
      const results = await searchLocation(searchQuery)
      setSearchResults(results)
      setIsSearching(false)
    }, 500)
    return () => clearTimeout(timer)
  }, [searchQuery])

  const loadInitialLocation = async () => {
    setIsLoading(true)
    const loc = { name: 'New Delhi', admin1: 'Delhi', latitude: 28.61, longitude: 77.23 }
    setLocation(loc)
    const data = await getWeather(loc.latitude, loc.longitude)
    setWeather(data)
    setIsLoading(false)
  }

  useEffect(() => {
    loadInitialLocation()
  }, [])

  const selectLocation = async (loc) => {
    setSearchQuery('')
    setSearchResults([])
    setLocation({ name: loc.name, admin1: loc.admin1, latitude: loc.latitude, longitude: loc.longitude })

    setIsLoading(true)
    const data = await getWeather(loc.latitude, loc.longitude)
    setWeather(data)
    setIsLoading(false)
  }

  const handleSearchSubmit = (e) => {
    e.preventDefault()
    if (searchResults.length > 0) {
      selectLocation(searchResults[0])
    }
  }

  return (
    <div className="min-h-screen p-4 md:p-8 flex flex-col items-center max-w-5xl mx-auto text-slate-800">
      <motion.header
        initial={{ y: -50, opacity: 0, scale: 0.9 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, type: "spring", bounce: 0.4 }}
        className="w-full text-center mb-8"
      >
        <h1 className="text-4xl md:text-6xl font-extrabold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-transparent bg-clip-text mb-2 p-2">
          India Weather
        </h1>
        <p className="text-[var(--color-text-muted)] font-medium text-lg">
          Accurate forecasts for every corner of India
        </p>
      </motion.header>

      <motion.form
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        onSubmit={handleSearchSubmit}
        className="w-full max-w-xl relative mb-12 z-50"
      >
        <div className="relative group">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search for a city in India (e.g., Mumbai)..."
            className="w-full glass rounded-full py-4 pl-6 pr-14 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-blue-400/50 transition-all text-lg shadow-lg group-hover:shadow-xl"
          />
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            className="absolute right-2 top-1/2 -translate-y-1/2 p-3 bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 rounded-full transition-colors flex items-center justify-center shadow-md"
          >
            {isSearching ? <Loader2 size={20} className="text-white animate-spin" /> : <Search size={20} className="text-white" />}
          </motion.button>
        </div>

        <AnimatePresence>
          {searchResults.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="absolute w-full mt-3 glass rounded-3xl flex flex-col shadow-2xl max-h-[300px] overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden border-2 border-white/60"
            >
              {searchResults.map((res, i) => (
                <motion.button
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  key={i}
                  type="button"
                  whileHover={{ backgroundColor: "rgba(255,255,255,0.5)", paddingLeft: "2rem" }}
                  onClick={() => selectLocation(res)}
                  className="w-full text-left px-6 py-4 transition-all flex items-center gap-4 border-b border-black/5 last:border-0 focus:bg-white/50 focus:outline-none"
                >
                  <MapPin size={20} className="text-indigo-500" />
                  <div>
                    <div className="font-bold text-slate-800 text-lg">{res.name}</div>
                    <div className="text-sm font-medium text-slate-500">{res.admin1}, {res.country}</div>
                  </div>
                </motion.button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.form>

      {/* Weather Content Container */}
      <AnimatePresence mode="wait">
        {isLoading && (
          <motion.div
            key="loading"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="flex items-center justify-center py-20"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
            >
              <Loader2 className="text-indigo-500" size={56} />
            </motion.div>
          </motion.div>
        )}

        {!isLoading && weather && location && (
          <motion.div
            key="weather"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            className="w-full flex flex-col gap-8 items-center z-10"
          >
            {/* Current Weather Card */}
            <motion.div
              variants={itemVariants}
              whileHover={{ y: -5, boxShadow: "0 20px 40px rgba(0,0,0,0.08)" }}
              className="w-full glass rounded-[2.5rem] p-8 md:p-12 flex flex-col md:flex-row items-center justify-between shadow-xl relative overflow-hidden group transition-all duration-300 border-2 border-white"
            >
              {/* Subtle background glow effect based on time / condition */}
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-transparent pointer-events-none" />

              <div className="flex flex-col items-center md:items-start mb-8 md:mb-0 relative z-10 w-full md:w-auto">
                <motion.div
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="flex items-center gap-3 mb-2"
                >
                  <MapPin className="text-indigo-500" size={32} />
                  <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight text-slate-800">{location.name}</h2>
                </motion.div>
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="text-slate-500 text-xl font-semibold mb-8 pl-1"
                >
                  {location.admin1 || 'India'}
                </motion.p>

                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.6 }}
                  className="flex flex-wrap items-center gap-4 bg-white/60 rounded-3xl p-5 md:w-auto w-full justify-center md:justify-start backdrop-blur-md shadow-sm border border-white"
                >
                  <div className="flex items-center gap-3">
                    <motion.div whileHover={{ rotate: 15, scale: 1.1 }}>
                      <Droplets className="text-cyan-500" size={28} />
                    </motion.div>
                    <div className="flex flex-col">
                      <span className="text-xl font-bold text-slate-800 leading-tight">{weather.current.relative_humidity_2m}%</span>
                      <span className="text-xs text-slate-500 font-bold uppercase tracking-wider">Humidity</span>
                    </div>
                  </div>
                  <div className="w-px h-10 bg-slate-200 hidden sm:block mx-2" />
                  <div className="flex items-center gap-3">
                    <motion.div whileHover={{ x: 5, scale: 1.1 }}>
                      <Wind className="text-indigo-400" size={28} />
                    </motion.div>
                    <div className="flex flex-col">
                      <span className="text-xl font-bold text-slate-800 leading-tight">{weather.current.wind_speed_10m} km/h</span>
                      <span className="text-xs text-slate-500 font-bold uppercase tracking-wider">Wind</span>
                    </div>
                  </div>
                </motion.div>
              </div>

              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", stiffness: 200, damping: 20, delay: 0.3 }}
                className="text-center md:text-right relative z-10 flex flex-col items-center md:items-end"
              >
                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                >
                  <WeatherIcon desc={getWeatherDescription(weather.current.weather_code)} size={160} className="mb-4 drop-shadow-xl" />
                </motion.div>
                <h3 className="text-8xl md:text-[9rem] leading-none font-bold text-slate-800 tracking-tighter">
                  {Math.round(weather.current.temperature_2m)}°
                </h3>
                <motion.p
                  whileHover={{ scale: 1.05 }}
                  className="text-indigo-700 text-xl font-bold mt-4 bg-white/70 px-6 py-2.5 rounded-full inline-block backdrop-blur-md shadow-sm border border-white"
                >
                  {getWeatherDescription(weather.current.weather_code)}
                </motion.p>
              </motion.div>
            </motion.div>

            {/* 5-Day Forecast Grid */}
            <motion.div variants={itemVariants} className="w-full mt-6">
              <h3 className="text-2xl font-extrabold w-full text-left mb-6 pl-2 text-slate-800">5-Day Forecast</h3>
              <div className="w-full grid grid-cols-2 md:grid-cols-5 gap-4 md:gap-6">
                {weather.daily.time.slice(0, 5).map((date, index) => {
                  const desc = getWeatherDescription(weather.daily.weather_code[index])
                  const maxT = Math.round(weather.daily.temperature_2m_max[index])
                  const minT = Math.round(weather.daily.temperature_2m_min[index])
                  const dateObj = new Date(date)
                  const dayName = index === 0 ? 'Today' : dateObj.toLocaleDateString('en-US', { weekday: 'short' })

                  return (
                    <motion.div
                      custom={index}
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: 0.5 + index * 0.1, type: "spring", bounce: 0.4 }}
                      whileHover={{ y: -8, scale: 1.05, boxShadow: "0 15px 30px rgba(0,0,0,0.06)" }}
                      key={index}
                      className="glass rounded-[2rem] p-6 flex flex-col items-center justify-between gap-5 cursor-default hover:bg-white/80 transition-colors border-2 border-white shadow-md relative overflow-hidden group"
                    >
                      <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                      <span className="text-lg font-bold text-slate-500 relative z-10">{dayName}</span>

                      <motion.div
                        whileHover={{ scale: 1.2, rotate: 5 }}
                        transition={{ type: 'spring', stiffness: 300 }}
                      >
                        <WeatherIcon desc={desc} size={56} className="drop-shadow-sm relative z-10 my-2" />
                      </motion.div>

                      <div className="flex flex-col items-center relative z-10">
                        <span className="text-3xl font-extrabold text-slate-800 mb-1">{maxT}°</span>
                        <span className="text-sm font-bold text-slate-400">{minT}°</span>
                      </div>
                    </motion.div>
                  )
                })}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default App
