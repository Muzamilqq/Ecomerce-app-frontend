import { useState } from "react";
import { X, Search } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toggleSearchBar } from "../../store/slices/popupSlice";

const SearchOverlay = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isSearchBarOpen } = useSelector((s) => s.popup);
  const [query, setQuery] = useState("");

  if (!isSearchBarOpen) return null;

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/products?search=${encodeURIComponent(query.trim())}`);
      dispatch(toggleSearchBar());
      setQuery("");
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/60 flex items-start justify-center pt-24 px-4"
      onClick={() => dispatch(toggleSearchBar())}
    >
      <div className="w-full max-w-2xl" onClick={(e) => e.stopPropagation()}>
        <form onSubmit={handleSearch} className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <input
            autoFocus
            type="text"
            placeholder="Search products..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full pl-12 pr-12 py-4 glass border border-[hsla(var(--glass-border))] rounded-xl text-foreground text-lg focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <button
            type="button"
            onClick={() => dispatch(toggleSearchBar())}
            className="absolute right-4 top-1/2 -translate-y-1/2 p-1 hover:bg-secondary rounded-lg"
          >
            <X className="w-5 h-5 text-muted-foreground" />
          </button>
        </form>
      </div>
    </div>
  );
};

export default SearchOverlay;
