import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import Alert from '@mui/material/Alert';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SaveIcon from '@mui/icons-material/Save';

import { useSuppliers } from '../../hooks/useSuppliers';
import { useSnackbar } from '../../hooks/useSnackbar';
import { ROUTES } from '../../constants/appConstants';

import PageHeader from '../../components/common/PageHeader';
import AppCard from '../../components/common/AppCard';
import AppTextField from '../../components/common/AppTextField';
import AppButton from '../../components/common/AppButton';

export const EditSupplier = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { suppliers, getSupplierById, updateSupplier } = useSuppliers();
  const { notifySuccess, notifyError } = useSnackbar();

  const supplier = getSupplierById(id);

  const [name, setName] = useState(supplier?.name || '');
  const [phone, setPhone] = useState(supplier?.phone || '');
  const [email, setEmail] = useState(supplier?.email || '');
  const [address, setAddress] = useState(supplier?.address || '');
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!supplier) {
    return (
      <Box>
        <PageHeader title="Supplier Not Found" />
        <Alert severity="error" sx={{ mb: 2 }}>
          Supplier with ID "{id}" could not be found in the database.
        </Alert>
        <Button variant="contained" onClick={() => navigate(ROUTES.SUPPLIERS)}>
          Return to Supplier List
        </Button>
      </Box>
    );
  }

  const validate = () => {
    const errs = {};
    const trimmedName = name.trim();

    if (!trimmedName) {
      errs.name = 'Supplier Name is required';
    } else {
      // Check for duplicate name excluding the current supplier itself
      const duplicate = suppliers.some(
        (s) => s.id !== id && s.name.toLowerCase() === trimmedName.toLowerCase()
      );
      if (duplicate) {
        errs.name = 'Another supplier with this name already exists';
      }
    }

    if (email.trim() && !/\S+@\S+\.\S+/.test(email)) {
      errs.email = 'Please enter a valid email address';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);

    try {
      updateSupplier({
        id,
        name,
        phone,
        email,
        address,
      });

      notifySuccess(`Supplier "${name.trim()}" updated successfully!`);
      navigate(ROUTES.SUPPLIERS);
    } catch {
      notifyError('Failed to update supplier.');
      setIsSubmitting(false);
    }
  };

  return (
    <Box>
      <PageHeader
        title={`Edit: ${supplier.name}`}
        subtitle="Modify supplier contact information and details"
        breadcrumbs={[
          { label: 'Dashboard', path: ROUTES.DASHBOARD },
          { label: 'Suppliers', path: ROUTES.SUPPLIERS },
          { label: 'Edit Supplier' },
        ]}
        action={
          <Button
            variant="outlined"
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate(ROUTES.SUPPLIERS)}
          >
            Cancel
          </Button>
        }
      />

      <Box sx={{ maxWidth: 700, mx: 'auto' }}>
        <AppCard
          title="Update Supplier Details"
          subheader="Edit the supplier business information"
        >
          <Box component="form" onSubmit={handleSubmit} noValidate>
            <Grid container spacing={2.5}>
              <Grid size={{ xs: 12 }}>
                <AppTextField
                  label="Supplier Name"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    if (errors.name) setErrors((prev) => ({ ...prev, name: null }));
                  }}
                  error={errors.name}
                  required
                  autoFocus
                />
              </Grid>

              <Grid size={{ xs: 12, sm: 6 }}>
                <AppTextField
                  label="Contact Phone Number"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </Grid>

              <Grid size={{ xs: 12, sm: 6 }}>
                <AppTextField
                  label="Email Address"
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (errors.email) setErrors((prev) => ({ ...prev, email: null }));
                  }}
                  error={errors.email}
                />
              </Grid>

              <Grid size={{ xs: 12 }}>
                <AppTextField
                  label="Business Address / Port"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  multiline
                  rows={3}
                />
              </Grid>

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
                    onClick={() => navigate(ROUTES.SUPPLIERS)}
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
                    Update Supplier
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

export default EditSupplier;
