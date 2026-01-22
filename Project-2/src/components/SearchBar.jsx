import { useState } from 'react';
import { Search, X, Loader } from 'lucide-react';
import './SearchBar.css';

const SearchBar = ({ onSearch, isLoading }) => {
    const [searchTerm, setSearchTerm] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (searchTerm.trim()) {
            onSearch(searchTerm);
        }
    };

    const handleClear = () => {
        setSearchTerm('');
        onSearch('');
    };

    return (
        <form className="search-bar glass" onSubmit={handleSubmit}>
            <Search className="search-icon" size={20} />
            <input
                type="text"
                className="search-input"
                placeholder="Search for movies..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                disabled={isLoading}
            />
            {searchTerm && (
                <button
                    type="button"
                    className="clear-btn"
                    onClick={handleClear}
                    disabled={isLoading}
                >
                    <X size={18} />
                </button>
            )}
            {isLoading && (
                <div className="loading-indicator">
                    <Loader size={20} className="spin" />
                </div>
            )}
            <button
                type="submit"
                className="search-btn"
                disabled={isLoading || !searchTerm.trim()}
            >
                Search
            </button>
        </form>
    );
};

export default SearchBar;
