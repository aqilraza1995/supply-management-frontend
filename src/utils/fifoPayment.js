/**
 * FIFO (First-In, First-Out) Payment Settlement Utility
 * 
 * Ensures that whenever a payment is received, it greedily settles
 * the oldest outstanding/unpaid supply records first.
 */

/**
 * Sorts supplies in chronological order (oldest first)
 * @param {Array} supplies 
 * @returns {Array} sorted supplies
 */
export const sortSuppliesOldestFirst = (supplies = []) => {
  return [...supplies].sort((a, b) => {
    const dateComp = new Date(a.supplyDate).getTime() - new Date(b.supplyDate).getTime();
    if (dateComp !== 0) return dateComp;
    const createdComp = new Date(a.createdAt || 0).getTime() - new Date(b.createdAt || 0).getTime();
    if (createdComp !== 0) return createdComp;
    return String(a.id).localeCompare(String(b.id));
  });
};

/**
 * Computes the historical settlement state of all supplies and payments for a given supplier
 * @param {Array} supplies - All supplies for the supplier
 * @param {Array} payments - All payments for the supplier
 * @returns {Object} { suppliesWithStatus, paymentsWithBreakdown, totalSupplied, totalPaid, totalRemaining, totalQuantity }
 */
export const computeSupplierLedger = (supplies = [], payments = []) => {
  const sortedSupplies = sortSuppliesOldestFirst(supplies);
  
  // Sort payments chronologically (oldest first) to replay FIFO history
  const sortedPayments = [...payments].sort((a, b) => {
    const dateComp = new Date(a.paymentDate).getTime() - new Date(b.paymentDate).getTime();
    if (dateComp !== 0) return dateComp;
    return new Date(a.createdAt || 0).getTime() - new Date(b.createdAt || 0).getTime();
  });

  // Track running balance for each supply
  const supplyStateMap = new Map();
  sortedSupplies.forEach((s) => {
    supplyStateMap.set(s.id, {
      ...s,
      paidAmount: 0,
      remainingAmount: Number(s.totalAmount) || 0,
    });
  });

  let runningTotalOutstanding = 0;
  sortedSupplies.forEach((s) => {
    runningTotalOutstanding += Number(s.totalAmount) || 0;
  });

  // Replay each payment against the supplies
  const processedPayments = [];

  sortedPayments.forEach((pmt) => {
    let unallocated = Number(pmt.amount) || 0;
    const previousOutstanding = runningTotalOutstanding;
    const allocations = [];

    // The latest supply at the time of this payment can be tracked,
    // but in general, FIFO settles from the oldest unpaid supply
    const unpaidSupplies = sortedSupplies
      .filter((s) => new Date(s.supplyDate).getTime() <= new Date(pmt.paymentDate).getTime() || true)
      .map((s) => supplyStateMap.get(s.id))
      .filter((s) => s && s.remainingAmount > 0);

    // If payment already stored explicit allocations from when it was created,
    // we use them, or dynamically calculate them:
    if (pmt.allocations && pmt.allocations.length > 0) {
      pmt.allocations.forEach((alloc) => {
        const supplyState = supplyStateMap.get(alloc.supplyId);
        if (supplyState) {
          supplyState.paidAmount += Number(alloc.amount) || 0;
          supplyState.remainingAmount = Math.max(0, supplyState.remainingAmount - (Number(alloc.amount) || 0));
        }
        allocations.push(alloc);
      });
      runningTotalOutstanding = Math.max(0, runningTotalOutstanding - (Number(pmt.amount) || 0));
    } else {
      // Re-allocate dynamically via FIFO
      for (const supplyState of unpaidSupplies) {
        if (unallocated <= 0) break;
        const toPay = Math.min(unallocated, supplyState.remainingAmount);
        const prevBal = supplyState.remainingAmount;
        supplyState.paidAmount += toPay;
        supplyState.remainingAmount -= toPay;
        unallocated -= toPay;

        allocations.push({
          supplyId: supplyState.id,
          supplyCategory: supplyState.category,
          supplyDate: supplyState.supplyDate,
          amount: toPay,
          previousBalance: prevBal,
          remainingBalance: supplyState.remainingAmount,
        });
      }
      runningTotalOutstanding = Math.max(0, runningTotalOutstanding - (Number(pmt.amount) || 0));
    }

    // Determine dues adjusted against previous vs current supply
    // The current/latest supply is the one with the latest date up to this payment
    const lastSupply = sortedSupplies[sortedSupplies.length - 1];
    let adjustedAgainstCurrent = 0;
    let adjustedAgainstPrevious = 0;

    allocations.forEach((alloc) => {
      if (lastSupply && alloc.supplyId === lastSupply.id) {
        adjustedAgainstCurrent += Number(alloc.amount) || 0;
      } else {
        adjustedAgainstPrevious += Number(alloc.amount) || 0;
      }
    });

    processedPayments.push({
      ...pmt,
      previousOutstanding,
      amountAdjusted: Number(pmt.amount) || 0,
      amountAdjustedAgainstPreviousDues: adjustedAgainstPrevious,
      amountAdjustedAgainstCurrentSupply: adjustedAgainstCurrent,
      remainingOutstanding: runningTotalOutstanding,
      allocations,
    });
  });

  // Final supplies list with status
  const suppliesWithStatus = sortedSupplies.map((s) => {
    const state = supplyStateMap.get(s.id);
    const paid = state ? state.paidAmount : 0;
    const remaining = state ? state.remainingAmount : Number(s.totalAmount) || 0;
    let status = 'UNPAID';
    if (remaining === 0) {
      status = 'PAID';
    } else if (paid > 0) {
      status = 'PARTIAL';
    }

    return {
      ...s,
      paidAmount: paid,
      remainingAmount: remaining,
      status,
    };
  });

  const totalSupplied = sortedSupplies.reduce((sum, s) => sum + (Number(s.totalAmount) || 0), 0);
  const totalPaid = sortedPayments.reduce((sum, p) => sum + (Number(p.amount) || 0), 0);
  const totalRemaining = Math.max(0, totalSupplied - totalPaid);
  const totalQuantity = sortedSupplies.reduce((sum, s) => sum + (Number(s.quantity) || 0), 0);

  return {
    suppliesWithStatus,
    paymentsWithBreakdown: processedPayments,
    totalSupplied,
    totalPaid,
    totalRemaining,
    totalQuantity,
  };
};

/**
 * Calculates FIFO allocations for a NEW payment being entered
 * @param {Array} currentSupplies - All supplies for the supplier
 * @param {Array} pastPayments - All existing payments for the supplier
 * @param {number} paymentAmount - Amount being paid now
 * @returns {Object} { allocations, totalOutstandingBefore, totalOutstandingAfter, adjustedAgainstPrevious, adjustedAgainstCurrent }
 */
export const calculateNewPaymentFIFO = (currentSupplies = [], pastPayments = [], paymentAmount = 0) => {
  const numericPayment = Number(paymentAmount) || 0;
  const ledger = computeSupplierLedger(currentSupplies, pastPayments);
  
  const totalOutstandingBefore = ledger.totalRemaining;
  const allocations = [];
  let unallocated = numericPayment;

  // Filter supplies that still have remaining amount > 0, in FIFO order (oldest first)
  const unpaidSupplies = ledger.suppliesWithStatus.filter((s) => s.remainingAmount > 0);
  const latestSupply = currentSupplies.length > 0
    ? [...currentSupplies].sort((a, b) => new Date(b.supplyDate).getTime() - new Date(a.supplyDate).getTime())[0]
    : null;

  let adjustedAgainstPrevious = 0;
  let adjustedAgainstCurrent = 0;

  for (const supply of unpaidSupplies) {
    if (unallocated <= 0) break;
    const toAllocate = Math.min(unallocated, supply.remainingAmount);
    const prevBalance = supply.remainingAmount;
    const newRemaining = prevBalance - toAllocate;

    allocations.push({
      supplyId: supply.id,
      supplyDate: supply.supplyDate,
      category: supply.category,
      quantity: supply.quantity,
      unit: supply.unit,
      totalAmount: supply.totalAmount,
      amount: toAllocate,
      previousBalance: prevBalance,
      remainingBalance: newRemaining,
    });

    if (latestSupply && supply.id === latestSupply.id) {
      adjustedAgainstCurrent += toAllocate;
    } else {
      adjustedAgainstPrevious += toAllocate;
    }

    unallocated -= toAllocate;
  }

  const totalOutstandingAfter = Math.max(0, totalOutstandingBefore - numericPayment);

  return {
    allocations,
    totalAllocated: numericPayment - unallocated,
    unallocated,
    totalOutstandingBefore,
    totalOutstandingAfter,
    adjustedAgainstPrevious,
    adjustedAgainstCurrent,
  };
};

/**
 * Returns latest supply details and outstanding breakdown for Add Payment screen
 * @param {Array} supplierSupplies 
 * @param {Array} supplierPayments 
 * @returns {Object}
 */
export const getSupplierOutstandingSummary = (supplierSupplies = [], supplierPayments = []) => {
  const ledger = computeSupplierLedger(supplierSupplies, supplierPayments);
  const sortedSupplies = [...supplierSupplies].sort(
    (a, b) => new Date(b.supplyDate).getTime() - new Date(a.supplyDate).getTime()
  );

  const lastSupply = sortedSupplies[0] || null;

  // Outstanding on all supplies except the latest supply
  let previousOutstanding = 0;
  if (lastSupply) {
    const priorSupplies = supplierSupplies.filter((s) => s.id !== lastSupply.id);
    const priorPayments = supplierPayments; // rough or calculated via ledger
    // Calculate unpaid on prior supplies:
    ledger.suppliesWithStatus.forEach((s) => {
      if (s.id !== lastSupply.id) {
        previousOutstanding += s.remainingAmount;
      }
    });
  }

  return {
    totalOutstanding: ledger.totalRemaining,
    lastSupply,
    previousOutstanding,
    totalSupplied: ledger.totalSupplied,
    totalPaid: ledger.totalPaid,
    totalQuantity: ledger.totalQuantity,
  };
};
