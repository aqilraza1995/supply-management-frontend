import { useState } from 'react';
import { DEFAULT_PAGE_SIZE } from '../constants/appConstants';

export const usePagination = (initialPage = 0, initialRowsPerPage = DEFAULT_PAGE_SIZE) => {
  const [page, setPage] = useState(initialPage);
  const [rowsPerPage, setRowsPerPage] = useState(initialRowsPerPage);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const resetPage = () => {
    setPage(0);
  };

  const paginate = (items = []) => {
    const startIndex = page * rowsPerPage;
    return items.slice(startIndex, startIndex + rowsPerPage);
  };

  return {
    page,
    rowsPerPage,
    handleChangePage,
    handleChangeRowsPerPage,
    resetPage,
    paginate,
    setPage,
  };
};

export default usePagination;
