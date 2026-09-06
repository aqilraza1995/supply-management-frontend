import { createSlice } from '@reduxjs/toolkit';
import { INITIAL_SUPPLIES } from './initialSupplies';

const initialState = {
  items: INITIAL_SUPPLIES,
};

const supplySlice = createSlice({
  name: 'supplies',
  initialState,
  reducers: {
    addSupply: (state, action) => {
      const now = new Date().toISOString();
      const newSupply = {
        id: `sup-rec-${Date.now()}`,
        supplierId: action.payload.supplierId,
        category: action.payload.category.trim(),
        quantity: Number(action.payload.quantity) || 0,
        unit: action.payload.unit || 'KG',
        totalAmount: Number(action.payload.totalAmount) || 0,
        supplyDate: action.payload.supplyDate,
        notes: action.payload.notes?.trim() || '',
        createdAt: now,
      };
      state.items.unshift(newSupply);
    },
  },
});

export const { addSupply } = supplySlice.actions;

export const selectAllSupplies = (state) => state.supplies.items;

export default supplySlice.reducer;
