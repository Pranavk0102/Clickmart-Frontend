import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../config/api';

const normalizeTicket = (t) => {
  if (!t) return null;
  return {
    ...t,
    customer: t.customerName || t.customer || '',
    email: t.customerEmail || t.email || '',
    displayId: t.ticketNumber || String(t.id || ''),
    status: String(t.status || 'open').toLowerCase().replace(/_/g, '-'),
    priority: String(t.priority || 'medium').toLowerCase(),
  };
};

export const fetchTickets = createAsyncThunk(
  'tickets/fetchTickets',
  async (_, { rejectWithValue, getState }) => {
    try {
      const { auth } = getState();
      const isAdmin = auth.user?.role?.toUpperCase() === 'ADMIN';
      const endpoint = isAdmin ? '/support/tickets' : '/support/tickets/my';
      const response = await api.get(endpoint);
      const data = response.data.data;
      const list = Array.isArray(data) ? data : (data?.content || []);
      return list.map(normalizeTicket).filter(Boolean);
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch tickets');
    }
  }
);

export const createTicket = createAsyncThunk(
  'tickets/createTicket',
  async (ticketData, { rejectWithValue }) => {
    try {
      const response = await api.post('/support/tickets', ticketData);
      return normalizeTicket(response.data.data);
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.response?.data?.error || 'Failed to create ticket');
    }
  }
);

export const respondToTicket = createAsyncThunk(
  'tickets/respondToTicket',
  async ({ ticketId, response, status }, { rejectWithValue }) => {
    try {
      const res = await api.patch(`/support/tickets/${ticketId}/respond`, { response, status });
      return normalizeTicket(res.data.data);
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to respond to ticket');
    }
  }
);

export const updateTicketStatus = createAsyncThunk(
  'tickets/updateTicketStatus',
  async ({ ticketId, status }, { rejectWithValue }) => {
    try {
      const response = await api.patch(`/support/tickets/${ticketId}/respond`, { response: '', status });
      return normalizeTicket(response.data.data);
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update ticket status');
    }
  }
);

const ticketSlice = createSlice({
  name: 'tickets',
  initialState: {
    tickets: [],
    currentTicket: null,
    loading: false,
    error: null,
  },
  reducers: {
    clearTicketError: (state) => { state.error = null; },
    setCurrentTicket: (state, action) => { state.currentTicket = action.payload; },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTickets.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchTickets.fulfilled, (state, action) => { state.loading = false; state.tickets = action.payload; })
      .addCase(fetchTickets.rejected, (state, action) => { state.loading = false; state.error = action.payload; })
      .addCase(createTicket.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(createTicket.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload) state.tickets.unshift(action.payload);
      })
      .addCase(createTicket.rejected, (state, action) => { state.loading = false; state.error = action.payload; })
      .addCase(updateTicketStatus.fulfilled, (state, action) => {
        if (!action.payload) return;
        const i = state.tickets.findIndex(t => t.id === action.payload.id);
        if (i !== -1) state.tickets[i] = action.payload;
        if (state.currentTicket?.id === action.payload.id) state.currentTicket = action.payload;
      })
      .addCase(respondToTicket.fulfilled, (state, action) => {
        if (!action.payload) return;
        const i = state.tickets.findIndex(t => t.id === action.payload.id);
        if (i !== -1) state.tickets[i] = action.payload;
        if (state.currentTicket?.id === action.payload.id) state.currentTicket = action.payload;
      });
  },
});

export const { clearTicketError, setCurrentTicket } = ticketSlice.actions;
export default ticketSlice.reducer;
