/**
 * Business Calculation Utilities
 */
import { isToday } from './dateUtils';
import { computeSupplierLedger } from './fifoPayment';

/**
 * Calculates all aggregated metrics for the enterprise dashboard dynamically
 * @param {Array} suppliers 
 * @param {Array} supplies 
 * @param {Array} payments 
 * @returns {Object}
 */
export const calculateDashboardStats = (suppliers = [], supplies = [], payments = []) => {
  const totalSuppliers = suppliers.length;

  // Total Today's Supply count
  const todaySupplies = supplies.filter((s) => isToday(s.supplyDate));
  const todaySupplyCount = todaySupplies.length;
  const todaySupplyAmount = todaySupplies.reduce((sum, s) => sum + (Number(s.totalAmount) || 0), 0);

  // Total Supply amount across all supplies
  const totalSupplyAmount = supplies.reduce((sum, s) => sum + (Number(s.totalAmount) || 0), 0);

  // Total Paid across all payments
  const totalPaidAmount = payments.reduce((sum, p) => sum + (Number(p.amount) || 0), 0);

  // Remaining total amount (must equal sum of all suppliers' remaining amounts)
  let totalRemainingAmount = 0;
  let suppliersWithRemainingCount = 0;
  let suppliersFullyClearedCount = 0;

  suppliers.forEach((supplier) => {
    const supplierSupplies = supplies.filter((s) => s.supplierId === supplier.id);
    const supplierPayments = payments.filter((p) => p.supplierId === supplier.id);
    const ledger = computeSupplierLedger(supplierSupplies, supplierPayments);
    
    if (ledger.totalRemaining > 0) {
      totalRemainingAmount += ledger.totalRemaining;
      suppliersWithRemainingCount += 1;
    } else if (supplierSupplies.length > 0) {
      suppliersFullyClearedCount += 1;
    }
  });

  const clearanceRate = totalSupplyAmount > 0 
    ? Math.min(100, Math.round((totalPaidAmount / totalSupplyAmount) * 100))
    : 100;

  return {
    totalSuppliers,
    totalRemainingAmount,
    todaySupplyCount,
    todaySupplyAmount,
    totalSupplyAmount,
    totalPaidAmount,
    clearanceRate,
    suppliersWithRemainingCount,
    suppliersFullyClearedCount,
  };
};

/**
 * Returns supplier list enriched with all calculated metrics
 */
export const enrichSuppliersWithMetrics = (suppliers = [], supplies = [], payments = []) => {
  return suppliers.map((supplier) => {
    const supplierSupplies = supplies.filter((s) => s.supplierId === supplier.id);
    const supplierPayments = payments.filter((p) => p.supplierId === supplier.id);
    const ledger = computeSupplierLedger(supplierSupplies, supplierPayments);

    // Find last supply date
    const sortedSupplies = [...supplierSupplies].sort(
      (a, b) => new Date(b.supplyDate).getTime() - new Date(a.supplyDate).getTime()
    );
    const lastSupplyDate = sortedSupplies[0]?.supplyDate || null;

    return {
      ...supplier,
      totalSupplyCount: supplierSupplies.length,
      totalSupplyQuantity: ledger.totalQuantity,
      totalSupplyAmount: ledger.totalSupplied,
      totalPaid: ledger.totalPaid,
      remainingAmount: ledger.totalRemaining,
      lastSupplyDate,
      hasRemaining: ledger.totalRemaining > 0,
    };
  });
};

/**
 * Returns supplies enriched with supplier name and paid/remaining status
 */
export const enrichSuppliesWithSupplierAndStatus = (supplies = [], suppliers = [], payments = []) => {
  const supplierMap = new Map(suppliers.map((s) => [s.id, s.name]));

  // Calculate remaining balances per supplier
  const supplierLedgerMap = new Map();
  suppliers.forEach((sup) => {
    const supSupplies = supplies.filter((s) => s.supplierId === sup.id);
    const supPayments = payments.filter((p) => p.supplierId === sup.id);
    const ledger = computeSupplierLedger(supSupplies, supPayments);
    ledger.suppliesWithStatus.forEach((s) => {
      supplierLedgerMap.set(s.id, {
        paidAmount: s.paidAmount,
        remainingAmount: s.remainingAmount,
        status: s.status,
      });
    });
  });

  return supplies.map((supply) => {
    const statusData = supplierLedgerMap.get(supply.id) || {
      paidAmount: 0,
      remainingAmount: Number(supply.totalAmount) || 0,
      status: 'UNPAID',
    };

    return {
      ...supply,
      supplierName: supplierMap.get(supply.supplierId) || 'Unknown Supplier',
      paidAmount: statusData.paidAmount,
      remainingAmount: statusData.remainingAmount,
      status: statusData.status,
    };
  });
};

/**
 * Returns payments enriched with supplier name
 */
export const enrichPaymentsWithSupplier = (payments = [], suppliers = []) => {
  const supplierMap = new Map(suppliers.map((s) => [s.id, s.name]));

  return payments.map((payment) => ({
    ...payment,
    supplierName: supplierMap.get(payment.supplierId) || 'Unknown Supplier',
  }));
};
