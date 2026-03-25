import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { axiosInstance } from "../../lib/axios";
import { toast } from "react-toastify";

export const fetchAllProducts = createAsyncThunk(
  "product/fetchAllProducts",
  async (params = {}, { rejectWithValue }) => {
    try {
      const query = new URLSearchParams(params).toString();
      const res = await axiosInstance.get(`/product?${query}`);
      return res.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch products",
      );
    }
  },
);

export const fetchSingleProduct = createAsyncThunk(
  "product/fetchSingleProduct",
  async (productId, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get(
        `/product/singleProduct/${productId}`,
      );
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message);
    }
  },
);

export const postReview = createAsyncThunk(
  "product/postReview",
  async ({ productId, rating, comment }, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.put(
        `/product/post-new/review/${productId}`,
        { rating, comment },
      );
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message);
    }
  },
);

export const deleteReview = createAsyncThunk(
  "product/deleteReview",
  async (productId, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.delete(
        `/product/delete/review/${productId}`,
      );
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message);
    }
  },
);

export const fetchAIProducts = createAsyncThunk(
  "product/fetchAIProducts",
  async (userPrompt, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.post("/product/ai-search", {
        userPrompt,
      });
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message);
    }
  },
);

const productSlice = createSlice({
  name: "product",
  initialState: {
    loading: false,
    products: [],
    productDetails: null,
    totalProducts: 0,
    topRatedProducts: [],
    newProducts: [],
    aiSearching: false,
    isReviewDeleting: false,
    isPostingReview: false,
    productReviews: [],
  },
  reducers: {
    clearProductDetails: (state) => {
      state.productDetails = null;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchAllProducts.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(fetchAllProducts.fulfilled, (state, action) => {
      state.loading = false;
      state.products = action.payload.products;
      state.totalProducts = action.payload.totalProducts;
      state.newProducts = action.payload.newProducts || [];
      state.topRatedProducts = action.payload.topRatedProducts || [];
    });
    builder.addCase(fetchAllProducts.rejected, (state) => {
      state.loading = false;
    });

    builder.addCase(fetchSingleProduct.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(fetchSingleProduct.fulfilled, (state, action) => {
      state.loading = false;
      state.productDetails = action.payload.product;
      state.productReviews = action.payload.product?.reviews || [];
    });
    builder.addCase(fetchSingleProduct.rejected, (state) => {
      state.loading = false;
    });

    builder.addCase(postReview.pending, (state) => {
      state.isPostingReview = true;
    });
    builder.addCase(postReview.fulfilled, (state, action) => {
      state.isPostingReview = false;
      state.productDetails = action.payload.product;
      state.productReviews = action.payload.product?.reviews || [];
      toast.success("Review posted!");
    });
    builder.addCase(postReview.rejected, (state, action) => {
      state.isPostingReview = false;
      toast.error(action.payload);
    });

    builder.addCase(deleteReview.pending, (state) => {
      state.isReviewDeleting = true;
    });
    builder.addCase(deleteReview.fulfilled, (state, action) => {
      state.isReviewDeleting = false;
      state.productDetails = action.payload.product;
      state.productReviews = action.payload.product?.reviews || [];
      toast.success("Review deleted!");
    });
    builder.addCase(deleteReview.rejected, (state, action) => {
      state.isReviewDeleting = false;
      toast.error(action.payload);
    });

    builder.addCase(fetchAIProducts.pending, (state) => {
      state.aiSearching = true;
    });
    builder.addCase(fetchAIProducts.fulfilled, (state, action) => {
      state.aiSearching = false;
      state.products = action.payload.products;
    });
    builder.addCase(fetchAIProducts.rejected, (state, action) => {
      state.aiSearching = false;
      toast.error(action.payload);
    });
  },
});

export const { clearProductDetails } = productSlice.actions;
export default productSlice.reducer;
