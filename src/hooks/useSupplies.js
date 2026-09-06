import { useSelector, useDispatch } from 'react-redux';
import { selectAllSupplies, addSupply as addSupplyAction } from '../features/supplies/supplySlice';
import { selectEnrichedSupplies, selectTodaySupplies } from '../selectors/supplySelectors';

export const useSupplies = () => {
  const dispatch = useDispatch();
  const supplies = useSelector(selectAllSupplies);
  const enrichedSupplies = useSelector(selectEnrichedSupplies);
  const todaySupplies = useSelector(selectTodaySupplies);

  const addSupply = (supplyData) => {
    dispatch(addSupplyAction(supplyData));
  };

  return {
    supplies,
    enrichedSupplies,
    todaySupplies,
    addSupply,
  };
};

export default useSupplies;
