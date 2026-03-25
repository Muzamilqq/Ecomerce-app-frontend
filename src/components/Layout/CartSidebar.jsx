import { X, Plus, Minus, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toggleCart } from "../../store/slices/popupSlice";
import {
  addToCart,
  removeFromCart,
  increaseQuantity,
  decreaseQuantity,
} from "../../store/slices/cartSlice";

const CartSidebar = () => {
  const dispatch = useDispatch();
  const { isCartOpen } = useSelector((s) => s.popup);
  const { cart } = useSelector((s) => s.cart);

  const total = cart.reduce(
    (sum, item) => sum + parseFloat(item.product.price) * item.quantity,
    0,
  );

  if (!isCartOpen) return null;

  return (
    <>
      <div
        className="fixed inset-0 z-40 bg-black/50"
        onClick={() => dispatch(toggleCart())}
      />
      <aside className="fixed right-0 top-0 z-50 h-full w-80 glass border-l border-[hsla(var(--glass-border))] animate-slide-in-right flex flex-col">
        <div className="flex items-center justify-between p-5 border-b border-[hsla(var(--glass-border))]">
          <h2 className="text-lg font-bold text-foreground">
            Cart ({cart.length})
          </h2>
          <button
            onClick={() => dispatch(toggleCart())}
            className="p-2 hover:bg-secondary rounded-lg"
          >
            <X className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {cart.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <p>Your cart is empty</p>
              <Link
                to="/products"
                onClick={() => dispatch(toggleCart())}
                className="text-primary text-sm hover:underline mt-2 block"
              >
                Browse products
              </Link>
            </div>
          ) : (
            cart.map((item) => (
              <div key={item.product.id} className="glass-card flex gap-3">
                <img
                  src={item.product.image}
                  alt={item.product.name}
                  className="w-14 h-14 object-cover rounded-lg flex-shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">
                    {item.product.name}
                  </p>
                  <p className="text-primary text-sm font-bold">
                    $
                    {(parseFloat(item.product.price) * item.quantity).toFixed(
                      2,
                    )}
                  </p>
                  <div className="flex items-center gap-2 mt-2">
                    <button
                      onClick={() =>
                        dispatch(decreaseQuantity(item.product.id))
                      }
                      className="w-6 h-6 rounded-full bg-secondary hover:bg-primary hover:text-primary-foreground flex items-center justify-center transition-colors"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="text-sm font-medium text-foreground">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() =>
                        dispatch(increaseQuantity(item.product.id))
                      }
                      className="w-6 h-6 rounded-full bg-secondary hover:bg-primary hover:text-primary-foreground flex items-center justify-center transition-colors"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                    <button
                      onClick={() => dispatch(removeFromCart(item.product.id))}
                      className="ml-auto p-1 hover:text-destructive transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {cart.length > 0 && (
          <div className="p-4 border-t border-[hsla(var(--glass-border))]">
            <div className="flex justify-between mb-4">
              <span className="text-muted-foreground">Total</span>
              <span className="font-bold text-foreground">
                ${total.toFixed(2)}
              </span>
            </div>
            <Link
              to="/payment"
              onClick={() => dispatch(toggleCart())}
              className="block w-full py-3 gradient-primary text-primary-foreground rounded-lg font-semibold text-center hover:glow-on-hover transition-all"
            >
              Checkout
            </Link>
          </div>
        )}
      </aside>
    </>
  );
};

export default CartSidebar;
