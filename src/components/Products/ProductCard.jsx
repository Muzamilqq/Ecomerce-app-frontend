import { Star, ShoppingCart } from "lucide-react";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { addToCart } from "../../store/slices/cartSlice";

const ProductCard = ({ product }) => {
  const dispatch = useDispatch();

  if (!product) return null;

  const price = parseFloat(product.price) * 283;

  return (
    <div className="glass-card group hover:glow-on-hover animate-smooth h-full flex flex-col">
      <Link
        to={`/product/${product.id}`}
        className="block relative overflow-hidden rounded-lg mb-3"
      >
        <img
          src={product.image || "https://placehold.co/300x300"}
          alt={product.name}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        {product.stock <= 0 && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <span className="text-white font-semibold text-sm">
              Out of Stock
            </span>
          </div>
        )}
        {product.stock > 0 && product.stock <= 5 && (
          <span className="absolute top-2 right-2 bg-orange-500 text-white text-xs px-2 py-0.5 rounded-full font-medium">
            Only {product.stock} left
          </span>
        )}
      </Link>

      <div className="flex-1 flex flex-col">
        <Link to={`/product/${product.id}`}>
          <h3 className="text-sm font-semibold text-foreground hover:text-primary transition-colors line-clamp-2 mb-1">
            {product.name}
          </h3>
        </Link>
        <p className="text-xs text-muted-foreground mb-2">{product.category}</p>

        <div className="flex items-center gap-1 mb-3">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className={`w-3 h-3 ${i < Math.round(product.ratings) ? "text-yellow-400 fill-yellow-400" : "text-muted-foreground"}`}
            />
          ))}
          <span className="text-xs text-muted-foreground ml-1">
            ({product.review_count || 0})
          </span>
        </div>

        <div className="flex items-center justify-between mt-auto">
          <span className="text-lg font-bold text-foreground">
            ₹{price.toFixed(0).toLocaleString()}
          </span>
          <button
            onClick={() =>
              product.stock > 0 && dispatch(addToCart({ product, quantity: 1 }))
            }
            disabled={product.stock <= 0}
            className="flex items-center gap-1.5 px-3 py-2 gradient-primary text-primary-foreground rounded-lg text-xs font-medium hover:glow-on-hover animate-smooth disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ShoppingCart className="w-3.5 h-3.5" />
            Add
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
