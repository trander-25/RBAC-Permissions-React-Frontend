// User roles in the system
export const roles = {
  CLIENT: 'client',
  MODERATOR: 'moderator',
  ADMIN: 'admin'
}

// System permissions
export const permissions = {
  VIEW_DASHBOARD: 'view_dashboard',
  VIEW_SUPPORT: 'view_support',
  VIEW_MESSAGES: 'view_messages',
  VIEW_REVENUE: 'view_revenue',
  VIEW_ADMIN_TOOLS: 'view_admin_tools'
}

// Role-based permission mapping
export const rolePermissions = {
  [roles.CLIENT]: [
    permissions.VIEW_DASHBOARD,
    permissions.VIEW_SUPPORT
  ],
  [roles.MODERATOR]: [
    permissions.VIEW_DASHBOARD,
    permissions.VIEW_SUPPORT,
    permissions.VIEW_MESSAGES
  ],
  [roles.ADMIN]: Object.values(permissions) // All permissions
  // [roles.MODERATOR]: [
  //   permissions.VIEW_DASHBOARD,
  //   permissions.VIEW_SUPPORT,
  //   permissions.VIEW_MESSAGES,
  //   permissions.VIEW_REVENUE,
  //   permissions.VIEW_ADMIN_TOOLS
  // ]
}