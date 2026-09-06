/**
 * Utility functions for Indian currency, numbers, and dates
 */

/**
 * Formats a number to Indian Currency string (₹ 1,00,000)
 * @param {number|string} amount
 * @param {boolean} includeSymbol
 * @returns {string}
 */
export const formatCurrency = (amount, includeSymbol = true) => {
  const numericAmount = Number(amount) || 0;
  
  // Format to Indian numbering system (e.g., 1,00,000)
  const formattedNumber = new Intl.NumberFormat('en-IN', {
    maximumFractionDigits: 2,
    minimumFractionDigits: 0,
  }).format(numericAmount);

  return includeSymbol ? `₹${formattedNumber}` : formattedNumber;
};

/**
 * Formats number with commas in Indian style
 * @param {number|string} value
 * @returns {string}
 */
export const formatNumber = (value) => {
  const num = Number(value) || 0;
  return new Intl.NumberFormat('en-IN').format(num);
};

/**
 * Formats date into readable Indian business format (e.g., "04 Sep 2026")
 * @param {string|Date} dateInput
 * @returns {string}
 */
export const formatDate = (dateInput) => {
  if (!dateInput) return '-';
  try {
    const date = new Date(dateInput);
    if (isNaN(date.getTime())) return '-';
    
    return new Intl.DateTimeFormat('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    }).format(date);
  } catch {
    return String(dateInput);
  }
};

/**
 * Formats date and time into readable format
 * @param {string|Date} dateInput
 * @returns {string}
 */
export const formatDateTime = (dateInput) => {
  if (!dateInput) return '-';
  try {
    const date = new Date(dateInput);
    if (isNaN(date.getTime())) return '-';
    
    return new Intl.DateTimeFormat('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    }).format(date);
  } catch {
    return String(dateInput);
  }
};
