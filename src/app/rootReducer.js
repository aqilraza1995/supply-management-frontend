import { combineReducers } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import supplierReducer from '../features/suppliers/supplierSlice';
import supplyReducer from '../features/supplies/supplySlice';
import paymentReducer from '../features/payments/paymentSlice';
import uiReducer from '../features/ui/uiSlice';

const rootReducer = combineReducers({
  auth: authReducer,
  suppliers: supplierReducer,
  supplies: supplyReducer,
  payments: paymentReducer,
  ui: uiReducer,
});

export default rootReducer;
