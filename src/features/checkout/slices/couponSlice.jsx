import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../../config/api';

export const fetchCoupons = createAsyncThunk(
  'coupons/fetchCoupons',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/coupons');
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to fetch coupons');
    }
  }
);

export const validateCoupon = createAsyncThunk(
  'coupons/validateCoupon',
  async ({ code, orderTotal, categoryIds }, { rejectWithValue }) => {
    try {
      const response = await api.post('/coupons/validate', { code, orderTotal, categoryIds: categoryIds || [] });
      const data = response.data.data;
      return {
        code: data.couponCode || code,
        discountAmount: data.discount || 0,
        description: data.description || '',
      };
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || error.response?.data?.message || 'Invalid coupon');
    }
  }
);

const initialState = {
  coupons: [],
  validatedCoupon: null,
  loading: false,
  error: null,
};

const couponSlice = createSlice({
  name: 'coupons',
  initialState,
  reducers: {
    clearValidatedCoupon: (state) => {
      state.validatedCoupon = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCoupons.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCoupons.fulfilled, (state, action) => {
        state.loading = false;
        state.coupons = action.payload;
      })
      .addCase(fetchCoupons.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(validateCoupon.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(validateCoupon.fulfilled, (state, action) => {
        state.loading = false;
        state.validatedCoupon = action.payload;
      })
      .addCase(validateCoupon.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.validatedCoupon = null;
      });
  },
});

export const { clearValidatedCoupon, clearError } = couponSlice.actions;
export default couponSlice.reducer;
