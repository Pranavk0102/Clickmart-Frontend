import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../config/api';

export const fetchReviews = createAsyncThunk(
  'reviews/fetchReviews',
  async (productId, { rejectWithValue }) => {
    try {
      const response = await api.get(`/products/${productId}/reviews`);
      const data = response.data.data;
      return Array.isArray(data) ? data : (data?.content || []);
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch reviews');
    }
  }
);

export const createReview = createAsyncThunk(
  'reviews/createReview',
  async ({ productId, rating, comment }, { rejectWithValue }) => {
    try {
      const response = await api.post(`/products/${productId}/reviews`, { rating, comment });
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.response?.data?.error || 'Failed to create review');
    }
  }
);

export const updateReview = createAsyncThunk(
  'reviews/updateReview',
  async ({ reviewId, rating, comment }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/reviews/${reviewId}`, { rating, comment });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update review');
    }
  }
);

export const deleteReview = createAsyncThunk(
  'reviews/deleteReview',
  async ({ productId, reviewId }, { rejectWithValue }) => {
    try {
      await api.delete(`/products/${productId}/reviews/${reviewId}`);
      return reviewId;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete review');
    }
  }
);

const reviewSlice = createSlice({
  name: 'reviews',
  initialState: {
    reviews: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearReviewError: (state) => { state.error = null; },
    clearReviews: (state) => { state.reviews = []; },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchReviews.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchReviews.fulfilled, (state, action) => { state.loading = false; state.reviews = action.payload; })
      .addCase(fetchReviews.rejected, (state, action) => { state.loading = false; state.error = action.payload; })
      .addCase(createReview.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(createReview.fulfilled, (state, action) => { state.loading = false; state.reviews.unshift(action.payload); })
      .addCase(createReview.rejected, (state, action) => { state.loading = false; state.error = action.payload; })
      .addCase(updateReview.fulfilled, (state, action) => {
        const index = state.reviews.findIndex(r => r.id === action.payload.id);
        if (index !== -1) state.reviews[index] = action.payload;
      })
      .addCase(deleteReview.fulfilled, (state, action) => {
        state.reviews = state.reviews.filter(r => r.id !== action.payload);
      });
  },
});

export const { clearReviewError, clearReviews } = reviewSlice.actions;
export default reviewSlice.reducer;
