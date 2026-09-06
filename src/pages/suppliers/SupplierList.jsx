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
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import PaymentsIcon from '@mui/icons-material/Payments';

import { useSuppliers } from '../../hooks/useSuppliers';
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
import StatusChip from '../../components/common/StatusChip';

export const SupplierList = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const filterParam = searchParams.get('filter') || 'all';

  const { enrichedSuppliers } = useSuppliers();

  // Search & Filter state
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearch = useDebounce(searchTerm, 250);
  const [activeTab, setActiveTab] = useState(filterParam === 'remaining' ? 'remaining' : 'all');

  // Sorting and pagination hooks
  const { orderBy, order, handleRequestSort, sortItems } = useTableSort('name', 'asc');
  const { page, rowsPerPage, handleChangePage, handleChangeRowsPerPage, paginate, resetPage } = usePagination();

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
    resetPage();
    if (newValue === 'remaining') {
      setSearchParams({ filter: 'remaining' });
    } else {
      setSearchParams({});
    }
  };

  // Filter and search logic
  const filteredSuppliers = useMemo(() => {
    return enrichedSuppliers.filter((supplier) => {
      // Tab filter
      if (activeTab === 'remaining' && supplier.remainingAmount <= 0) {
        return false;
      }
      if (activeTab === 'cleared' && (supplier.remainingAmount > 0 || supplier.totalSupplyCount === 0)) {
        return false;
      }

      // Search term
      if (debouncedSearch) {
        const query = debouncedSearch.toLowerCase().trim();
        const matchesName = supplier.name.toLowerCase().includes(query);
        const matchesPhone = supplier.phone?.toLowerCase().includes(query);
        const matchesAddress = supplier.address?.toLowerCase().includes(query);
        return matchesName || matchesPhone || matchesAddress;
      }

      return true;
    });
  }, [enrichedSuppliers, activeTab, debouncedSearch]);

  const sortedSuppliers = useMemo(() => {
    return sortItems(filteredSuppliers);
  }, [filteredSuppliers, sortItems]);

  const paginatedSuppliers = useMemo(() => {
    return paginate(sortedSuppliers);
  }, [sortedSuppliers, paginate]);

  const columns = [
    {
      id: 'name',
      label: 'Supplier Name',
      sortable: true,
      minWidth: 180,
      render: (row) => (
        <Box>
          <Typography
            variant="body2"
            sx={{
              fontWeight: 700,
              cursor: 'pointer',
              color: 'text.primary',
              '&:hover': { color: 'primary.main', textDecoration: 'underline' },
            }}
            onClick={() => navigate(`/suppliers/${row.id}`)}
          >
            {row.name}
          </Typography>
          {row.phone && (
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
              {row.phone}
            </Typography>
          )}
        </Box>
      ),
    },
    {
      id: 'totalSupplyCount',
      label: 'Total Boxes',
      sortable: true,
      align: 'center',
      minWidth: 110,
      render: (row) => (
        <Chip
          label={`${row.totalSupplyCount} orders`}
          size="small"
          variant="outlined"
          sx={{ fontWeight: 600, borderColor: '#CBD5E1' }}
        />
      ),
    },
    {
      id: 'totalSupplyAmount',
      label: 'Total Amount',
      sortable: true,
      numeric: true,
      minWidth: 130,
      render: (row) => (
        <Typography variant="body2" sx={{ fontWeight: 700 }}>
          {formatCurrency(row.totalSupplyAmount)}
        </Typography>
      ),
    },
    {
      id: 'totalPaid',
      label: 'Total Paid',
      sortable: true,
      numeric: true,
      minWidth: 130,
      render: (row) => (
        <Typography variant="body2" sx={{ fontWeight: 600, color: 'secondary.main' }}>
          {formatCurrency(row.totalPaid)}
        </Typography>
      ),
    },
    {
      id: 'remainingAmount',
      label: 'Remaining Amount',
      sortable: true,
      numeric: true,
      minWidth: 150,
      render: (row) => (
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 1 }}>
          <Typography
            variant="body2"
            sx={{
              fontWeight: 800,
              color: row.remainingAmount > 0 ? 'warning.dark' : 'success.main',
            }}
          >
            {formatCurrency(row.remainingAmount)}
          </Typography>
          <StatusChip status={row.remainingAmount === 0 ? 'PAID' : 'PARTIAL'} />
        </Box>
      ),
    },
    {
      id: 'lastSupplyDate',
      label: 'Last Supply Date',
      sortable: true,
      minWidth: 130,
      render: (row) => formatDate(row.lastSupplyDate),
    },
    {
      id: 'actions',
      label: 'Actions',
      sortable: false,
      align: 'center',
      minWidth: 130,
      render: (row) => (
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.5 }}>
          <Tooltip title="View History & Ledger">
            <IconButton
              size="small"
              color="primary"
              onClick={() => navigate(`/suppliers/${row.id}`)}
              aria-label={`View ${row.name}`}
            >
              <VisibilityIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Edit Supplier">
            <IconButton
              size="small"
              color="default"
              onClick={() => navigate(`/suppliers/${row.id}/edit`)}
              aria-label={`Edit ${row.name}`}
            >
              <EditIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          {row.remainingAmount > 0 && (
            <Tooltip title="Receive Payment">
              <IconButton
                size="small"
                color="secondary"
                onClick={() => navigate(`${ROUTES.PAYMENTS_ADD}?supplierId=${row.id}`)}
                aria-label={`Pay ${row.name}`}
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
        title="Suppliers"
        subtitle="Manage registered suppliers, supply volume, and outstanding credit balances"
        action={
          <Button
            variant="contained"
            color="primary"
            startIcon={<PersonAddIcon />}
            onClick={() => navigate(ROUTES.SUPPLIERS_ADD)}
          >
            Add Supplier
          </Button>
        }
      />

      <AppCard>
        {/* Filters and Search Bar */}
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
            <Tab label="All Suppliers" value="all" sx={{ fontWeight: 700 }} />
            <Tab
              label={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8 }}>
                  <span>With Remaining Dues</span>
                  <Chip
                    label={enrichedSuppliers.filter((s) => s.remainingAmount > 0).length}
                    size="small"
                    color="warning"
                    sx={{ height: 18, fontSize: '0.6875rem' }}
                  />
                </Box>
              }
              value="remaining"
              sx={{ fontWeight: 700 }}
            />
            <Tab label="Fully Settled" value="cleared" sx={{ fontWeight: 700 }} />
          </Tabs>

          <AppSearch
            value={searchTerm}
            onChange={(val) => {
              setSearchTerm(val);
              resetPage();
            }}
            placeholder="Search by supplier name or phone..."
            fullWidth={false}
          />
        </Box>

        {/* Reusable Data Table */}
        <AppTable
          columns={columns}
          rows={paginatedSuppliers}
          orderBy={orderBy}
          order={order}
          onSort={handleRequestSort}
          emptyTitle={activeTab === 'remaining' ? 'No outstanding suppliers' : 'No suppliers found'}
          emptyDescription={
            activeTab === 'remaining'
              ? 'All suppliers have settled their outstanding balances.'
              : 'Try changing your search term or add a new supplier.'
          }
          emptyActionLabel={activeTab === 'all' ? 'Add New Supplier' : undefined}
          onEmptyAction={() => navigate(ROUTES.SUPPLIERS_ADD)}
        />

        {/* Reusable Pagination */}
        <AppPagination
          count={filteredSuppliers.length}
          page={page}
          rowsPerPage={rowsPerPage}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </AppCard>
    </Box>
  );
};

export default SupplierList;
