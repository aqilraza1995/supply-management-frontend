/**
 * Date Utility Functions
 */

/**
 * Returns today's date formatted as YYYY-MM-DD for HTML input fields
 * @returns {string}
 */
export const getTodayDateString = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

/**
 * Checks if a given date string or timestamp is today (local time)
 * @param {string|Date} dateInput
 * @returns {boolean}
 */
export const isToday = (dateInput) => {
  if (!dateInput) return false;
  try {
    const target = new Date(dateInput);
    if (isNaN(target.getTime())) return false;
    const today = new Date();
    return (
      target.getFullYear() === today.getFullYear() &&
      target.getMonth() === today.getMonth() &&
      target.getDate() === today.getDate()
    );
  } catch {
    return false;
  }
};

/**
 * Compare two dates for sorting (ascending: oldest first)
 */
export const compareDatesAsc = (a, b) => {
  const dateA = new Date(a).getTime() || 0;
  const dateB = new Date(b).getTime() || 0;
  return dateA - dateB;
};

/**
 * Compare two dates for sorting (descending: newest first)
 */
export const compareDatesDesc = (a, b) => {
  const dateA = new Date(a).getTime() || 0;
  const dateB = new Date(b).getTime() || 0;
  return dateB - dateA;
};
