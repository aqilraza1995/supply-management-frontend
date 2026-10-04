import { createSlice } from '@reduxjs/toolkit';
import { INITIAL_SUPPLIERS } from './initialSuppliers';

const initialState = {
  items: INITIAL_SUPPLIERS,
};

const supplierSlice = createSlice({
  name: 'suppliers',
  initialState,
  reducers: {
    addCompany: (state, action) => {
      const now = new Date().toISOString();
      const newSupplier = {
        id: `sup-${Date.now()}`,
        name: action.payload.name.trim(),
        phone: action.payload.phone?.trim() || '',
        email: action.payload.email?.trim() || '',
        address: action.payload.address?.trim() || '',
        createdAt: now,
        updatedAt: now,
      };
      state.items.unshift(newSupplier);
    },
    updateCompany: (state, action) => {
      const { id, name, phone, email, address } = action.payload;
      const index = state.items.findIndex((s) => s.id === id);
      if (index !== -1) {
        state.items[index] = {
          ...state.items[index],
          name: name ? name.trim() : state.items[index].name,
          phone: phone !== undefined ? phone.trim() : state.items[index].phone,
          email: email !== undefined ? email.trim() : state.items[index].email,
          address: address !== undefined ? address.trim() : state.items[index].address,
          updatedAt: new Date().toISOString(),
        };
      }
    },
    deleteCompany: (state, action) => {
      state.items = state.items.filter((s) => s.id !== action.payload);
    },
  },
});

export const { addCompany, updateCompany, deleteCompany } = supplierSlice.actions;

export const selectAllSuppliers = (state) => state.suppliers.items;

export default supplierSlice.reducer;
