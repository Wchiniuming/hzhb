interface PermissionGuardProps {
  requiredPermissions: string[];
  userPermissions: string[];
  children: React.ReactNode;
  fallback?: React.ReactNode;
  requireAll?: boolean;
}

const PermissionGuard: React.FC<PermissionGuardProps> = ({
  requiredPermissions,
  userPermissions,
  children,
  fallback = null,
  requireAll = true
}) => {
  const hasPermission = requireAll
    ? requiredPermissions.every(perm => userPermissions.includes(perm))
    : requiredPermissions.some(perm => userPermissions.includes(perm));

  return hasPermission ? <>{children}</> : <>{fallback}</>;
};

export default PermissionGuard;
