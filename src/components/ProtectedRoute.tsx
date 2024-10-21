import { useAuth } from '@/contexts/AuthContext';
import { useAxiosWithAuth } from '@/utils/apiClient';
import { Navigate, useLocation } from 'react-router-dom';

const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const { pathname } = useLocation();
  useAxiosWithAuth();
  const { isAuthenticated } = useAuth();

  return isAuthenticated ? (
    children
  ) : (
    <Navigate to={`/login?redirectTo=${pathname?.substring(1)}`} />
  );
};

export default ProtectedRoute;
