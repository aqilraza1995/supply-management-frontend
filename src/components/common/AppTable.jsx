import React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableSortLabel from '@mui/material/TableSortLabel';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import EmptyState from './EmptyState';
import ResponsiveTable from './ResponsiveTable';

export const AppTable = ({
  columns = [],
  rows = [],
  orderBy,
  order = 'asc',
  onSort,
  keyField = 'id',
  loading = false,
  emptyTitle,
  emptyDescription,
  emptyActionLabel,
  onEmptyAction,
  sx,
}) => {
  return (
    <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid #E2E8F0', borderRadius: 2, ...sx }}>
      <ResponsiveTable>
        <Table sx={{ minWidth: 650 }} aria-label="customized table">
          <TableHead>
            <TableRow>
              {columns.map((column) => {
                const isSortable = column.sortable !== false && Boolean(onSort);
                const isSorted = orderBy === column.id;

                return (
                  <TableCell
                    key={column.id}
                    align={column.align || (column.numeric ? 'right' : 'left')}
                    sx={{
                      minWidth: column.minWidth,
                      width: column.width,
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {isSortable ? (
                      <TableSortLabel
                        active={isSorted}
                        direction={isSorted ? order : 'asc'}
                        onClick={() => onSort(column.id)}
                      >
                        {column.label}
                      </TableSortLabel>
                    ) : (
                      column.label
                    )}
                  </TableCell>
                );
              })}
            </TableRow>
          </TableHead>

          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={columns.length} align="center" sx={{ py: 6 }}>
                  <CircularProgress size={32} />
                </TableCell>
              </TableRow>
            ) : rows.length === 0 ? (
              <TableRow>
                <TableCell colSpan={columns.length} sx={{ p: 0 }}>
                  <EmptyState
                    title={emptyTitle}
                    description={emptyDescription}
                    actionLabel={emptyActionLabel}
                    onAction={onEmptyAction}
                  />
                </TableCell>
              </TableRow>
            ) : (
              rows.map((row, index) => (
                <TableRow
                  hover
                  key={row[keyField] || index}
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                  {columns.map((column) => (
                    <TableCell
                      key={column.id}
                      align={column.align || (column.numeric ? 'right' : 'left')}
                      sx={{ whiteSpace: column.wrap ? 'normal' : 'nowrap' }}
                    >
                      {column.render ? column.render(row, index) : row[column.id] ?? '-'}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </ResponsiveTable>
    </TableContainer>
  );
};

export default AppTable;
