import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { axiosInstance } from "../../lib/axios";
import { toast } from "react-toastify";

export const checkAuth = createAsyncThunk(
  "auth/checkAuth",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get("/auth/me");
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message);
    }
  },
);

export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.post("/auth/login", { email, password });
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Login failed");
    }
  },
);

export const registerUser = createAsyncThunk(
  "auth/registerUser",
  async ({ name, email, password }, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.post("/auth/register", {
        name,
        email,
        password,
      });
      return res.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Registration failed",
      );
    }
  },
);

export const logoutUser = createAsyncThunk(
  "auth/logoutUser",
  async (_, { rejectWithValue }) => {
    try {
      await axiosInstance.get("/auth/logout");
    } catch (err) {
      return rejectWithValue(err.response?.data?.message);
    }
  },
);

export const forgotPassword = createAsyncThunk(
  "auth/forgotPassword",
  async ({ email, frontendUrl }, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.post(
        `/auth/password/forgot?frontendUrl=${frontendUrl}`,
        { email },
      );
      return res.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to send reset email",
      );
    }
  },
);

export const resetPassword = createAsyncThunk(
  "auth/resetPassword",
  async ({ token, password, confirmPassword }, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.put(`/auth/password/reset/${token}`, {
        password,
        confirmPassword,
      });
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Reset failed");
    }
  },
);

export const updateProfile = createAsyncThunk(
  "auth/updateProfile",
  async (formData, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.put("/auth/profile/update", formData);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Update failed");
    }
  },
);

export const updatePassword = createAsyncThunk(
  "auth/updatePassword",
  async (data, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.put("/auth/password/update", data);
      return res.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Password update failed",
      );
    }
  },
);

const authSlice = createSlice({
  name: "auth",
  initialState: {
    authUser: null,
    isSigningUp: false,
    isLoggingIn: false,
    isUpdatingProfile: false,
    isUpdatingPassword: false,
    isRequestingForToken: false,
    isCheckingAuth: true,
    error: null,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // checkAuth
    builder.addCase(checkAuth.pending, (state) => {
      state.isCheckingAuth = true;
    });
    builder.addCase(checkAuth.fulfilled, (state, action) => {
      state.isCheckingAuth = false;
      state.authUser = action.payload.user;
    });
    builder.addCase(checkAuth.rejected, (state) => {
      state.isCheckingAuth = false;
      state.authUser = null;
    });
    // login
    builder.addCase(loginUser.pending, (state) => {
      state.isLoggingIn = true;
      state.error = null;
    });
    builder.addCase(loginUser.fulfilled, (state, action) => {
      state.isLoggingIn = false;
      state.authUser = action.payload.user;
      toast.success("Logged in successfully!");
    });
    builder.addCase(loginUser.rejected, (state, action) => {
      state.isLoggingIn = false;
      state.error = action.payload;
      toast.error(action.payload);
    });
    // register
    builder.addCase(registerUser.pending, (state) => {
      state.isSigningUp = true;
      state.error = null;
    });
    builder.addCase(registerUser.fulfilled, (state, action) => {
      state.isSigningUp = false;
      state.authUser = action.payload.user;
      toast.success("Registered successfully!");
    });
    builder.addCase(registerUser.rejected, (state, action) => {
      state.isSigningUp = false;
      state.error = action.payload;
      toast.error(action.payload);
    });
    // logout
    builder.addCase(logoutUser.fulfilled, (state) => {
      state.authUser = null;
      toast.success("Logged out.");
    });
    // forgotPassword
    builder.addCase(forgotPassword.pending, (state) => {
      state.isRequestingForToken = true;
    });
    builder.addCase(forgotPassword.fulfilled, (state, action) => {
      state.isRequestingForToken = false;
      toast.success(action.payload.message);
    });
    builder.addCase(forgotPassword.rejected, (state, action) => {
      state.isRequestingForToken = false;
      toast.error(action.payload);
    });
    // resetPassword
    builder.addCase(resetPassword.fulfilled, (state, action) => {
      state.authUser = action.payload.user;
      toast.success("Password reset successfully!");
    });
    builder.addCase(resetPassword.rejected, (state, action) => {
      toast.error(action.payload);
    });
    // updateProfile
    builder.addCase(updateProfile.pending, (state) => {
      state.isUpdatingProfile = true;
    });
    builder.addCase(updateProfile.fulfilled, (state, action) => {
      state.isUpdatingProfile = false;
      state.authUser = action.payload.user;
      toast.success("Profile updated!");
    });
    builder.addCase(updateProfile.rejected, (state, action) => {
      state.isUpdatingProfile = false;
      toast.error(action.payload);
    });
    // updatePassword
    builder.addCase(updatePassword.pending, (state) => {
      state.isUpdatingPassword = true;
    });
    builder.addCase(updatePassword.fulfilled, (state) => {
      state.isUpdatingPassword = false;
      toast.success("Password updated!");
    });
    builder.addCase(updatePassword.rejected, (state, action) => {
      state.isUpdatingPassword = false;
      toast.error(action.payload);
    });
  },
});

export const { clearError } = authSlice.actions;
export default authSlice.reducer;
