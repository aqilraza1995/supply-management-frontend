import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Alert from '@mui/material/Alert';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Table from '@mui/material/Table';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import TableBody from '@mui/material/TableBody';
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';

// Icons
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import EditIcon from '@mui/icons-material/Edit';
import AddCircleOutlinedIcon from '@mui/icons-material/AddCircleOutlined';
import PaymentsIcon from '@mui/icons-material/Payments';
import Inventory2Icon from '@mui/icons-material/Inventory2';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ScaleIcon from '@mui/icons-material/Scale';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';

import { selectSupplierFullHistory } from '../../selectors/supplierSelectors';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { ROUTES } from '../../constants/appConstants';

import PageHeader from '../../components/common/PageHeader';
import AppCard from '../../components/common/AppCard';
import StatCard from '../../components/common/StatCard';
import StatusChip from '../../components/common/StatusChip';
import ResponsiveTable from '../../components/common/ResponsiveTable';
import AppDialog from '../../components/common/AppDialog';

export const SupplierDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const historySelector = selectSupplierFullHistory(id);
  const data = useSelector(historySelector);

  const [activeTab, setActiveTab] = useState(0);
  const [selectedPayment, setSelectedPayment] = useState(null);

  if (!data || !data.supplier) {
    return (
      <Box>
        <PageHeader title="Supplier Not Found" />
        <Alert severity="error" sx={{ mb: 3 }}>
          No supplier found with ID "{id}".
        </Alert>
        <Button variant="contained" onClick={() => navigate(ROUTES.SUPPLIERS)}>
          Back to Supplier List
        </Button>
      </Box>
    );
  }

  const { supplier, suppliesWithStatus, paymentsWithBreakdown, totalSupplied, totalPaid, totalRemaining, totalQuantity } = data;

  return (
    <Box>
      <PageHeader
        title={supplier.name}
        subtitle={
          supplier.address
            ? `${supplier.address} • Contact: ${supplier.phone || 'N/A'}`
            : `Contact: ${supplier.phone || 'N/A'} • Email: ${supplier.email || 'N/A'}`
        }
        breadcrumbs={[
          { label: 'Dashboard', path: ROUTES.DASHBOARD },
          { label: 'Suppliers', path: ROUTES.SUPPLIERS },
          { label: supplier.name },
        ]}
        action={
          <>
            <Button
              variant="outlined"
              startIcon={<ArrowBackIcon />}
              onClick={() => navigate(ROUTES.SUPPLIERS)}
            >
              All Suppliers
            </Button>
            <Button
              variant="outlined"
              startIcon={<EditIcon />}
              onClick={() => navigate(`/suppliers/${supplier.id}/edit`)}
            >
              Edit Details
            </Button>
            <Button
              variant="outlined"
              color="primary"
              startIcon={<AddCircleOutlinedIcon />}
              onClick={() => navigate(`${ROUTES.SUPPLIES_ADD}?supplierId=${supplier.id}`)}
            >
              New Supply
            </Button>
            <Button
              variant="contained"
              color="secondary"
              startIcon={<PaymentsIcon />}
              onClick={() => navigate(`${ROUTES.PAYMENTS_ADD}?supplierId=${supplier.id}`)}
              disabled={totalRemaining <= 0}
            >
              Receive Payment
            </Button>
          </>
        }
      />

      {/* 4 Summary Cards */}
      <Grid container spacing={2.5} sx={{ mb: 3.5 }}>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard
            title="Total Quantity"
            value={`${totalQuantity} KG`}
            subtitle={`Across ${suppliesWithStatus.length} shipments`}
            icon={ScaleIcon}
            color="info"
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard
            title="Total Supply Amount"
            value={formatCurrency(totalSupplied)}
            subtitle="Cumulative goods received"
            icon={Inventory2Icon}
            color="primary"
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard
            title="Total Paid"
            value={formatCurrency(totalPaid)}
            subtitle={`${paymentsWithBreakdown.length} settlements made`}
            icon={CheckCircleIcon}
            color="secondary"
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard
            title="Total Remaining Due"
            value={formatCurrency(totalRemaining)}
            subtitle={totalRemaining === 0 ? 'Account fully settled' : 'Unpaid balance pending'}
            icon={AccountBalanceWalletIcon}
            color={totalRemaining > 0 ? 'warning' : 'secondary'}
          />
        </Grid>
      </Grid>

      {/* Comprehensive History Section */}
      <AppCard>
        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
          <Tabs
            value={activeTab}
            onChange={(e, val) => setActiveTab(val)}
            textColor="primary"
            indicatorColor="primary"
          >
            <Tab
              label={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <span>Supply History</span>
                  <Chip label={suppliesWithStatus.length} size="small" sx={{ height: 20 }} />
                </Box>
              }
              sx={{ fontWeight: 700 }}
            />
            <Tab
              label={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <span>Payment History (FIFO)</span>
                  <Chip label={paymentsWithBreakdown.length} size="small" sx={{ height: 20 }} />
                </Box>
              }
              sx={{ fontWeight: 700 }}
            />
          </Tabs>
        </Box>

        {/* Tab 0: Supply History */}
        {activeTab === 0 && (
          <ResponsiveTable>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Supply Date</TableCell>
                  <TableCell>Category</TableCell>
                  <TableCell align="right">Quantity</TableCell>
                  <TableCell align="right">Total Amount</TableCell>
                  <TableCell align="right">Amount Paid</TableCell>
                  <TableCell align="right">Remaining Amount</TableCell>
                  <TableCell align="center">Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {suppliesWithStatus.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} align="center" sx={{ py: 5, color: 'text.secondary' }}>
                      No supply records recorded for this supplier yet.
                    </TableCell>
                  </TableRow>
                ) : (
                  suppliesWithStatus.map((supply) => (
                    <TableRow key={supply.id} hover>
                      <TableCell sx={{ fontWeight: 600 }}>{formatDate(supply.supplyDate)}</TableCell>
                      <TableCell>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          {supply.category}
                        </Typography>
                        {supply.notes && (
                          <Typography variant="caption" color="text.secondary">
                            {supply.notes}
                          </Typography>
                        )}
                      </TableCell>
                      <TableCell align="right">{`${supply.quantity} ${supply.unit}`}</TableCell>
                      <TableCell align="right" sx={{ fontWeight: 700 }}>
                        {formatCurrency(supply.totalAmount)}
                      </TableCell>
                      <TableCell align="right" sx={{ color: 'secondary.main', fontWeight: 600 }}>
                        {formatCurrency(supply.paidAmount)}
                      </TableCell>
                      <TableCell
                        align="right"
                        sx={{
                          fontWeight: 700,
                          color: supply.remainingAmount > 0 ? 'warning.dark' : 'text.primary',
                        }}
                      >
                        {formatCurrency(supply.remainingAmount)}
                      </TableCell>
                      <TableCell align="center">
                        <StatusChip status={supply.status} />
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </ResponsiveTable>
        )}

        {/* Tab 1: Payment History */}
        {activeTab === 1 && (
          <ResponsiveTable>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Payment Date</TableCell>
                  <TableCell align="right">Payment Amount</TableCell>
                  <TableCell align="right">Adjusted Against Previous Dues</TableCell>
                  <TableCell align="right">Adjusted Against Current Supply</TableCell>
                  <TableCell align="right">Remaining Balance</TableCell>
                  <TableCell align="center">FIFO Breakdown</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paymentsWithBreakdown.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} align="center" sx={{ py: 5, color: 'text.secondary' }}>
                      No payments received for this supplier yet.
                    </TableCell>
                  </TableRow>
                ) : (
                  paymentsWithBreakdown.map((pmt) => (
                    <TableRow key={pmt.id} hover>
                      <TableCell sx={{ fontWeight: 600 }}>
                        {formatDate(pmt.paymentDate)}
                        {pmt.paymentMethod && (
                          <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                            {pmt.paymentMethod}
                          </Typography>
                        )}
                      </TableCell>
                      <TableCell align="right" sx={{ fontWeight: 800, color: 'secondary.main' }}>
                        {formatCurrency(pmt.amount)}
                      </TableCell>
                      <TableCell align="right">
                        <Typography variant="body2" sx={{ fontWeight: 600, color: '#475569' }}>
                          {formatCurrency(pmt.amountAdjustedAgainstPreviousDues)}
                        </Typography>
                      </TableCell>
                      <TableCell align="right">
                        <Typography variant="body2" sx={{ fontWeight: 600, color: '#475569' }}>
                          {formatCurrency(pmt.amountAdjustedAgainstCurrentSupply)}
                        </Typography>
                      </TableCell>
                      <TableCell align="right" sx={{ fontWeight: 700, color: 'warning.dark' }}>
                        {formatCurrency(pmt.remainingOutstanding)}
                      </TableCell>
                      <TableCell align="center">
                        {pmt.allocations && pmt.allocations.length > 0 ? (
                          <Button
                            size="small"
                            variant="outlined"
                            startIcon={<InfoOutlinedIcon fontSize="small" />}
                            onClick={() => setSelectedPayment(pmt)}
                            sx={{ py: 0.2, px: 1, fontSize: '0.75rem' }}
                          >
                            Breakdown
                          </Button>
                        ) : (
                          <Typography variant="caption" color="text.secondary">
                            N/A
                          </Typography>
                        )}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </ResponsiveTable>
        )}
      </AppCard>

      {/* Payment Allocation Details Modal */}
      {selectedPayment && (
        <AppDialog
          open={Boolean(selectedPayment)}
          onClose={() => setSelectedPayment(null)}
          title={`FIFO Allocation Breakdown: ${formatCurrency(selectedPayment.amount)}`}
          maxWidth="md"
        >
          <Box sx={{ mb: 2 }}>
            <Typography variant="body2" color="text.secondary">
              Payment date: <strong>{formatDate(selectedPayment.paymentDate)}</strong> • Method:{' '}
              <strong>{selectedPayment.paymentMethod || 'Direct'}</strong>
            </Typography>
            {selectedPayment.notes && (
              <Typography variant="body2" sx={{ mt: 0.5, fontStyle: 'italic', color: '#475569' }}>
                "{selectedPayment.notes}"
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
                  <TableCell align="right">Amount Allocated</TableCell>
                  <TableCell align="right">Balance After</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {selectedPayment.allocations.map((alloc, idx) => (
                  <TableRow key={idx}>
                    <TableCell>{formatDate(alloc.supplyDate)}</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>{alloc.supplyCategory || 'Supply Item'}</TableCell>
                    <TableCell align="right">{formatCurrency(alloc.previousBalance)}</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 700, color: 'secondary.main' }}>
                      {formatCurrency(alloc.amount)}
                    </TableCell>
                    <TableCell align="right" sx={{ fontWeight: 700, color: alloc.remainingBalance === 0 ? 'success.main' : 'warning.dark' }}>
                      {formatCurrency(alloc.remainingBalance)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </ResponsiveTable>

          <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
            <Button onClick={() => setSelectedPayment(null)} variant="contained">
              Close
            </Button>
          </Box>
        </AppDialog>
      )}
    </Box>
  );
};

export default SupplierDetails;
