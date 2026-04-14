import { Navigate } from 'react-router-dom';

interface ProtectedRouteProps {
  isAuthenticated: boolean;
  children: React.ReactNode;
  redirectUrl?: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  isAuthenticated,
  children,
  redirectUrl = '/login'
}) => {
  if (!isAuthenticated) {
    return <Navigate to={redirectUrl} replace />;
  }
  return <>{children}</>;
};

export default ProtectedRoute;
