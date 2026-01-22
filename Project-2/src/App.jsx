import { useState, useEffect } from 'react';
import Header from './components/Header';
import SearchBar from './components/SearchBar';
import MovieCard from './components/MovieCard';
import MovieDetails from './components/MovieDetails';
import FavoritesList from './components/FavoritesList';
import { searchMovies, getMovieDetails, isApiKeyConfigured } from './services/api';
import { loadFavorites, saveFavorites, isFavorite, addFavorite, removeFavorite } from './services/storage';
import { AlertCircle, Film } from 'lucide-react';
import './App.css';

function App() {
  const [currentView, setCurrentView] = useState('search');
  const [movies, setMovies] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hasSearched, setHasSearched] = useState(false);

  // Load favorites from localStorage on mount
  useEffect(() => {
    const savedFavorites = loadFavorites();
    setFavorites(savedFavorites);
  }, []);

  // Save favorites to localStorage whenever they change
  useEffect(() => {
    saveFavorites(favorites);
  }, [favorites]);

  const handleSearch = async (searchTerm) => {
    if (!searchTerm.trim()) {
      setMovies([]);
      setError(null);
      setHasSearched(false);
      return;
    }

    if (!isApiKeyConfigured()) {
      setError('Please configure your OMDB API key in the .env file');
      return;
    }

    setIsLoading(true);
    setError(null);
    setHasSearched(true);

    try {
      const data = await searchMovies(searchTerm);

      if (data.Error) {
        setMovies([]);
        setError(data.Error);
      } else {
        setMovies(data.Search || []);
        if (!data.Search || data.Search.length === 0) {
          setError('No movies found. Try a different search term.');
        }
      }
    } catch (err) {
      setError('Failed to fetch movies. Please check your internet connection and API key.');
      setMovies([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleShowDetails = async (imdbId) => {
    if (!isApiKeyConfigured()) {
      setError('Please configure your OMDB API key in the .env file');
      return;
    }

    try {
      const details = await getMovieDetails(imdbId);
      setSelectedMovie(details);
    } catch (err) {
      setError('Failed to fetch movie details.');
    }
  };

  const handleToggleFavorite = (movie) => {
    if (isFavorite(favorites, movie.imdbID)) {
      setFavorites(removeFavorite(favorites, movie.imdbID));
    } else {
      setFavorites(addFavorite(favorites, movie));
    }
  };

  return (
    <div className="app">
      <Header
        currentView={currentView}
        onViewChange={setCurrentView}
        favoritesCount={favorites.length}
      />

      <main className="container main-content">
        {currentView === 'search' ? (
          <>
            <SearchBar onSearch={handleSearch} isLoading={isLoading} />

            {error && (
              <div className="error-message glass">
                <AlertCircle size={24} />
                <p>{error}</p>
              </div>
            )}

            {isLoading && (
              <div className="loading-state">
                <div className="loader"></div>
                <p>Searching for movies...</p>
              </div>
            )}

            {!isLoading && !error && movies.length > 0 && (
              <div className="movies-grid">
                {movies.map((movie) => (
                  <MovieCard
                    key={movie.imdbID}
                    movie={movie}
                    isFavorite={isFavorite(favorites, movie.imdbID)}
                    onToggleFavorite={handleToggleFavorite}
                    onShowDetails={handleShowDetails}
                  />
                ))}
              </div>
            )}

            {!isLoading && !error && !hasSearched && (
              <div className="welcome-state">
                <div className="welcome-icon">
                  <Film size={80} />
                </div>
                <h2>Discover Amazing Movies</h2>
                <p>Search for your favorite movies and build your personal collection</p>
              </div>
            )}
          </>
        ) : (
          <FavoritesList
            favorites={favorites}
            onToggleFavorite={handleToggleFavorite}
            onShowDetails={handleShowDetails}
          />
        )}
      </main>

      {selectedMovie && (
        <MovieDetails
          movie={selectedMovie}
          onClose={() => setSelectedMovie(null)}
          isFavorite={isFavorite(favorites, selectedMovie.imdbID)}
          onToggleFavorite={handleToggleFavorite}
        />
      )}
    </div>
  );
}

export default App;
