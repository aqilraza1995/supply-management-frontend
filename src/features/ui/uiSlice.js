import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  snackbar: {
    open: false,
    message: '',
    severity: 'success', // 'success' | 'error' | 'warning' | 'info'
  },
  mobileDrawerOpen: false,
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    showSnackbar: (state, action) => {
      state.snackbar = {
        open: true,
        message: action.payload.message,
        severity: action.payload.severity || 'success',
      };
    },
    closeSnackbar: (state) => {
      state.snackbar.open = false;
    },
    setMobileDrawerOpen: (state, action) => {
      state.mobileDrawerOpen = action.payload;
    },
    toggleMobileDrawer: (state) => {
      state.mobileDrawerOpen = !state.mobileDrawerOpen;
    },
  },
});

export const { showSnackbar, closeSnackbar, setMobileDrawerOpen, toggleMobileDrawer } = uiSlice.actions;

export const selectSnackbar = (state) => state.ui.snackbar;
export const selectMobileDrawerOpen = (state) => state.ui.mobileDrawerOpen;

export default uiSlice.reducer;
