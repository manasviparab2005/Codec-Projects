const FAVORITES_KEY = 'movieSearchApp_favorites';

/**
 * Save favorites to localStorage
 * @param {Array} favorites - Array of favorite movie objects
 */
export const saveFavorites = (favorites) => {
    try {
        const serialized = JSON.stringify(favorites);
        localStorage.setItem(FAVORITES_KEY, serialized);
    } catch (error) {
        console.error('Error saving favorites to localStorage:', error);
    }
};

/**
 * Load favorites from localStorage
 * @returns {Array} - Array of favorite movie objects
 */
export const loadFavorites = () => {
    try {
        const serialized = localStorage.getItem(FAVORITES_KEY);
        if (serialized === null) {
            return [];
        }
        return JSON.parse(serialized);
    } catch (error) {
        console.error('Error loading favorites from localStorage:', error);
        return [];
    }
};

/**
 * Check if a movie is in favorites
 * @param {Array} favorites - Array of favorite movies
 * @param {string} imdbId - IMDb ID to check
 * @returns {boolean} - True if movie is favorited
 */
export const isFavorite = (favorites, imdbId) => {
    return favorites.some(movie => movie.imdbID === imdbId);
};

/**
 * Add a movie to favorites
 * @param {Array} favorites - Current favorites array
 * @param {Object} movie - Movie object to add
 * @returns {Array} - Updated favorites array
 */
export const addFavorite = (favorites, movie) => {
    if (isFavorite(favorites, movie.imdbID)) {
        return favorites;
    }
    return [...favorites, movie];
};

/**
 * Remove a movie from favorites
 * @param {Array} favorites - Current favorites array
 * @param {string} imdbId - IMDb ID to remove
 * @returns {Array} - Updated favorites array
 */
export const removeFavorite = (favorites, imdbId) => {
    return favorites.filter(movie => movie.imdbID !== imdbId);
};
