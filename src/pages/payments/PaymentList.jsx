import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import Chip from '@mui/material/Chip';
import Table from '@mui/material/Table';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import TableBody from '@mui/material/TableBody';

// Icons
import PaymentsIcon from '@mui/icons-material/Payments';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import VisibilityIcon from '@mui/icons-material/Visibility';

import { usePayments } from '../../hooks/usePayments';
import { usePagination } from '../../hooks/usePagination';
import { useTableSort } from '../../hooks/useTableSort';
import { useDebounce } from '../../hooks/useDebounce';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { ROUTES } from '../../constants/appConstants';

import PageHeader from '../../components/common/PageHeader';
import AppCard from '../../components/common/AppCard';
import AppSearch from '../../components/common/AppSearch';
import AppTable from '../../components/common/AppTable';
import AppPagination from '../../components/common/AppPagination';
import AppDialog from '../../components/common/AppDialog';
import ResponsiveTable from '../../components/common/ResponsiveTable';

export const PaymentList = () => {
  const navigate = useNavigate();
  const { enrichedPayments } = usePayments();

  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearch = useDebounce(searchTerm, 250);
  const [selectedPayment, setSelectedPayment] = useState(null);

  const { orderBy, order, handleRequestSort, sortItems } = useTableSort('paymentDate', 'desc');
  const { page, rowsPerPage, handleChangePage, handleChangeRowsPerPage, paginate, resetPage } = usePagination();

  const filteredPayments = useMemo(() => {
    return enrichedPayments.filter((pmt) => {
      if (!debouncedSearch) return true;
      const query = debouncedSearch.toLowerCase().trim();
      const matchesSupplier = pmt.supplierName?.toLowerCase().includes(query);
      const matchesMethod = pmt.paymentMethod?.toLowerCase().includes(query);
      const matchesNotes = pmt.notes?.toLowerCase().includes(query);
      return matchesSupplier || matchesMethod || matchesNotes;
    });
  }, [enrichedPayments, debouncedSearch]);

  const sortedPayments = useMemo(() => {
    return sortItems(filteredPayments);
  }, [filteredPayments, sortItems]);

  const paginatedPayments = useMemo(() => {
    return paginate(sortedPayments);
  }, [sortedPayments, paginate]);

  const columns = [
    {
      id: 'supplierName',
      label: 'Supplier Name',
      sortable: true,
      minWidth: 170,
      render: (row) => (
        <Box>
          <Typography
            variant="body2"
            sx={{
              fontWeight: 700,
              cursor: 'pointer',
              '&:hover': { color: 'primary.main', textDecoration: 'underline' },
            }}
            onClick={() => navigate(`/suppliers/${row.supplierId}`)}
          >
            {row.supplierName}
          </Typography>
          {row.paymentMethod && (
            <Typography variant="caption" color="text.secondary">
              {row.paymentMethod}
            </Typography>
          )}
        </Box>
      ),
    },
    {
      id: 'paymentDate',
      label: 'Payment Date',
      sortable: true,
      minWidth: 120,
      render: (row) => formatDate(row.paymentDate),
    },
    {
      id: 'amount',
      label: 'Payment Amount',
      sortable: true,
      numeric: true,
      minWidth: 140,
      render: (row) => (
        <Typography variant="body2" sx={{ fontWeight: 800, color: 'secondary.main' }}>
          {formatCurrency(row.amount)}
        </Typography>
      ),
    },
    {
      id: 'allocations',
      label: 'FIFO Settlement',
      sortable: false,
      align: 'center',
      minWidth: 160,
      render: (row) => (
        <Button
          size="small"
          variant="outlined"
          color="inherit"
          startIcon={<InfoOutlinedIcon fontSize="small" />}
          onClick={() => setSelectedPayment(row)}
          sx={{
            py: 0.3,
            px: 1.2,
            fontSize: '0.75rem',
            fontWeight: 600,
            borderColor: '#CBD5E1',
          }}
        >
          {row.allocations?.length ? `${row.allocations.length} Bills Settled` : 'Direct'}
        </Button>
      ),
    },
    {
      id: 'actions',
      label: 'Actions',
      sortable: false,
      align: 'center',
      minWidth: 100,
      render: (row) => (
        <Tooltip title="View Supplier History">
          <IconButton
            size="small"
            color="primary"
            onClick={() => navigate(`/suppliers/${row.supplierId}`)}
            aria-label="View Supplier Details"
          >
            <VisibilityIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      ),
    },
  ];

  return (
    <Box>
      <PageHeader
        title="Payment Records"
        subtitle="Track incoming settlements and FIFO allocations against invoices"
        action={
          <Button
            variant="contained"
            color="secondary"
            startIcon={<PaymentsIcon />}
            onClick={() => navigate(ROUTES.PAYMENTS_ADD)}
          >
            Receive Payment
          </Button>
        }
      />

      <AppCard>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            mb: 3,
          }}
        >
          <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
            Payment History Log
          </Typography>

          <AppSearch
            value={searchTerm}
            onChange={(val) => {
              setSearchTerm(val);
              resetPage();
            }}
            placeholder="Search payment by supplier or note..."
            fullWidth={false}
          />
        </Box>

        <AppTable
          columns={columns}
          rows={paginatedPayments}
          orderBy={orderBy}
          order={order}
          onSort={handleRequestSort}
          emptyTitle="No payments found"
          emptyDescription="No payment transactions match your query or none have been recorded."
          emptyActionLabel="Receive New Payment"
          onEmptyAction={() => navigate(ROUTES.PAYMENTS_ADD)}
        />

        <AppPagination
          count={filteredPayments.length}
          page={page}
          rowsPerPage={rowsPerPage}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </AppCard>

      {/* Allocation Breakdown Dialog */}
      {selectedPayment && (
        <AppDialog
          open={Boolean(selectedPayment)}
          onClose={() => setSelectedPayment(null)}
          title={`Settlement Breakdown: ${formatCurrency(selectedPayment.amount)}`}
          maxWidth="md"
        >
          <Box sx={{ mb: 2.5 }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
              Supplier: {selectedPayment.supplierName}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Date: {formatDate(selectedPayment.paymentDate)} • Method: {selectedPayment.paymentMethod || 'Bank Transfer'}
            </Typography>
            {selectedPayment.notes && (
              <Typography variant="body2" sx={{ mt: 0.5, fontStyle: 'italic', color: '#475569' }}>
                Note: "{selectedPayment.notes}"
              </Typography>
            )}
          </Box>

          <ResponsiveTable>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Supply Date</TableCell>
                  <TableCell>Category</TableCell>
                  <TableCell align="right">Previous Due</TableCell>
                  <TableCell align="right">Payment Allocated</TableCell>
                  <TableCell align="right">Remaining Due After</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {selectedPayment.allocations && selectedPayment.allocations.length > 0 ? (
                  selectedPayment.allocations.map((alloc, i) => (
                    <TableRow key={i}>
                      <TableCell>{formatDate(alloc.supplyDate)}</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>{alloc.supplyCategory || 'Supply Item'}</TableCell>
                      <TableCell align="right">{formatCurrency(alloc.previousBalance)}</TableCell>
                      <TableCell align="right" sx={{ fontWeight: 700, color: 'secondary.main' }}>
                        {formatCurrency(alloc.amount)}
                      </TableCell>
                      <TableCell
                        align="right"
                        sx={{
                          fontWeight: 700,
                          color: alloc.remainingBalance === 0 ? 'success.main' : 'warning.dark',
                        }}
                      >
                        {formatCurrency(alloc.remainingBalance)}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} align="center" sx={{ py: 3, color: 'text.secondary' }}>
                      Direct ledger credit
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </ResponsiveTable>

          <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
            <Button onClick={() => setSelectedPayment(null)} variant="contained">
              Done
            </Button>
          </Box>
        </AppDialog>
      )}
    </Box>
  );
};

export default PaymentList;
