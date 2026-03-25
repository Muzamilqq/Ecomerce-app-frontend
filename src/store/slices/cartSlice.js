import { createSlice } from "@reduxjs/toolkit";
import { toast } from "react-toastify";

const loadCart = () => {
  try {
    const saved = localStorage.getItem("cart");
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
};

const saveCart = (cart) => {
  localStorage.setItem("cart", JSON.stringify(cart));
};

const cartSlice = createSlice({
  name: "cart",
  initialState: {
    cart: loadCart(),
  },
  reducers: {
    addToCart: (state, action) => {
      const existing = state.cart.find(
        (item) => item.product.id === action.payload.product.id,
      );
      if (existing) {
        existing.quantity += action.payload.quantity || 1;
      } else {
        state.cart.push({
          product: action.payload.product,
          quantity: action.payload.quantity || 1,
        });
      }
      saveCart(state.cart);
      toast.success("Added to cart!");
    },
    removeFromCart: (state, action) => {
      state.cart = state.cart.filter(
        (item) => item.product.id !== action.payload,
      );
      saveCart(state.cart);
      toast.info("Removed from cart.");
    },
    increaseQuantity: (state, action) => {
      const item = state.cart.find((i) => i.product.id === action.payload);
      if (item) item.quantity += 1;
      saveCart(state.cart);
    },
    decreaseQuantity: (state, action) => {
      const item = state.cart.find((i) => i.product.id === action.payload);
      if (item && item.quantity > 1) item.quantity -= 1;
      saveCart(state.cart);
    },
    clearCart: (state) => {
      state.cart = [];
      localStorage.removeItem("cart");
    },
  },
});

export const {
  addToCart,
  removeFromCart,
  increaseQuantity,
  decreaseQuantity,
  clearCart,
} = cartSlice.actions;
export default cartSlice.reducer;
