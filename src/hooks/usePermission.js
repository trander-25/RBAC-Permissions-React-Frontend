import { rolePermissions } from '~/config/rbacConfig'

// Custom hook to check user permissions based on role
export const usePermission = (userRole) => {
  const hasPermission = (permission) => {
    const allowedPermissions = rolePermissions[userRole] || []
    return allowedPermissions.includes(permission)
  }
  return { hasPermission }
}