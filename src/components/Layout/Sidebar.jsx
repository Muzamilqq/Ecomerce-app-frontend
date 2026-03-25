import {
  X,
  Home,
  Package,
  Info,
  HelpCircle,
  ShoppingCart,
  Phone,
  List,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toggleSidebar } from "../../store/slices/popupSlice";

const navLinks = [
  { path: "/", label: "Home", icon: Home },
  { path: "/products", label: "Products", icon: Package },
  { path: "/cart", label: "Cart", icon: ShoppingCart },
  { path: "/orders", label: "Orders", icon: List },
  { path: "/about", label: "About", icon: Info },
  { path: "/faq", label: "FAQ", icon: HelpCircle },
  { path: "/contact", label: "Contact", icon: Phone },
];

const Sidebar = () => {
  const dispatch = useDispatch();
  const { isSidebarOpen } = useSelector((s) => s.popup);

  if (!isSidebarOpen) return null;

  return (
    <>
      <div
        className="fixed inset-0 z-40 bg-black/50"
        onClick={() => dispatch(toggleSidebar())}
      />
      <aside className="fixed left-0 top-0 z-50 h-full w-72 glass border-r border-[hsla(var(--glass-border))] animate-slide-in-left p-6">
        <div className="flex items-center justify-between mb-8">
          <span className="text-xl font-bold text-primary">ShopMate</span>
          <button
            onClick={() => dispatch(toggleSidebar())}
            className="p-2 hover:bg-secondary rounded-lg"
          >
            <X className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>
        <nav className="space-y-1">
          {navLinks.map(({ path, label, icon: Icon }) => (
            <Link
              key={path}
              to={path}
              onClick={() => dispatch(toggleSidebar())}
              className="flex items-center gap-3 px-4 py-3 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
            >
              <Icon className="w-5 h-5" />
              <span className="font-medium">{label}</span>
            </Link>
          ))}
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;
