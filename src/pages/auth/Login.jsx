import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Alert from "@mui/material/Alert";

import Container from "@mui/material/Container";

// Icons

import LoginIcon from "@mui/icons-material/Login";
import { EmailOutlined, LockOutlined } from "@mui/icons-material";

import { useAuth } from "../../hooks/useAuth";
import { useSnackbar } from "../../hooks/useSnackbar";
import { DEMO_CREDENTIALS } from "../../constants/auth";
import { ROUTES } from "../../constants/appConstants";
import AppTextField from "../../components/common/AppTextField";
import AppButton from "../../components/common/AppButton";

export const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, loading, error, clearError } = useAuth();
  const { notifySuccess } = useSnackbar();

  const [credentials, setCredentials] = useState({
    email: "",
    password: "",
  });

  const [errorText, setErrorText] = useState({});

  const handleChange = (evt) => {
    setCredentials({ ...credentials, [evt.target.name]: evt.target.value });
  };

  const handleValidation = () => {
    let errors = {};
    let isError = false;

    if (!email) {
      errors.email = "Email is required.";
      isError = true;
    }
    if (!password) {
      errors.password = "Password is required.";
      isError = true;
    }
    setErrorText(errors);
    return isError;
  };

  const handleSubmit = async () => {
    const validate = handleValidation();
    if (!validate) {
      console.log("Credentials :", credentials);

      const result = await login(email, password);
      if (result.success) {
        notifySuccess("Welcome back! You are now logged in.");
        const from = location.state?.from?.pathname || ROUTES.DASHBOARD;
        navigate(from, { replace: true });
      }
    }
    console.log("errorText :", errorText);
  };

  const { email, password } = credentials;

  // const [email, setEmail] = useState("");
  // const [password, setPassword] = useState("");
  // const [showPassword, setShowPassword] = useState(false);
  // const [fieldErrors, setFieldErrors] = useState({});

  // const validate = () => {
  //   const errors = {};
  //   if (!email.trim()) {
  //     errors.email = "Email address is required";
  //   } else if (!/\S+@\S+\.\S+/.test(email)) {
  //     errors.email = "Please enter a valid email address";
  //   }

  //   if (!password) {
  //     errors.password = "Password is required";
  //   } else if (password.length < 6) {
  //     errors.password = "Password must be at least 6 characters";
  //   }

  //   setFieldErrors(errors);
  //   return Object.keys(errors).length === 0;
  // };

  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   if (!validate()) return;

  //   const result = await login(email, password);
  //   if (result.success) {
  //     notifySuccess("Welcome back! You are now logged in.");
  //     const from = location.state?.from?.pathname || ROUTES.DASHBOARD;
  //     navigate(from, { replace: true });
  //   }
  // };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        bgcolor: "#0F172A", // Slate 900
        backgroundImage:
          "radial-gradient(at 0% 0%, rgba(37, 99, 235, 0.15) 0px, transparent 50%), radial-gradient(at 100% 100%, rgba(5, 150, 105, 0.15) 0px, transparent 50%)",
        p: { xs: 2, sm: 3 },
      }}
    >
      <Container maxWidth="xs" disableGutters>
        <Card
          sx={{
            borderRadius: 4,
            boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.4)",
            border: "1px solid rgba(255, 255, 255, 0.1)",
            bgcolor: "#FFFFFF",
            overflow: "hidden",
          }}
        >
          {/* Header Banner */}
          <Box
            sx={{
              p: 3.5,
              pb: 2,
              textAlign: "center",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Box
              sx={{
                width: 52,
                height: 52,
                borderRadius: 3,
                // bgcolor: 'primary.main',
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                mb: 2,
                boxShadow: "0 8px 16px rgba(37, 99, 235, 0.35)",
              }}
            >
              <img
                src="./logo.png"
                alt="logo"
                style={{ width: "152px", height: "80px" }}
              />
              {/* <HubIcon sx={{ color: '#FFFFFF', fontSize: 30 }} /> */}
            </Box>
            <Typography variant="h5" sx={{ fontWeight: 800, color: "#0F172A" }}>
              Supplier Management
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
              Sign in to manage suppliers, supplies & payments
            </Typography>
          </Box>

          <CardContent sx={{ p: 3.5, pt: 1 }}>
            {error && (
              <Alert
                severity="error"
                sx={{ mb: 2.5, borderRadius: 2 }}
                onClose={clearError}
              >
                {error}
              </Alert>
            )}

            {/* Quick Demo Credentials Banner */}
            <Box
              sx={{
                p: 2,
                mb: 3,
                borderRadius: 2,
                bgcolor: "#F8FAFC",
                border: "1px dashed #CBD5E1",
                display: "flex",
                flexDirection: "column",
                gap: 1,
              }}
            >
              <Typography
                variant="caption"
                sx={{ color: "#475569", fontFamily: "monospace" }}
              >
                Email: <strong>{DEMO_CREDENTIALS.email}</strong>
                <br />
                Pass: <strong>{DEMO_CREDENTIALS.password}</strong>
              </Typography>
            </Box>

            {/* <Box component="form" onSubmit={handleSubmit} noValidate> */}
            <Box>
              <Box sx={{ mb: 2.5 }}>
                <AppTextField
                  label="Email Address"
                  type="email"
                  name="email"
                  value={email}
                  onChange={handleChange}
                  error={errorText?.email}
                  required
                  placeholder="admin@example.com"
                  startIcon={
                    <EmailOutlined
                      fontSize="small"
                      sx={{ color: "text.secondary" }}
                    />
                  }
                />
              </Box>

              <Box sx={{ mb: 3 }}>
                <AppTextField
                  name="password"
                  label="Password"
                  type="password"
                  value={password}
                  onChange={handleChange}
                  error={errorText?.password}
                  required
                  placeholder="••••••••"
                  startIcon={
                    <LockOutlined
                      fontSize="small"
                      sx={{ color: "text.secondary" }}
                    />
                  }
                />
              </Box>

              <AppButton
                type="submit"
                fullWidth
                size="large"
                onClick={handleSubmit}
                loading={loading}
                startIcon={<LoginIcon />}
                sx={{ py: 1.4, fontSize: "0.9375rem" }}
              >
                Sign In to Dashboard
              </AppButton>
            </Box>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
};

export default Login;
