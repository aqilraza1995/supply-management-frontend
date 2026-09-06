import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SaveIcon from '@mui/icons-material/Save';

import { useSuppliers } from '../../hooks/useSuppliers';
import { useSnackbar } from '../../hooks/useSnackbar';
import { ROUTES } from '../../constants/appConstants';

import PageHeader from '../../components/common/PageHeader';
import AppCard from '../../components/common/AppCard';
import AppTextField from '../../components/common/AppTextField';
import AppButton from '../../components/common/AppButton';

export const AddSupplier = () => {
  const navigate = useNavigate();
  const { suppliers, addSupplier } = useSuppliers();
  const { notifySuccess, notifyError } = useSnackbar();

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validate = () => {
    const errs = {};
    const trimmedName = name.trim();

    if (!trimmedName) {
      errs.name = 'Supplier Name is required';
    } else {
      // Check for duplicate names
      const duplicate = suppliers.some(
        (s) => s.name.toLowerCase() === trimmedName.toLowerCase()
      );
      if (duplicate) {
        errs.name = 'A supplier with this name already exists';
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
      addSupplier({
        name,
        phone,
        email,
        address,
      });

      notifySuccess(`Supplier "${name.trim()}" added successfully!`);
      navigate(ROUTES.SUPPLIERS);
    } catch {
      notifyError('Failed to add supplier. Please try again.');
      setIsSubmitting(false);
    }
  };

  return (
    <Box>
      <PageHeader
        title="Add Supplier"
        subtitle="Register a new supplier in the management system"
        breadcrumbs={[
          { label: 'Dashboard', path: ROUTES.DASHBOARD },
          { label: 'Suppliers', path: ROUTES.SUPPLIERS },
          { label: 'Add Supplier' },
        ]}
        action={
          <Button
            variant="outlined"
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate(ROUTES.SUPPLIERS)}
          >
            Back to Suppliers
          </Button>
        }
      />

      <Box sx={{ maxWidth: 700, mx: 'auto' }}>
        <AppCard
          title="Supplier Information"
          subheader="Provide the primary business and contact details"
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
                  placeholder="e.g. Rahul Fish Supplier"
                  autoFocus
                />
              </Grid>

              <Grid size={{ xs: 12, sm: 6 }}>
                <AppTextField
                  label="Contact Phone Number"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="e.g. +91 98301 23456"
                />
              </Grid>

              <Grid size={{ xs: 12, sm: 6 }}>
                <AppTextField
                  label="Address"
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (errors.email) setErrors((prev) => ({ ...prev, email: null }));
                  }}
                  error={errors.email}
                  placeholder="e.g. supplier@example.com"
                />
              </Grid>

              {/* <Grid size={{ xs: 12 }}>
                <AppTextField
                  label="Business Address / Port"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="e.g. Machuabazar Market, Kolkata, West Bengal"
                  multiline
                  rows={3}
                />
              </Grid> */}

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
                    Save Supplier
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

export default AddSupplier;
