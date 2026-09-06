import React from 'react';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { theme } from './theme/theme';
import AppRoutes from './routes/AppRoutes';
import AppSnackbar from './components/common/AppSnackbar';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AppRoutes />
      <AppSnackbar />
    </ThemeProvider>
  );
}

export default App;
