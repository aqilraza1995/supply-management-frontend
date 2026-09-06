import { useSelector, useDispatch } from 'react-redux';
import {
  selectAllSuppliers,
  addSupplier as addSupplierAction,
  updateSupplier as updateSupplierAction,
  deleteSupplier as deleteSupplierAction,
} from '../features/suppliers/supplierSlice';
import {
  selectEnrichedSuppliers,
  selectSuppliersWithRemainingAmount,
  selectSupplierFullHistory,
} from '../selectors/supplierSelectors';

export const useSuppliers = () => {
  const dispatch = useDispatch();
  const suppliers = useSelector(selectAllSuppliers);
  const enrichedSuppliers = useSelector(selectEnrichedSuppliers);
  const suppliersWithRemaining = useSelector(selectSuppliersWithRemainingAmount);

  const addSupplier = (supplierData) => {
    dispatch(addSupplierAction(supplierData));
  };

  const updateSupplier = (supplierData) => {
    dispatch(updateSupplierAction(supplierData));
  };

  const deleteSupplier = (id) => {
    dispatch(deleteSupplierAction(id));
  };

  const getSupplierById = (id) => {
    return suppliers.find((s) => String(s.id) === String(id));
  };

  return {
    suppliers,
    enrichedSuppliers,
    suppliersWithRemaining,
    addSupplier,
    updateSupplier,
    deleteSupplier,
    getSupplierById,
    selectSupplierFullHistory,
  };
};

export default useSuppliers;
