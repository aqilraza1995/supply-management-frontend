import { useState } from 'react';

export const useTableSort = (initialOrderBy = '', initialOrder = 'asc') => {
  const [order, setOrder] = useState(initialOrder); // 'asc' | 'desc'
  const [orderBy, setOrderBy] = useState(initialOrderBy);

  const handleRequestSort = (property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const sortItems = (items = []) => {
    if (!orderBy) return items;

    return [...items].sort((a, b) => {
      let valA = a[orderBy];
      let valB = b[orderBy];

      if (valA === undefined || valA === null) valA = '';
      if (valB === undefined || valB === null) valB = '';

      // Numeric comparison
      if (typeof valA === 'number' && typeof valB === 'number') {
        return order === 'asc' ? valA - valB : valB - valA;
      }

      // Date string comparison
      const isDateA = !isNaN(Date.parse(valA)) && isNaN(valA);
      const isDateB = !isNaN(Date.parse(valB)) && isNaN(valB);
      if (isDateA && isDateB) {
        const timeA = new Date(valA).getTime();
        const timeB = new Date(valB).getTime();
        return order === 'asc' ? timeA - timeB : timeB - timeA;
      }

      // String comparison
      const strA = String(valA).toLowerCase();
      const strB = String(valB).toLowerCase();
      if (strA < strB) return order === 'asc' ? -1 : 1;
      if (strA > strB) return order === 'asc' ? 1 : -1;
      return 0;
    });
  };

  return {
    order,
    orderBy,
    handleRequestSort,
    sortItems,
    setOrder,
    setOrderBy,
  };
};

export default useTableSort;
