import React, { useState, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Chip from '@mui/material/Chip';

// Icons
import AddCircleOutlinedIcon from '@mui/icons-material/AddCircleOutlined';
import VisibilityIcon from '@mui/icons-material/Visibility';
import PaymentsIcon from '@mui/icons-material/Payments';

import { useSupplies } from '../../hooks/useSupplies';
import { usePagination } from '../../hooks/usePagination';
import { useTableSort } from '../../hooks/useTableSort';
import { useDebounce } from '../../hooks/useDebounce';
import { isToday } from '../../utils/dateUtils';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { ROUTES } from '../../constants/appConstants';

import PageHeader from '../../components/common/PageHeader';
import AppCard from '../../components/common/AppCard';
import AppSearch from '../../components/common/AppSearch';
import AppTable from '../../components/common/AppTable';
import AppPagination from '../../components/common/AppPagination';
import StatusChip from '../../components/common/StatusChip';

export const SupplyList = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const filterParam = searchParams.get('filter') || 'all';

  const { enrichedSupplies } = useSupplies();

  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearch = useDebounce(searchTerm, 250);
  const [activeTab, setActiveTab] = useState(filterParam === 'today' ? 'today' : 'all');

  const { orderBy, order, handleRequestSort, sortItems } = useTableSort('supplyDate', 'desc');
  const { page, rowsPerPage, handleChangePage, handleChangeRowsPerPage, paginate, resetPage } = usePagination();

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
    resetPage();
    if (newValue === 'today') {
      setSearchParams({ filter: 'today' });
    } else {
      setSearchParams({});
    }
  };

  const filteredSupplies = useMemo(() => {
    return enrichedSupplies.filter((item) => {
      // Tab filter
      if (activeTab === 'today' && !isToday(item.supplyDate)) {
        return false;
      }
      if (activeTab === 'unpaid' && item.remainingAmount <= 0) {
        return false;
      }
      if (activeTab === 'paid' && item.remainingAmount > 0) {
        return false;
      }

      // Search query
      if (debouncedSearch) {
        const query = debouncedSearch.toLowerCase().trim();
        const matchesSupplier = item.supplierName?.toLowerCase().includes(query);
        const matchesCategory = item.category?.toLowerCase().includes(query);
        const matchesNotes = item.notes?.toLowerCase().includes(query);
        return matchesSupplier || matchesCategory || matchesNotes;
      }

      return true;
    });
  }, [enrichedSupplies, activeTab, debouncedSearch]);

  const sortedSupplies = useMemo(() => {
    return sortItems(filteredSupplies);
  }, [filteredSupplies, sortItems]);

  const paginatedSupplies = useMemo(() => {
    return paginate(sortedSupplies);
  }, [sortedSupplies, paginate]);

  const todayCount = enrichedSupplies.filter((s) => isToday(s.supplyDate)).length;

  const columns = [
    {
      id: 'supplierName',
      label: 'Supplier Name',
      sortable: true,
      minWidth: 170,
      render: (row) => (
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
      ),
    },
    {
      id: 'supplyDate',
      label: 'Supply Date',
      sortable: true,
      minWidth: 120,
      render: (row) => (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8 }}>
          <span>{formatDate(row.supplyDate)}</span>
          {isToday(row.supplyDate) && (
            <Chip
              label="Today"
              size="small"
              color="secondary"
              sx={{ height: 18, fontSize: '0.625rem', fontWeight: 700 }}
            />
          )}
        </Box>
      ),
    },
    // {
    //   id: 'category',
    //   label: 'Category',
    //   sortable: true,
    //   minWidth: 130,
    //   render: (row) => (
    //     <Box>
    //       <Typography variant="body2" sx={{ fontWeight: 600 }}>
    //         {row.category}
    //       </Typography>
    //       {row.notes && (
    //         <Typography variant="caption" color="text.secondary" noWrap sx={{ display: 'block', maxWidth: 180 }}>
    //           {row.notes}
    //         </Typography>
    //       )}
    //     </Box>
    //   ),
    // },
    {
      id: 'quantity',
      label: 'Quantity',
      sortable: true,
      numeric: true,
      minWidth: 100,
      render: (row) => `${row.quantity} ${row.unit || 'KG'}`,
    },
    {
      id: 'totalAmount',
      label: 'Total Amount',
      sortable: true,
      numeric: true,
      minWidth: 120,
      render: (row) => (
        <Typography variant="body2" sx={{ fontWeight: 700 }}>
          {formatCurrency(row.totalAmount)}
        </Typography>
      ),
    },
    {
      id: 'paidAmount',
      label: 'Amount Paid',
      sortable: true,
      numeric: true,
      minWidth: 120,
      render: (row) => (
        <Typography variant="body2" sx={{ fontWeight: 600, color: 'secondary.main' }}>
          {formatCurrency(row.paidAmount)}
        </Typography>
      ),
    },
    {
      id: 'remainingAmount',
      label: 'Remaining',
      sortable: true,
      numeric: true,
      minWidth: 130,
      render: (row) => (
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 1 }}>
          <Typography
            variant="body2"
            sx={{
              fontWeight: 700,
              color: row.remainingAmount > 0 ? 'warning.dark' : 'text.primary',
            }}
          >
            {formatCurrency(row.remainingAmount)}
          </Typography>
          <StatusChip status={row.status} />
        </Box>
      ),
    },
    {
      id: 'actions',
      label: 'Actions',
      sortable: false,
      align: 'center',
      minWidth: 110,
      render: (row) => (
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.5 }}>
          <Tooltip title="View Supplier Ledger">
            <IconButton
              size="small"
              color="primary"
              onClick={() => navigate(`/suppliers/${row.supplierId}`)}
              aria-label="View Supplier Details"
            >
              <VisibilityIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          {row.remainingAmount > 0 && (
            <Tooltip title="Receive Payment for Supplier">
              <IconButton
                size="small"
                color="secondary"
                onClick={() => navigate(`${ROUTES.PAYMENTS_ADD}?supplierId=${row.supplierId}`)}
                aria-label="Make Payment"
              >
                <PaymentsIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          )}
        </Box>
      ),
    },
  ];

  return (
    <Box>
      <PageHeader
        title="Supply Records"
        subtitle="Manage inventory shipments, delivery dates, and supply balances"
        action={
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddCircleOutlinedIcon />}
            onClick={() => navigate(ROUTES.SUPPLIES_ADD)}
          >
            Add Supply
          </Button>
        }
      />

      <AppCard>
        {/* Filters and Search */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            justifyContent: 'space-between',
            alignItems: { xs: 'stretch', md: 'center' },
            gap: 2,
            mb: 3,
          }}
        >
          <Tabs
            value={activeTab}
            onChange={handleTabChange}
            textColor="primary"
            indicatorColor="primary"
            sx={{ borderBottom: 1, borderColor: 'divider', minHeight: 44 }}
          >
            <Tab label="All Supplies" value="all" sx={{ fontWeight: 700 }} />
            <Tab
              label={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8 }}>
                  <span>Today's Supplies</span>
                  <Chip
                    label={todayCount}
                    size="small"
                    color="secondary"
                    sx={{ height: 18, fontSize: '0.6875rem', fontWeight: 700 }}
                  />
                </Box>
              }
              value="today"
              sx={{ fontWeight: 700 }}
            />
            <Tab label="Pending / Unpaid" value="unpaid" sx={{ fontWeight: 700 }} />
            <Tab label="Fully Settled" value="paid" sx={{ fontWeight: 700 }} />
          </Tabs>

          <AppSearch
            value={searchTerm}
            onChange={(val) => {
              setSearchTerm(val);
              resetPage();
            }}
            placeholder="Search supplier, fish, or notes..."
            fullWidth={false}
          />
        </Box>

        {/* Reusable Data Table */}
        <AppTable
          columns={columns}
          rows={paginatedSupplies}
          orderBy={orderBy}
          order={order}
          onSort={handleRequestSort}
          emptyTitle={activeTab === 'today' ? "No supplies received today" : "No supply records found"}
          emptyDescription={
            activeTab === 'today'
              ? "There are no shipments logged for today's date."
              : 'Try clearing your search filters or create a new supply entry.'
          }
          emptyActionLabel="Add New Supply"
          onEmptyAction={() => navigate(ROUTES.SUPPLIES_ADD)}
        />

        {/* Reusable Pagination */}
        <AppPagination
          count={filteredSupplies.length}
          page={page}
          rowsPerPage={rowsPerPage}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </AppCard>
    </Box>
  );
};

export default SupplyList;
