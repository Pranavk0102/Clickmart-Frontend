import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../../config/api';

export const fetchAddresses = createAsyncThunk(
  'addresses/fetchAddresses',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/addresses');
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to fetch addresses');
    }
  }
);

export const addAddress = createAsyncThunk(
  'addresses/addAddress',
  async (addressData, { rejectWithValue }) => {
    try {
      const { isDefault, ...requestData } = addressData;
      const response = await api.post('/addresses', requestData);
      const newAddress = response.data.data;
      if (isDefault && newAddress?.id) {
        await api.patch(`/addresses/${newAddress.id}/default`);
        const refreshed = await api.get('/addresses');
        return { addresses: refreshed.data.data, newAddress };
      }
      return { addresses: null, newAddress };
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || error.response?.data?.message || 'Failed to add address');
    }
  }
);

export const updateAddress = createAsyncThunk(
  'addresses/updateAddress',
  async ({ id, addressData }, { rejectWithValue }) => {
    try {
      const { isDefault, ...requestData } = addressData;
      const response = await api.put(`/addresses/${id}`, requestData);
      const updated = response.data.data;
      if (isDefault) {
        await api.patch(`/addresses/${id}/default`);
        const refreshed = await api.get('/addresses');
        return { addresses: refreshed.data.data };
      }
      return { addresses: null, updated };
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || error.response?.data?.message || 'Failed to update address');
    }
  }
);

export const deleteAddress = createAsyncThunk(
  'addresses/deleteAddress',
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/addresses/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to delete address');
    }
  }
);

export const setDefaultAddress = createAsyncThunk(
  'addresses/setDefaultAddress',
  async (id, { rejectWithValue }) => {
    try {
      await api.patch(`/addresses/${id}/default`);
      const response = await api.get('/addresses');
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to set default address');
    }
  }
);

const initialState = {
  addresses: [],
  loading: false,
  error: null,
};

const addressSlice = createSlice({
  name: 'addresses',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAddresses.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAddresses.fulfilled, (state, action) => {
        state.loading = false;
        state.addresses = action.payload;
      })
      .addCase(fetchAddresses.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(addAddress.fulfilled, (state, action) => {
        if (action.payload.addresses) {
          state.addresses = action.payload.addresses;
        } else {
          state.addresses.push(action.payload.newAddress);
        }
      })
      .addCase(updateAddress.fulfilled, (state, action) => {
        if (action.payload.addresses) {
          state.addresses = action.payload.addresses;
        } else if (action.payload.updated) {
          const index = state.addresses.findIndex(a => a.id === action.payload.updated.id);
          if (index !== -1) state.addresses[index] = action.payload.updated;
        }
      })
      .addCase(deleteAddress.fulfilled, (state, action) => {
        state.addresses = state.addresses.filter(a => a.id !== action.payload);
      })
      .addCase(setDefaultAddress.fulfilled, (state, action) => {
        state.addresses = action.payload;
      });
  },
});

export const { clearError } = addressSlice.actions;
export default addressSlice.reducer;
