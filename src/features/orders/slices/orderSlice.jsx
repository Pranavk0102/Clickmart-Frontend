import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../../config/api';

export const placeOrder = createAsyncThunk(
  'orders/placeOrder',
  async (orderData, { rejectWithValue }) => {
    try {
      const response = await api.post('/orders', orderData);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
        error.response?.data?.error ||
        'Failed to place order'
      );
    }
  }
);

export const fetchMyOrders = createAsyncThunk(
  'orders/fetchMyOrders',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/orders/my');
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to fetch orders');
    }
  }
);

export const fetchOrderByNumber = createAsyncThunk(
  'orders/fetchOrderByNumber',
  async ({ orderNumber, isAdmin = false }, { rejectWithValue }) => {
    try {
      const endpoint = isAdmin ? `/orders/${orderNumber}` : `/orders/my/${orderNumber}`;
      const response = await api.get(endpoint);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to fetch order');
    }
  }
);

export const cancelOrder = createAsyncThunk(
  'orders/cancelOrder',
  async (orderNumber, { rejectWithValue }) => {
    try {
      const response = await api.patch(`/orders/my/${orderNumber}/cancel`);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to cancel order');
    }
  }
);

export const returnOrder = createAsyncThunk(
  'orders/returnOrder',
  async (orderNumber, { rejectWithValue }) => {
    try {
      const response = await api.patch(`/orders/my/${orderNumber}/return`);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || error.response?.data?.message || 'Failed to submit return request');
    }
  }
);

const initialState = {
  orders: [],
  currentOrder: null,
  loading: false,
  orderPlacing: false,
  error: null,
};

const orderSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    clearCurrentOrder: (state) => {
      state.currentOrder = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(placeOrder.pending, (state) => {
        state.loading = true;
        state.orderPlacing = true;
        state.error = null;
      })
      .addCase(placeOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.orderPlacing = false;
        state.currentOrder = action.payload;
        state.orders.unshift(action.payload);
      })
      .addCase(placeOrder.rejected, (state, action) => {
        state.loading = false;
        state.orderPlacing = false;
        state.error = action.payload;
      })
      .addCase(fetchMyOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMyOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload;
      })
      .addCase(fetchMyOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchOrderByNumber.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrderByNumber.fulfilled, (state, action) => {
        state.loading = false;
        state.currentOrder = action.payload;
      })
      .addCase(fetchOrderByNumber.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(cancelOrder.fulfilled, (state, action) => {
        const index = state.orders.findIndex(o => o.orderNumber === action.payload.orderNumber);
        if (index !== -1) {
          state.orders[index] = action.payload;
        }
        if (state.currentOrder?.orderNumber === action.payload.orderNumber) {
          state.currentOrder = action.payload;
        }
      })
      .addCase(returnOrder.fulfilled, (state, action) => {
        const index = state.orders.findIndex(o => o.orderNumber === action.payload.orderNumber);
        if (index !== -1) {
          state.orders[index] = action.payload;
        }
        if (state.currentOrder?.orderNumber === action.payload.orderNumber) {
          state.currentOrder = action.payload;
        }
      });
  },
});

export const { clearCurrentOrder, clearError } = orderSlice.actions;
export default orderSlice.reducer;
