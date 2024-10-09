import { Navigate, useLocation } from 'react-router-dom';

const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const { pathname } = useLocation();
  const isAuthenticated = true; // TODO: maintain state for user

  return isAuthenticated ? (
    children
  ) : (
    <Navigate to={`/login?redirectTo=${pathname?.substring(1)}`} />
  );
};

export default ProtectedRoute;
