import { createSelector } from '@reduxjs/toolkit';
import { enrichSuppliesWithSupplierAndStatus } from '../utils/calculations';
import { isToday } from '../utils/dateUtils';
import { selectSuppliersState, selectSuppliesState, selectPaymentsState } from './supplierSelectors';

/**
 * Returns all supplies enriched with supplier name, paid amount, and remaining balance
 */
export const selectEnrichedSupplies = createSelector(
  [selectSuppliesState, selectSuppliersState, selectPaymentsState],
  (supplies, suppliers, payments) => {
    return enrichSuppliesWithSupplierAndStatus(supplies, suppliers, payments);
  }
);

/**
 * Returns supplies delivered today
 */
export const selectTodaySupplies = createSelector(
  [selectEnrichedSupplies],
  (enrichedSupplies) => enrichedSupplies.filter((s) => isToday(s.supplyDate))
);
