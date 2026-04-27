import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../../config/api';

const unwrapData = (response) => {
  if (response && response.data && response.data.data) {
    return response.data.data;
  }
  if (response && response.data) {
    return response.data;
  }
  return response;
};

const normalizePagedPayload = (payload) => {
  if (Array.isArray(payload)) {
    return {
      content: payload,
      totalPages: 1,
      totalElements: payload.length,
      number: 0,
    };
  }

  if (payload && Array.isArray(payload.content)) {
    let totalPages = 1;
    if (payload.totalPages !== undefined && payload.totalPages !== null) {
      totalPages = payload.totalPages;
    }

    let totalElements = payload.content.length;
    if (payload.totalElements !== undefined && payload.totalElements !== null) {
      totalElements = payload.totalElements;
    }

    let number = 0;
    if (payload.number !== undefined && payload.number !== null) {
      number = payload.number;
    }

    return {
      content: payload.content,
      totalPages: totalPages,
      totalElements: totalElements,
      number: number,
    };
  }

  return {
    content: [],
    totalPages: 0,
    totalElements: 0,
    number: 0,
  };
};

const normalizeDashboardStats = (payload) => {
  let data = payload;
  if (!data) {
    data = {};
  }

  let totalRevenue = 0;
  if (data.totalRevenue !== undefined) {
    totalRevenue = data.totalRevenue;
  } else if (data.revenue !== undefined) {
    totalRevenue = data.revenue;
  } else if (data.totalSales !== undefined) {
    totalRevenue = data.totalSales;
  }

  let totalCustomers = 0;
  if (data.totalCustomers !== undefined) {
    totalCustomers = data.totalCustomers;
  } else if (data.customers !== undefined) {
    totalCustomers = data.customers;
  } else if (data.customerCount !== undefined) {
    totalCustomers = data.customerCount;
  }

  let totalOrders = 0;
  if (data.totalOrders !== undefined) {
    totalOrders = data.totalOrders;
  } else if (data.orders !== undefined) {
    totalOrders = data.orders;
  } else if (data.orderCount !== undefined) {
    totalOrders = data.orderCount;
  }

  let totalProducts = 0;
  if (data.totalProducts !== undefined) {
    totalProducts = data.totalProducts;
  } else if (data.products !== undefined) {
    totalProducts = data.products;
  } else if (data.productCount !== undefined) {
    totalProducts = data.productCount;
  }

  return {
    totalRevenue: totalRevenue,
    totalCustomers: totalCustomers,
    totalOrders: totalOrders,
    totalProducts: totalProducts,
  };
};

const normalizeCustomer = (customer) => {
  if (!customer) {
    return null;
  }

  let name = customer.name;
  if (!name) {
    let firstName = customer.firstName;
    if (!firstName) firstName = '';
    
    let lastName = customer.lastName;
    if (!lastName) lastName = '';
    
    name = (firstName + ' ' + lastName).trim();
  }

  let active = true;
  if (typeof customer.active === 'boolean') {
    active = customer.active;
  } else if (customer.status) {
    if (String(customer.status).toUpperCase() === 'ACTIVE') {
      active = true;
    } else {
      active = false;
    }
  }

  return {
    ...customer,
    name: name,
    active: active,
  };
};

const normalizeCustomerPage = (payload) => {
  const page = normalizePagedPayload(payload);
  const normalizedContent = [];
  
  for (let i = 0; i < page.content.length; i++) {
    const cust = normalizeCustomer(page.content[i]);
    if (cust) {
      normalizedContent.push(cust);
    }
  }

  return {
    ...page,
    content: normalizedContent,
  };
};

export const fetchDashboardStats = createAsyncThunk(
  'admin/fetchDashboardStats',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/admin/dashboard/stats');
      return normalizeDashboardStats(unwrapData(response));
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || error.response?.data?.message || 'Failed to fetch dashboard stats');
    }
  }
);

export const fetchAllCustomers = createAsyncThunk(
  'admin/fetchAllCustomers',
  async ({ page = 0, size = 20, query } = {}, { rejectWithValue }) => {
    try {
      const params = { page, size };
      if (query) params.query = query;
      const response = await api.get('/admin/customers', { params });
      return normalizeCustomerPage(unwrapData(response));
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || error.response?.data?.message || 'Failed to fetch customers');
    }
  }
);

export const fetchCustomerById = createAsyncThunk(
  'admin/fetchCustomerById',
  async (customerId, { rejectWithValue }) => {
    try {
      const response = await api.get(`/admin/customers/${customerId}`);
      return normalizeCustomer(unwrapData(response));
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || error.response?.data?.message || 'Failed to fetch customer');
    }
  }
);

export const updateCustomer = createAsyncThunk(
  'admin/updateCustomer',
  async ({ customerId, customerData }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/admin/customers/${customerId}`, customerData);
      return normalizeCustomer(unwrapData(response));
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || error.response?.data?.message || 'Failed to update customer');
    }
  }
);

export const toggleCustomerStatus = createAsyncThunk(
  'admin/toggleCustomerStatus',
  async (customerId, { rejectWithValue }) => {
    try {
      const response = await api.patch(`/admin/customers/${customerId}/toggle-active`);
      return normalizeCustomer(unwrapData(response));
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || error.response?.data?.message || 'Failed to toggle customer status');
    }
  }
);

export const createProduct = createAsyncThunk(
  'admin/createProduct',
  async (productData, { rejectWithValue }) => {
    try {
      const response = await api.post('/products', productData);
      return unwrapData(response);
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || error.response?.data?.message || 'Failed to create product');
    }
  }
);

export const updateProduct = createAsyncThunk(
  'admin/updateProduct',
  async ({ productId, productData }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/products/${productId}`, productData);
      return unwrapData(response);
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || error.response?.data?.message || 'Failed to update product');
    }
  }
);

export const deleteProduct = createAsyncThunk(
  'admin/deleteProduct',
  async (productId, { rejectWithValue }) => {
    try {
      await api.delete(`/products/${productId}`);
      return productId;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || error.response?.data?.message || 'Failed to delete product');
    }
  }
);

export const fetchAllOrders = createAsyncThunk(
  'admin/fetchAllOrders',
  async ({ page = 0, size = 20, status = '' } = {}, { rejectWithValue }) => {
    try {
      const params = { page, size };
      if (status) params.status = status;
      const response = await api.get('/orders', { params });
      return normalizePagedPayload(unwrapData(response));
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || error.response?.data?.message || 'Failed to fetch orders');
    }
  }
);

export const updateOrderStatus = createAsyncThunk(
  'admin/updateOrderStatus',
  async ({ orderNumber, status }, { rejectWithValue }) => {
    try {
      const response = await api.patch(`/orders/${orderNumber}/status`, { status });
      return unwrapData(response);
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || error.response?.data?.message || 'Failed to update order status');
    }
  }
);

export const createCategory = createAsyncThunk(
  'admin/createCategory',
  async (categoryData, { rejectWithValue }) => {
    try {
      const response = await api.post('/categories', categoryData);
      return unwrapData(response);
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || error.response?.data?.message || 'Failed to create category');
    }
  }
);

export const updateCategory = createAsyncThunk(
  'admin/updateCategory',
  async ({ categoryId, categoryData }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/categories/${categoryId}`, categoryData);
      return unwrapData(response);
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || error.response?.data?.message || 'Failed to update category');
    }
  }
);

export const fetchAdminCoupons = createAsyncThunk(
  'admin/fetchAdminCoupons',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/coupons/all');
      return unwrapData(response);
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || error.response?.data?.message || 'Failed to fetch coupons');
    }
  }
);

export const deleteCategory = createAsyncThunk(
  'admin/deleteCategory',
  async (categoryId, { rejectWithValue }) => {
    try {
      await api.delete(`/categories/${categoryId}`);
      return categoryId;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || error.response?.data?.message || 'Failed to delete category');
    }
  }
);

export const toggleCategory = createAsyncThunk(
  'admin/toggleCategory',
  async (categoryId, { rejectWithValue }) => {
    try {
      const response = await api.patch(`/categories/${categoryId}/toggle-active`);
      return unwrapData(response);
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || error.response?.data?.message || 'Failed to toggle category status');
    }
  }
);

export const createCoupon = createAsyncThunk(
  'admin/createCoupon',
  async (couponData, { rejectWithValue }) => {
    try {
      const response = await api.post('/coupons', couponData);
      return unwrapData(response);
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || error.response?.data?.message || 'Failed to create coupon');
    }
  }
);

export const updateCoupon = createAsyncThunk(
  'admin/updateCoupon',
  async ({ couponId, couponData }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/coupons/${couponId}`, couponData);
      return unwrapData(response);
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || error.response?.data?.message || 'Failed to update coupon');
    }
  }
);

export const deleteCoupon = createAsyncThunk(
  'admin/deleteCoupon',
  async (couponId, { rejectWithValue }) => {
    try {
      await api.delete(`/coupons/${couponId}`);
      return couponId;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || error.response?.data?.message || 'Failed to delete coupon');
    }
  }
);

export const fetchInventory = createAsyncThunk(
  'admin/fetchInventory',
  async ({ page = 0, size = 20 } = {}, { rejectWithValue }) => {
    try {
      const response = await api.get('/admin/inventory', {
        params: { page, size },
      });
      return normalizePagedPayload(unwrapData(response));
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || error.response?.data?.message || 'Inventory management is not available from the backend yet');
    }
  }
);

export const updateStock = createAsyncThunk(
  'admin/updateStock',
  async ({ productId, stock }, { rejectWithValue }) => {
    try {
      const response = await api.patch(`/admin/inventory/${productId}/stock`, { stock });
      return unwrapData(response);
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || error.response?.data?.message || 'Inventory management is not available from the backend yet');
    }
  }
);

const initialState = {
  dashboardStats: null,
  customers: [],
  currentCustomer: null,
  customersTotalPages: 0,
  customersCurrentPage: 0,
  orders: [],
  ordersTotalPages: 0,
  ordersCurrentPage: 0,
  inventory: [],
  inventoryTotalPages: 0,
  inventoryCurrentPage: 0,
  coupons: [],
  couponsLoading: false,
  couponsTotalPages: 0,
  couponsCurrentPage: 0,
  loading: false,
  dashboardLoading: false,
  customersLoading: false,
  ordersLoading: false,
  inventoryLoading: false,
  error: null,
};

const adminSlice = createSlice({
  name: 'admin',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearCurrentCustomer: (state) => {
      state.currentCustomer = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDashboardStats.pending, (state) => {
        state.dashboardLoading = true;
        state.error = null;
      })
      .addCase(fetchDashboardStats.fulfilled, (state, action) => {
        state.dashboardLoading = false;
        state.dashboardStats = action.payload;
      })
      .addCase(fetchDashboardStats.rejected, (state, action) => {
        state.dashboardLoading = false;
        state.error = action.payload;
      })
      .addCase(fetchAllCustomers.pending, (state) => {
        state.customersLoading = true;
        state.error = null;
      })
      .addCase(fetchAllCustomers.fulfilled, (state, action) => {
        state.customersLoading = false;
        state.customers = action.payload.content;
        state.customersTotalPages = action.payload.totalPages;
        state.customersCurrentPage = action.payload.number;
      })
      .addCase(fetchAllCustomers.rejected, (state, action) => {
        state.customersLoading = false;
        state.error = action.payload;
      })
      .addCase(fetchCustomerById.fulfilled, (state, action) => {
        state.currentCustomer = action.payload;
      })
      .addCase(updateCustomer.fulfilled, (state, action) => {
        const index = state.customers.findIndex((customer) => customer.id === action.payload.id);
        if (index !== -1) {
          state.customers[index] = action.payload;
        }
        state.currentCustomer = action.payload;
      })
      .addCase(toggleCustomerStatus.fulfilled, (state, action) => {
        const index = state.customers.findIndex((customer) => customer.id === action.payload.id);
        if (index !== -1) {
          state.customers[index] = action.payload;
        }
        if (state.currentCustomer?.id === action.payload.id) {
          state.currentCustomer = action.payload;
        }
      })
      .addCase(fetchAllOrders.pending, (state) => {
        state.ordersLoading = true;
        state.error = null;
      })
      .addCase(fetchAllOrders.fulfilled, (state, action) => {
        state.ordersLoading = false;
        state.orders = action.payload.content;
        state.ordersTotalPages = action.payload.totalPages;
        state.ordersCurrentPage = action.payload.number;
      })
      .addCase(fetchAllOrders.rejected, (state, action) => {
        state.ordersLoading = false;
        state.error = action.payload;
      })
      .addCase(updateOrderStatus.fulfilled, (state, action) => {
        const index = state.orders.findIndex((order) => order.orderNumber === action.payload.orderNumber);
        if (index !== -1) {
          state.orders[index] = action.payload;
        }
      })
      .addCase(fetchInventory.pending, (state) => {
        state.inventoryLoading = true;
        state.error = null;
      })
      .addCase(fetchInventory.fulfilled, (state, action) => {
        state.inventoryLoading = false;
        state.inventory = action.payload.content;
        state.inventoryTotalPages = action.payload.totalPages;
        state.inventoryCurrentPage = action.payload.number;
      })
      .addCase(fetchInventory.rejected, (state, action) => {
        state.inventoryLoading = false;
        state.error = action.payload;
      })
      .addCase(updateStock.fulfilled, (state, action) => {
        const index = state.inventory.findIndex((item) => item.id === action.payload.id);
        if (index !== -1) {
          state.inventory[index] = action.payload;
        }
      })
      .addCase(fetchAdminCoupons.pending, (state) => {
        state.couponsLoading = true;
        state.error = null;
      })
      .addCase(fetchAdminCoupons.fulfilled, (state, action) => {
        state.couponsLoading = false;
        state.coupons = action.payload;
      })
      .addCase(fetchAdminCoupons.rejected, (state, action) => {
        state.couponsLoading = false;
        state.error = action.payload;
      })
      .addCase(createCoupon.fulfilled, (state, action) => {
        state.coupons.unshift(action.payload);
      })
      .addCase(updateCoupon.fulfilled, (state, action) => {
        const index = state.coupons.findIndex((coupon) => coupon.id === action.payload.id);
        if (index !== -1) {
          state.coupons[index] = action.payload;
        }
      })
      .addCase(deleteCoupon.fulfilled, (state, action) => {
        state.coupons = state.coupons.filter((coupon) => coupon.id !== action.payload);
      });
  },
});

export const { clearError, clearCurrentCustomer } = adminSlice.actions;
export default adminSlice.reducer;
