const API_BASE_URL = 'https://api.themoviedb.org/3';
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p';
const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

/**
 * Search for movies by title
 * @param {string} searchTerm - The movie title to search for
 * @returns {Promise<Object>} - Search results containing movie array
 */
export const searchMovies = async (searchTerm) => {
  if (!searchTerm || searchTerm.trim() === '') {
    return { Search: [], totalResults: '0' };
  }

  try {
    const response = await fetch(
      `${API_BASE_URL}/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(searchTerm)}&include_adult=false`
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    // Transform TMDB response to match OMDB format for compatibility
    const transformedResults = {
      Search: data.results.map(movie => ({
        Title: movie.title,
        Year: movie.release_date ? movie.release_date.split('-')[0] : 'N/A',
        imdbID: movie.id.toString(), // TMDB uses numeric IDs
        Type: 'movie',
        Poster: movie.poster_path
          ? `${IMAGE_BASE_URL}/w500${movie.poster_path}`
          : 'N/A'
      })),
      totalResults: data.total_results.toString(),
      Response: data.results.length > 0 ? 'True' : 'False'
    };

    if (transformedResults.Search.length === 0) {
      transformedResults.Error = 'Movie not found!';
    }

    return transformedResults;
  } catch (error) {
    console.error('Error searching movies:', error);
    throw error;
  }
};

/**
 * Get detailed information about a specific movie
 * @param {string} movieId - The TMDB movie ID
 * @returns {Promise<Object>} - Detailed movie information
 */
export const getMovieDetails = async (movieId) => {
  if (!movieId) {
    throw new Error('Movie ID is required');
  }

  try {
    const response = await fetch(
      `${API_BASE_URL}/movie/${movieId}?api_key=${API_KEY}&append_to_response=credits`
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    // Transform TMDB response to match OMDB format
    const transformedData = {
      Title: data.title,
      Year: data.release_date ? data.release_date.split('-')[0] : 'N/A',
      Rated: data.adult ? 'R' : 'PG-13',
      Released: data.release_date || 'N/A',
      Runtime: data.runtime ? `${data.runtime} min` : 'N/A',
      Genre: data.genres.map(g => g.name).join(', '),
      Director: data.credits?.crew?.find(c => c.job === 'Director')?.name || 'N/A',
      Writer: data.credits?.crew?.filter(c => c.job === 'Writer' || c.job === 'Screenplay')
        .map(w => w.name).slice(0, 3).join(', ') || 'N/A',
      Actors: data.credits?.cast?.slice(0, 4).map(a => a.name).join(', ') || 'N/A',
      Plot: data.overview || 'No plot available.',
      Language: data.original_language?.toUpperCase() || 'N/A',
      Country: data.production_countries?.map(c => c.iso_3166_1).join(', ') || 'N/A',
      Awards: 'N/A', // TMDB doesn't provide awards in basic API
      Poster: data.poster_path ? `${IMAGE_BASE_URL}/w500${data.poster_path}` : 'N/A',
      imdbID: movieId,
      imdbRating: data.vote_average ? data.vote_average.toFixed(1) : 'N/A',
      imdbVotes: data.vote_count ? data.vote_count.toLocaleString() : 'N/A',
      Type: 'movie',
      Response: 'True'
    };

    return transformedData;
  } catch (error) {
    console.error('Error fetching movie details:', error);
    throw error;
  }
};

/**
 * Check if API key is configured
 * @returns {boolean} - True if API key is set
 */
export const isApiKeyConfigured = () => {
  return API_KEY && API_KEY !== '' && API_KEY !== 'your_api_key_here';
};
