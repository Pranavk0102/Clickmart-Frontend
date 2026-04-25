import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../config/api';

const normalizeProductsPage = (payload) => {
  if (Array.isArray(payload)) {
    return {
      content: payload,
      totalPages: 1,
      totalElements: payload.length,
      number: 0,
    };
  }

  if (payload && Array.isArray(payload.content)) {
    return payload;
  }

  return {
    content: [],
    totalPages: 0,
    totalElements: 0,
    number: 0,
  };
};

export const fetchProducts = createAsyncThunk(
  'products/fetchProducts',
  async ({ page = 0, size = 20, sort = 'relevance', search = '', category = '', categoryId = null } = {}, { rejectWithValue }) => {
    try {
      const params = { page, size, sort };
      if (search) params.query = search;
      if (categoryId) params.categoryId = categoryId;
      else if (category) params.query = params.query ? `${params.query} ${category}` : category;

      const response = await api.get('/products', { params });
      return normalizeProductsPage(response.data.data);
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to fetch products');
    }
  }
);

export const fetchProductById = createAsyncThunk(
  'products/fetchProductById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.get(`/products/${id}`);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to fetch product');
    }
  }
);

export const fetchProductReviews = createAsyncThunk(
  'products/fetchProductReviews',
  async ({ productId, page = 0, size = 10 }, { rejectWithValue }) => {
    try {
      const response = await api.get(`/products/${productId}/reviews`, {
        params: { page, size }
      });
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to fetch reviews');
    }
  }
);

export const addReview = createAsyncThunk(
  'products/addReview',
  async ({ productId, reviewData }, { rejectWithValue }) => {
    try {
      const response = await api.post(`/products/${productId}/reviews`, reviewData);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to add review');
    }
  }
);

const initialState = {
  items: [],
  currentProduct: null,
  currentProductLoading: false,
  reviews: [],
  totalPages: 0,
  totalElements: 0,
  currentPage: 0,
  loading: false,
  error: null,
};

const productSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    clearCurrentProduct: (state) => {
      state.currentProduct = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.content;
        state.totalPages = action.payload.totalPages;
        state.totalElements = action.payload.totalElements;
        state.currentPage = action.payload.number;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchProductById.pending, (state) => {
        state.currentProductLoading = true;
        state.error = null;
      })
      .addCase(fetchProductById.fulfilled, (state, action) => {
        state.currentProductLoading = false;
        state.currentProduct = action.payload;
      })
      .addCase(fetchProductById.rejected, (state, action) => {
        state.currentProductLoading = false;
        state.error = action.payload;
      })
      .addCase(fetchProductReviews.fulfilled, (state, action) => {
        const data = action.payload;
        state.reviews = Array.isArray(data) ? data : (data?.content || []);
      })
      .addCase(addReview.fulfilled, (state, action) => {
        state.reviews.unshift(action.payload);
      });
  },
});

export const { clearCurrentProduct, clearError } = productSlice.actions;
export default productSlice.reducer;
