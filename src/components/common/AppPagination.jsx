import React from 'react';
import TablePagination from '@mui/material/TablePagination';
import { PAGE_SIZE_OPTIONS } from '../../constants/appConstants';

export const AppPagination = ({
  count = 0,
  page = 0,
  rowsPerPage = 10,
  onPageChange,
  onRowsPerPageChange,
  rowsPerPageOptions = PAGE_SIZE_OPTIONS,
}) => {
  return (
    <TablePagination
      component="div"
      count={count}
      page={page}
      onPageChange={onPageChange}
      rowsPerPage={rowsPerPage}
      onRowsPerPageChange={onRowsPerPageChange}
      rowsPerPageOptions={rowsPerPageOptions}
      labelRowsPerPage="Rows per page:"
      showFirstButton
      showLastButton
      sx={{
        borderTop: '1px solid #E2E8F0',
        '.MuiTablePagination-selectLabel, .MuiTablePagination-displayedRows': {
          fontSize: '0.8125rem',
          color: 'text.secondary',
        },
      }}
    />
  );
};

export default AppPagination;
