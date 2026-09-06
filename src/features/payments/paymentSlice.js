import { createSlice } from '@reduxjs/toolkit';
import { INITIAL_PAYMENTS } from './initialPayments';

const initialState = {
  items: INITIAL_PAYMENTS,
};

const paymentSlice = createSlice({
  name: 'payments',
  initialState,
  reducers: {
    addPayment: (state, action) => {
      const now = new Date().toISOString();
      const newPayment = {
        id: `pmt-rec-${Date.now()}`,
        supplierId: action.payload.supplierId,
        amount: Number(action.payload.amount) || 0,
        paymentDate: action.payload.paymentDate,
        paymentMethod: action.payload.paymentMethod || 'Bank Transfer / NEFT / RTGS',
        notes: action.payload.notes?.trim() || '',
        allocations: action.payload.allocations || [],
        createdAt: now,
      };
      state.items.unshift(newPayment);
    },
  },
});

export const { addPayment } = paymentSlice.actions;

export const selectAllPayments = (state) => state.payments.items;

export default paymentSlice.reducer;
