import { useSelector, useDispatch } from 'react-redux';
import { selectAllPayments, addPayment as addPaymentAction } from '../features/payments/paymentSlice';
import { selectAllSuppliers } from '../features/suppliers/supplierSlice';
import { selectAllSupplies } from '../features/supplies/supplySlice';
import { enrichPaymentsWithSupplier } from '../utils/calculations';
import {
  calculateNewPaymentFIFO,
  getSupplierOutstandingSummary,
} from '../utils/fifoPayment';

export const usePayments = () => {
  const dispatch = useDispatch();
  const payments = useSelector(selectAllPayments);
  const suppliers = useSelector(selectAllSuppliers);
  const supplies = useSelector(selectAllSupplies);

  const enrichedPayments = enrichPaymentsWithSupplier(payments, suppliers);

  const addPayment = (paymentData) => {
    dispatch(addPaymentAction(paymentData));
  };

  const getSupplierSummary = (supplierId) => {
    const supplierSupplies = supplies.filter((s) => String(s.supplierId) === String(supplierId));
    const supplierPayments = payments.filter((p) => String(p.supplierId) === String(supplierId));
    return getSupplierOutstandingSummary(supplierSupplies, supplierPayments);
  };

  const calculatePaymentPreview = (supplierId, paymentAmount) => {
    const supplierSupplies = supplies.filter((s) => String(s.supplierId) === String(supplierId));
    const supplierPayments = payments.filter((p) => String(p.supplierId) === String(supplierId));
    return calculateNewPaymentFIFO(supplierSupplies, supplierPayments, paymentAmount);
  };

  return {
    payments,
    enrichedPayments,
    addPayment,
    getSupplierSummary,
    calculatePaymentPreview,
  };
};

export default usePayments;
