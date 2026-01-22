import { Heart, Film } from 'lucide-react';
import './MovieCard.css';

const MovieCard = ({ movie, isFavorite, onToggleFavorite, onShowDetails }) => {
    const posterUrl = movie.Poster !== 'N/A' ? movie.Poster : null;

    return (
        <div className="movie-card glass" onClick={() => onShowDetails(movie.imdbID)}>
            <div className="movie-poster">
                {posterUrl ? (
                    <img src={posterUrl} alt={movie.Title} loading="lazy" />
                ) : (
                    <div className="poster-placeholder">
                        <Film size={48} />
                        <span>No Poster</span>
                    </div>
                )}
                <button
                    className={`favorite-btn ${isFavorite ? 'active' : ''}`}
                    onClick={(e) => {
                        e.stopPropagation();
                        onToggleFavorite(movie);
                    }}
                    aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
                >
                    <Heart size={20} fill={isFavorite ? 'currentColor' : 'none'} />
                </button>
            </div>

            <div className="movie-info">
                <h3 className="movie-title">{movie.Title}</h3>
                <div className="movie-meta">
                    <span className="movie-year">{movie.Year}</span>
                    {movie.Type && (
                        <>
                            <span className="meta-separator">•</span>
                            <span className="movie-type">{movie.Type}</span>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default MovieCard;
