import React, { useState, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SaveIcon from '@mui/icons-material/Save';

import { useSuppliers } from '../../hooks/useSuppliers';
import { useSupplies } from '../../hooks/useSupplies';
import { useSnackbar } from '../../hooks/useSnackbar';
import { getTodayDateString } from '../../utils/dateUtils';
import { formatCurrency } from '../../utils/formatters';
import {
  ROUTES,
  SUPPLY_CATEGORIES,
  QUANTITY_UNITS,
  CURRENCY,
} from '../../constants/appConstants';

import PageHeader from '../../components/common/PageHeader';
import AppCard from '../../components/common/AppCard';
import AppTextField from '../../components/common/AppTextField';
import AppNumberField from '../../components/common/AppNumberField';
import AppAutocomplete from '../../components/common/AppAutocomplete';
import AppDatePicker from '../../components/common/AppDatePicker';
import AppButton from '../../components/common/AppButton';

export const AddSupply = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const preselectedSupplierId = searchParams.get('supplierId');

  const { enrichedSuppliers } = useSuppliers();
  const { addSupply } = useSupplies();
  const { notifySuccess, notifyError } = useSnackbar();

  // Find preselected supplier if available
  const initialSupplier = useMemo(() => {
    if (!preselectedSupplierId) return null;
    return enrichedSuppliers.find((s) => String(s.id) === String(preselectedSupplierId)) || null;
  }, [preselectedSupplierId, enrichedSuppliers]);

  // Form State
  const [selectedSupplier, setSelectedSupplier] = useState(initialSupplier);
  const [category, setCategory] = useState('');
  const [quantity, setQuantity] = useState('');
  const [unit, setUnit] = useState('KG');
  const [totalAmount, setTotalAmount] = useState('');
  const [supplyDate, setSupplyDate] = useState(getTodayDateString());
  const [notes, setNotes] = useState('');

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validate = () => {
    const errs = {};

    if (!selectedSupplier) {
      errs.supplier = 'Please select a supplier';
    }

    if (!category.trim()) {
      errs.category = 'Supply category is required';
    }

    const numQty = Number(quantity);
    if (!quantity || isNaN(numQty) || numQty <= 0) {
      errs.quantity = 'Quantity must be greater than 0';
    }

    const numAmount = Number(totalAmount);
    if (!totalAmount || isNaN(numAmount) || numAmount <= 0) {
      errs.totalAmount = 'Total amount must be greater than 0';
    }

    if (!supplyDate) {
      errs.supplyDate = 'Supply date is required';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);

    try {
      addSupply({
        supplierId: selectedSupplier.id,
        category: category.trim(),
        quantity: Number(quantity),
        unit,
        totalAmount: Number(totalAmount),
        supplyDate,
        notes: notes.trim(),
      });

      notifySuccess(
        `Supply record for ${selectedSupplier.name} (${category}) created successfully!`
      );
      navigate(ROUTES.SUPPLIES);
    } catch {
      notifyError('Failed to record supply. Please check your inputs.');
      setIsSubmitting(false);
    }
  };

  return (
    <Box>
      <PageHeader
        title="Add Supply"
        subtitle="Log incoming inventory and generate an outstanding bill"
        breadcrumbs={[
          { label: 'Dashboard', path: ROUTES.DASHBOARD },
          { label: 'Supplies', path: ROUTES.SUPPLIES },
          { label: 'Add Supply' },
        ]}
        action={
          <Button
            variant="outlined"
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate(ROUTES.SUPPLIES)}
          >
            Back to Supply List
          </Button>
        }
      />

      <Box sx={{ maxWidth: 800, mx: 'auto' }}>
        <AppCard
          title="Supply Information"
          subheader="All newly added supplies start with ₹0 paid and full total amount as remaining balance"
        >
          <Box component="form" onSubmit={handleSubmit} noValidate>
            <Grid container spacing={2.5}>
              {/* Supplier Selection with MUI Autocomplete */}
              <Grid size={{ xs: 12 }}>
                <AppAutocomplete
                  options={enrichedSuppliers}
                  value={selectedSupplier}
                  onChange={(val) => {
                    setSelectedSupplier(val);
                    if (errors.supplier) setErrors((prev) => ({ ...prev, supplier: null }));
                  }}
                  getOptionLabel={(option) => option ? option.name : ''}
                  label="Select Supplier"
                  placeholder="Type to search suppliers..."
                  required
                  error={errors.supplier}
                  renderCustomOption={(option) => (
                    <Box sx={{ py: 0.5, width: '100%' }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography variant="body2" sx={{ fontWeight: 700 }}>
                          {option.name}
                        </Typography>
                        <Typography variant="caption" sx={{ color: option.remainingAmount > 0 ? 'warning.dark' : 'success.main', fontWeight: 600 }}>
                          Due: {formatCurrency(option.remainingAmount)}
                        </Typography>
                      </Box>
                      {option.address && (
                        <Typography variant="caption" color="text.secondary">
                          {option.address}
                        </Typography>
                      )}
                    </Box>
                  )}
                />
              </Grid>

              {/* Category */}
              <Grid size={{ xs: 12, sm: 6 }}>
                 <AppNumberField
                  label="DR Number"
                  value={quantity}
                  onChange={(e) => {
                    setQuantity(e.target.value);
                    if (errors.quantity) setErrors((prev) => ({ ...prev, quantity: null }));
                  }}
                  error={errors.quantity}
                  required
                  placeholder="e.g. 100"
                />
              </Grid>

              {/* Supply Date */}
              <Grid size={{ xs: 12, sm: 6 }}>
                <AppDatePicker
                  label="Supply Date"
                  value={supplyDate}
                  onChange={(e) => {
                    setSupplyDate(e.target.value);
                    if (errors.supplyDate) setErrors((prev) => ({ ...prev, supplyDate: null }));
                  }}
                  error={errors.supplyDate}
                  required
                />
              </Grid>

              {/* Quantity & Unit */}
              <Grid size={{ xs: 12, sm: 6 }}>
                <AppNumberField
                  label="Quantity"
                  value={quantity}
                  onChange={(e) => {
                    setQuantity(e.target.value);
                    if (errors.quantity) setErrors((prev) => ({ ...prev, quantity: null }));
                  }}
                  error={errors.quantity}
                  required
                  placeholder="e.g. 100"
                />
              </Grid>

              {/* Real-time Summary Card */}
              {selectedSupplier && totalAmount > 0 && (
                <Grid size={{ xs: 12 }}>
                  <Box
                    sx={{
                      p: 2,
                      borderRadius: 2,
                      bgcolor: '#F8FAFC',
                      border: '1px solid #E2E8F0',
                    }}
                  >
                    <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1, color: '#0F172A' }}>
                      Balance Impact Preview:
                    </Typography>
                    <Grid container spacing={2}>
                      <Grid size={{ xs: 4 }}>
                        <Typography variant="caption" color="text.secondary">Current Due:</Typography>
                        <Typography variant="body2" sx={{ fontWeight: 700 }}>
                          {formatCurrency(selectedSupplier.remainingAmount)}
                        </Typography>
                      </Grid>
                      <Grid size={{ xs: 4 }}>
                        <Typography variant="caption" color="text.secondary">New Supply Amount:</Typography>
                        <Typography variant="body2" sx={{ fontWeight: 700, color: 'primary.main' }}>
                          +{formatCurrency(totalAmount)}
                        </Typography>
                      </Grid>
                      <Grid size={{ xs: 4 }}>
                        <Typography variant="caption" color="text.secondary">New Total Due:</Typography>
                        <Typography variant="body2" sx={{ fontWeight: 800, color: 'warning.dark' }}>
                          {formatCurrency((selectedSupplier.remainingAmount || 0) + Number(totalAmount))}
                        </Typography>
                      </Grid>
                    </Grid>
                  </Box>
                </Grid>
              )}

              {/* Form Actions */}
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
                    onClick={() => navigate(ROUTES.SUPPLIES)}
                    disabled={isSubmitting}
                  >
                    Cancel
                  </Button>
                  <AppButton
                    type="submit"
                    variant="contained"
                    color="primary"
                    loading={isSubmitting}
                    startIcon={<SaveIcon />}
                  >
                    Save Supply Record
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

export default AddSupply;
