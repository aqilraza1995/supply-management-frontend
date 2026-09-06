import { useDispatch, useSelector } from 'react-redux';
import { showSnackbar, closeSnackbar, selectSnackbar } from '../features/ui/uiSlice';

export const useSnackbar = () => {
  const dispatch = useDispatch();
  const snackbar = useSelector(selectSnackbar);

  const notify = (message, severity = 'success') => {
    dispatch(showSnackbar({ message, severity }));
  };

  const notifySuccess = (message) => notify(message, 'success');
  const notifyError = (message) => notify(message, 'error');
  const notifyWarning = (message) => notify(message, 'warning');
  const notifyInfo = (message) => notify(message, 'info');

  const close = () => {
    dispatch(closeSnackbar());
  };

  return {
    snackbar,
    notify,
    notifySuccess,
    notifyError,
    notifyWarning,
    notifyInfo,
    close,
  };
};

export default useSnackbar;
