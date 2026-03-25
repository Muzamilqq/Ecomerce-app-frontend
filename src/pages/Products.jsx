import { useEffect, useState } from "react";
import { Search, Sparkles, Filter } from "lucide-react";
import { categories } from "../data/products";
import ProductCard from "../components/Products/ProductCard";
import Pagination from "../components/Products/Pagination";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { fetchAllProducts } from "../store/slices/productSlice";
import { toggleAIModal } from "../store/slices/popupSlice";
import AISearchModal from "../components/Products/AISearchModal";

const Products = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const { products, loading, totalProducts } = useSelector((s) => s.product);
  const { isAIPopupOpen } = useSelector((s) => s.popup);

  const params = new URLSearchParams(location.search);
  const [filters, setFilters] = useState({
    category: params.get("category") || "",
    search: params.get("search") || "",
    availability: "",
    price: "",
    ratings: "",
    page: 1,
  });

  useEffect(() => {
    // sync URL param changes (e.g. clicking category from home page)
    const p = new URLSearchParams(location.search);
    setFilters((prev) => ({
      ...prev,
      category: p.get("category") || "",
      search: p.get("search") || "",
      page: 1,
    }));
  }, [location.search]);

  useEffect(() => {
    const query = {};
    if (filters.category) query.category = filters.category;
    if (filters.search) query.search = filters.search;
    if (filters.availability) query.availability = filters.availability;
    if (filters.price) query.price = filters.price;
    if (filters.ratings) query.ratings = filters.ratings;
    query.page = filters.page;
    dispatch(fetchAllProducts(query));
  }, [filters, dispatch]);

  const totalPages = Math.ceil(totalProducts / 10);

  const handleCategoryClick = (cat) => {
    setFilters((prev) => ({
      ...prev,
      category: prev.category === cat ? "" : cat,
      page: 1,
    }));
  };

  return (
    <div className="min-h-screen bg-background pt-20">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Products</h1>
            <p className="text-muted-foreground text-sm mt-1">
              {totalProducts} products found
            </p>
          </div>
          <button
            onClick={() => dispatch(toggleAIModal())}
            className="flex items-center gap-2 px-4 py-2.5 gradient-primary text-primary-foreground rounded-lg font-medium text-sm hover:glow-on-hover animate-smooth"
          >
            <Sparkles className="w-4 h-4" /> AI Search
          </button>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Filters sidebar */}
          <aside className="w-full lg:w-64 flex-shrink-0 space-y-4">
            <div className="glass-panel">
              <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                <Filter className="w-4 h-4" /> Filters
              </h3>

              {/* Search */}
              <div className="mb-4">
                <label className="text-xs text-muted-foreground mb-1 block">
                  Search
                </label>
                <input
                  type="text"
                  placeholder="Search..."
                  value={filters.search}
                  onChange={(e) =>
                    setFilters((p) => ({
                      ...p,
                      search: e.target.value,
                      page: 1,
                    }))
                  }
                  className="w-full px-3 py-2 bg-secondary border border-border rounded-lg text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              {/* Category */}
              <div className="mb-4">
                <label className="text-xs text-muted-foreground mb-2 block">
                  Category
                </label>
                <div className="flex flex-wrap gap-2">
                  {categories.map((c) => (
                    <button
                      key={c.id}
                      onClick={() => handleCategoryClick(c.name)}
                      className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                        filters.category === c.name
                          ? "gradient-primary text-primary-foreground"
                          : "bg-secondary text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      {c.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Availability */}
              <div className="mb-4">
                <label className="text-xs text-muted-foreground mb-1 block">
                  Availability
                </label>
                <select
                  value={filters.availability}
                  onChange={(e) =>
                    setFilters((p) => ({
                      ...p,
                      availability: e.target.value,
                      page: 1,
                    }))
                  }
                  className="w-full px-3 py-2 bg-secondary border border-border rounded-lg text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="">All</option>
                  <option value="in-stock">In Stock</option>
                  <option value="limited">Limited</option>
                  <option value="out-of-stock">Out of Stock</option>
                </select>
              </div>

              {/* Price */}
              <div className="mb-4">
                <label className="text-xs text-muted-foreground mb-1 block">
                  Price Range (USD)
                </label>
                <select
                  value={filters.price}
                  onChange={(e) =>
                    setFilters((p) => ({
                      ...p,
                      price: e.target.value,
                      page: 1,
                    }))
                  }
                  className="w-full px-3 py-2 bg-secondary border border-border rounded-lg text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="">Any</option>
                  <option value="0-10">$0 – $10</option>
                  <option value="10-50">$10 – $50</option>
                  <option value="50-200">$50 – $200</option>
                  <option value="200-1000">$200 – $1000</option>
                </select>
              </div>

              {/* Rating */}
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">
                  Min Rating
                </label>
                <select
                  value={filters.ratings}
                  onChange={(e) =>
                    setFilters((p) => ({
                      ...p,
                      ratings: e.target.value,
                      page: 1,
                    }))
                  }
                  className="w-full px-3 py-2 bg-secondary border border-border rounded-lg text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="">Any</option>
                  <option value="4">4+ ⭐</option>
                  <option value="4.5">4.5+ ⭐</option>
                </select>
              </div>

              <button
                onClick={() =>
                  setFilters({
                    category: "",
                    search: "",
                    availability: "",
                    price: "",
                    ratings: "",
                    page: 1,
                  })
                }
                className="mt-4 w-full py-2 text-xs text-muted-foreground hover:text-foreground border border-border rounded-lg transition-colors"
              >
                Clear Filters
              </button>
            </div>
          </aside>

          {/* Products grid */}
          <div className="flex-1">
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {[...Array(8)].map((_, i) => (
                  <div
                    key={i}
                    className="glass-card animate-pulse h-64 bg-secondary rounded-xl"
                  />
                ))}
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-16">
                <p className="text-2xl mb-2">🔍</p>
                <p className="text-muted-foreground">
                  No products found. Try different filters.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {products.map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
            )}
            <Pagination
              currentPage={filters.page}
              totalPages={totalPages}
              onPageChange={(p) => setFilters((prev) => ({ ...prev, page: p }))}
            />
          </div>
        </div>
      </div>
      {isAIPopupOpen && <AISearchModal />}
    </div>
  );
};

export default Products;
