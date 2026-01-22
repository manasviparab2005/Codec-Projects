import { X, Star, Calendar, Clock, Globe, Award } from 'lucide-react';
import './MovieDetails.css';

const MovieDetails = ({ movie, onClose, isFavorite, onToggleFavorite }) => {
    if (!movie) return null;

    const posterUrl = movie.Poster !== 'N/A' ? movie.Poster : null;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content glass" onClick={(e) => e.stopPropagation()}>
                <button className="close-btn" onClick={onClose} aria-label="Close">
                    <X size={24} />
                </button>

                <div className="details-container">
                    <div className="details-poster">
                        {posterUrl ? (
                            <img src={posterUrl} alt={movie.Title} />
                        ) : (
                            <div className="poster-placeholder-large">
                                <span>No Poster Available</span>
                            </div>
                        )}
                    </div>

                    <div className="details-info">
                        <h2 className="details-title">{movie.Title}</h2>

                        <div className="details-meta">
                            {movie.Year && (
                                <div className="meta-item">
                                    <Calendar size={16} />
                                    <span>{movie.Year}</span>
                                </div>
                            )}
                            {movie.Runtime && (
                                <div className="meta-item">
                                    <Clock size={16} />
                                    <span>{movie.Runtime}</span>
                                </div>
                            )}
                            {movie.Country && (
                                <div className="meta-item">
                                    <Globe size={16} />
                                    <span>{movie.Country}</span>
                                </div>
                            )}
                        </div>

                        {movie.imdbRating && movie.imdbRating !== 'N/A' && (
                            <div className="rating-section">
                                <div className="rating-box">
                                    <Star size={24} fill="currentColor" />
                                    <div>
                                        <div className="rating-value">{movie.imdbRating}</div>
                                        <div className="rating-label">IMDb Rating</div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {movie.Genre && (
                            <div className="detail-section">
                                <h3>Genre</h3>
                                <div className="genre-tags">
                                    {movie.Genre.split(', ').map((genre) => (
                                        <span key={genre} className="genre-tag">{genre}</span>
                                    ))}
                                </div>
                            </div>
                        )}

                        {movie.Plot && movie.Plot !== 'N/A' && (
                            <div className="detail-section">
                                <h3>Plot</h3>
                                <p className="plot-text">{movie.Plot}</p>
                            </div>
                        )}

                        {movie.Director && movie.Director !== 'N/A' && (
                            <div className="detail-section">
                                <h3>Director</h3>
                                <p>{movie.Director}</p>
                            </div>
                        )}

                        {movie.Actors && movie.Actors !== 'N/A' && (
                            <div className="detail-section">
                                <h3>Cast</h3>
                                <p>{movie.Actors}</p>
                            </div>
                        )}

                        {movie.Awards && movie.Awards !== 'N/A' && (
                            <div className="detail-section awards">
                                <Award size={18} />
                                <p>{movie.Awards}</p>
                            </div>
                        )}

                        <button
                            className={`favorite-action-btn ${isFavorite ? 'active' : ''}`}
                            onClick={() => onToggleFavorite(movie)}
                        >
                            {isFavorite ? 'Remove from Favorites' : 'Add to Favorites'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MovieDetails;
