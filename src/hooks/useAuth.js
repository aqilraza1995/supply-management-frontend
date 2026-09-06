import { useSelector, useDispatch } from 'react-redux';
import {
  selectAuth,
  selectIsAuthenticated,
  selectCurrentUser,
  selectAuthLoading,
  selectAuthError,
  loginStart,
  loginSuccess,
  loginFailure,
  logout as logoutAction,
  clearAuthError,
} from '../features/auth/authSlice';
import { DEMO_CREDENTIALS, DEMO_USER } from '../constants/auth';

export const useAuth = () => {
  const dispatch = useDispatch();
  const auth = useSelector(selectAuth);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const user = useSelector(selectCurrentUser);
  const loading = useSelector(selectAuthLoading);
  const error = useSelector(selectAuthError);

  const login = async (email, password) => {
    dispatch(loginStart());

    // Small async delay for realistic UX
    await new Promise((res) => setTimeout(res, 400));

    const trimmedEmail = email?.trim().toLowerCase();
    const demoEmail = DEMO_CREDENTIALS.email.toLowerCase();

    if (trimmedEmail === demoEmail && password === DEMO_CREDENTIALS.password) {
      const loggedUser = {
        ...DEMO_USER,
        email: trimmedEmail,
        lastLogin: new Date().toISOString(),
      };
      dispatch(loginSuccess({ user: loggedUser }));
      return { success: true };
    } else {
      const errorMsg = 'Invalid email or password. Use demo credentials.';
      dispatch(loginFailure(errorMsg));
      return { success: false, error: errorMsg };
    }
  };

  const logout = () => {
    dispatch(logoutAction());
  };

  const clearError = () => {
    dispatch(clearAuthError());
  };

  return {
    auth,
    isAuthenticated,
    user,
    loading,
    error,
    login,
    logout,
    clearError,
  };
};

export default useAuth;
