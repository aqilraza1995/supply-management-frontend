import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import LinearProgress from '@mui/material/LinearProgress';

// Icons
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import TodayIcon from '@mui/icons-material/Today';
import AddCircleOutlinedIcon from '@mui/icons-material/AddCircleOutlined';
import PaymentsIcon from '@mui/icons-material/Payments';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

import {
  selectDashboardStats,
  selectRecentSupplies,
  selectRecentPayments,
  selectTopOutstandingSuppliers,
} from '../../selectors/dashboardSelectors';
import { ROUTES } from '../../constants/appConstants';
import { formatCurrency, formatDate } from '../../utils/formatters';

import PageHeader from '../../components/common/PageHeader';
import StatCard from '../../components/common/StatCard';
import AppCard from '../../components/common/AppCard';
import StatusChip from '../../components/common/StatusChip';
import ResponsiveTable from '../../components/common/ResponsiveTable';
import Table from '@mui/material/Table';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import TableBody from '@mui/material/TableBody';

export const Dashboard = () => {
  const navigate = useNavigate();
  const stats = useSelector(selectDashboardStats);
  const recentSupplies = useSelector(selectRecentSupplies);
  const recentPayments = useSelector(selectRecentPayments);
  const topOutstanding = useSelector(selectTopOutstandingSuppliers);

  return (
    <Box>
      <PageHeader
        title="Business Dashboard"
        subtitle="Real-time overview of supplier balances, daily supplies, and FIFO payment settlements"
        action={
          <>
            <Button
              variant="outlined"
              startIcon={<PersonAddIcon />}
              onClick={() => navigate(ROUTES.SUPPLIERS_ADD)}
              sx={{ bgcolor: '#FFFFFF', borderColor: '#CBD5E1', color: '#334155' }}
            >
              Add Supplier
            </Button>
            <Button
              variant="outlined"
              startIcon={<AddCircleOutlinedIcon />}
              onClick={() => navigate(ROUTES.SUPPLIES_ADD)}
              sx={{ bgcolor: '#FFFFFF', borderColor: '#CBD5E1', color: '#334155' }}
            >
              Add Supply
            </Button>
            <Button
              variant="contained"
              color="secondary"
              startIcon={<PaymentsIcon />}
              onClick={() => navigate(ROUTES.PAYMENTS_ADD)}
            >
              Receive Payment
            </Button>
          </>
        }
      />

      {/* 3 Core Clickable Summary Cards required by prompt */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {/* Card 1: Total Suppliers */}
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <StatCard
            title="Total Suppliers"
            value={stats.totalSuppliers}
            subtitle={`${stats.suppliersWithRemainingCount} with pending dues`}
            icon={PeopleAltIcon}
            color="primary"
            onClick={() => navigate(ROUTES.SUPPLIERS)}
            actionText="View all suppliers"
          />
        </Grid>

        {/* Card 2: Total Remaining Amount */}
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <StatCard
            title="Total Remaining Amount"
            value={formatCurrency(stats.totalRemainingAmount)}
            subtitle="Across all pending supplier accounts"
            icon={AccountBalanceWalletIcon}
            color="warning"
            onClick={() => navigate(`${ROUTES.SUPPLIERS}?filter=remaining`)}
            actionText="View suppliers with dues"
          />
        </Grid>

        {/* Card 3: Today's Supply Count */}
        <Grid size={{ xs: 12, sm: 12, md: 4 }}>
          <StatCard
            title="Today's Supply"
            value={stats.todaySupplyCount}
            subtitle={`Valued at ${formatCurrency(stats.todaySupplyAmount)}`}
            icon={TodayIcon}
            color="secondary"
            onClick={() => navigate(`${ROUTES.SUPPLIES}?filter=today`)}
            actionText="View today's supplies"
          />
        </Grid>
      </Grid>

      {/* Financial Health Summary Banner */}
      <AppCard sx={{ mb: 4 }}>
        <Grid container spacing={3} alignItems="center">
          <Grid size={{ xs: 12, md: 4 }}>
            <Box>
              <Typography variant="caption" sx={{ textTransform: 'uppercase', fontWeight: 700, color: 'text.secondary' }}>
                Total Lifetime Supply Volume
              </Typography>
              <Typography variant="h5" sx={{ fontWeight: 800, mt: 0.5 }}>
                {formatCurrency(stats.totalSupplyAmount)}
              </Typography>
            </Box>
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            <Box>
              <Typography variant="caption" sx={{ textTransform: 'uppercase', fontWeight: 700, color: 'text.secondary' }}>
                Total Payments Received
              </Typography>
              <Typography variant="h5" sx={{ fontWeight: 800, mt: 0.5, color: 'secondary.main' }}>
                {formatCurrency(stats.totalPaidAmount)}
              </Typography>
            </Box>
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            <Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.secondary' }}>
                  Settlement Rate
                </Typography>
                <Typography variant="caption" sx={{ fontWeight: 800, color: 'primary.main' }}>
                  {stats.clearanceRate}% Settled
                </Typography>
              </Box>
              <LinearProgress
                variant="determinate"
                value={stats.clearanceRate}
                sx={{ height: 8, borderRadius: 4, bgcolor: '#E2E8F0', '& .MuiLinearProgress-bar': { bgcolor: 'secondary.main' } }}
              />
            </Box>
          </Grid>
        </Grid>
      </AppCard>

      {/* Tables Section: Top Outstanding & Recent Activity */}
      <Grid container spacing={3}>
        {/* Top Suppliers with Outstanding Balances */}
        <Grid size={{ xs: 12, lg: 6 }}>
          <AppCard
            title="Suppliers with Outstanding Balance"
            subheader="Suppliers with remaining dues ordered by amount"
            action={
              <Button
                size="small"
                endIcon={<ArrowForwardIcon fontSize="small" />}
                onClick={() => navigate(`${ROUTES.SUPPLIERS}?filter=remaining`)}
              >
                See all
              </Button>
            }
          >
            <ResponsiveTable>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Supplier</TableCell>
                    <TableCell align="right">Total Supply</TableCell>
                    <TableCell align="right">Remaining Due</TableCell>
                    <TableCell align="center">Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {topOutstanding.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} align="center" sx={{ py: 3, color: 'text.secondary' }}>
                        All supplier accounts are fully settled!
                      </TableCell>
                    </TableRow>
                  ) : (
                    topOutstanding.map((sup) => (
                      <TableRow key={sup.id} hover>
                        <TableCell>
                          <Typography
                            variant="body2"
                            sx={{
                              fontWeight: 700,
                              cursor: 'pointer',
                              '&:hover': { color: 'primary.main', textDecoration: 'underline' },
                            }}
                            onClick={() => navigate(`/suppliers/${sup.id}`)}
                          >
                            {sup.name}
                          </Typography>
                        </TableCell>
                        <TableCell align="right">{formatCurrency(sup.totalSupplyAmount)}</TableCell>
                        <TableCell align="right">
                          <Typography variant="body2" sx={{ fontWeight: 700, color: 'warning.dark' }}>
                            {formatCurrency(sup.remainingAmount)}
                          </Typography>
                        </TableCell>
                        <TableCell align="center">
                          <Button
                            size="small"
                            variant="outlined"
                            color="secondary"
                            sx={{ py: 0.2, px: 1, fontSize: '0.75rem' }}
                            onClick={() => navigate(`${ROUTES.PAYMENTS_ADD}?supplierId=${sup.id}`)}
                          >
                            Pay
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </ResponsiveTable>
          </AppCard>
        </Grid>

        {/* Recent Supplies */}
        <Grid size={{ xs: 12, lg: 6 }}>
          <AppCard
            title="Recent Supplies"
            subheader="Latest shipments and goods received"
            action={
              <Button
                size="small"
                endIcon={<ArrowForwardIcon fontSize="small" />}
                onClick={() => navigate(ROUTES.SUPPLIES)}
              >
                View all
              </Button>
            }
          >
            <ResponsiveTable>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Date</TableCell>
                    <TableCell>Supplier & Category</TableCell>
                    <TableCell align="right">Amount</TableCell>
                    <TableCell align="center">Status</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {recentSupplies.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} align="center" sx={{ py: 3, color: 'text.secondary' }}>
                        No supplies recorded yet.
                      </TableCell>
                    </TableRow>
                  ) : (
                    recentSupplies.map((item) => (
                      <TableRow key={item.id} hover>
                        <TableCell sx={{ color: 'text.secondary', fontSize: '0.8125rem' }}>
                          {formatDate(item.supplyDate)}
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" sx={{ fontWeight: 600 }}>
                            {item.supplierName}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {item.category} ({item.quantity} {item.unit})
                          </Typography>
                        </TableCell>
                        <TableCell align="right" sx={{ fontWeight: 700 }}>
                          {formatCurrency(item.totalAmount)}
                        </TableCell>
                        <TableCell align="center">
                          <StatusChip status={item.status} />
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </ResponsiveTable>
          </AppCard>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;
