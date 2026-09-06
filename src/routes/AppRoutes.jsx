import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Layout & Route Guards
import ProtectedRoute from '../components/routes/ProtectedRoute';
import PublicRoute from '../components/routes/PublicRoute';
import MainLayout from '../components/layout/MainLayout';

// Pages
import Login from '../pages/auth/Login';
import Dashboard from '../pages/dashboard/Dashboard';
import SupplierList from '../pages/suppliers/SupplierList';
import AddSupplier from '../pages/suppliers/AddSupplier';
import EditSupplier from '../pages/suppliers/EditSupplier';
import SupplierDetails from '../pages/suppliers/SupplierDetails';
import SupplyList from '../pages/supplies/SupplyList';
import AddSupply from '../pages/supplies/AddSupply';
import PaymentList from '../pages/payments/PaymentList';
import AddPayment from '../pages/payments/AddPayment';
import NotFound from '../pages/notfound/NotFound';

import { ROUTES } from '../constants/appConstants';

export const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes (Accessible only when NOT logged in) */}
      <Route element={<PublicRoute />}>
        <Route path={ROUTES.LOGIN} element={<Login />} />
      </Route>

      {/* Protected Application Routes (Accessible only when logged in) */}
      <Route element={<ProtectedRoute />}>
        <Route element={<MainLayout />}>
          <Route path="/" element={<Navigate to={ROUTES.DASHBOARD} replace />} />
          <Route path={ROUTES.DASHBOARD} element={<Dashboard />} />

          {/* Supplier Module */}
          <Route path={ROUTES.SUPPLIERS} element={<SupplierList />} />
          <Route path={ROUTES.SUPPLIERS_ADD} element={<AddSupplier />} />
          <Route path={ROUTES.SUPPLIERS_EDIT} element={<EditSupplier />} />
          <Route path={ROUTES.SUPPLIERS_DETAILS} element={<SupplierDetails />} />

          {/* Supply Module */}
          <Route path={ROUTES.SUPPLIES} element={<SupplyList />} />
          <Route path={ROUTES.SUPPLIES_ADD} element={<AddSupply />} />

          {/* Payment Module */}
          <Route path={ROUTES.PAYMENTS} element={<PaymentList />} />
          <Route path={ROUTES.PAYMENTS_ADD} element={<AddPayment />} />

          {/* 404 Inside Layout for authenticated users */}
          <Route path="*" element={<NotFound />} />
        </Route>
      </Route>

      {/* Catch-all route */}
      <Route path="*" element={<Navigate to={ROUTES.LOGIN} replace />} />
    </Routes>
  );
};

export default AppRoutes;
