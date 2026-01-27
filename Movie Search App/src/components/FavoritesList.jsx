import { Heart } from 'lucide-react';
import MovieCard from './MovieCard';
import './FavoritesList.css';

const FavoritesList = ({ favorites, onToggleFavorite, onShowDetails }) => {
    if (favorites.length === 0) {
        return (
            <div className="empty-state">
                <div className="empty-icon">
                    <Heart size={64} />
                </div>
                <h2>No Favorites Yet</h2>
                <p>Start adding movies to your favorites by clicking the heart icon!</p>
            </div>
        );
    }

    return (
        <div className="favorites-section">
            <div className="favorites-header">
                <h2>My Favorites</h2>
                <span className="favorites-count">{favorites.length} {favorites.length === 1 ? 'Movie' : 'Movies'}</span>
            </div>

            <div className="movies-grid">
                {favorites.map((movie) => (
                    <MovieCard
                        key={movie.imdbID}
                        movie={movie}
                        isFavorite={true}
                        onToggleFavorite={onToggleFavorite}
                        onShowDetails={onShowDetails}
                    />
                ))}
            </div>
        </div>
    );
};

export default FavoritesList;
