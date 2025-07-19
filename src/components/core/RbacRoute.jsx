import { Navigate, Outlet } from 'react-router-dom'
import { usePermission } from '~/hooks/usePermission'
import { roles } from '~/config/rbacConfig'

function RbacRoute({
  requiredPermission,
  redirectTo = '/access-denied',
  children // For react-router-dom v5
}) {
  const user = JSON.parse(localStorage.getItem('userInfo'))
  const userRole = user?.role || roles.CLIENT

  const { hasPermission } = usePermission(userRole)

  // Redirect to access denied if user lacks permission
  if (!hasPermission(requiredPermission)) {
    return <Navigate to={redirectTo} replace={true} />
  }

  // Modern approach for React Router v6+
  return <Outlet />

  // Legacy approach for React Router v5
  // return children
}

export default RbacRoute