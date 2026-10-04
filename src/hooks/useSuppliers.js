import { useSelector, useDispatch } from 'react-redux';
import {
  selectAllSuppliers,
  addCompany as addCompanyAction,
  updateCompany as updateCompanyAction,
  deleteCompany as deleteCompanyAction,
} from '../features/suppliers/supplierSlice';
import {
  selectEnrichedCompanies,
  selectCompaniesWithRemainingAmount,
  selectSupplierFullHistory,
} from '../selectors/supplierSelectors';

export const useSuppliers = () => {
  const dispatch = useDispatch();
  const suppliers = useSelector(selectAllSuppliers);
  const enrichedCompanies = useSelector(selectEnrichedCompanies);
  const companiesWithRemaining = useSelector(selectCompaniesWithRemainingAmount);

  const addCompany = (supplierData) => {
    dispatch(addCompanyAction(supplierData));
  };

  const updateCompany = (supplierData) => {
    dispatch(updateCompanyAction(supplierData));
  };

  const deleteCompany = (id) => {
    dispatch(deleteCompanyAction(id));
  };

  const getCompanyById = (id) => {
    return suppliers.find((s) => String(s.id) === String(id));
  };

  return {
    suppliers,
    enrichedCompanies,
    companiesWithRemaining,
    addCompany,
    updateCompany,
    deleteCompany,
    getCompanyById,
    selectSupplierFullHistory,
  };
};

export default useSuppliers;
