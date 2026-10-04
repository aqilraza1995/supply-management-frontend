import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import SaveIcon from "@mui/icons-material/Save";

import { useSuppliers } from "../../hooks/useSuppliers";
import { useSnackbar } from "../../hooks/useSnackbar";
import { ROUTES } from "../../constants/appConstants";

import PageHeader from "../../components/common/PageHeader";
import AppCard from "../../components/common/AppCard";
import AppTextField from "../../components/common/AppTextField";
import AppButton from "../../components/common/AppButton";

export const AddEditCompany = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  console.log("ID =====> ", id);
  const { suppliers, addCompany, getCompanyById } = useSuppliers();

  const { notifySuccess, notifyError } = useSnackbar();

  const [company, setCompany] = useState({
    name: "",
    phone: "",
    address: "",
  });
  const [errorText, setErrorText] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (evt) => {
    setCompany({ ...company, [evt.target.name]: evt.target.value });
  };

  const handleValidation = () => {
    let errors = {};
    let isError = false;
    const phoneRegex = /^[6-9]\d{9}$/;

    if (!name) {
      errors.name = "Comapny is requored";
      isError = true;
    }
    if (phone && !phoneRegex.test(phone)) {
      errors.phone = "Please enter a valid phone number.";
      isError = true;
    }
    setErrorText(errors);

    return isError;
  };

  const handleSubmit = async () => {
    const validate = handleValidation();
    console.log("ErrorText :", errorText);

    if (!validate) {
      console.log("company ===> ", company);
    }
  };

  // const validate = () => {
  //   const errs = {};
  //   const trimmedName = name.trim();

  //   if (!trimmedName) {
  //     errs.name = 'Supplier Name is required';
  //   } else {
  //     // Check for duplicate names
  //     const duplicate = suppliers.some(
  //       (s) => s.name.toLowerCase() === trimmedName.toLowerCase()
  //     );
  //     if (duplicate) {
  //       errs.name = 'A supplier with this name already exists';
  //     }
  //   }

  //   if (email.trim() && !/\S+@\S+\.\S+/.test(email)) {
  //     errs.email = 'Please enter a valid email address';
  //   }

  //   setErrors(errs);
  //   return Object.keys(errs).length === 0;
  // };

  // const handleSubmit = (e) => {
  //   e.preventDefault();
  //   if (!validate()) return;

  //   setIsSubmitting(true);

  //   try {
  //     addSupplier({
  //       name,
  //       phone,
  //       email,
  //       address,
  //     });

  //     notifySuccess(`Supplier "${name.trim()}" added successfully!`);
  //     navigate(ROUTES.SUPPLIERS);
  //   } catch {
  //     notifyError('Failed to add supplier. Please try again.');
  //     setIsSubmitting(false);
  //   }
  // };

  useEffect(() => {
    const getData = async () => {
      const data = getCompanyById(id);
      setCompany({
        name: data?.name,
        phone: data?.phone,
        address : data?.address
      })
    };
    if (id) {
      getData();
    }
  }, []);

  const { name, phone, address } = company;

  return (
    <Box>
      <PageHeader
        title={id ? "Update Company":"Add Company"}
        subtitle={id ? "Update company in the management system" :"Register a new company in the management system"}
        breadcrumbs={[
          { label: "Dashboard", path: ROUTES.DASHBOARD },
          { label: "Companies", path: ROUTES.COMPANIES },
          { label: id ? "Update Company" : "Add Company" },
        ]}
        action={
          <Button
            variant="outlined"
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate(ROUTES.COMPANIES)}
          >
            Back to Companies
          </Button>
        }
      />

      <Box sx={{ maxWidth: 700, mx: "auto" }}>
        <AppCard
          title="Company Information"
          subheader="Provide the primary business and contact details"
        >
          {/* <Box component="form" onSubmit={handleSubmit} noValidate> */}
          <Box>
            <Grid container spacing={2.5}>
              <Grid size={{ xs: 12, sm: 6 }}>
                <AppTextField
                  name="name"
                  label="Company Name"
                  value={name}
                  onChange={handleChange}
                  error={errorText?.name}
                  required
                  placeholder="e.g. Rahul Fish & Co."
                  autoFocus
                />
              </Grid>

              <Grid size={{ xs: 12, sm: 6 }}>
                <AppTextField
                  name="phone"
                  label="Contact Number"
                  value={phone}
                  onChange={handleChange}
                  error={errorText?.phone}
                  placeholder="e.g. +91 98301 23456"
                />
              </Grid>

              <Grid size={{ xs: 12 }}>
                <AppTextField
                  name="address"
                  label="Address"
                  value={address}
                  onChange={handleChange}
                  placeholder="e.g. H.I.T fish market howrah"
                />
              </Grid>

              <Grid size={{ xs: 12 }}>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "flex-end",
                    gap: 1.5,
                    pt: 2,
                    borderTop: "1px solid #E2E8F0",
                  }}
                >
                  <Button
                    variant="text"
                    color="inherit"
                    onClick={() => navigate(ROUTES.COMPANIES)}
                    disabled={isSubmitting}
                  >
                    Cancel
                  </Button>
                  <AppButton
                    type="submit"
                    variant="contained"
                    color="primary"
                    onClick={handleSubmit}
                    loading={isSubmitting}
                    startIcon={<SaveIcon />}
                  >
                    {id ? "Update Company" :"Save Company"}
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

export default AddEditCompany;
