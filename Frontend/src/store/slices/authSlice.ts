import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../services/api.service";
import type { User } from "../../types/userType";

interface AuthState {
  user: User | null;
  token: string | null;
  status: "idle" | "loading" | "error";
}

const initialState: AuthState = {
  user: null,
  token: localStorage.getItem("token"),
  status: "idle",
};

export const login = createAsyncThunk(
  "auth/login",
  async (credentials: { username: string; password: string }) => {
    const response = await api.post("/Auth/login", credentials);
    localStorage.setItem("token", response.data.token);
    return response.data.token;
  }
);

export const register = createAsyncThunk(
  "auth/register",
  async (userData: User) => {
    const response = await api.post("/Auth/register", userData);
    localStorage.setItem("token", response.data.token);
    return response.data.token;
  }
);

export const fetchUser = createAsyncThunk("auth/fetchUser", async () => {
  const response = await api.get("/Auth/loggedInUser");
  return response.data;
});

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      localStorage.removeItem("token");
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.status = "loading";
      })
      .addCase(login.fulfilled, (state, action) => {
        state.token = action.payload;
        state.status = "idle";
      })
      .addCase(login.rejected, (state) => {
        state.status = "error";
      })
      .addCase(register.fulfilled, (state, action) => {
        state.token = action.payload;
      })
      .addCase(fetchUser.fulfilled, (state, action) => {
        state.user = action.payload;
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
