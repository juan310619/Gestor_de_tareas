import { useState, useEffect } from "react";
import "../styles/searchbar.css";

interface SearchBarProps {
  onSearch: (query: string) => void;
  placeholder?: string;
  debounceMs?: number;
  onClear?: () => void;
}

export default function SearchBar({
  onSearch,
  placeholder = "Buscar...",
  debounceMs = 300,
  onClear,
}: SearchBarProps) {
  const [query, setQuery] = useState("");

  // Debounce para las búsquedas
  useEffect(() => {
    const timer = setTimeout(() => {
      onSearch(query);
    }, debounceMs);

    return () => clearTimeout(timer);
  }, [query, onSearch, debounceMs]);

  const handleClear = () => {
    setQuery("");
    onClear?.();
  };

  return (
    <div className="search-bar-container">
      <div className="search-input-wrapper">
        <svg
          className="search-icon"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <circle cx="11" cy="11" r="8"></circle>
          <path d="m21 21-4.35-4.35"></path>
        </svg>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={placeholder}
          className="search-input"
          aria-label="Buscar"
        />
        {query && (
          <button
            className="clear-button"
            onClick={handleClear}
            aria-label="Limpiar búsqueda"
          >
            ✕
          </button>
        )}
      </div>
    </div>
  );
}
