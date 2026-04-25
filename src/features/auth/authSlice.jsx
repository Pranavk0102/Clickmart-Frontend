import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api, { requestTokenRefresh } from '../../config/api';

const parseStoredJson = (key) => {
  try {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : null;
  } catch {
    localStorage.removeItem(key);
    return null;
  }
};

const storedUser = parseStoredJson('user');

export const register = createAsyncThunk(
  'auth/register',
  async (userData, { rejectWithValue }) => {
    try {
      const response = await api.post('/auth/register', userData);
      const data = response.data.data;
      const accessToken = data.token || data.accessToken;
      const { refreshToken, user } = data;
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);
      localStorage.setItem('user', JSON.stringify(user));
      return { user, accessToken, refreshToken };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.response?.data?.error || 'Registration failed');
    }
  }
);

export const login = createAsyncThunk(
  'auth/login',
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await api.post('/auth/login', credentials);
      const data = response.data.data;
      const accessToken = data.token || data.accessToken;
      const { refreshToken, user } = data;
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);
      localStorage.setItem('user', JSON.stringify(user));
      return { user, accessToken, refreshToken };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.response?.data?.error || 'Login failed');
    }
  }
);

export const logout = createAsyncThunk(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      const refreshToken = localStorage.getItem('refreshToken');
      await api.post('/auth/logout', { refreshToken });
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
      return null;
    } catch (error) {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
      return rejectWithValue(error.response?.data?.error || 'Logout failed');
    }
  }
);

export const getCurrentUser = createAsyncThunk(
  'auth/getCurrentUser',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/auth/me');
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to fetch user');
    }
  }
);

export const refreshToken = createAsyncThunk(
  'auth/refreshToken',
  async (_, { rejectWithValue, getState }) => {
    try {
      const storedRefresh = getState().auth.refreshToken || localStorage.getItem('refreshToken');
      if (!storedRefresh) throw new Error('No refresh token available');
      const data = await requestTokenRefresh(storedRefresh);
      const accessToken = data.token || data.accessToken;
      const newRefreshToken = data.refreshToken;
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', newRefreshToken);
      return { accessToken, refreshToken: newRefreshToken };
    } catch (error) {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
      return rejectWithValue(error.response?.data?.error || 'Token refresh failed');
    }
  }
);

export const updateProfile = createAsyncThunk(
  'auth/updateProfile',
  async (profileData, { rejectWithValue }) => {
    try {
      const response = await api.put('/profile', profileData);
      const updatedUser = response.data.data;
      localStorage.setItem('user', JSON.stringify(updatedUser));
      return updatedUser;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to update profile');
    }
  }
);

export const changePassword = createAsyncThunk(
  'auth/changePassword',
  async (passwordData, { rejectWithValue }) => {
    try {
      await api.put('/profile/password', passwordData);
      return true;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to change password');
    }
  }
);

const initialState = {
  user: storedUser,
  accessToken: localStorage.getItem('accessToken') || null,
  refreshToken: localStorage.getItem('refreshToken') || null,
  isAuthenticated: !!localStorage.getItem('accessToken'),
  isAdmin: storedUser?.role?.toUpperCase() === 'ADMIN',
  loading: false,
  error: null,
  passwordChangeSuccess: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearPasswordChangeSuccess: (state) => {
      state.passwordChangeSuccess = false;
    },
    setUser: (state, action) => {
      state.user = action.payload;
      state.isAdmin = action.payload?.role?.toUpperCase() === 'ADMIN';
      localStorage.setItem('user', JSON.stringify(action.payload));
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(register.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(register.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.accessToken = action.payload.accessToken;
        state.refreshToken = action.payload.refreshToken;
        state.isAuthenticated = true;
        state.isAdmin = action.payload.user?.role?.toUpperCase() === 'ADMIN';
      })
      .addCase(register.rejected, (state, action) => { state.loading = false; state.error = action.payload; })
      .addCase(login.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.accessToken = action.payload.accessToken;
        state.refreshToken = action.payload.refreshToken;
        state.isAuthenticated = true;
        state.isAdmin = action.payload.user?.role?.toUpperCase() === 'ADMIN';
      })
      .addCase(login.rejected, (state, action) => { state.loading = false; state.error = action.payload; })
      .addCase(logout.fulfilled, (state) => {
        state.user = null; state.accessToken = null; state.refreshToken = null;
        state.isAuthenticated = false; state.isAdmin = false; state.loading = false;
      })
      .addCase(logout.rejected, (state, action) => {
        state.user = null; state.accessToken = null; state.refreshToken = null;
        state.isAuthenticated = false; state.isAdmin = false; state.loading = false;
        state.error = action.payload;
      })
      .addCase(getCurrentUser.pending, (state) => { state.loading = true; })
      .addCase(getCurrentUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.isAdmin = action.payload?.role?.toUpperCase() === 'ADMIN';
        localStorage.setItem('user', JSON.stringify(action.payload));
      })
      .addCase(getCurrentUser.rejected, (state, action) => { state.loading = false; state.error = action.payload; })
      .addCase(refreshToken.fulfilled, (state, action) => {
        state.accessToken = action.payload.accessToken;
        state.refreshToken = action.payload.refreshToken;
      })
      .addCase(refreshToken.rejected, (state) => {
        state.user = null; state.accessToken = null; state.refreshToken = null;
        state.isAuthenticated = false; state.isAdmin = false;
      })
      .addCase(updateProfile.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.isAdmin = action.payload?.role?.toUpperCase() === 'ADMIN';
      })
      .addCase(updateProfile.rejected, (state, action) => { state.loading = false; state.error = action.payload; })
      .addCase(changePassword.pending, (state) => { state.loading = true; state.error = null; state.passwordChangeSuccess = false; })
      .addCase(changePassword.fulfilled, (state) => { state.loading = false; state.passwordChangeSuccess = true; })
      .addCase(changePassword.rejected, (state, action) => { state.loading = false; state.error = action.payload; state.passwordChangeSuccess = false; });
  },
});

export const { clearError, clearPasswordChangeSuccess, setUser } = authSlice.actions;

export const selectIsAdmin = (state) => state.auth.isAdmin;
export const selectCurrentUser = (state) => state.auth.user;
export const selectIsAuthenticated = (state) => state.auth.isAuthenticated;

export default authSlice.reducer;
