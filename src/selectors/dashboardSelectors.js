import { createSelector } from '@reduxjs/toolkit';
import { calculateDashboardStats, enrichPaymentsWithSupplier } from '../utils/calculations';
import {
  selectSuppliersState,
  selectSuppliesState,
  selectPaymentsState,
  selectEnrichedSuppliers,
} from './supplierSelectors';
import { selectEnrichedSupplies } from './supplySelectors';

/**
 * Returns dynamic KPI statistics for the dashboard
 */
export const selectDashboardStats = createSelector(
  [selectSuppliersState, selectSuppliesState, selectPaymentsState],
  (suppliers, supplies, payments) => {
    return calculateDashboardStats(suppliers, supplies, payments);
  }
);

/**
 * Returns latest supplies for dashboard activity feed
 */
export const selectRecentSupplies = createSelector(
  [selectEnrichedSupplies],
  (enrichedSupplies) => {
    return [...enrichedSupplies]
      .sort((a, b) => new Date(b.supplyDate).getTime() - new Date(a.supplyDate).getTime())
      .slice(0, 5);
  }
);

/**
 * Returns latest payments with supplier names for dashboard activity feed
 */
export const selectRecentPayments = createSelector(
  [selectPaymentsState, selectSuppliersState],
  (payments, suppliers) => {
    const enriched = enrichPaymentsWithSupplier(payments, suppliers);
    return [...enriched]
      .sort((a, b) => new Date(b.paymentDate).getTime() - new Date(a.paymentDate).getTime())
      .slice(0, 5);
  }
);

/**
 * Returns top suppliers with highest outstanding balance
 */
export const selectTopOutstandingSuppliers = createSelector(
  [selectEnrichedSuppliers],
  (enrichedSuppliers) => {
    return enrichedSuppliers
      .filter((s) => s.remainingAmount > 0)
      .sort((a, b) => b.remainingAmount - a.remainingAmount)
      .slice(0, 5);
  }
);
