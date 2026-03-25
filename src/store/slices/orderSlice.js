import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { axiosInstance } from "../../lib/axios";
import { toast } from "react-toastify";

export const placeOrder = createAsyncThunk(
  "order/placeOrder",
  async (orderData, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.post("/order/new", orderData);
      return res.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to place order",
      );
    }
  },
);

export const fetchMyOrders = createAsyncThunk(
  "order/fetchMyOrders",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get("/order/orders/me");
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message);
    }
  },
);

const orderSlice = createSlice({
  name: "order",
  initialState: {
    myOrders: [],
    fetchingOrders: false,
    placingOrder: false,
    finalPrice: null,
    orderStep: 1,
    paymentIntent: "",
  },
  reducers: {
    setOrderStep: (state, action) => {
      state.orderStep = action.payload;
    },
    clearOrderState: (state) => {
      state.finalPrice = null;
      state.orderStep = 1;
      state.paymentIntent = "";
    },
  },
  extraReducers: (builder) => {
    builder.addCase(placeOrder.pending, (state) => {
      state.placingOrder = true;
    });
    builder.addCase(placeOrder.fulfilled, (state, action) => {
      state.placingOrder = false;
      state.finalPrice = action.payload.total_price;
      state.paymentIntent = action.payload.paymentIntent;
      state.orderStep = 2;
    });
    builder.addCase(placeOrder.rejected, (state, action) => {
      state.placingOrder = false;
      toast.error(action.payload);
    });
    builder.addCase(fetchMyOrders.pending, (state) => {
      state.fetchingOrders = true;
    });
    builder.addCase(fetchMyOrders.fulfilled, (state, action) => {
      state.fetchingOrders = false;
      state.myOrders = action.payload.myOrders;
    });
    builder.addCase(fetchMyOrders.rejected, (state) => {
      state.fetchingOrders = false;
    });
  },
});

export const { setOrderStep, clearOrderState } = orderSlice.actions;
export default orderSlice.reducer;
