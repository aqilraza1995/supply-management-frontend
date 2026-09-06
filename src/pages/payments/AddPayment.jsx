import React, { useState, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';
import Table from '@mui/material/Table';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import TableBody from '@mui/material/TableBody';

// Icons
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SaveIcon from '@mui/icons-material/Save';
import CheckCircleOutlinedIcon from '@mui/icons-material/CheckCircleOutlined';

import { useSuppliers } from '../../hooks/useSuppliers';
import { usePayments } from '../../hooks/usePayments';
import { useSnackbar } from '../../hooks/useSnackbar';
import { getTodayDateString } from '../../utils/dateUtils';
import { formatCurrency, formatDate } from '../../utils/formatters';
import {
  ROUTES,
  PAYMENT_METHODS,
  CURRENCY,
} from '../../constants/appConstants';

import PageHeader from '../../components/common/PageHeader';
import AppCard from '../../components/common/AppCard';
import AppTextField from '../../components/common/AppTextField';
import AppNumberField from '../../components/common/AppNumberField';
import AppAutocomplete from '../../components/common/AppAutocomplete';
import AppDatePicker from '../../components/common/AppDatePicker';
import AppButton from '../../components/common/AppButton';
import ResponsiveTable from '../../components/common/ResponsiveTable';

export const AddPayment = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const preselectedSupplierId = searchParams.get('supplierId');

  const { enrichedSuppliers } = useSuppliers();
  const { addPayment, getSupplierSummary, calculatePaymentPreview } = usePayments();
  const { notifySuccess, notifyError } = useSnackbar();

  // Find preselected supplier if query param passed
  const initialSupplier = useMemo(() => {
    if (!preselectedSupplierId) return null;
    return enrichedSuppliers.find((s) => String(s.id) === String(preselectedSupplierId)) || null;
  }, [preselectedSupplierId, enrichedSuppliers]);

  // Form State
  const [selectedSupplier, setSelectedSupplier] = useState(initialSupplier);
  const [amount, setAmount] = useState('');
  const [paymentDate, setPaymentDate] = useState(getTodayDateString());
  const [paymentMethod, setPaymentMethod] = useState(PAYMENT_METHODS[0]);
  const [notes, setNotes] = useState('');

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Supplier live summary and outstanding breakdown
  const supplierSummary = useMemo(() => {
    if (!selectedSupplier) return null;
    return getSupplierSummary(selectedSupplier.id);
  }, [selectedSupplier, getSupplierSummary]);

  // Real-time FIFO allocation preview as user types amount
  const fifoPreview = useMemo(() => {
    if (!selectedSupplier || !amount || Number(amount) <= 0) return null;
    return calculatePaymentPreview(selectedSupplier.id, Number(amount));
  }, [selectedSupplier, amount, calculatePaymentPreview]);

  const validate = () => {
    const errs = {};

    if (!selectedSupplier) {
      errs.supplier = 'Please select a supplier';
    }

    const numAmount = Number(amount);
    if (!amount || isNaN(numAmount) || numAmount <= 0) {
      errs.amount = 'Payment amount must be greater than 0';
    } else if (supplierSummary && numAmount > supplierSummary.totalOutstanding) {
      errs.amount = `Payment amount cannot exceed total outstanding balance of ${formatCurrency(
        supplierSummary.totalOutstanding
      )}`;
    }

    if (!paymentDate) {
      errs.paymentDate = 'Payment date is required';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);

    try {
      const calculation = calculatePaymentPreview(selectedSupplier.id, Number(amount));

      addPayment({
        supplierId: selectedSupplier.id,
        amount: Number(amount),
        paymentDate,
        paymentMethod,
        notes: notes.trim(),
        allocations: calculation.allocations,
      });

      notifySuccess(
        `Payment of ${formatCurrency(amount)} recorded for ${selectedSupplier.name} via FIFO!`
      );
      navigate(ROUTES.PAYMENTS);
    } catch {
      notifyError('Failed to record payment. Please check your inputs.');
      setIsSubmitting(false);
    }
  };

  const handlePayFullOutstanding = () => {
    if (supplierSummary && supplierSummary.totalOutstanding > 0) {
      setAmount(String(supplierSummary.totalOutstanding));
      if (errors.amount) setErrors((prev) => ({ ...prev, amount: null }));
    }
  };

  return (
    <Box>
      <PageHeader
        title="Receive Payment"
        subtitle="Record payment and automatically settle oldest invoices via FIFO"
        breadcrumbs={[
          { label: 'Dashboard', path: ROUTES.DASHBOARD },
          { label: 'Payments', path: ROUTES.PAYMENTS },
          { label: 'Receive Payment' },
        ]}
        action={
          <Button
            variant="outlined"
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate(ROUTES.PAYMENTS)}
          >
            Back to Payments
          </Button>
        }
      />

      <Box sx={{ maxWidth: 900, mx: 'auto' }}>
        <AppCard
          title="Payment Settlement Entry"
          subheader="FIFO rule: Oldest unpaid supply records are credited first until full amount is adjusted"
        >
          <Box component="form" onSubmit={handleSubmit} noValidate>
            <Grid container spacing={3}>
              {/* Supplier Selection Autocomplete */}
              <Grid size={{ xs: 12 }}>
                <AppAutocomplete
                  options={enrichedSuppliers}
                  value={selectedSupplier}
                  onChange={(val) => {
                    setSelectedSupplier(val);
                    setAmount('');
                    if (errors.supplier) setErrors((prev) => ({ ...prev, supplier: null }));
                  }}
                  getOptionLabel={(opt) => (opt ? opt.name : '')}
                  label="Select Supplier to Receive Payment"
                  placeholder="Type to search suppliers..."
                  required
                  error={errors.supplier}
                  renderCustomOption={(option) => (
                    <Box sx={{ py: 0.5, width: '100%' }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography variant="body2" sx={{ fontWeight: 700 }}>
                          {option.name}
                        </Typography>
                        <Typography
                          variant="caption"
                          sx={{
                            color: option.remainingAmount > 0 ? 'warning.dark' : 'success.main',
                            fontWeight: 700,
                          }}
                        >
                          Outstanding: {formatCurrency(option.remainingAmount)}
                        </Typography>
                      </Box>
                    </Box>
                  )}
                />
              </Grid>

              {/* Outstanding & Last Supply Information Banner (Required by Section 10) */}
              {selectedSupplier && supplierSummary && (
                <Grid size={{ xs: 12 }}>
                  <Box
                    sx={{
                      p: 2.5,
                      borderRadius: 2.5,
                      bgcolor: '#F8FAFC',
                      border: '1px solid #E2E8F0',
                    }}
                  >
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                      <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#0F172A', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                        Supplier Financial Overview
                      </Typography>
                      {supplierSummary.totalOutstanding > 0 ? (
                        <Button
                          size="small"
                          variant="outlined"
                          color="warning"
                          onClick={handlePayFullOutstanding}
                          sx={{ fontWeight: 700, fontSize: '0.75rem' }}
                        >
                          Pay Full Due ({formatCurrency(supplierSummary.totalOutstanding)})
                        </Button>
                      ) : (
                        <Chip
                          label="No Dues Pending"
                          color="success"
                          size="small"
                          icon={<CheckCircleOutlinedIcon />}
                        />
                      )}
                    </Box>

                    <Grid container spacing={2}>
                      <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                        <Typography variant="caption" color="text.secondary">
                          Last Supply
                        </Typography>
                        <Typography variant="body2" sx={{ fontWeight: 700 }}>
                          {supplierSummary.lastSupply
                            ? `${supplierSummary.lastSupply.quantity} ${supplierSummary.lastSupply.unit} ${supplierSummary.lastSupply.category}`
                            : 'No supplies yet'}
                        </Typography>
                      </Grid>

                      <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                        <Typography variant="caption" color="text.secondary">
                          Last Supply Date
                        </Typography>
                        <Typography variant="body2" sx={{ fontWeight: 700 }}>
                          {supplierSummary.lastSupply
                            ? formatDate(supplierSummary.lastSupply.supplyDate)
                            : '-'}
                        </Typography>
                      </Grid>

                      <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                        <Typography variant="caption" color="text.secondary">
                          Previous Outstanding Dues
                        </Typography>
                        <Typography variant="body2" sx={{ fontWeight: 700, color: '#475569' }}>
                          {formatCurrency(supplierSummary.previousOutstanding)}
                        </Typography>
                      </Grid>

                      <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                        <Typography variant="caption" color="text.secondary">
                          Total Outstanding Dues
                        </Typography>
                        <Typography
                          variant="h6"
                          sx={{
                            fontWeight: 800,
                            color: supplierSummary.totalOutstanding > 0 ? 'warning.dark' : 'success.main',
                          }}
                        >
                          {formatCurrency(supplierSummary.totalOutstanding)}
                        </Typography>
                      </Grid>
                    </Grid>
                  </Box>
                </Grid>
              )}

              {/* Payment Amount */}
              <Grid size={{ xs: 12, sm: 6 }}>
                <AppNumberField
                  label="Receive Payment Amount"
                  value={amount}
                  onChange={(e) => {
                    setAmount(e.target.value);
                    if (errors.amount) setErrors((prev) => ({ ...prev, amount: null }));
                  }}
                  error={errors.amount}
                  required
                  prefix={CURRENCY.symbol}
                  placeholder="e.g. 50000"
                  disabled={!selectedSupplier || (supplierSummary && supplierSummary.totalOutstanding === 0)}
                  helperText={
                    amount
                      ? `Formatted: ${formatCurrency(amount)}`
                      : supplierSummary && supplierSummary.totalOutstanding > 0
                      ? `Max payable: ${formatCurrency(supplierSummary.totalOutstanding)}`
                      : 'Select supplier with outstanding balance'
                  }
                />
              </Grid>

              {/* Payment Date */}
              <Grid size={{ xs: 12, sm: 6 }}>
                <AppDatePicker
                  label="Payment Date"
                  value={paymentDate}
                  onChange={(e) => {
                    setPaymentDate(e.target.value);
                    if (errors.paymentDate) setErrors((prev) => ({ ...prev, paymentDate: null }));
                  }}
                  error={errors.paymentDate}
                  required
                />
              </Grid>

              {/* Payment Method */}
              <Grid size={{ xs: 12, sm: 6 }}>
                <AppTextField
                  select
                  label="Payment Method"
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                >
                  {PAYMENT_METHODS.map((method) => (
                    <MenuItem key={method} value={method}>
                      {method}
                    </MenuItem>
                  ))}
                </AppTextField>
              </Grid>

              {/* Notes */}
              {/* <Grid size={{ xs: 12, sm: 6 }}>
                <AppTextField
                  label="Reference / Cheque No. / Transaction ID"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g. NEFT ref #4892019 cleared via SBI"
                />
              </Grid> */}

              {/* Interactive Live FIFO Breakdown Preview */}
              {fifoPreview && fifoPreview.allocations.length > 0 && (
                <Grid size={{ xs: 12 }}>
                  <Box
                    sx={{
                      p: 2.5,
                      borderRadius: 2.5,
                      bgcolor: '#F0FDF4', // Emerald 50
                      border: '1px solid #BBF7D0',
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1.5 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <CheckCircleOutlinedIcon color="secondary" fontSize="small" />
                        <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#166534' }}>
                          Live FIFO Settlement Preview
                        </Typography>
                      </Box>
                      <Typography variant="caption" sx={{ fontWeight: 700, color: '#15803D' }}>
                        Remaining Due After Payment: {formatCurrency(fifoPreview.totalOutstandingAfter)}
                      </Typography>
                    </Box>

                    <ResponsiveTable>
                      <Table size="small" sx={{ bgcolor: '#FFFFFF', borderRadius: 1.5, overflow: 'hidden' }}>
                        <TableHead>
                          <TableRow>
                            <TableCell>Bill Date</TableCell>
                            <TableCell>Item</TableCell>
                            <TableCell align="right">Invoice Total</TableCell>
                            <TableCell align="right">Due Before</TableCell>
                            <TableCell align="right">FIFO Allocated</TableCell>
                            <TableCell align="right">Due After</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {fifoPreview.allocations.map((alloc) => (
                            <TableRow key={alloc.supplyId}>
                              <TableCell>{formatDate(alloc.supplyDate)}</TableCell>
                              <TableCell sx={{ fontWeight: 600 }}>{alloc.category}</TableCell>
                              <TableCell align="right">{formatCurrency(alloc.totalAmount)}</TableCell>
                              <TableCell align="right">{formatCurrency(alloc.previousBalance)}</TableCell>
                              <TableCell align="right" sx={{ fontWeight: 700, color: 'secondary.main' }}>
                                -{formatCurrency(alloc.amount)}
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
                          ))}
                        </TableBody>
                      </Table>
                    </ResponsiveTable>
                  </Box>
                </Grid>
              )}

              {/* Actions */}
              <Grid size={{ xs: 12 }}>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'flex-end',
                    gap: 1.5,
                    pt: 2,
                    borderTop: '1px solid #E2E8F0',
                  }}
                >
                  <Button
                    variant="text"
                    color="inherit"
                    onClick={() => navigate(ROUTES.PAYMENTS)}
                    disabled={isSubmitting}
                  >
                    Cancel
                  </Button>
                  <AppButton
                    type="submit"
                    variant="contained"
                    color="secondary"
                    loading={isSubmitting}
                    disabled={!selectedSupplier || (supplierSummary && supplierSummary.totalOutstanding === 0)}
                    startIcon={<SaveIcon />}
                  >
                    Confirm & Record Payment
                  </AppButton>
                </Box>
              </Grid>
            </Grid>
          </Box>
        </AppCard>
      </Box>
    </Box>
  );
};

export default AddPayment;
