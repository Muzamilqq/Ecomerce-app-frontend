import { Menu, User, ShoppingCart, Sun, Moon, Search } from "lucide-react";
import { useTheme } from "../../contexts/ThemeContext";
import { useDispatch, useSelector } from "react-redux";
import {
  toggleAuthPopup,
  toggleSidebar,
  toggleSearchBar,
  toggleCart,
} from "../../store/slices/popupSlice";
import { Link } from "react-router-dom";

const Navbar = () => {
  const { theme, toggleTheme } = useTheme();
  const dispatch = useDispatch();
  const { authUser } = useSelector((s) => s.auth);
  const { cart } = useSelector((s) => s.cart);

  return (
    <nav className="sticky top-0 z-50 glass border-b border-[hsla(var(--glass-border))] px-4">
      <div className="container mx-auto flex items-center justify-between h-16">
        <div className="flex items-center gap-3">
          <button
            onClick={() => dispatch(toggleSidebar())}
            className="p-2 hover:bg-secondary rounded-lg transition-colors lg:hidden"
          >
            <Menu className="w-5 h-5 text-foreground" />
          </button>
          <Link to="/" className="text-xl font-bold text-primary">
            ShopMate
          </Link>
        </div>

        <div className="hidden md:flex items-center gap-6">
          {["/", "/products", "/about", "/faq", "/contact"].map((path, i) => (
            <Link
              key={path}
              to={path}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              {["Home", "Products", "About", "FAQ", "Contact"][i]}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => dispatch(toggleSearchBar())}
            className="p-2 hover:bg-secondary rounded-lg transition-colors"
          >
            <Search className="w-5 h-5 text-foreground" />
          </button>
          <button
            onClick={toggleTheme}
            className="p-2 hover:bg-secondary rounded-lg transition-colors"
          >
            {theme === "dark" ? (
              <Sun className="w-5 h-5 text-foreground" />
            ) : (
              <Moon className="w-5 h-5 text-foreground" />
            )}
          </button>
          <button
            onClick={() => dispatch(toggleCart())}
            className="relative p-2 hover:bg-secondary rounded-lg transition-colors"
          >
            <ShoppingCart className="w-5 h-5 text-foreground" />
            {cart.length > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-primary text-primary-foreground text-xs rounded-full flex items-center justify-center">
                {cart.length}
              </span>
            )}
          </button>
          <button
            onClick={() => dispatch(toggleAuthPopup())}
            className="p-2 hover:bg-secondary rounded-lg transition-colors"
          >
            {authUser?.avatar?.url ? (
              <img
                src={authUser.avatar.url}
                alt="avatar"
                className="w-7 h-7 rounded-full object-cover"
              />
            ) : (
              <User className="w-5 h-5 text-foreground" />
            )}
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
