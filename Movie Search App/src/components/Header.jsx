import { Film, Heart } from 'lucide-react';
import './Header.css';

const Header = ({ currentView, onViewChange, favoritesCount }) => {
    return (
        <header className="header glass">
            <div className="container">
                <div className="header-content">
                    <div className="logo">
                        <Film size={32} className="logo-icon" />
                        <h1>MovieFlix</h1>
                    </div>

                    <nav className="nav">
                        <button
                            className={`nav-btn ${currentView === 'search' ? 'active' : ''}`}
                            onClick={() => onViewChange('search')}
                        >
                            Search
                        </button>
                        <button
                            className={`nav-btn ${currentView === 'favorites' ? 'active' : ''}`}
                            onClick={() => onViewChange('favorites')}
                        >
                            <Heart size={18} />
                            Favorites
                            {favoritesCount > 0 && (
                                <span className="badge">{favoritesCount}</span>
                            )}
                        </button>
                    </nav>
                </div>
            </div>
        </header>
    );
};

export default Header;
