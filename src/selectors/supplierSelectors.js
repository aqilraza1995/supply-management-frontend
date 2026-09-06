import { createSelector } from '@reduxjs/toolkit';
import { enrichSuppliersWithMetrics } from '../utils/calculations';
import { computeSupplierLedger } from '../utils/fifoPayment';

export const selectSuppliersState = (state) => state.suppliers.items;
export const selectSuppliesState = (state) => state.supplies.items;
export const selectPaymentsState = (state) => state.payments.items;

/**
 * Returns all suppliers enriched with totals, paid, remaining, and last supply date
 */
export const selectEnrichedSuppliers = createSelector(
  [selectSuppliersState, selectSuppliesState, selectPaymentsState],
  (suppliers, supplies, payments) => {
    return enrichSuppliersWithMetrics(suppliers, supplies, payments);
  }
);

/**
 * Returns only suppliers with remaining amount > 0 (for Remaining Amount card link)
 */
export const selectSuppliersWithRemainingAmount = createSelector(
  [selectEnrichedSuppliers],
  (enrichedSuppliers) => enrichedSuppliers.filter((s) => s.remainingAmount > 0)
);

/**
 * Factory selector or curried function to select supplier by ID
 */
export const selectSupplierById = (supplierId) =>
  createSelector([selectSuppliersState], (suppliers) =>
    suppliers.find((s) => String(s.id) === String(supplierId))
  );

/**
 * Full details and historical ledger for a specific supplier
 */
export const selectSupplierFullHistory = (supplierId) =>
  createSelector(
    [selectSuppliersState, selectSuppliesState, selectPaymentsState],
    (suppliers, supplies, payments) => {
      const supplier = suppliers.find((s) => String(s.id) === String(supplierId));
      if (!supplier) return null;

      const supplierSupplies = supplies.filter((s) => String(s.supplierId) === String(supplierId));
      const supplierPayments = payments.filter((p) => String(p.supplierId) === String(supplierId));

      const ledger = computeSupplierLedger(supplierSupplies, supplierPayments);

      return {
        supplier,
        ...ledger,
      };
    }
  );
