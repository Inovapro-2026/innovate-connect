import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

interface RoleRouteProps {
  children: React.ReactNode;
  role: 'client' | 'freelancer' | 'admin';
  redirectTo?: string;
}

export function RoleRoute({ children, role, redirectTo }: RoleRouteProps) {
  const { user, profile, userRoles, isAdmin, isFreelancer, isClient, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-full border-4 border-primary border-t-transparent animate-spin" />
          <p className="text-muted-foreground text-sm">Verificando acesso...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth/login" replace />;
  }

  let hasAccess = false;
  let defaultRedirect = '/auth/login';

  switch (role) {
    case 'admin':
      hasAccess = isAdmin;
      defaultRedirect = '/admin/login';
      break;
    case 'freelancer':
      hasAccess = isFreelancer || isAdmin;
      defaultRedirect = '/auth/login';
      break;
    case 'client':
      hasAccess = isClient || isAdmin;
      defaultRedirect = '/auth/login';
      break;
  }

  if (!hasAccess) {
    // If user is logged in but wrong role, redirect to their dashboard
    if (isAdmin) return <Navigate to="/admin" replace />;
    if (isFreelancer) return <Navigate to="/freelas" replace />;
    if (isClient) return <Navigate to="/marketplace" replace />;
    return <Navigate to={redirectTo || defaultRedirect} replace />;
  }

  return <>{children}</>;
}

export function AdminRoute({ children }: { children: React.ReactNode }) {
  return <RoleRoute role="admin">{children}</RoleRoute>;
}
